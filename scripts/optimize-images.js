#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Default to blog directory
const targetDir = 'blog';

// Resolve to absolute path
const absolutePath = path.resolve(targetDir);

// Check if directory exists
if (!fs.existsSync(absolutePath)) {
  console.error(`❌ Error: Directory does not exist: ${absolutePath}`);
  process.exit(1);
}

console.log(`\n🔍 Optimizing images in: ${absolutePath}\n`);

try {
  // Count files to optimize
  const jpgCount = execSync(
    `find "${absolutePath}" -name "*.jpg" -type f | wc -l`,
    { encoding: 'utf-8' }
  ).trim();
  
  const pngCount = execSync(
    `find "${absolutePath}" -name "*.png" -type f | wc -l`,
    { encoding: 'utf-8' }
  ).trim();

  const totalFiles = parseInt(jpgCount) + parseInt(pngCount);

  if (totalFiles === 0) {
    console.log('✅ No JPEG or PNG images found to optimize.');
    process.exit(0);
  }

  console.log(`📸 Found ${jpgCount} JPEG and ${pngCount} PNG images to convert to WebP\n`);

  // Convert JPEG images to WebP at 70% quality
  if (parseInt(jpgCount) > 0) {
    console.log('⚙️  Converting JPEG images to WebP (70% quality)...');
    execSync(
      `find "${absolutePath}" -name "*.jpg" -type f -print0 | xargs -0 -n 1 -P 4 sh -c 'magick "$1" -strip -quality 70 "\${1%.jpg}.webp" && echo "  ✓ $(basename "$1")"' _`,
      { stdio: 'inherit' }
    );
  }

  // Convert PNG images to WebP at 85% quality
  if (parseInt(pngCount) > 0) {
    console.log('\n⚙️  Converting PNG images to WebP (85% quality)...');
    execSync(
      `find "${absolutePath}" -name "*.png" -type f -print0 | xargs -0 -n 1 sh -c 'magick "$1" -strip -quality 85 "\${1%.png}.webp" && echo "  ✓ $(basename "$1")"' _`,
      { stdio: 'inherit' }
    );
  }

  // Update markdown files to reference .webp
  console.log('\n📝 Updating markdown references...');
  execSync(
    `find "${absolutePath}" -name "*.md" -type f -print0 | xargs -0 sed -i '' -e 's/\\.jpg)/.webp)/g' -e 's/\\.png)/.webp)/g'`,
    { stdio: 'inherit' }
  );

  // Delete original files
  console.log('\n🗑️  Removing original JPEG and PNG files...');
  if (parseInt(jpgCount) > 0) {
    execSync(`find "${absolutePath}" -name "*.jpg" -type f -delete`);
  }
  if (parseInt(pngCount) > 0) {
    execSync(`find "${absolutePath}" -name "*.png" -type f -delete`);
  }

  console.log(`\n✅ Successfully optimized ${totalFiles} images!`);
  console.log('📦 All images converted to WebP format for optimal mobile performance.\n');

} catch (error) {
  console.error('\n❌ Error during optimization:', error.message);
  process.exit(1);
}
