import {services} from '@/db/raw';
import {handleApi} from '@/lib/server/api';
export const dynamic='force-dynamic';
async function handle(request:Request){try{return await handleApi(request,services());}catch(e){console.error('Dawat storage unavailable',e);return Response.json({error:'Restaurant storage is unavailable. Please try again shortly.',code:'UNAVAILABLE'},{status:503,headers:{'cache-control':'no-store'}});}}
export const GET=handle;
export const POST=handle;
