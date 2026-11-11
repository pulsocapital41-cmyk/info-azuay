import { getCollection } from 'astro:content';

export async function GET() {
  const noticias = (await getCollection('noticias')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const itemsXml = noticias
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>https://infoazuay.net/noticias/${post.id}/</link>
      <guid isPermaLink="true">https://infoazuay.net/noticias/${post.id}/</guid>
      <description><![CDATA[${post.data.subtitle || post.data.excerpt || ''}]]></description>
      <category><![CDATA[${post.data.category}]]></category>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
    </item>`
    )
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Info Azuay — Noticias en tiempo real</title>
    <description>El pulso informativo del Austro ecuatoriano. Noticias de Cuenca, Azuay y la región.</description>
    <link>https://infoazuay.net</link>
    <language>es-ec</language>
    <atom:link href="https://infoazuay.net/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
