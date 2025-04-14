const Setting = require('../models/Setting');

// Get website settings
exports.getSettings = async (req, res) => {
  try {
    // Find the first settings document or create a default one if none exists
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({
        siteName: 'ReikiDevs',
        siteDescription: 'Web Development and Digital Solutions',
      });
    }
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update website settings
exports.updateSettings = async (req, res) => {
  try {
    const { 
      siteName, siteDescription, logo, favicon, contactEmail, contactPhone, 
      address, socialMedia, metaTags, googleAnalyticsId, customCss, customJs 
    } = req.body;
    
    // Find the first settings document or create a default one if none exists
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting({
        siteName: siteName || 'ReikiDevs',
        siteDescription: siteDescription || 'Web Development and Digital Solutions',
      });
    } else {
      settings.siteName = siteName || settings.siteName;
      settings.siteDescription = siteDescription !== undefined ? siteDescription : settings.siteDescription;
      settings.logo = logo !== undefined ? logo : settings.logo;
      settings.favicon = favicon !== undefined ? favicon : settings.favicon;
      settings.contactEmail = contactEmail !== undefined ? contactEmail : settings.contactEmail;
      settings.contactPhone = contactPhone !== undefined ? contactPhone : settings.contactPhone;
      settings.address = address !== undefined ? address : settings.address;
      
      if (socialMedia) {
        settings.socialMedia = {
          facebook: socialMedia.facebook !== undefined ? socialMedia.facebook : settings.socialMedia?.facebook,
          twitter: socialMedia.twitter !== undefined ? socialMedia.twitter : settings.socialMedia?.twitter,
          instagram: socialMedia.instagram !== undefined ? socialMedia.instagram : settings.socialMedia?.instagram,
          linkedin: socialMedia.linkedin !== undefined ? socialMedia.linkedin : settings.socialMedia?.linkedin,
          youtube: socialMedia.youtube !== undefined ? socialMedia.youtube : settings.socialMedia?.youtube,
        };
      }
      
      settings.metaTags = metaTags !== undefined ? metaTags : settings.metaTags;
      settings.googleAnalyticsId = googleAnalyticsId !== undefined ? googleAnalyticsId : settings.googleAnalyticsId;
      settings.customCss = customCss !== undefined ? customCss : settings.customCss;
      settings.customJs = customJs !== undefined ? customJs : settings.customJs;
    }
    
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};