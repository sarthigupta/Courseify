const axios = require("axios");

const YT_API_BASE = "https://www.googleapis.com/youtube/v3";
const API_KEY = () => process.env.YOUTUBE_API_KEY;

/**
 * Extract playlist ID from various YouTube URL formats
 */
const extractPlaylistId = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("list") || null;
  } catch {
    // Try regex fallback
    const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }
};

/**
 * Convert ISO 8601 duration (PT1H2M3S) to total seconds
 */
const parseDuration = (iso) => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Fetch playlist metadata + all video items (handles pagination)
 */
const fetchPlaylistData = async (playlistId) => {
  // 1. Get playlist metadata
  const playlistRes = await axios.get(`${YT_API_BASE}/playlists`, {
    params: {
      part: "snippet",
      id: playlistId,
      key: API_KEY(),
    },
  });

  const playlistItem = playlistRes.data.items?.[0];
  if (!playlistItem) {
    throw new Error("Playlist not found or is private");
  }

  const snippet = playlistItem.snippet;
  const playlistInfo = {
    title: snippet.title,
    description: snippet.description,
    channelTitle: snippet.channelTitle,
    thumbnail:
      snippet.thumbnails?.maxres?.url ||
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.default?.url ||
      "",
  };

  // 2. Fetch all playlist items (paginated)
  let videos = [];
  let nextPageToken = null;

  do {
    const itemsRes = await axios.get(`${YT_API_BASE}/playlistItems`, {
      params: {
        part: "snippet,contentDetails",
        playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
        key: API_KEY(),
      },
    });

    const items = itemsRes.data.items || [];
    nextPageToken = itemsRes.data.nextPageToken || null;

    // Filter out deleted/private videos
    const validItems = items.filter(
      (item) => item.snippet.title !== "Deleted video" && item.snippet.title !== "Private video"
    );

    const videoIds = validItems.map((item) => item.contentDetails.videoId).join(",");

    // 3. Fetch video durations in bulk
    const videoDetailsRes = await axios.get(`${YT_API_BASE}/videos`, {
      params: {
        part: "contentDetails,snippet",
        id: videoIds,
        key: API_KEY(),
      },
    });

    const durationMap = {};
    videoDetailsRes.data.items.forEach((v) => {
      durationMap[v.id] = {
        duration: v.contentDetails.duration,
        durationSeconds: parseDuration(v.contentDetails.duration),
      };
    });

    validItems.forEach((item) => {
      const videoId = item.contentDetails.videoId;
      const dur = durationMap[videoId] || { duration: "PT0S", durationSeconds: 0 };
      videos.push({
        videoId,
        title: item.snippet.title,
        description: item.snippet.description?.slice(0, 500) || "",
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.default?.url ||
          "",
        duration: dur.duration,
        durationSeconds: dur.durationSeconds,
      });
    });
  } while (nextPageToken);

  return { playlistInfo, videos };
};

module.exports = { extractPlaylistId, fetchPlaylistData, parseDuration };
