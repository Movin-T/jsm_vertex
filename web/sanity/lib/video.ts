const YOUTUBE_ID = /^[\w-]{11}$/;

/** Extracts a YouTube video id from watch, youtu.be, or embed URLs; null if unsupported. */
export function getYouTubeId(url: string | null | undefined) {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, '');
  let id: string | null = null;

  if (host === 'youtu.be') {
    id = parsed.pathname.slice(1);
  } else if (host === 'youtube.com' || host === 'm.youtube.com') {
    id = parsed.pathname.startsWith('/embed/')
      ? parsed.pathname.split('/')[2]
      : parsed.searchParams.get('v');
  }

  return id && YOUTUBE_ID.test(id) ? id : null;
}

/** Builds the privacy-enhanced embed URL, starting at a whole number of seconds. */
export function youTubeEmbedUrl(id: string, startSeconds = 0) {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
  if (startSeconds > 0) {
    params.set('start', String(Math.floor(startSeconds)));
    params.set('autoplay', '1');
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
