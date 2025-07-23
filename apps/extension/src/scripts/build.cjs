const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Define paths
const templatePath = path.join(__dirname, '../../public' , 'manifest.template.json');
const templateDistPath = path.join(__dirname, '../../dist', 'manifest.template.json');
const outputDir = path.join(__dirname, '../..', 'dist');
const outputPath = path.join(outputDir, 'manifest.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read and process template
try {
  const template = fs.readFileSync(templatePath, 'utf8');
  const clientId = process.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('CLIENT_ID environment variable is not set.');
  }
  const manifest = template.replace(/%%CLIENT_ID%%/g, clientId);
  
  // Write final manifest
  fs.writeFileSync(outputPath, manifest);
  console.log('Successfully generated manifest.json in', outputDir);
} catch (error) {
  console.error('Error generating manifest:', error);
  process.exit(1);
}

fs.rmSync(templateDistPath, { force: true, recursive: true });
console.log('Removed template manifest from dist directory:', templateDistPath);
