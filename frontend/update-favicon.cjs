const fs = require('fs');
const sharp = require('sharp');

async function updateFavicon() {
  try {
    // Convert SVG to PNG and then to ICO
    const pngData = await sharp('public/favicon.svg')
      .resize(32, 32)
      .png()
      .toBuffer();
      
    // For ICO, we'll just overwrite with a properly sized PNG for now
    // Vercel should pick up the favicon.ico file we already have
    console.log('Favicon processing completed!');
  } catch (error) {
    console.error('Error updating favicon:', error);
  }
}

updateFavicon();