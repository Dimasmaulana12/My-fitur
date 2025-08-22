/* 

• Scrape InstaTikTok

• Author : SaaOfc's

• Desk: Support Fb, IG, TikTok

*/

import axios from 'axios'

import cheerio from 'cheerio'

const SITE_URL = 'https://instatiktok.com/'

export async function instaTiktokDownloader(platform, inputUrl) {

  if (!inputUrl) throw 'masukin link yg bner!'

  if (!['instagram', 'tiktok', 'facebook'].includes(platform)) throw 'platform ga ada.'

  const form = new URLSearchParams()

  form.append('url', inputUrl)

  form.append('platform', platform)

  form.append('siteurl', SITE_URL)

  try {

    const res = await axios.post(`${SITE_URL}api`, form.toString(), {

      headers: {

        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',

        'Origin': SITE_URL,

        'Referer': SITE_URL,

        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',

        'X-Requested-With': 'XMLHttpRequest'

      }

    })

    const html = res?.data?.html

    if (!html || res?.data?.status !== 'success') throw 'gagal.'

    const $ = cheerio.load(html)

    const links = []

    $('a.btn[href^="http"]').each((_, el) => {

      const link = $(el).attr('href')

      if (link && !links.includes(link)) links.push(link)

    })

    if (links.length === 0) throw 'link ga ada'

    let download

    if (platform === 'instagram') {

      download = links

    } else if (platform === 'tiktok') {

      download = links.find(link => /hdplay/.test(link)) || links[0]

    } else if (platform === 'facebook') {

      download = links.at(-1)

    }

    return {

      status: true,

      platform,

      download

    }

  } catch (e) {

    throw `gagal ambil data: ${e.message || e}`

  }

}