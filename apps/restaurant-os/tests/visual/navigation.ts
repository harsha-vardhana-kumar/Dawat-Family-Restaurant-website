import {useSyncExternalStore} from 'react';
const route=()=>window.location.hash.slice(1)||'/';
const subscribe=(listener:()=>void)=>{window.addEventListener('hashchange',listener);return()=>window.removeEventListener('hashchange',listener);};
export function useRoute(){return useSyncExternalStore(subscribe,route,()=>'/');}
export function useSearchParams(){return new URLSearchParams(useRoute().split('?')[1]||'');}
export function usePathname(){return useRoute().split('?')[0];}
export const router={push:(path:string)=>{window.location.hash=path;},replace:(path:string)=>{window.location.hash=path;}};
export function useRouter(){return router;}
