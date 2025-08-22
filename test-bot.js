// Test script for WhatsApp Bot functionality
import WhatsAppBot from './bot.js'

// Mock Baileys socket for testing
class MockSocket {
  constructor() {
    this.messages = []
  }

  async sendMessage(jid, message) {
    console.log(`📤 Sending to ${jid}:`)
    if (message.text) {
      console.log(`   Text: ${message.text.substring(0, 100)}${message.text.length > 100 ? '...' : ''}`)
    }
    if (message.interactive) {
      console.log(`   Interactive: ${message.interactive.header.title}`)
      console.log(`   Body: ${message.interactive.body.text}`)
      if (message.interactive.nativeFlowMessage?.buttons) {
        console.log(`   Buttons: ${message.interactive.nativeFlowMessage.buttons.length}`)
        message.interactive.nativeFlowMessage.buttons.forEach((btn, i) => {
          if (btn.buttonParamsJson) {
            const params = JSON.parse(btn.buttonParamsJson)
            console.log(`     ${i + 1}. ${params.display_text} (${params.id})`)
          }
        })
      }
    }
    console.log('')
    this.messages.push({ jid, message })
  }
}

// Test the bot functionality
async function testBot() {
  console.log('🧪 Testing WhatsApp Bot Interactive Menu Functions...\n')
  
  const bot = new WhatsAppBot()
  bot.sock = new MockSocket()
  
  const testJid = '1234567890@s.whatsapp.net'
  
  console.log('='.repeat(50))
  console.log('1. Testing Main Menu Creation')
  console.log('='.repeat(50))
  await bot.sendMainMenu(testJid)
  
  console.log('='.repeat(50))
  console.log('2. Testing AI Menu Creation')
  console.log('='.repeat(50))
  await bot.sendAIMenu(testJid)
  
  console.log('='.repeat(50))
  console.log('3. Testing Download Menu Creation')
  console.log('='.repeat(50))
  await bot.sendDownloadMenu(testJid)
  
  console.log('='.repeat(50))
  console.log('4. Testing Tools Menu Creation')
  console.log('='.repeat(50))
  await bot.sendToolsMenu(testJid)
  
  console.log('='.repeat(50))
  console.log('5. Testing Help Menu Creation')
  console.log('='.repeat(50))
  await bot.sendHelpMenu(testJid)
  
  console.log('='.repeat(50))
  console.log('6. Testing Message Extraction')
  console.log('='.repeat(50))
  
  // Test different message types
  const testMessages = [
    { conversation: 'hello' },
    { extendedTextMessage: { text: 'menu' } },
    { buttonsResponseMessage: { selectedButtonId: 'menu_ai' } },
    { interactiveResponseMessage: { 
        nativeFlowResponseMessage: { 
          paramsJson: JSON.stringify({ id: 'ai_image', display_text: 'AI Image' })
        }
      }
    }
  ]
  
  testMessages.forEach((msg, i) => {
    const extracted = bot.extractMessageText(msg)
    console.log(`Message ${i + 1}: ${JSON.stringify(msg)} -> "${extracted}"`)
  })
  
  console.log('\n='.repeat(50))
  console.log('7. Testing Command Handling')
  console.log('='.repeat(50))
  
  // Test button command handling
  await bot.handleMessage({ conversation: 'menu' }, testJid)
  await bot.handleMessage({ buttonsResponseMessage: { selectedButtonId: 'menu_ai' } }, testJid)
  await bot.handleMessage({ conversation: 'help' }, testJid)
  
  console.log('✅ All tests completed!')
  console.log(`📊 Total messages sent: ${bot.sock.messages.length}`)
}

// Run tests
testBot().catch(console.error)