/**
 * Script to create sample portfolio images
 */
const fs = require('fs');
const path = require('path');

// Define the portfolio directory path
const portfolioDir = path.join(__dirname, '../uploads/portfolio');

// Ensure the directory exists
if (!fs.existsSync(portfolioDir)) {
  fs.mkdirSync(portfolioDir, { recursive: true });
  console.log('Created portfolio directory');
}

// Sample image data (1x1 pixel transparent PNG)
const sampleImageData = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

// List of sample portfolio images to create
const sampleImages = [
  'fashion-ecommerce.jpg',
  'clinic-management.jpg',
  'property-website.jpg',
  'fnb-marketing.jpg'
];

// Create each sample image
sampleImages.forEach(imageName => {
  const imagePath = path.join(portfolioDir, imageName);
  
  // Only create if it doesn't exist
  if (!fs.existsSync(imagePath)) {
    fs.writeFileSync(imagePath, sampleImageData);
    console.log(`Created sample image: ${imageName}`);
  } else {
    console.log(`Image already exists: ${imageName}`);
  }
});

console.log('Sample portfolio images have been created.');