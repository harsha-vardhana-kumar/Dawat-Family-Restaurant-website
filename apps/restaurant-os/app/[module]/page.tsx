import RestaurantApp from '@/components/os/app';
export default async function ModulePage({params}:{params:Promise<{module:string}>}){return <RestaurantApp module={(await params).module}/>;}
