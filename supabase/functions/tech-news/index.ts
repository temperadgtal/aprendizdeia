import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

type Region = 'global' | 'br'

interface NewsItem {
  id: string
  title: string
  url: string
  description: string
  source: string
  author: string | null
  image: string | null
  publishedAt: string | null
  region: Region
}

function decodeEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(Number(n)))
    .trim()
}

function pick(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return m ? m[1] : null
}

function extractImage(block: string): string | null {
  const media = block.match(/<media:content[^>]*url="([^"]+)"/i) || block.match(/<media:thumbnail[^>]*url="([^"]+)"/i)
  if (media) return media[1]
  const enclosure = block.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image/i)
  if (enclosure) return enclosure[1]
  const content = pick(block, 'content:encoded') || pick(block, 'description') || ''
  const img = content.match(/<img[^>]*src="([^"]+)"/i)
  return img ? img[1] : null
}

async function fetchRss(url: string, source: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      },
      redirect: 'follow',
    })
    if (!res.ok) return []
    const xml = await res.text()
    const items = xml.split(/<item[\s>]/i).slice(1)
    return items.slice(0, 8).map((raw, idx) => {
      const block = '<item ' + raw
      const title = decodeEntities(pick(block, 'title') ?? '')
      const linkRaw = pick(block, 'link') ?? ''
      const link = decodeEntities(linkRaw) || (block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? '')
      const desc = decodeEntities(pick(block, 'description') ?? '').slice(0, 220)
      const pubDate = pick(block, 'pubDate') ?? pick(block, 'dc:date')
      const author = pick(block, 'dc:creator') ?? pick(block, 'author')
      return {
        id: `${source}-${idx}-${link.slice(-24)}`,
        title,
        url: link,
        description: desc,
        source,
        author: author ? decodeEntities(author) : null,
        image: extractImage(block),
        publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
        region: 'br' as Region,
      }
    }).filter((i) => i.title && i.url)
  } catch (_e) {
    return []
  }
}

async function fetchDevTo(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://dev.to/api/articles?per_page=15&top=7', {
      headers: { 'Accept': 'application/json' },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data as any[]).map((a) => ({
      id: `devto-${a.id}`,
      title: a.title,
      url: a.url,
      description: a.description ?? '',
      source: 'dev.to',
      author: a.user?.name ?? null,
      image: a.cover_image ?? a.social_image ?? null,
      publishedAt: a.published_at ?? null,
      region: 'global' as Region,
    }))
  } catch (_e) {
    return []
  }
}

async function fetchHackerNews(): Promise<NewsItem[]> {
  try {
    const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    if (!idsRes.ok) return []
    const ids: number[] = await idsRes.json()
    const top = ids.slice(0, 15)
    const stories = await Promise.all(
      top.map(async (id) => {
        const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        if (!r.ok) return null
        return r.json()
      }),
    )
    return stories
      .filter((s) => s && s.title && s.url)
      .map((s) => ({
        id: `hn-${s.id}`,
        title: s.title,
        url: s.url,
        description: s.text ? String(s.text).replace(/<[^>]*>/g, '').slice(0, 200) : '',
        source: 'Hacker News',
        author: s.by ?? null,
        image: null,
        publishedAt: s.time ? new Date(s.time * 1000).toISOString() : null,
        region: 'global' as Region,
      }))
  } catch (_e) {
    return []
  }
}

const BR_FEEDS: { url: string; source: string }[] = [
  { url: 'https://canaltech.com.br/rss/', source: 'Canaltech' },
  { url: 'https://www.tecmundo.com.br/rss', source: 'TecMundo' },
  { url: 'https://olhardigital.com.br/feed/', source: 'Olhar Digital' },
  { url: 'https://tecnoblog.net/feed/', source: 'Tecnoblog' },
  { url: 'https://www.mundoconectado.com.br/feed/', source: 'Mundo Conectado' },
  { url: 'https://gizmodo.uol.com.br/feed/', source: 'Gizmodo Brasil' },
  { url: 'https://itforum.com.br/feed/', source: 'IT Forum' },
  { url: 'https://startups.com.br/feed/', source: 'Startups' },
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const brResults = await Promise.all(BR_FEEDS.map((f) => fetchRss(f.url, f.source)))
    const [devto, hn] = await Promise.all([fetchDevTo(), fetchHackerNews()])

    const items = [...brResults.flat(), ...devto, ...hn].sort((a, b) => {
      const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0
      const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0
      return tb - ta
    })

    return new Response(JSON.stringify({ items }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), items: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
