#!/usr/bin/env node

/**
 * RAVO Documentation - GitBook Upload Helper
 *
 * This script helps organize your documentation files for GitBook upload
 * Run: node gitbook-upload-helper.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 RAVO GitBook Upload Helper');
console.log('===============================\n');

// Configuration
const DOCS_DIR = './GITBOOK DOC';
const OUTPUT_DIR = './gitbook-ready';

const fileStructure = {
  // Main pages (root level)
  'README.md': '🏠 Home Page',
  'DOCUMENTATION-SUMMARY.md': '📊 Documentation Summary',

  // Developer section
  'developer/integration.md': '🛠️ Developer Integration Guide',

  // Investor section
  'investor/getting-started.md': '🚀 Getting Started (Investors)',
  'investor/economics.md': '💰 Token Economics',

  // Technical section
  'technical/contracts.md': '📋 Smart Contracts Reference',
  'technical/troubleshooting.md': '🔧 Troubleshooting Guide',

  // Assets
  'images/diagrams/': '📊 Architecture Diagrams',
  'images/screenshots/': '📸 Screenshots',

  // New files
  'gitbook-setup-guide.md': '📚 GitBook Setup Guide'
};

function createUploadStructure() {
  console.log('📁 Creating upload structure...\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let fileCount = 0;
  let totalSize = 0;

  console.log('📋 Files to upload:');
  console.log('===================\n');

  for (const [filePath, description] of Object.entries(fileStructure)) {
    const fullPath = path.join(DOCS_DIR, filePath);

    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);

      if (stats.isFile()) {
        // Copy file
        const destPath = path.join(OUTPUT_DIR, path.basename(filePath));
        fs.copyFileSync(fullPath, destPath);

        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`✅ ${description}`);
        console.log(`   📄 ${filePath} (${sizeKB} KB)`);
        console.log(`   📍 Ready at: ${destPath}\n`);

        fileCount++;
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        // Copy directory
        const destDir = path.join(OUTPUT_DIR, path.basename(filePath));

        // Create destination directory
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        // Copy all files in directory
        const files = fs.readdirSync(fullPath);
        files.forEach(file => {
          const srcFile = path.join(fullPath, file);
          const destFile = path.join(destDir, file);

          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
            const fileStats = fs.statSync(srcFile);
            const sizeKB = (fileStats.size / 1024).toFixed(1);
            console.log(`✅ ${description} - ${file}`);
            console.log(`   📄 ${file} (${sizeKB} KB)`);
            fileCount++;
            totalSize += fileStats.size;
          }
        });

        console.log(`   📍 Ready at: ${destDir}\n`);
      }
    } else {
      console.log(`⚠️  ${description}`);
      console.log(`   ❌ File not found: ${fullPath}\n`);
    }
  }

  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log('📊 Upload Summary:');
  console.log('==================');
  console.log(`📁 Files ready: ${fileCount}`);
  console.log(`💾 Total size: ${totalSizeMB} MB`);
  console.log(`📂 Output directory: ${OUTPUT_DIR}`);
}

function generateUploadInstructions() {
  console.log('\n📚 GitBook Upload Instructions:');
  console.log('===============================\n');

  console.log('1. 🏗️ Create GitBook Space:');
  console.log('   • Go to https://gitbook.com');
  console.log('   • Create new space: "RAVO Protocol Documentation"');
  console.log('   • Choose "Blank" template\n');

  console.log('2. 📤 Upload Files (in this order):');
  console.log('   • README.md (main page)');
  console.log('   • developer/integration.md');
  console.log('   • investor/getting-started.md');
  console.log('   • investor/economics.md');
  console.log('   • technical/contracts.md');
  console.log('   • technical/troubleshooting.md');
  console.log('   • DOCUMENTATION-SUMMARY.md\n');

  console.log('3. 📁 Create Navigation Structure:');
  console.log('   • Home (README.md)');
  console.log('   ├── 👥 For Investors');
  console.log('   │   ├── 🚀 Getting Started');
  console.log('   │   └── 💰 Token Economics');
  console.log('   ├── 🛠️ For Developers');
  console.log('   │   └── 🔧 Integration Guide');
  console.log('   └── 📚 Technical Reference');
  console.log('       ├── 📋 Smart Contracts');
  console.log('       └── 🔧 Troubleshooting\n');

  console.log('4. 🖼️ Upload Images:');
  console.log('   • Create "Assets" or "Images" section');
  console.log('   • Upload diagrams from images/diagrams/');
  console.log('   • Upload screenshots from images/screenshots/\n');

  console.log('5. 🎨 Customize Branding:');
  console.log('   • Upload RAVO logo');
  console.log('   • Set primary colors (#4ecdc4, #ff6b6b)');
  console.log('   • Configure custom domain (docs.ravo.app)\n');

  console.log('6. 🌐 Publish & Share:');
  console.log('   • Click "Publish" button');
  console.log('   • Share on social media');
  console.log('   • Update website links\n');
}

function main() {
  try {
    createUploadStructure();
    generateUploadInstructions();

    console.log('🎉 Ready for GitBook upload!');
    console.log('===========================');
    console.log('📂 All files copied to:', OUTPUT_DIR);
    console.log('📖 Follow the instructions above to publish on GitBook');
    console.log('🆘 Need help? Check gitbook-setup-guide.md');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createUploadStructure, generateUploadInstructions };
