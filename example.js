// Example usage of WhatsApp Bot with Interactive Menus
import WhatsAppBot from './bot.js'

// To start the bot:
// 1. Make sure you have internet connection
// 2. Run: node bot.js  
// 3. Scan the QR code with your WhatsApp
// 4. Bot will be ready to receive messages

console.log(`
🤖 WhatsApp Bot Interactive Menu Example

📋 Features Implemented:
✅ Interactive button menus using Baileys
✅ Main menu with 4 categories 
✅ Sub-menus for each category
✅ Button response handling
✅ Text command fallback
✅ Error handling with user-friendly messages
✅ Integration with utility functions:
   - AI Image generation (ailabscat.js)
   - AI Video generation (ailabscat.js) 
   - Luna AI video (lunaai.video.js)
   - GPT chat (gptoss.js)
   - Instagram/TikTok/Facebook downloader
   - Spotify downloader
   - TempMail service (TemBox.js)

🔧 Technical Implementation:
- createInteractiveMessage() creates button menus
- extractMessageText() handles all message types
- Automatic fallback to text if buttons fail
- Proper button ID mapping for actions
- Try-catch error handling

📱 How to use:
1. Send 'menu' or 'hi' to get main menu
2. Click buttons to navigate menus
3. Or use text commands directly:
   - aiimg [prompt] - Generate AI image
   - aivideo [prompt] - Generate AI video
   - gpt [question] - Chat with GPT
   - ig [link] - Download Instagram
   - tiktok [link] - Download TikTok
   - tempmail - Create temporary email
   - help - Show help menu

🚀 To start the bot:
   node bot.js

⚠️ Note: You need internet connection and valid WhatsApp account to run the bot.
`)

// Uncomment below to start the bot automatically
// const bot = new WhatsAppBot()
// bot.start()