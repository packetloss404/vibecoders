import 'dotenv/config';

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error('YOUTUBE_API_KEY not found in .env');
  process.exit(1);
}

const channels = {
  'dyoburon': 'UCYzpOLXEmgUiHZeho6u77Zg',
  'HardHeadHackerHead': 'UCvRibuOhtInWPz8Yaf3DjTw',
  'BilbroSwagginzCoding': 'UCU0uyjCjL9gcwKhGc_9kW8A',
  'Clearmud': 'UClMgNsPzvVprkO297NfjDuw',
  'khuurdotdev': 'UCflKBuSaZf-NJN0BmVmF90A',
  'bridgemindai': 'UCwaTGE53GLGC3fDClVl_7TA',
  'EnterpriseVibeCode': 'UCyxYcJWs5WstpM2h8KjabUw',
  'NateNeedham': 'UChh5UFM7CUMFNVQrJX1aVVA',
  'Dubibubii': 'UC4SgqYQmdTCKXUoer2U-lcg',
  'jorddanlee': 'UCMB_2UGhVxA_gLjdtm35lRw'
};

async function getChannelData(channelId) {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${channelId}&key=${API_KEY}`);
  return res.json();
}

async function getVideos(uploadsPlaylistId) {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&key=${API_KEY}`);
  return res.json();
}

async function getLiveDetails(videoId) {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${videoId}&key=${API_KEY}`);
  return res.json();
}

function getDayOfWeek(dateStr) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(dateStr).getDay()];
}

async function analyzeChannel(name, channelId) {
  const data = await getChannelData(channelId);
  if (!data.items || data.items.length === 0) {
    console.log(`${name}: Channel not found (data: ${JSON.stringify(data)})`);
    return null;
  }

  const uploadsPlaylistId = data.items[0].contentDetails.relatedPlaylists.uploads;

  const videosData = await getVideos(uploadsPlaylistId);
  const videos = videosData.items || [];

  const liveStreamTimes = [];

  for (const video of videos) {
    const videoId = video.contentDetails.videoId;
    const publishedAt = video.snippet.publishedAt;

    const details = await getLiveDetails(videoId);
    const liveDetails = details.items?.[0]?.liveStreamingDetails;

    if (liveDetails) {
      liveStreamTimes.push(publishedAt);
    }
  }

  return { name, handle: name, liveCount: liveStreamTimes.length, liveStreamTimes };
}

async function main() {
  console.log('Fetching channel data...\n');

  for (const [name, channelId] of Object.entries(channels)) {
    const result = await analyzeChannel(name, channelId);
    if (result) {
      console.log(`${result.name}: ${result.liveCount} live streams`);
      if (result.liveStreamTimes.length > 0) {
        const times = result.liveStreamTimes.slice(0, 3).map(t => {
          const d = new Date(t);
          return `${getDayOfWeek(d)} ${d.toLocaleTimeString('en-US', { hour: '2-digit', timeZone: 'America/New_York' })} ET`;
        });
        console.log(`  Recent: ${times.join(', ')}`);
      }
    }
    await new Promise(r => setTimeout(r, 200));
  }
}

main();