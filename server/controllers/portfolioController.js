const Portfolio = require('../models/Portfolio');
const slugify = require('slugify');

// Get all portfolio items with pagination
exports.getAllPortfolioItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const projectType = req.query.projectType || '';
    const status = req.query.status || '';
    
    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (projectType) {
      query.projectType = projectType;
    }
    
    if (status) {
      query.status = status;
    }
    
    const total = await Portfolio.countDocuments(query);
    const portfolioItems = await Portfolio.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      portfolioItems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get portfolio item by ID
exports.getPortfolioItemById = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    
    res.json(portfolioItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get portfolio item by slug
exports.getPortfolioItemBySlug = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findOne({ slug: req.params.slug });
    
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    
    res.json(portfolioItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create portfolio item
exports.createPortfolioItem = async (req, res) => {
  try {
    const { 
      title, description, client, projectType, technologies, 
      featuredImage, images, websiteUrl, completionDate, status 
    } = req.body;
    
    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });
    
    // Check if slug already exists
    const existingPortfolioItem = await Portfolio.findOne({ slug });
    if (existingPortfolioItem) {
      return res.status(400).json({ message: 'A portfolio item with this title already exists' });
    }
    
    // Get highest order value
    const highestOrder = await Portfolio.findOne().sort({ order: -1 });
    const order = highestOrder ? highestOrder.order + 1 : 1;
    
    const portfolioItem = new Portfolio({
      title,
      slug,
      description,
      client,
      projectType,
      technologies: technologies || [],
      featuredImage,
      images: images || [],
      websiteUrl,
      completionDate,
      status: status || 'published',
      order,
    });
    
    await portfolioItem.save();
    
    res.status(201).json(portfolioItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update portfolio item
exports.updatePortfolioItem = async (req, res) => {
  try {
    const { 
      title, description, client, projectType, technologies, 
      featuredImage, images, websiteUrl, completionDate, status, isFeatured 
    } = req.body;
    
    let portfolioItem = await Portfolio.findById(req.params.id);
    
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    
    // Generate new slug if title changed
    let slug = portfolioItem.slug;
    if (title && title !== portfolioItem.title) {
      slug = slugify(title, { lower: true, strict: true });
      
      // Check if new slug already exists
      const existingPortfolioItem = await Portfolio.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingPortfolioItem) {
        return res.status(400).json({ message: 'A portfolio item with this title already exists' });
      }
    }
    
    portfolioItem.title = title || portfolioItem.title;
    portfolioItem.slug = slug;
    portfolioItem.description = description || portfolioItem.description;
    portfolioItem.client = client || portfolioItem.client;
    portfolioItem.projectType = projectType || portfolioItem.projectType;
    portfolioItem.technologies = technologies || portfolioItem.technologies;
    portfolioItem.featuredImage = featuredImage || portfolioItem.featuredImage;
    portfolioItem.images = images || portfolioItem.images;
    portfolioItem.websiteUrl = websiteUrl !== undefined ? websiteUrl : portfolioItem.websiteUrl;
    portfolioItem.completionDate = completionDate || portfolioItem.completionDate;
    portfolioItem.status = status || portfolioItem.status;
    portfolioItem.isFeatured = isFeatured !== undefined ? isFeatured : portfolioItem.isFeatured;
    
    await portfolioItem.save();
    
    res.json(portfolioItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete portfolio item
exports.deletePortfolioItem = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    
    await Portfolio.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Portfolio item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get project types
exports.getProjectTypes = async (req, res) => {
  try {
    const projectTypes = await Portfolio.distinct('projectType');
    res.json(projectTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get featured portfolio items
exports.getFeaturedPortfolioItems = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const featuredItems = await Portfolio.find({ isFeatured: true, status: 'published' })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit);
    
    res.json(featuredItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update portfolio item order
exports.updatePortfolioItemOrder = async (req, res) => {
  try {
    const { id, direction } = req.body;
    
    const portfolioItem = await Portfolio.findById(id);
    
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    
    let targetOrder;
    let targetPortfolioItem;
    
    if (direction === 'up') {
      // Find the portfolio item with the next lower order
      targetPortfolioItem = await Portfolio.findOne({ order: { $lt: portfolioItem.order } })
        .sort({ order: -1 });
      
      if (!targetPortfolioItem) {
        return res.status(400).json({ message: 'Already at the top' });
      }
    } else if (direction === 'down') {
      // Find the portfolio item with the next higher order
      targetPortfolioItem = await Portfolio.findOne({ order: { $gt: portfolioItem.order } })
        .sort({ order: 1 });
      
      if (!targetPortfolioItem) {
        return res.status(400).json({ message: 'Already at the bottom' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid direction' });
    }
    
    // Swap orders
    const tempOrder = portfolioItem.order;
    portfolioItem.order = targetPortfolioItem.order;
    targetPortfolioItem.order = tempOrder;
    
    await portfolioItem.save();
    await targetPortfolioItem.save();
    
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

