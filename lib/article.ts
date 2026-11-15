import type {Block} from '@/lib/content';
export const plain=(s:string)=>s.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
export function heading(b:Block,n:number){return b.type===`h${n}`||(b.type==='html'&&new RegExp(`^\\s*<h${n}[ >]`).test(String(b.value)));}
export function hasContent(b:Block){
 const value=Array.isArray(b.value)?b.value.join(' '):b.value;
 if(b.type==='destinations')return true;
 if(b.type==='figure')return /^\/images\/\S+/.test(value);
 if(/lorem ipsum/i.test(value))return false;
 return !!plain(value).replace(/&#160;|&#8203;|&ZeroWidthSpace;/g,'').trim()||/<(?:img|iframe|video)\b[^>]+(?:src)=/i.test(value);
}
export function chaptersFor(blocks:Block[],guide=false){
 const chapters:{title:string;html?:string;blocks:Block[]}[]=[{title:'',blocks:[]}];
 let added=false;
 for(const b of blocks){
  if(!hasContent(b))continue;
  if(guide&&heading(b,2)&&/^Viajar en bicicleta por /i.test(plain(String(b.value)))){if(!added){chapters.at(-1)!.blocks.push({type:'destinations',value:''});added=true;}continue;}
  if(heading(b,2))chapters.push({title:plain(String(b.value)),html:b.type==='html'?String(b.value).replace(/^\s*<h2[^>]*>/i,'').replace(/<\/h2>\s*$/i,''):undefined,blocks:[]});
  else if(!/^En esta página hablamos de:?$/i.test(plain(String(b.value))))chapters.at(-1)!.blocks.push(b);
 }
return chapters.filter((c,i)=>i===0||c.blocks.some(hasContent));
}
