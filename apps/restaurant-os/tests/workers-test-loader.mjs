// Node cannot resolve the Worker binding module. This rendering-only bridge
// throws on every binding read: a signed-out render must not access private data.
export async function resolve(specifier,context,nextResolve){
 if(specifier==='cloudflare:workers')return{url:'data:text/javascript,'+encodeURIComponent('export const env=new Proxy({}, {get(){throw new Error("Private Worker binding accessed during signed-out rendering");}});'),shortCircuit:true};
 return nextResolve(specifier,context);
}
