import {ensure,permit,Problem,str} from '../domain';
import {all,atomic,audit,Context,Database,input,insert,json,now,one,owned,s,uid} from './db';
import {approve,cookie,cookies,login,pair,platformLogin,rateLimit,sameOrigin,session,verify} from './auth';
import {availability,bindModifiers,bulkMenu,ownCredentials,saveResource,saveRole,saveSettings,saveStaff,tableStatus} from './admin';
import {addItems,applyDiscount,billPreview,createOrder,finalizeBill,kitchenAction,orderDetail,orderState,sendKot,setCharges,splitBill,tableAction,updateLine} from './orders';
import {cancelInvoice,cashAction,closeShift,expense,openShift,pay,refund,shiftSummary,supplierPayment} from './finance';
import {adjustStock,createPurchase,receivePurchase,saveRecipe,stockCount} from './stock';
import {redeem} from './loyalty';
import {bootstrap,detail,recordList,search} from './queries';
import {csv,dashboard,report} from './reports';
import {encryptedBackup} from './backup';
export type Services={db:Database;bucket?:R2Bucket};
function response(data:unknown,status=200,extra:Record<string,string>={},setCookies:string[]=[]){const headers=new Headers({'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff',...extra});for(const c of setCookies)headers.append('set-cookie',c);return new Response(json(data),{status,headers});}
export async function handleApi(req:Request,services:Services){const requestId=uid();try{const {db,bucket}=services,url=new URL(req.url),parts=url.pathname.replace(/^\/api\/os\/?/,'').split('/').filter(Boolean),path=parts.join('/');if(req.method==='POST')sameOrigin(req);ensure(['GET','POST'].includes(req.method),'Method not allowed.',405);const text=req.method==='POST'?await req.text():'{}';ensure(text.length<=200000,'This request is too large.',413);let parsed:unknown;try{parsed=JSON.parse(text);}catch{throw new Problem(400,'Invalid request.');}const p=input(parsed);
 if(path==='auth/status'&&req.method==='GET'){try{const result=await session(db,req,true);return response({signedIn:true,...result,platform:!!req.headers.get('oai-authenticated-user-id'),paired:!!cookies(req).dawat_device});}catch(e){if(e instanceof Problem&&[401,403].includes(e.status))return response({signedIn:false,platform:!!req.headers.get('oai-authenticated-user-id'),paired:!!cookies(req).dawat_device});throw e;}}
 if(req.method==='POST'&&(path==='auth/platform'||path==='auth/login')){const result=path==='auth/platform'?await platformLogin(db,req):await login(db,req,p);return response({actor:result.actor,csrf:result.csrf},200,{},result.cookies);}
 const auth=await session(db,req,path==='auth/unlock'||path==='auth/logout');const c:Context={db,actor:auth.actor,settings:auth.settings,key:req.headers.get('idempotency-key')||''};
 if(req.method==='GET'){
 if(path==='bootstrap')return response(await bootstrap(c));
 if(parts[0]==='records')return response(await recordList(c,parts[1],(url.searchParams.get('q')||'').slice(0,100),Number(url.searchParams.get('page')||1),url.searchParams.get('history')==='1'));
 if(parts[0]==='detail')return response(await detail(c,parts[1],parts[2]));
 if(parts[0]==='orders'){ensure(c.actor.permissions.some(x=>['order.create','order.completed.view','kitchen.view'].includes(x)),'Access denied.',403);const order=await orderDetail(c,parts[1]);if(['Closed','Cancelled','Refunded'].includes(String(order.status)))permit(c.actor,'order.completed.view');const invoice=order.invoice;return response({...order,preview:invoice?null:await billPreview(c,await owned(db,c.actor,'orders',parts[1])).catch(e=>{if(e instanceof Problem)return null;throw e;})});}
 if(parts[0]==='shifts'){permit(c.actor,'shift.open');return response(await shiftSummary(c,parts[1]));}
 if(path==='dashboard')return response(await dashboard(c,url.searchParams.get('from'),url.searchParams.get('to')));
 if(path==='reports'){const result=await report(c,url.searchParams.get('type')||'sales',url.searchParams.get('from'),url.searchParams.get('to'));if(url.searchParams.get('export')==='csv')return new Response(csv(result.rows),{headers:{'content-type':'text/csv; charset=utf-8','content-disposition':`attachment; filename="dawat-${result.type}-${result.range.from}.csv"`,'cache-control':'no-store'}});return response(result);}
 if(path==='search')return response(await search(c,url.searchParams.get('q')||''));
 if(parts[0]==='attachments'){permit(c.actor,'expense.manage');const meta=await owned(db,c.actor,'attachments',parts[1]);ensure(bucket,'Receipt storage is unavailable.',503);const object=await bucket.get(String(meta.object_key));ensure(object,'Receipt not found.',404);return new Response(object.body,{headers:{'content-type':String(meta.mime),'content-disposition':'attachment; filename="'+String(meta.name).replace(/[^\w. -]/g,'_')+'"','cache-control':'no-store','x-content-type-options':'nosniff'}});}
 }
 else{
 if(path==='auth/logout'){await atomic(db,[s(db,'DELETE FROM sessions WHERE id=?',c.actor.sessionId),audit(db,c.actor,'Logout','staff',c.actor.id)]);return response({ok:true},200,{},[cookie(req,'dawat_session','',true,0),cookie(req,'dawat_csrf','',false,0)]);}
 if(path==='auth/lock'){await s(db,'UPDATE sessions SET locked=1 WHERE id=?',c.actor.sessionId).run();return response({locked:true});}
 if(path==='auth/unlock'){await rateLimit(db,'unlock:'+c.actor.id,5);const staff=await owned(db,c.actor,'staff',c.actor.id);const secret=str(p.secret,128,true);ensure(await verify(secret,staff.pin_hash)||await verify(secret,staff.password_hash),'PIN or password is incorrect.',403);await s(db,'UPDATE sessions SET locked=0,last_seen_at=? WHERE id=?',now(),c.actor.sessionId).run();return response({locked:false});}
 if(path==='auth/touch')return response({ok:true});
 if(path==='auth/pair'){const result=await pair(c,req,p);return response({terminalId:result.terminalId},200,{},result.cookies);}
 if(path==='auth/approve')return response(await approve(c,p));
 if(path==='auth/credentials'){await rateLimit(db,'credentials:'+c.actor.id,5);return response(await ownCredentials(c,p));}
 if(path==='orders/create')return response(await createOrder(c,p));
 if(parts[0]==='orders'){const id=parts[1],action=parts[2];const handlers:Record<string,()=>Promise<unknown>>={items:()=>addItems(c,id,p),line:()=>updateLine(c,id,p),void:()=>updateLine(c,id,p,true),state:()=>orderState(c,id,p),table:()=>tableAction(c,id,p),kot:()=>sendKot(c,id,p),discount:()=>applyDiscount(c,id,p),bill:()=>finalizeBill(c,id,p),split:()=>splitBill(c,id,p),pay:()=>pay(c,id,p),refund:()=>refund(c,id,p),'cancel-invoice':()=>cancelInvoice(c,id,p),loyalty:()=>redeem(c,id,p),charges:()=>setCharges(c,id,p)};if(handlers[action])return response(await handlers[action]());}
 if(parts[0]==='kitchen')return response(await kitchenAction(c,parts[1],p));
 if(parts[0]==='resources')return response(await saveResource(c,parts[1],p));
 if(parts[0]==='tables')return response(await tableStatus(c,parts[1],p));
 if(path==='menu/availability')return response(await availability(c,p));
 if(path==='menu/bulk')return response(await bulkMenu(c,p));
 if(path==='menu/modifiers')return response(await bindModifiers(c,p));
 if(path==='inventory/adjust')return response(await adjustStock(c,p));
 if(path==='inventory/wastage')return response(await adjustStock(c,p,true));
 if(path==='inventory/recipe')return response(await saveRecipe(c,p));
 if(parts[0]==='stock-counts')return response(await stockCount(c,p,parts[1]==='create'?undefined:parts[1]));
 if(path==='purchases/create')return response(await createPurchase(c,p));
 if(parts[0]==='purchases'&&parts[2]==='receive')return response(await receivePurchase(c,parts[1],p));
 if(parts[0]==='purchases'&&parts[2]==='pay')return response(await supplierPayment(c,parts[1],p));
 if(parts[0]==='expenses')return response(await expense(c,p,parts[1]==='create'?undefined:parts[1]));
 if(path==='shifts/open')return response(await openShift(c,p));
 if(parts[0]==='shifts'&&parts[2]==='close')return response(await closeShift(c,parts[1],p));
 if(path==='cash')return response(await cashAction(c,p));
 if(path==='staff')return response(await saveStaff(c,p));
 if(path==='roles')return response(await saveRole(c,p));
 if(path==='settings')return response(await saveSettings(c,p));
 if(path==='print'){const kind=str(p.kind,10,true),id=str(p.id,100,true);ensure(kind==='bill'||kind==='kot','Unknown document.');permit(c.actor,kind==='bill'?'bill.reprint':'kitchen.view');const row=await owned(db,c.actor,kind==='bill'?'invoices':'kots',id);const document=kind==='bill'?{...row,events:await all(db,'SELECT * FROM invoice_events WHERE invoice_id=?',id),payments:await all(db,'SELECT * FROM payments WHERE invoice_id=?',id),refunds:await all(db,'SELECT * FROM refunds WHERE invoice_id=?',id)}:{...row,items:await all(db,'SELECT * FROM kot_items WHERE kot_id=?',id)};const old=await one(db,"SELECT id FROM audit_logs WHERE entity_id=? AND action='Print requested'",id);await audit(db,c.actor,'Print requested',kind,id,null,{reprint:!!old}).run();return response({kind,document,reprint:!!old});}
 if(parts[0]==='notifications'){permit(c.actor,'audit.view');const n=await owned(db,c.actor,'notifications',parts[1]);await atomic(db,[s(db,'UPDATE notifications SET acknowledged_at=?,acknowledged_by=? WHERE id=?',now(),c.actor.id,String(n.id)),audit(db,c.actor,'Notification acknowledged','notifications',String(n.id))]);return response({ok:true});}
 if(path==='attachments'){permit(c.actor,'expense.manage');ensure(bucket,'Receipt storage is unavailable.',503);const encoded=str(p.base64,175000,true),mime=str(p.mime,50,true);ensure(['image/jpeg','image/png','application/pdf'].includes(mime),'Upload a PNG, JPEG, or PDF receipt.');let bytes:Uint8Array;try{bytes=Uint8Array.from(atob(encoded),ch=>ch.charCodeAt(0));}catch{throw new Problem(400,'Invalid attachment.');}ensure(bytes.length>0&&bytes.length<=125000,'Keep receipts under 125 KB.');const signature=[...bytes.slice(0,8)].map(x=>x.toString(16).padStart(2,'0')).join('');ensure(mime==='image/jpeg'?signature.startsWith('ffd8ff'):mime==='image/png'?signature==='89504e470d0a1a0a':signature.startsWith('255044462d'),'File content does not match the selected format.');const id=uid(),key=c.actor.locationId+'/receipts/'+id,name=str(p.name,120,true);await bucket.put(key,bytes,{httpMetadata:{contentType:mime}});try{await atomic(db,[insert(db,'attachments',{id,location_id:c.actor.locationId,name,mime,size:bytes.length,object_key:key,uploaded_by:c.actor.id,created_at:now()}),audit(db,c.actor,'Receipt uploaded','attachments',id,null,{name,mime,size:bytes.length})]);}catch(e){await bucket.delete(key);throw e;}return response({id});}
 if(path==='backup'){const bytes=await encryptedBackup(c,p.passphrase,bucket);return new Response(bytes as BodyInit,{headers:{'content-type':'application/octet-stream','content-disposition':'attachment; filename="dawat-backup-'+now().slice(0,10)+'.dawat"','cache-control':'no-store'}});}
 }
 throw new Problem(404,'This action is unavailable.');
 }catch(error){if(error instanceof Problem)return response({error:error.message,code:error.code,requestId},error.status);console.error('Dawat request failed',requestId,error instanceof Error?error.stack:String(error));return response({error:'The restaurant service is temporarily unavailable. Your input is preserved; retry when connected.',code:'UNAVAILABLE',requestId},503);}}
