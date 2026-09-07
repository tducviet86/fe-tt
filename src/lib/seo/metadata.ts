import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
const site=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
export function buildCanonical(path:string){return new URL(path,site).toString()}
export function buildAlternates(viPath:string,enPath:string){return{canonical:buildCanonical(viPath),languages:{vi:buildCanonical(viPath),en:buildCanonical(enPath),"x-default":buildCanonical(viPath)}}}
export function buildMetadata(input:{title:string;description:string;locale:Locale;path:string;alternatePath:string;image?:string;index?:boolean}):Metadata{const vi=input.locale==="vi"?input.path:input.alternatePath;const en=input.locale==="en"?input.path:input.alternatePath;return{title:input.title,description:input.description,alternates:buildAlternates(vi,en),robots:{index:input.index??true,follow:input.index??true},openGraph:{title:input.title,description:input.description,url:buildCanonical(input.path),locale:input.locale==="vi"?"vi_VN":"en_US",type:"website",images:input.image?[{url:input.image}]:undefined},twitter:{card:"summary_large_image",title:input.title,description:input.description,images:input.image?[input.image]:undefined}}}
