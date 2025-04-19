const Portfolio = require('../models/Portfolio');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const { ensureFullUrl, processUrlArray } = require('../utils/urlHelper');

// Get all portfolio items with pagination
exports.getAllPortfolioItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const projectType = req.query.projectType || '';
    const status = req.query.status || '';
    const projectStatus = req.query.projectStatus || '';
    
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
    
    if (projectStatus) {
      query.projectStatus = projectStatus;
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
    console.error('Error getting portfolio items:', error);
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
    console.error('Error getting portfolio item by ID:', error);
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
    console.error('Error getting portfolio item by slug:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create portfolio item
exports.createPortfolioItem = async (req, res) => {
  try {
    console.log('Creating portfolio item with body:', req.body);
    console.log('File:', req.file);
    
    const { 
      title, description, client, projectType, websiteUrl, completionDate, status, projectStatus 
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !client || !projectType) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        errors: {
          title: !title ? 'Title is required' : null,
          description: !description ? 'Description is required' : null,
          client: !client ? 'Client is required' : null,
          projectType: !projectType ? 'Project type is required' : null
        }
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Featured image is required',
        errors: {
          featuredImage: 'Featured image is required'
        }
      });
    }
    
    // Parse JSON strings from form data
    let technologies = [];
    let imageUrls = [];
    
    if (req.body.technologies) {
      try {
        technologies = JSON.parse(req.body.technologies);
      } catch (err) {
        console.error('Error parsing technologies:', err);
      }
    }
    
    if (req.body.images) {
      try {
        imageUrls = JSON.parse(req.body.images);
      } catch (err) {
        console.error('Error parsing images:', err);
      }
    }
    
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
    
    // Create the featured image path
    const featuredImagePath = `/uploads/portfolio/${req.file.filename}`;
    const featuredImage = ensureFullUrl(featuredImagePath);
    
    // Process additional images to add full URLs
    if (imageUrls && imageUrls.length > 0) {
      imageUrls = processUrlArray(imageUrls);
    }
    
    // Create new portfolio item
    const portfolioItem = new Portfolio({
      title,
      slug,
      description,
      client,
      projectType,
      technologies,
      featuredImage,
      images: imageUrls,
      websiteUrl: websiteUrl || '',
      completionDate: completionDate || null,
      status: status || 'published',
      projectStatus: projectStatus || 'completed',
      order,
      isFeatured: req.body.isFeatured === 'true',
    });
    
    const savedPortfolio = await portfolioItem.save();
    console.log('Portfolio saved successfully:', savedPortfolio);
    
    res.status(201).json(savedPortfolio);
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Server Error',
      stack: config.isDevelopment ? error.stack : undefined
    });
  }
};

// Update portfolio item
exports.updatePortfolioItem = async (req, res) => {
  try {
    console.log('Updating portfolio item with body:', req.body);
    console.log('File:', req.file);
    
    const { 
      title, description, client, projectType, websiteUrl, completionDate, status, isFeatured, featuredImage, projectStatus
    } = req.body;
    
    // Parse JSON strings from form data
    let technologies = [];
    let imageUrls = [];
    
    if (req.body.technologies) {
      try {
        technologies = JSON.parse(req.body.technologies);
      } catch (err) {
        console.error('Error parsing technologies:', err);
      }
    }
    
    if (req.body.images) {
      try {
        imageUrls = JSON.parse(req.body.images);
      } catch (err) {
        console.error('Error parsing images:', err);
      }
    }
    
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
    
    // Handle the uploaded file if it exists
    if (req.file) {
      const featuredImagePath = `/uploads/portfolio/${req.file.filename}`;
      portfolioItem.featuredImage = ensureFullUrl(featuredImagePath);
    } else if (featuredImage) {
      // If no file is uploaded but featuredImage is provided in the request body
      portfolioItem.featuredImage = featuredImage;
    }
    
    // Check if featuredImage exists after update attempt
    if (!portfolioItem.featuredImage) {
      return res.status(400).json({ message: 'Featured image is required' });
    }
    
    // Process additional images to add full URLs
    if (imageUrls && imageUrls.length > 0) {
      imageUrls = processUrlArray(imageUrls);
    }
    
    portfolioItem.title = title || portfolioItem.title;
    portfolioItem.slug = slug;
    portfolioItem.description = description || portfolioItem.description;
    portfolioItem.client = client || portfolioItem.client;
    portfolioItem.projectType = projectType || portfolioItem.projectType;
    portfolioItem.technologies = technologies.length > 0 ? technologies : portfolioItem.technologies;
    portfolioItem.images = imageUrls.length > 0 ? imageUrls : portfolioItem.images;
    portfolioItem.websiteUrl = websiteUrl !== undefined ? websiteUrl : portfolioItem.websiteUrl;
    portfolioItem.completionDate = completionDate || portfolioItem.completionDate;
    portfolioItem.status = status || portfolioItem.status;
    portfolioItem.projectStatus = projectStatus || portfolioItem.projectStatus;
    portfolioItem.isFeatured = isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : portfolioItem.isFeatured;
    
    const updatedPortfolio = await portfolioItem.save();
    console.log('Portfolio updated successfully:', updatedPortfolio);
    
    res.json(updatedPortfolio);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
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
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get project types
exports.getProjectTypes = async (req, res) => {
  try {
    const projectTypes = await Portfolio.distinct('projectType');
    res.json(projectTypes);
  } catch (error) {
    console.error('Error getting project types:', error);
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
    console.error('Error getting featured portfolio items:', error);
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
    console.error('Error updating portfolio item order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};