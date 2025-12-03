const fs = require('fs');

// Create a minimal ICO file
function createSimpleIco() {
  try {
    // Minimal valid ICO header (16x16, 1 color entry)
    const icoHeader = Buffer.from([
      0x00, 0x00, // Reserved
      0x01, 0x00, // Icon type
      0x01, 0x00  // Number of images
    ]);
    
    // Icon directory entry (16x16, 32-bit RGBA)
    const iconDirEntry = Buffer.from([
      0x10, 0x00, // Width (16)
      0x10, 0x00, // Height (16)
      0x00,       // Color palette count
      0x00,       // Reserved
      0x01, 0x00, // Color planes
      0x20, 0x00, // Bits per pixel (32)
      0x00, 0x00, 0x00, 0x00, // Image size (will be filled later)
      0x16, 0x00, 0x00, 0x00  // Image offset (22 bytes from start)
    ]);
    
    // Simple 16x16 bitmap data (solid pink square)
    const imageData = Buffer.alloc(16 * 16 * 4, 0);
    // Fill with pink color (R:236, G:72, B:153, A:255)
    for (let i = 0; i < 16 * 16; i++) {
      imageData[i * 4] = 153;     // B
      imageData[i * 4 + 1] = 72;  // G
      imageData[i * 4 + 2] = 236; // R
      imageData[i * 4 + 3] = 255; // A
    }
    
    // Update image size in directory entry
    iconDirEntry.writeUInt32LE(imageData.length, 8);
    
    // Combine all parts
    const icoBuffer = Buffer.concat([icoHeader, iconDirEntry, imageData]);
    
    // Write to file
    fs.writeFileSync('public/favicon.ico', icoBuffer);
    
    console.log('Simple favicon.ico created successfully!');
  } catch (error) {
    console.error('Error creating ICO file:', error);
  }
}

createSimpleIco();