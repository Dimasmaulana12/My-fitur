# WhatsApp Bot with Interactive Menus

WhatsApp bot dengan sistem menu interaktif menggunakan tombol (buttons) untuk pengalaman pengguna yang lebih baik.

## Features

### 🤖 AI Generator
- **AI Image**: Generate gambar menggunakan AI
- **AI Video**: Generate video menggunakan AI  
- **Luna Video**: Generate video menggunakan Luna AI
- **Text to Image**: Konversi teks ke gambar
- **GPT Chat**: Chat dengan GPT

### 📥 Downloader
- **Instagram**: Download video/foto dari Instagram
- **TikTok**: Download video dari TikTok
- **Facebook**: Download video dari Facebook
- **Spotify**: Download musik dari Spotify

### 🛠️ Tools
- **TempMail**: Buat email sementara
- **Check Email**: Cek inbox email sementara

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the bot:
```bash
npm start
```

3. Scan QR code dengan WhatsApp untuk login

## Usage

### Interactive Menu
Bot akan menampilkan menu interaktif dengan tombol yang bisa diklik. Pilih menu yang diinginkan dengan menekan tombol.

### Text Commands
Alternatif menggunakan perintah teks:

- `menu` - Tampilkan menu utama
- `help` - Tampilkan bantuan
- `aiimg [prompt]` - Generate AI image
- `aivideo [prompt]` - Generate AI video
- `lunavideo [prompt]` - Generate Luna AI video
- `gpt [pertanyaan]` - Chat dengan GPT
- `ig [link]` - Download Instagram
- `tiktok [link]` - Download TikTok
- `fb [link]` - Download Facebook
- `tempmail` - Buat email sementara
- `checkemail [token]` - Cek inbox email

## Features

- ✅ Interactive button menus
- ✅ Fallback to text if buttons fail
- ✅ Error handling with user-friendly messages
- ✅ Integration with all utility functions
- ✅ Support for both button clicks and text commands
- ✅ Proper message extraction for different message types

## Technical Implementation

### Button Message Creation
- `createInteractiveMessage()` - Creates interactive buttons
- `createListMessage()` - Creates list-style menus
- `extractMessageText()` - Handles various message types including button responses

### Error Handling
- Try-catch blocks for all button operations
- Automatic fallback to plain text menus if buttons fail
- Graceful error messages for users

### Message Processing
The bot properly handles:
- Regular text messages
- Button response messages
- List response messages
- Interactive response messages

## Support

WhatsApp Group: https://chat.whatsapp.com/Ke94ex9fNLjE2h8QzhvEiy

Created by @Dimasmaulana12