import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the URL' }, { status: response.status });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Gereksiz etiketleri temizle
    $('script, style, nav, footer, header, noscript, iframe, svg, img, button, input').remove();

    // Sadece gövde metnini al ve boşlukları temizle
    let text = $('body').text();
    text = text.replace(/\s+/g, ' ').trim();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'An error occurred while scraping the URL' }, { status: 500 });
  }
}
