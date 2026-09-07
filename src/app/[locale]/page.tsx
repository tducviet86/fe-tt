import{notFound}from"next/navigation";import{HomeExperience}from"@/components/commercial/home-experience";import{getUnits}from"@/lib/api/units";
export function generateStaticParams(){return[{locale:"vi"},{locale:"en"}]}
export default async function Home({params}:{params:Promise<{locale:string}>}){const{locale}=await params;if(locale!=="vi"&&locale!=="en")notFound();return <HomeExperience locale={locale} units={await getUnits()}/>}
