import { makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import { sendGPTOSS } from './gptoss.js'
import { aiLabs } from './ailabscat.js'
import { tempmail } from './TemBox.js'
import LunaAI from './lunaai.video.js'
import { instaTiktokDownloader } from './InstaTikTok Downloader (1).js'
import { spotifyTrackDownloader } from './spotify downloader.js'

class WhatsAppBot {
  constructor() {
    this.sock = null
    this.authState = null
  }

  // Create interactive button message
  createInteractiveMessage(jid, headerText, bodyText, footerText, buttons) {
    try {
      return {
        interactive: {
          header: {
            title: headerText,
            hasMediaAttachment: false
          },
          body: { text: bodyText },
          footer: { text: footerText },
          nativeFlowMessage: {
            buttons: buttons.map((btn, index) => ({
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: btn.displayText,
                id: btn.id || `btn_${index}`
              })
            }))
          }
        }
      }
    } catch (error) {
      console.error('Error creating interactive message:', error)
      return null
    }
  }

  // Create list message
  createListMessage(jid, headerText, bodyText, footerText, listTitle, sections) {
    try {
      return {
        interactive: {
          header: {
            title: headerText,
            hasMediaAttachment: false
          },
          body: { text: bodyText },
          footer: { text: footerText },
          nativeFlowMessage: {
            buttons: [{
              name: "single_select",
              buttonParamsJson: JSON.stringify({
                title: listTitle,
                sections: sections
              })
            }]
          }
        }
      }
    } catch (error) {
      console.error('Error creating list message:', error)
      return null
    }
  }

  // Extract message text from various message types
  extractMessageText(message) {
    try {
      if (message?.conversation) {
        return message.conversation
      }
      
      if (message?.extendedTextMessage?.text) {
        return message.extendedTextMessage.text
      }
      
      // Handle button response
      if (message?.buttonsResponseMessage?.selectedButtonId) {
        return message.buttonsResponseMessage.selectedButtonId
      }
      
      // Handle list response
      if (message?.listResponseMessage?.singleSelectReply?.selectedRowId) {
        return message.listResponseMessage.singleSelectReply.selectedRowId
      }
      
      // Handle interactive response
      if (message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson) {
        const params = JSON.parse(message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)
        return params.id || params.display_text
      }
      
      return null
    } catch (error) {
      console.error('Error extracting message text:', error)
      return null
    }
  }

  // Send main menu
  async sendMainMenu(jid) {
    const buttons = [
      { displayText: "🤖 AI Generator", id: "menu_ai" },
      { displayText: "📥 Downloader", id: "menu_download" },
      { displayText: "🛠️ Tools", id: "menu_tools" },
      { displayText: "❓ Help", id: "menu_help" }
    ]

    const interactiveMessage = this.createInteractiveMessage(
      jid,
      "🤖 WhatsApp Bot Menu",
      "Selamat datang! Pilih menu yang ingin kamu gunakan:",
      "Powered by Baileys • Created by @Dimasmaulana12",
      buttons
    )

    try {
      if (interactiveMessage) {
        await this.sock.sendMessage(jid, interactiveMessage)
      } else {
        throw new Error('Failed to create interactive message')
      }
    } catch (error) {
      console.error('Failed to send interactive menu, falling back to text:', error)
      // Fallback to plain text menu
      const textMenu = `🤖 *WhatsApp Bot Menu*

Selamat datang! Pilih menu yang ingin kamu gunakan:

1. 🤖 AI Generator
2. 📥 Downloader  
3. 🛠️ Tools
4. ❓ Help

*Ketik nomor atau nama menu untuk melanjutkan*

Powered by Baileys • Created by @Dimasmaulana12`
      
      await this.sock.sendMessage(jid, { text: textMenu })
    }
  }

  // Send AI menu
  async sendAIMenu(jid) {
    const buttons = [
      { displayText: "🎨 AI Image", id: "ai_image" },
      { displayText: "🎬 AI Video", id: "ai_video" },
      { displayText: "🌙 Luna Video", id: "luna_video" },
      { displayText: "🖼️ Text to Image", id: "text2img" },
      { displayText: "💬 GPT Chat", id: "gpt_chat" }
    ]

    const interactiveMessage = this.createInteractiveMessage(
      jid,
      "🤖 AI Generator Menu",
      "Pilih fitur AI yang ingin kamu gunakan:",
      "Kembali ke menu utama: ketik 'menu'",
      buttons
    )

    try {
      if (interactiveMessage) {
        await this.sock.sendMessage(jid, interactiveMessage)
      } else {
        throw new Error('Failed to create interactive message')
      }
    } catch (error) {
      console.error('Failed to send AI menu, falling back to text:', error)
      const textMenu = `🤖 *AI Generator Menu*

Pilih fitur AI yang ingin kamu gunakan:

1. 🎨 AI Image (aiimg)
2. 🎬 AI Video (aivideo)  
3. 🌙 Luna Video (lunavideo)
4. 🖼️ Text to Image (t2vimg)
5. 💬 GPT Chat (gpt)

*Ketik nama fitur untuk menggunakan*
*Kembali ke menu utama: ketik 'menu'*`
      
      await this.sock.sendMessage(jid, { text: textMenu })
    }
  }

  // Send Download menu
  async sendDownloadMenu(jid) {
    const buttons = [
      { displayText: "📸 Instagram", id: "dl_instagram" },
      { displayText: "🎵 TikTok", id: "dl_tiktok" },
      { displayText: "👥 Facebook", id: "dl_facebook" },
      { displayText: "🎧 Spotify", id: "dl_spotify" }
    ]

    const interactiveMessage = this.createInteractiveMessage(
      jid,
      "📥 Downloader Menu",
      "Pilih platform yang ingin kamu download:",
      "Kembali ke menu utama: ketik 'menu'",
      buttons
    )

    try {
      if (interactiveMessage) {
        await this.sock.sendMessage(jid, interactiveMessage)
      } else {
        throw new Error('Failed to create interactive message')
      }
    } catch (error) {
      console.error('Failed to send download menu, falling back to text:', error)
      const textMenu = `📥 *Downloader Menu*

Pilih platform yang ingin kamu download:

1. 📸 Instagram
2. 🎵 TikTok
3. 👥 Facebook
4. 🎧 Spotify

*Kirim link setelah memilih platform*
*Kembali ke menu utama: ketik 'menu'*`
      
      await this.sock.sendMessage(jid, { text: textMenu })
    }
  }

  // Send Tools menu
  async sendToolsMenu(jid) {
    const buttons = [
      { displayText: "📧 TempMail", id: "tool_tempmail" },
      { displayText: "✉️ Check Email", id: "tool_checkemail" }
    ]

    const interactiveMessage = this.createInteractiveMessage(
      jid,
      "🛠️ Tools Menu",
      "Pilih tools yang ingin kamu gunakan:",
      "Kembali ke menu utama: ketik 'menu'",
      buttons
    )

    try {
      if (interactiveMessage) {
        await this.sock.sendMessage(jid, interactiveMessage)
      } else {
        throw new Error('Failed to create interactive message')
      }
    } catch (error) {
      console.error('Failed to send tools menu, falling back to text:', error)
      const textMenu = `🛠️ *Tools Menu*

Pilih tools yang ingin kamu gunakan:

1. 📧 TempMail - Buat email sementara
2. ✉️ Check Email - Cek inbox email

*Ketik nama tool untuk menggunakan*
*Kembali ke menu utama: ketik 'menu'*`
      
      await this.sock.sendMessage(jid, { text: textMenu })
    }
  }

  // Send Help menu
  async sendHelpMenu(jid) {
    const helpText = `❓ *Help & Commands*

*📝 Cara Penggunaan:*
- Gunakan menu interaktif dengan menekan tombol
- Atau ketik perintah langsung

*🤖 AI Commands:*
- aiimg [prompt] - Generate gambar dengan AI
- aivideo [prompt] - Generate video dengan AI
- lunavideo [prompt] - Generate video dengan Luna AI
- t2vimg [prompt] - Text to image
- gpt [pertanyaan] - Chat dengan GPT

*📥 Download Commands:*
- ig [link] - Download Instagram
- tiktok [link] - Download TikTok
- fb [link] - Download Facebook
- spotify [link] - Download Spotify

*🛠️ Tools Commands:*
- tempmail - Buat email sementara
- checkemail [token] - Cek inbox email

*⚙️ General Commands:*
- menu - Tampilkan menu utama
- help - Tampilkan bantuan ini

*📞 Support:*
WhatsApp Group: chat.whatsapp.com/Ke94ex9fNLjE2h8QzhvEiy

Powered by Baileys • Created by @Dimasmaulana12`

    await this.sock.sendMessage(jid, { text: helpText })
  }

  // Handle AI Image generation
  async handleAIImage(jid, prompt) {
    if (!prompt || prompt.trim() === '') {
      await this.sock.sendMessage(jid, { text: '❌ Mohon berikan prompt untuk generate image!\nContoh: aiimg beautiful sunset landscape' })
      return
    }

    await this.sock.sendMessage(jid, { text: '🎨 Sedang generate image... Mohon tunggu sebentar.' })
    
    try {
      const result = await aiLabs.text2img(prompt)
      if (result.success) {
        await this.sock.sendMessage(jid, {
          image: { url: result.result.url },
          caption: `✅ *AI Image Generated*\n\n📝 Prompt: ${prompt}\n\n💡 Ingin generate lagi? Ketik: aiimg [prompt baru]`
        })
      } else {
        await this.sock.sendMessage(jid, { text: `❌ Gagal generate image: ${result.result.error}` })
      }
    } catch (error) {
      await this.sock.sendMessage(jid, { text: `❌ Error: ${error.message}` })
    }
  }

  // Handle AI Video generation
  async handleAIVideo(jid, prompt) {
    if (!prompt || prompt.trim() === '') {
      await this.sock.sendMessage(jid, { text: '❌ Mohon berikan prompt untuk generate video!\nContoh: aivideo cat playing in garden' })
      return
    }

    await this.sock.sendMessage(jid, { text: '🎬 Sedang generate video... Ini akan memakan waktu beberapa menit.' })
    
    try {
      const result = await aiLabs.generate({ prompt, type: 'video' })
      if (result.success) {
        await this.sock.sendMessage(jid, {
          video: { url: result.result.url },
          caption: `✅ *AI Video Generated*\n\n📝 Prompt: ${prompt}\n\n💡 Ingin generate lagi? Ketik: aivideo [prompt baru]`
        })
      } else {
        await this.sock.sendMessage(jid, { text: `❌ Gagal generate video: ${result.result.error}` })
      }
    } catch (error) {
      await this.sock.sendMessage(jid, { text: `❌ Error: ${error.message}` })
    }
  }

  // Handle Luna AI Video generation
  async handleLunaVideo(jid, prompt) {
    if (!prompt || prompt.trim() === '') {
      await this.sock.sendMessage(jid, { text: '❌ Mohon berikan prompt untuk generate video!\nContoh: lunavideo dancing robot' })
      return
    }

    await this.sock.sendMessage(jid, { text: '🌙 Sedang generate video dengan Luna AI... Mohon tunggu.' })
    
    try {
      const luna = new LunaAI()
      const result = await luna.run({
        apikey: "your_apikey", // You'll need to replace this with actual API key
        prompt
      })
      
      if (result && result.video_url) {
        await this.sock.sendMessage(jid, {
          video: { url: result.video_url },
          caption: `✅ *Luna AI Video Generated*\n\n📝 Prompt: ${prompt}\n\n💡 Ingin generate lagi? Ketik: lunavideo [prompt baru]`
        })
      } else {
        await this.sock.sendMessage(jid, { text: '❌ Gagal generate video dengan Luna AI' })
      }
    } catch (error) {
      await this.sock.sendMessage(jid, { text: `❌ Error: ${error.message}` })
    }
  }

  // Handle GPT Chat
  async handleGPTChat(jid, question) {
    if (!question || question.trim() === '') {
      await this.sock.sendMessage(jid, { text: '❌ Mohon berikan pertanyaan!\nContoh: gpt Apa itu artificial intelligence?' })
      return
    }

    await this.sock.sendMessage(jid, { text: '💭 Sedang berpikir... Mohon tunggu.' })
    
    try {
      const result = await sendGPTOSS(question)
      if (result && result.assistant_messages && result.assistant_messages.length > 0) {
        const response = result.assistant_messages[result.assistant_messages.length - 1].text
        await this.sock.sendMessage(jid, { text: `🤖 *GPT Response:*\n\n${response}\n\n💡 Lanjut chat? Ketik: gpt [pertanyaan baru]` })
      } else {
        await this.sock.sendMessage(jid, { text: '❌ Tidak ada response dari GPT' })
      }
    } catch (error) {
      await this.sock.sendMessage(jid, { text: `❌ Error: ${error.message}` })
    }
  }

  // Handle downloads
  async handleDownload(jid, platform, url) {
    if (!url || url.trim() === '') {
      await this.sock.sendMessage(jid, { text: `❌ Mohon berikan link ${platform}!\nContoh: ${platform} https://...` })
      return
    }

    await this.sock.sendMessage(jid, { text: `📥 Sedang download dari ${platform}... Mohon tunggu.` })
    
    try {
      if (platform === 'spotify') {
        const result = await spotifyTrackDownloader(url)
        if (result.status === 'success') {
          await this.sock.sendMessage(jid, {
            audio: { url: result.dlink },
            caption: `✅ *Spotify Download Berhasil*\n\n🎵 Title: ${result.song_name}\n🎤 Artist: ${result.artist}\n💿 Album: ${result.album_name}\n⏱️ Duration: ${result.duration}\n\n💡 Download lagi? Kirim link Spotify yang baru`
          })
        } else {
          await this.sock.sendMessage(jid, { text: '❌ Gagal download dari Spotify' })
        }
        return
      }

      const platformMap = {
        'instagram': 'instagram',
        'tiktok': 'tiktok', 
        'facebook': 'facebook'
      }

      const result = await instaTiktokDownloader(platformMap[platform], url)
      
      if (result.status) {
        if (Array.isArray(result.download)) {
          // Multiple files (Instagram)
          await this.sock.sendMessage(jid, { text: `✅ Berhasil download ${result.download.length} file dari ${platform}:` })
          for (const [index, downloadUrl] of result.download.entries()) {
            await this.sock.sendMessage(jid, {
              video: { url: downloadUrl },
              caption: `📥 File ${index + 1}/${result.download.length}`
            })
          }
        } else {
          // Single file
          await this.sock.sendMessage(jid, {
            video: { url: result.download },
            caption: `✅ *Download ${platform} berhasil*\n\n💡 Download lagi? Kirim link ${platform} yang baru`
          })
        }
      } else {
        await this.sock.sendMessage(jid, { text: `❌ Gagal download dari ${platform}` })
      }
    } catch (error) {
      await this.sock.sendMessage(jid, { text: `❌ Error: ${error.message}` })
    }
  }

  // Handle TempMail
  async handleTempMail(jid) {
    await this.sock.sendMessage(jid, { text: '📧 Sedang membuat email sementara... Mohon tunggu.' })
    
    try {
      const result = await tempmail.create()
      if (result.success) {
        const response = `✅ *Email Sementara Berhasil Dibuat*

📧 Email: ${result.result.address}
🔐 Token: ${result.result.token}
⏰ Berlaku hingga: ${new Date(result.result.expiresAt).toLocaleString('id-ID')}

💡 Untuk cek inbox: checkemail ${result.result.token}
⚠️ Simpan token untuk mengecek email masuk`

        await this.sock.sendMessage(jid, { text: response })
      } else {
        await this.sock.sendMessage(jid, { text: `❌ Gagal membuat email: ${result.result.error}` })
      }
    } catch (error) {
      await this.sock.sendMessage(jid, { text: `❌ Error: ${error.message}` })
    }
  }

  // Handle Check Email
  async handleCheckEmail(jid, token) {
    if (!token || token.trim() === '') {
      await this.sock.sendMessage(jid, { text: '❌ Mohon berikan token email!\nContoh: checkemail your_token_here' })
      return
    }

    await this.sock.sendMessage(jid, { text: '✉️ Sedang mengecek inbox... Mohon tunggu.' })
    
    try {
      const expiresAt = new Date(Date.now() + (60 * 60 * 1000)) // 1 hour from now
      const result = await tempmail.checkInbox(token, expiresAt)
      
      if (result.success) {
        if (result.result.emails && result.result.emails.length > 0) {
          let response = `✅ *Inbox Email (${result.result.emails.length} email)*\n\n`
          
          result.result.emails.forEach((email, index) => {
            response += `📧 *Email ${index + 1}:*\n`
            response += `From: ${email.from}\n`
            response += `Subject: ${email.subject}\n`
            response += `Date: ${new Date(email.createdAt).toLocaleString('id-ID')}\n`
            response += `Body: ${email.body.substring(0, 200)}${email.body.length > 200 ? '...' : ''}\n\n`
          })
          
          response += `💡 Cek lagi: checkemail ${token}`
          await this.sock.sendMessage(jid, { text: response })
        } else {
          await this.sock.sendMessage(jid, { text: `📭 Inbox kosong\n\n💡 Cek lagi: checkemail ${token}` })
        }
      } else {
        await this.sock.sendMessage(jid, { text: `❌ ${result.result.error}` })
      }
    } catch (error) {
      await this.sock.sendMessage(jid, { text: `❌ Error: ${error.message}` })
    }
  }

  // Handle incoming messages
  async handleMessage(message, jid) {
    const text = this.extractMessageText(message)
    if (!text) return

    const command = text.toLowerCase().trim()
    const args = text.split(' ').slice(1).join(' ')

    console.log(`📩 Received: ${command} from ${jid}`)

    // Handle button responses
    switch (command) {
      case 'menu_ai':
        await this.sendAIMenu(jid)
        break
      case 'menu_download':
        await this.sendDownloadMenu(jid)
        break
      case 'menu_tools':
        await this.sendToolsMenu(jid)
        break
      case 'menu_help':
        await this.sendHelpMenu(jid)
        break
      case 'ai_image':
        await this.sock.sendMessage(jid, { text: '🎨 Kirim prompt untuk generate image:\nContoh: Beautiful sunset over mountains' })
        break
      case 'ai_video':
        await this.sock.sendMessage(jid, { text: '🎬 Kirim prompt untuk generate video:\nContoh: Cat playing in the garden' })
        break
      case 'luna_video':
        await this.sock.sendMessage(jid, { text: '🌙 Kirim prompt untuk Luna AI video:\nContoh: Dancing robot in space' })
        break
      case 'text2img':
        await this.sock.sendMessage(jid, { text: '🖼️ Kirim prompt untuk text to image:\nContoh: Cartoon character design' })
        break
      case 'gpt_chat':
        await this.sock.sendMessage(jid, { text: '💬 Kirim pertanyaan untuk GPT:\nContoh: Apa itu artificial intelligence?' })
        break
      case 'dl_instagram':
        await this.sock.sendMessage(jid, { text: '📸 Kirim link Instagram yang ingin di download:\nContoh: https://instagram.com/p/...' })
        break
      case 'dl_tiktok':
        await this.sock.sendMessage(jid, { text: '🎵 Kirim link TikTok yang ingin di download:\nContoh: https://tiktok.com/@user/video/...' })
        break
      case 'dl_facebook':
        await this.sock.sendMessage(jid, { text: '👥 Kirim link Facebook yang ingin di download:\nContoh: https://facebook.com/...' })
        break
      case 'dl_spotify':
        await this.sock.sendMessage(jid, { text: '🎧 Kirim link Spotify yang ingin di download:\nContoh: https://open.spotify.com/track/...' })
        break
      case 'tool_tempmail':
        await this.handleTempMail(jid)
        break
      case 'tool_checkemail':
        await this.sock.sendMessage(jid, { text: '✉️ Kirim token email untuk cek inbox:\nContoh: your_email_token_here' })
        break
      // Handle text commands
      case 'menu':
      case '/start':
      case 'hi':
      case 'hello':
        await this.sendMainMenu(jid)
        break
      case 'help':
        await this.sendHelpMenu(jid)
        break
      default:
        // Handle commands with arguments
        if (command.startsWith('aiimg ')) {
          await this.handleAIImage(jid, args)
        } else if (command.startsWith('aivideo ')) {
          await this.handleAIVideo(jid, args)
        } else if (command.startsWith('lunavideo ')) {
          await this.handleLunaVideo(jid, args)
        } else if (command.startsWith('t2vimg ') || command.startsWith('text2img ')) {
          await this.handleAIImage(jid, args) // Use same as aiimg
        } else if (command.startsWith('gpt ')) {
          await this.handleGPTChat(jid, args)
        } else if (command.startsWith('ig ') || command.startsWith('instagram ')) {
          await this.handleDownload(jid, 'instagram', args)
        } else if (command.startsWith('tiktok ') || command.startsWith('tt ')) {
          await this.handleDownload(jid, 'tiktok', args)
        } else if (command.startsWith('fb ') || command.startsWith('facebook ')) {
          await this.handleDownload(jid, 'facebook', args)
        } else if (command.startsWith('spotify ')) {
          await this.handleDownload(jid, 'spotify', args)
        } else if (command.startsWith('checkemail ')) {
          await this.handleCheckEmail(jid, args)
        } else if (command === 'tempmail') {
          await this.handleTempMail(jid)
        } else {
          // Unknown command, show menu
          await this.sendMainMenu(jid)
        }
        break
    }
  }

  // Start the bot
  async start() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
      this.authState = state

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
      })

      this.sock.ev.on('creds.update', saveCreds)

      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        
        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
          console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
          
          if (shouldReconnect) {
            this.start()
          }
        } else if (connection === 'open') {
          console.log('✅ WhatsApp Bot Connected Successfully!')
          console.log('🤖 Bot is ready to receive messages')
        }
      })

      this.sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0]
        if (!message.key.fromMe && message.message) {
          const jid = message.key.remoteJid
          await this.handleMessage(message.message, jid)
        }
      })

    } catch (error) {
      console.error('Error starting bot:', error)
    }
  }
}

// Start the bot
console.log('🚀 Starting WhatsApp Bot with Interactive Menus...')
const bot = new WhatsAppBot()
bot.start()

export default WhatsAppBot