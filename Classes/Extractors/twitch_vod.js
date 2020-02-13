const fetch = require('node-fetch');

module.exports = {
  title: 'Twitch Video',
  test_urls: [
    'https://www.twitch.tv/videos/550324960',
  ],
  regex: /https?:\/\/(?:www\.)?twitch\.tv\/videos\/(\d+)/,
  extract: async match => {
    const response = await fetch(`https://api.twitch.tv/helix/videos?id=${match[1]}`, {
      headers: { 'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko' },
    });
    const vodData = await response.json();
    if(response.status === 400)
      return null;
    else
      return vodData.data[0].thumbnail_url.replace('%{width}', '1430').replace('%{height}', '800');
  },
};