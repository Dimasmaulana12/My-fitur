import axios from "axios";
import crypto from "crypto"

const spotifyTrackDownloader = async (spotifyTrackUrl) => {
    const client = new axios.create({
        baseURL: 'https://spotisongdownloader.to',
        headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            'cookie': `PHPSESSID=${crypto.randomBytes(16).toString('hex')}; _ga=GA1.1.2675401.${Math.floor(Date.now() / 1000)}`,
            'referer': 'https://spotisongdownloader.to',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    const { data: meta } = await client.get('/api/composer/spotify/xsingle_track.php', {
        params: { url: spotifyTrackUrl }
    })
    await client.post('/track.php')
    const { data: dl } = await client.post('/api/composer/spotify/ssdw23456ytrfds.php', {
        "url": spotifyTrackUrl,
        "zip_download": "false",
        "quality": "m4a"
    })
    const result = {...dl, ...meta}
    return result
}

spotifyTrackDownloader("https://open.spotify.com/track/1ibeKVCiXORhvUpMmtsQWq")
.then(console.log)
.catch(e => {
    console.log('waduh ada error ' +e.message)
})

/* output
{
  dlink: 'https://mymp3.xyz/phmp3?fname=483-801.m4a',
  status: 'success',
  comments: 'success',
  cookie: '/root/django/scookies/c4.txt',
  song_name: 'Pieces',
  artist: 'Sum 41',
  img: 'https://i.scdn.co/image/ab67616d0000b273cb38dd3dba8a0801bc1ee03a',
  duration: '3m 0s',
  res: 200,
  url: 'https://open.spotify.com/track/1ibeKVCiXORhvUpMmtsQWq',
  released: '2004-10-12',
  album_name: 'Chuck'
} */