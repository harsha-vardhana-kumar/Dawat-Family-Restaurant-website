import {build} from 'esbuild';
import {mkdirSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
await build({entryPoints:['tests/engine-entry.ts'],bundle:true,platform:'node',format:'esm',outfile:'.test-build/engine.mjs'});
const {fixture,order,action}=await import('../tests/fixtures.mjs');

const f=await fixture(),created=[];
for(const name of ['QA-T01','QA-T02','QA-T03','QA-T04','QA-T05','QA-T06'])created.push(await f.owner.post('resources/tables',{values:{name,capacity:4}}));
let a=await order(f,'Dine-in',{tableId:created[0].id,guestCount:2,items:[{menuItemId:f.item.id,quantity:2,note:'QA less spicy'},{menuItemId:f.second.id,quantity:1}]});a=await action(f,a,'kot');
let b=await order(f,'Takeaway',{items:[{menuItemId:f.second.id,quantity:2,note:'QA parcel'}]});b=await action(f,b,'kot');
const tickets=(await f.owner.get('records/kitchen')).rows;await f.owner.post('kitchen/'+tickets[1].id,{version:tickets[1].version,status:'Preparing'});
let paid=await action(f,await order(f),'bill');paid=await action(f,paid,'pay',{method:'Cash',amountPaise:paid.invoice.total_paise,tenderedPaise:paid.invoice.total_paise});
const ingredient=await f.owner.post('resources/inventory',{values:{name:'QA Basmati rice',type:'Raw ingredient',unit_id:'kg',minimum_milli:3000}});await f.owner.post('inventory/adjust',{id:ingredient.id,version:1,type:'Opening',quantityMilli:2500,averageCostPaise:8000,reason:'QA count'});
await f.owner.post('resources/customers',{values:{name:'QA Guest',phone:'0000000000'}});await f.owner.post('resources/suppliers',{values:{name:'QA Test Supplier'}});
const boot=await f.owner.get('bootstrap');boot.actor.name='QA Owner';boot.actor.sessionId='';boot.settings.liveBillingEnabled=false;boot.setupIssues=['These are isolated component-test records. They are not restaurant transactions.'];
const snapshots={bootstrap:boot,'auth/status':{signedIn:true,platform:false,paired:true,actor:boot.actor},dashboard:await f.owner.get('dashboard')};
for(const kind of ['orders','kitchen','menu','inventory','customers','suppliers','purchases','expenses','shifts','staff','audit','notifications','recipes','stock-counts','ledger','wastage'])snapshots['records/'+kind]=await f.owner.get('records/'+kind);
for(const value of [a,b,paid])snapshots['orders/'+value.id]=await f.owner.get('orders/'+value.id);
for(const type of ['sales','items','payments','stock','profitability'])snapshots['reports?type='+type]=await f.owner.get('reports?type='+type);
snapshots['shifts/'+boot.activeShift.shift.id]=boot.activeShift;
writeFileSync('tests/visual/snapshots.json',JSON.stringify(snapshots));
mkdirSync('public/_visual-qa',{recursive:true});
await build({entryPoints:['tests/visual/entry.tsx'],bundle:true,platform:'browser',format:'esm',jsx:'automatic',outfile:'public/_visual-qa/app.js',alias:{'@':resolve('.'),'next/navigation':resolve('tests/visual/navigation.ts'),'next/link':resolve('tests/visual/link.tsx')},define:{'process.env.NODE_ENV':'"production"'},logLevel:'warning'});
function cssFiles(path){return readdirSync(path,{withFileTypes:true}).flatMap(e=>e.isDirectory()?cssFiles(join(path,e.name)):e.name.endsWith('.css')?[join(path,e.name)]:[]);}
writeFileSync('public/_visual-qa/style.css',cssFiles('dist/client').map(p=>readFileSync(p,'utf8')).join('\n'));
writeFileSync('public/_visual-qa/frame.html','<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="style.css"><title>Dawat component fixture</title></head><body><div id="root"></div><script type="module" src="app.js"></script></body></html>');
writeFileSync('public/_visual-qa/index.html','<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Dawat visual QA</title><style>body{margin:0;background:#e8e6e0;font:14px system-ui}header{padding:12px;display:flex;gap:14px;align-items:center}button{padding:8px 14px}iframe{display:block;margin:0 auto;border:1px solid #aaa;background:white}</style></head><body><header><strong>Isolated component fixture • No live API or writes</strong><button onclick="size(1280,800)">Desktop</button><button onclick="size(1024,768)">Tablet</button><button onclick="size(390,844)">Mobile</button></header><iframe title="Dawat component fixture" id="frame" width="1280" height="800" src="frame.html#/pos"></iframe><script>function size(w,h){const f=document.getElementById(\'frame\');f.width=w;f.height=h}</script></body></html>');
console.log('Isolated component fixtures prepared. No production records were created.');
f.db.sqlite.close();
