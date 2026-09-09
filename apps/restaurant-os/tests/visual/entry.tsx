import {createRoot} from 'react-dom/client';
import RestaurantApp from '../../components/os/app';
import {useRoute} from './navigation';
import fixtures from './snapshots.json';

// Component tests only. This bundle never authenticates with or sends writes to
// the restaurant API. Generated output is ignored and removed before packaging.
if(!location.pathname.startsWith('/_visual-qa/'))throw new Error('This fixture is only available in the isolated component test page.');
const snapshots=fixtures as unknown as Record<string,unknown>;
window.fetch=async (input:RequestInfo|URL,init?:RequestInit)=>{
 const path=String(input).replace(/^\/api\/os\//,'');
 if(init?.method==='POST')return new Response(JSON.stringify({error:'This is an isolated visual fixture. Server writes are disabled.'}),{status:400,headers:{'content-type':'application/json'}});
 const base=path.split('?')[0];
 let value=snapshots[path]??snapshots[base];
 if(base==='reports')value=snapshots['reports?type='+new URLSearchParams(path.split('?')[1]).get('type')];
 if(value===undefined)return new Response(JSON.stringify({error:'This view has no component fixture.'}),{status:404});
 return new Response(JSON.stringify(value),{headers:{'content-type':'application/json'}});
};
function App(){const path=useRoute().split('?')[0],view=path==='/'?'dashboard':path.slice(1);return <RestaurantApp module={view}/>;}
createRoot(document.getElementById('root')!).render(<App/>);
