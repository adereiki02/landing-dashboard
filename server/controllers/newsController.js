const News = require('../models/News');
const slugify = require('slugify');

// Get all news with pagination
exports.getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';
    
    // Build query
    const query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('author', 'name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name username');
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get news by slug
exports.getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug }).populate('author', 'name username');
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Increment view count
    news.viewCount += 1;
    await news.save();
    
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create news
exports.createNews = async (req, res) => {
  try {
    console.log('Create news request body:', req.body);
    console.log('Create news request file:', req.file);
    
    const { title, content, category, tags, status, isHighlighted } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }
    
    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });
    
    // Check if slug already exists
    const existingNews = await News.findOne({ slug });
    if (existingNews) {
      return res.status(400).json({ message: 'A news with this title already exists' });
    }
    
    // Generate excerpt automatically (first 300 characters)
    const excerpt = content.length > 300 ? content.substring(0, 300) + '...' : content;
    
    // Handle featured image upload
    const featuredImage = req.file ? `/uploads/news/${req.file.filename}` : '';
    
    // Parse tags if they're sent as JSON string
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }
    
    const news = new News({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      category,
      tags: parsedTags,
      author: req.user._id,
      status: status || 'draft',
      isHighlighted: isHighlighted === 'true' || isHighlighted === true
    });
    
    await news.save();
    
    res.status(201).json({
      message: 'News created successfully',
      news: {
        _id: news._id,
        title: news.title,
        slug: news.slug,
        excerpt: news.excerpt,
        featuredImage: news.featuredImage,
        category: news.category,
        status: news.status
      }
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ 
      message: 'Error creating news', 
      error: error.message 
    });
  }
};

// Update news
exports.updateNews = async (req, res) => {
  try {
    console.log('Update news request body:', req.body);
    console.log('Update news request file:', req.file);
    
    const { title, content, category, tags, status, isHighlighted } = req.body;
    
    let news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Check if user is author or admin
    if (news.author.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to update this news' });
    }
    
    // Generate new slug if title changed
    let slug = news.slug;
    if (title && title !== news.title) {
      slug = slugify(title, { lower: true, strict: true });
      
      // Check if new slug already exists
      const existingNews = await News.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingNews) {
        return res.status(400).json({ message: 'A news with this title already exists' });
      }
    }
    
    // Generate excerpt automatically (first 300 characters)
    const excerpt = content ? (content.length > 300 ? content.substring(0, 300) + '...' : content) : news.excerpt;
    
    // Handle featured image upload
    const featuredImage = req.file ? `/uploads/news/${req.file.filename}` : news.featuredImage;
    
    // Parse tags if they're sent as JSON string
    let parsedTags = news.tags;
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }
    
    news.title = title || news.title;
    news.slug = slug;
    news.content = content || news.content;
    news.excerpt = excerpt;
    news.featuredImage = featuredImage;
    news.category = category || news.category;
    news.tags = parsedTags;
    news.status = status || news.status;
    news.isHighlighted = isHighlighted === 'true' || isHighlighted === true;
    
    await news.save();
    
    res.json({
      message: 'News updated successfully',
      news
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Check if user is author or admin
    if (news.author.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete this news' });
    }
    
    await News.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'News removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get news categories
exports.getNewsCategories = async (req, res) => {
  try {
    const categories = await News.distinct('category');
    
    // Add default categories if none exist
    if (categories.length === 0) {
      return res.json(['Teknologi', 'Bisnis', 'Olahraga', 'Hiburan', 'Politik', 'Lainnya']);
    }
    
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get highlighted news
exports.getHighlightedNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const highlightedNews = await News.find({ isHighlighted: true, status: 'published' })
      .populate('author', 'name username')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(highlightedNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getHighlightedNews = async (req, res) => {
  try {
    const news = await News.find({ isHighlighted: true, status: 'published' })
      .populate('author', 'name username')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};