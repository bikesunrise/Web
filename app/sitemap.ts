export const dynamic='force-static';
import type { MetadataRoute } from 'next';import {entries} from '@/lib/content';
export default function sitemap():MetadataRoute.Sitemap{return [{url:'https://bikesunrise.com/',priority:1},...entries.map(x=>({url:'https://bikesunrise.com'+x.path+'/',lastModified:x.date?new Date(x.date):undefined,priority:x.kind==='archive'?.7:.6}))]}
