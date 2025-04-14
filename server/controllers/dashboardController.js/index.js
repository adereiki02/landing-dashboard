const News = require('../../models/News');
const Portfolio = require('../../models/Portfolio');
const Partner = require('../../models/Partner');
const User = require('../../models/User');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const newsCount = await News.countDocuments();
    const portfolioCount = await Portfolio.countDocuments();
    const partnerCount = await Partner.countDocuments();
    
    // Get new items from the last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const newNewsCount = await News.countDocuments({ createdAt: { $gte: lastMonth } });
    const newPortfolioCount = await Portfolio.countDocuments({ createdAt: { $gte: lastMonth } });
    const newPartnerCount = await Partner.countDocuments({ createdAt: { $gte: lastMonth } });
    
    // Calculate percentage changes
    const previousMonthStart = new Date(lastMonth);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    
    const previousMonthNewsCount = await News.countDocuments({ 
      createdAt: { $gte: previousMonthStart, $lt: lastMonth } 
    });
    const previousMonthPortfolioCount = await Portfolio.countDocuments({ 
      createdAt: { $gte: previousMonthStart, $lt: lastMonth } 
    });
    const previousMonthPartnerCount = await Partner.countDocuments({ 
      createdAt: { $gte: previousMonthStart, $lt: lastMonth } 
    });
    
    // Calculate percentage changes (avoid division by zero)
    const newsPercentChange = previousMonthNewsCount === 0 
      ? 100 
      : Math.round((newNewsCount - previousMonthNewsCount) / previousMonthNewsCount * 100);
    
    const portfolioPercentChange = previousMonthPortfolioCount === 0 
      ? 100 
      : Math.round((newPortfolioCount - previousMonthPortfolioCount) / previousMonthPortfolioCount * 100);
    
    const partnerPercentChange = previousMonthPartnerCount === 0 
      ? 100 
      : Math.round((newPartnerCount - previousMonthPartnerCount) / previousMonthPartnerCount * 100);
    
    // Mock visitor data (replace with actual analytics data in production)
    const visitorCount = 24500;
    const visitorPercentChange = 15;
    
    // Get visitor data for chart (mock data - replace with actual analytics in production)
    const visitorData = [
      { name: 'Jan', visitors: 4000 },
      { name: 'Feb', visitors: 3000 },
      { name: 'Mar', visitors: 5000 },
      { name: 'Apr', visitors: 4500 },
      { name: 'May', visitors: 6000 },
      { name: 'Jun', visitors: 8000 },
    ];
    
    // Content data for chart
    const contentData = [
      { name: 'News', count: newsCount },
      { name: 'Portfolio', count: portfolioCount },
      { name: 'Partners', count: partnerCount },
    ];
    
    res.json({
      stats: {
        visitors: {
          count: visitorCount,
          percentChange: visitorPercentChange,
          newThisMonth: Math.round(visitorCount * visitorPercentChange / 100)
        },
        news: {
          count: newsCount,
          percentChange: newsPercentChange,
          newThisMonth: newNewsCount
        },
        portfolio: {
          count: portfolioCount,
          percentChange: portfolioPercentChange,
          newThisMonth: newPortfolioCount
        },
        partners: {
          count: partnerCount,
          percentChange: partnerPercentChange,
          newThisMonth: newPartnerCount
        }
      },
      charts: {
        visitorData,
        contentData
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Failed to get dashboard statistics' });
  }
};

module.exports = {
  getDashboardStats
};