# Trader Assistant Sidepanel

A professional trading assistant chat interface built as a Chrome extension sidepanel using React and ShadCN UI components.

## Features

- 📈 **Trading Assistant**: Professional chat interface specialized for trading and market analysis
- 🎨 **Dark Theme UI**: Clean, modern dark interface with squared corners
- 📱 **Responsive Design**: Optimized for sidepanel dimensions
- ⚡ **Real-time Chat**: Instant message sending with loading states
- 🧹 **Chat Management**: Clear chat history functionality
- 🎯 **Trading-focused Responses**: Smart AI responses specialized for financial markets

## Tech Stack

- **React 18** with TypeScript
- **ShadCN UI** components
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Webpack** for bundling
- **Chrome Extension Manifest V3**

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Extension

```bash
npm run build
```

This will create a `dist` folder with the compiled extension files.

### 3. Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist` folder
4. The extension will be loaded and ready to use

### 4. Using the Extension

- Click the extension icon in the toolbar to open the sidepanel
- Or use the keyboard shortcut `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac)
- The sidepanel will appear on any website and provide the AI chat interface

## Development

### Development Mode

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

### Project Structure

```
src/
├── components/
│   ├── ui/                 # ShadCN UI components
│   ├── ChatInterface.tsx   # Main chat interface
│   ├── ChatHeader.tsx      # Chat header with AI branding
│   ├── ChatMessages.tsx   # Message list component
│   ├── ChatMessage.tsx    # Individual message component
│   └── ChatInput.tsx      # Message input component
├── hooks/
│   └── useChat.ts         # Chat state management
├── types/
│   └── chat.ts            # TypeScript interfaces
├── lib/
│   └── utils.ts           # Utility functions
├── index.tsx              # React app entry point
├── index.css              # Global styles
└── sidepanel.html         # HTML template
```

## Customization

### Adding Real AI Integration

The current implementation uses mock AI responses. To integrate with a real AI service:

1. Update the `useChat.ts` hook
2. Replace the mock response logic with actual API calls
3. Add your API key and endpoint configuration

### Styling

- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for theme customization
- Component-specific styles can be modified in individual component files

### Extension Permissions

Update `manifest.json` to add additional permissions if needed for your AI service integration.

## Browser Compatibility

- Chrome 114+ (Side Panel API support)
- Other Chromium-based browsers with side panel support

## License

MIT License - feel free to use this project as a starting point for your own AI chat extensions!# ai-perp-extension
