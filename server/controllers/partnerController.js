const Partner = require('../models/Partner');

// Get all partners with pagination
exports.getAllPartners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const isActive = req.query.isActive;
    
    // Build query
    const query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const total = await Partner.countDocuments(query);
    const partners = await Partner.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      partners,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get partner by ID
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    res.json(partner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create partner
exports.createPartner = async (req, res) => {
  try {
    const { name, websiteUrl, description } = req.body;
    
    // Check if logo file was uploaded
    let logo = '';
    if (req.file) {
      // If using multer, the file would be available in req.file
      logo = `/uploads/partners/${req.file.filename}`;
    } else if (req.body.logo) {
      // If logo is sent as a string (URL)
      logo = req.body.logo;
    } else {
      return res.status(400).json({ message: 'Partner logo is required' });
    }
    
    // Get highest order value
    const highestOrder = await Partner.findOne().sort({ order: -1 });
    const order = highestOrder ? highestOrder.order + 1 : 1;
    
    const partner = new Partner({
      name,
      logo,
      websiteUrl,
      description,
      order,
    });
    
    await partner.save();
    
    res.status(201).json(partner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update partner
exports.updatePartner = async (req, res) => {
  try {
    const { name, websiteUrl, description, isActive } = req.body;
    
    console.log('Update partner request body:', req.body);
    
    let partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    // Handle logo update if a new file was uploaded
    if (req.file) {
      partner.logo = `/uploads/partners/${req.file.filename}`;
    } else if (req.body.logo) {
      // If logo is sent as a string (URL)
      partner.logo = req.body.logo;
    }
    
    // Update fields if provided
    if (name !== undefined) partner.name = name;
    if (websiteUrl !== undefined) partner.websiteUrl = websiteUrl;
    if (description !== undefined) partner.description = description;
    
    // Handle isActive specifically
    if (isActive !== undefined) {
      // Convert to boolean if it's a string
      partner.isActive = typeof isActive === 'boolean' ? isActive : isActive === 'true';
      console.log('Setting isActive to:', partner.isActive);
    }
    
    await partner.save();
    
    res.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete partner
exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    await Partner.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Partner removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update partner order
exports.updatePartnerOrder = async (req, res) => {
  try {
    const { id, direction } = req.body;
    
    const partner = await Partner.findById(id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    let targetOrder;
    let targetPartner;
    
    if (direction === 'up') {
      // Find the partner with the next lower order
      targetPartner = await Partner.findOne({ order: { $lt: partner.order } })
        .sort({ order: -1 });
      
      if (!targetPartner) {
        return res.status(400).json({ message: 'Already at the top' });
      }
    } else if (direction === 'down') {
      // Find the partner with the next higher order
      targetPartner = await Partner.findOne({ order: { $gt: partner.order } })
        .sort({ order: 1 });
      
      if (!targetPartner) {
        return res.status(400).json({ message: 'Already at the bottom' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid direction' });
    }
    
    // Swap orders
    const tempOrder = partner.order;
    partner.order = targetPartner.order;
    targetPartner.order = tempOrder;
    
    await partner.save();
    await targetPartner.save();
    
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get active partners
exports.getActivePartners = async (req, res) => {
  try {
    console.log('Getting active partners');
    const partners = await Partner.find({ isActive: true })
      .sort({ order: 1 });
    
    console.log(`Found ${partners.length} active partners`);
    res.json(partners);
  } catch (error) {
    console.error('Error in getActivePartners:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};