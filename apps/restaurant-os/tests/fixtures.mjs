import assert from 'node:assert/strict';
import {SQLiteD1} from './sqlite-adapter.mjs';
import {handleApi} from '../.test-build/engine.mjs';
// Isolated QA data only. Never import this module in production code.
export class Client {
 constructor(db,platform='qa-owner'){this.db=db;this.platform=platform;this.cookies={};}
 async request(path,payload,expected=200,key=crypto.randomUUID(),extra={}){const headers={'oai-authenticated-user-id':this.platform,'oai-authenticated-user-email':this.platform+'@invalid.test',origin:'https://qa.invalid','content-type':'application/json',cookie:Object.entries(this.cookies).map(([k,v])=>k+'='+v).join('; '),'idempotency-key':key,'x-csrf-token':this.cookies.dawat_csrf||'',...extra};const req=new Request('https://qa.invalid/api/os/'+path,{method:payload===undefined?'GET':'POST',headers,...(payload===undefined?{}:{body:JSON.stringify(payload)})});const response=await handleApi(req,{db:this.db});for(const cookie of response.headers.getSetCookie()){const [k,v]=cookie.split(';')[0].split('=');this.cookies[k]=v;}const value=await response.json();assert.equal(response.status,expected,JSON.stringify(value));return value;}
 get(path){return this.request(path);}
 post(path,payload={},expected=200,key){return this.request(path,payload,expected,key);}
}
export async function fixture(){const db=new SQLiteD1();db.migrate();const owner=new Client(db);await owner.post('auth/platform');let b=await owner.get('bootstrap');await owner.post('settings',{version:b.settingsVersion,values:{legalName:'QA fixture — not Dawat legal name',invoicePrefix:'QA-{FY}-',noTaxConfirmed:true,liveBillingEnabled:true,manualDiscountsEnabled:true,discountLimitBps:1000}});const terminal=await owner.post('resources/terminals',{values:{name:'QA Terminal',type:'POS'}});await owner.post('auth/pair',{terminalId:terminal.id});await owner.post('shifts/open',{openingPaise:100000});b=await owner.get('bootstrap');return{db,owner,bootstrap:b,item:b.menu.find(m=>m.price_paise!==null),second:b.menu.filter(m=>m.price_paise!==null)[1]};}
export async function order(f,type='Takeaway',extra={}){const created=await f.owner.post('orders/create',{id:crypto.randomUUID(),type,items:[{menuItemId:f.item.id,quantity:1}],...extra});return f.owner.get('orders/'+created.id);}
export async function action(f,o,kind,p={}){await f.owner.post('orders/'+o.id+'/'+kind,{version:o.version,...p});return f.owner.get('orders/'+o.id);}
