#!/bin/bash

echo "🚀 Setting up AI Chat Sidepanel Extension..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the extension
echo "🔨 Building the extension..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' in the top right"
echo "3. Click 'Load unpacked' and select the 'dist' folder"
echo "4. Click the extension icon or use Ctrl+Shift+C to open the sidepanel"
echo ""
echo "🎉 Enjoy your new AI chat sidepanel!"
