import type { APIRoute } from 'astro';
const paths=['/','/menu/','/signature-dishes/','/our-story/','/experience/','/gallery/','/order-online/','/contact/','/offers/','/faq/'];
export const GET: APIRoute = ({site}) => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${new URL(path,site).href}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
