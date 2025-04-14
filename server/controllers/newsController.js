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
    const { title, content, excerpt, featuredImage, category, tags, status } = req.body;
    
    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });
    
    // Check if slug already exists
    const existingNews = await News.findOne({ slug });
    if (existingNews) {
      return res.status(400).json({ message: 'A news with this title already exists' });
    }
    
    const news = new News({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      category,
      tags: tags || [],
      author: req.user._id,
      status: status || 'draft',
    });
    
    await news.save();
    
    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update news
exports.updateNews = async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, category, tags, status, isHighlighted } = req.body;
    
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
    
    news.title = title || news.title;
    news.slug = slug;
    news.content = content || news.content;
    news.excerpt = excerpt || news.excerpt;
    news.featuredImage = featuredImage || news.featuredImage;
    news.category = category || news.category;
    news.tags = tags || news.tags;
    news.status = status || news.status;
    news.isHighlighted = isHighlighted !== undefined ? isHighlighted : news.isHighlighted;
    
    await news.save();
    
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
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