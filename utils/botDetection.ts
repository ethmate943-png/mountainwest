export const BOT_PATTERNS = {
  google: [
    /Mozilla\/5\.0 \(compatible; Googlebot\/2\.1; \+http:\/\/www\.google\.com\/bot\.html\)/i,
    /Mozilla\/5\.0 \(Linux; Android .*\) AppleWebKit\/.* \(KHTML, like Gecko\) Chrome\/41\.0\.2272\.96 .* \(compatible; Googlebot\/2\.1; \+http:\/\/www\.google\.com\/bot\.html\)/i,
    /Googlebot-Image\/1\.0/i,
    /Googlebot-Video\/1\.0/i,
    /Googlebot-News/i,
    /Googlebot-Favicon/i,
    /Google-InspectionTool/i,
    /Mozilla\/5\.0 \(Linux; Android .*\) AppleWebKit\/.* \(KHTML, like Gecko\) Chrome\/41\.0\.2272\.96 .* \(compatible; Google-AMPHTML\/1\.0; \+https:\/\/www\.google\.com\/bot\.html\)/i,
    /AMP Googlebot/i,
    /AdsBot-Google(-Mobile)?/i,
    /Mediapartners-Google/i,
    /Feedfetcher-Google/i,
    /Googlebot/i,
  ],
  bing: [
    /bingbot/i,
    /msnbot/i,
    /BingPreview/i,
    /MicrosoftPreview/i,
    /BingVideoPreview/i,
    /adidxbot/i,
  ],
  yahoo: [/Slurp/i, /yahoo/i],
  yandex: [
    /YandexBot/i,
    /YandexImages/i,
    /YandexVideo/i,
    /YandexMedia/i,
    /YandexBlogs/i,
  ],
  baidu: [
    /Baiduspider/i,
    /Baiduspider-image/i,
    /Baiduspider-video/i,
  ],
  duckduckgo: [/DuckDuckBot/i, /DuckDuckGo-Favicons-Bot/i],
  facebook: [/facebookexternalhit/i, /FacebookBot/i],
  twitter: [/Twitterbot/i],
  linkedin: [/LinkedInBot/i],
  pinterest: [/Pinterest/i],
  apple: [/Applebot(?!-Extended)/i],
  other: [/crawler/i, /spider/i, /bot\//i, /slurp/i],
};

export function detectBotType(ua: string): { isBot: boolean; botName: string | null } {
  if (!ua) return { isBot: false, botName: null };

  for (const [botName, patterns] of Object.entries(BOT_PATTERNS)) {
    if (patterns.some((p) => p.test(ua))) {
      return { isBot: true, botName };
    }
  }

  return { isBot: false, botName: null };
}

export function isCrawlerUserAgent(userAgent?: string): boolean {
  const ua =
    userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  return /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot/i.test(
    ua,
  );
}

export function getSpecificBotType(ua: string): string {
  if (!ua) return "Unknown Bot";

  if (/Googlebot-Image/i.test(ua)) return "Googlebot-Image";
  if (/Googlebot-Video/i.test(ua)) return "Googlebot-Video";
  if (/Googlebot-News/i.test(ua)) return "Googlebot-News";
  if (/Googlebot-Favicon/i.test(ua)) return "Googlebot-Favicon";
  if (/Google-InspectionTool/i.test(ua)) return "Google-InspectionTool";
  if (/AdsBot-Google-Mobile/i.test(ua)) return "AdsBot-Google-Mobile";
  if (/AdsBot-Google/i.test(ua)) return "AdsBot-Google";
  if (/Mediapartners-Google/i.test(ua)) return "Mediapartners-Google";
  if (/Feedfetcher-Google/i.test(ua)) return "Feedfetcher-Google";
  if (/Googlebot/i.test(ua)) return "Googlebot";

  if (/bingbot/i.test(ua)) return "Bingbot";
  if (/msnbot/i.test(ua)) return "MSNBot";
  if (/BingVideoPreview/i.test(ua)) return "BingVideoPreview";
  if (/MicrosoftPreview/i.test(ua)) return "MicrosoftPreview";
  if (/BingPreview/i.test(ua)) return "BingPreview";
  if (/adidxbot/i.test(ua)) return "AdIdxBot";

  if (/YandexImages/i.test(ua)) return "YandexImages";
  if (/YandexVideo/i.test(ua)) return "YandexVideo";
  if (/YandexMedia/i.test(ua)) return "YandexMedia";
  if (/YandexBlogs/i.test(ua)) return "YandexBlogs";
  if (/YandexBot/i.test(ua)) return "YandexBot";

  if (/Baiduspider-image/i.test(ua)) return "Baiduspider-Image";
  if (/Baiduspider-video/i.test(ua)) return "Baiduspider-Video";
  if (/Baiduspider/i.test(ua)) return "Baiduspider";

  if (/DuckDuckGo-Favicons-Bot/i.test(ua)) return "DuckDuckGo-Favicons";
  if (/DuckDuckBot/i.test(ua)) return "DuckDuckBot";

  if (/facebookexternalhit/i.test(ua)) return "FacebookExternalHit";
  if (/FacebookBot/i.test(ua)) return "FacebookBot";
  if (/Twitterbot/i.test(ua)) return "TwitterBot";
  if (/LinkedInBot/i.test(ua)) return "LinkedInBot";
  if (/Pinterest/i.test(ua)) return "PinterestBot";

  if (/Applebot/i.test(ua)) return "Applebot";
  if (/Slurp/i.test(ua)) return "Yahoo Slurp";

  return "Generic Bot";
}
