import {Actor,ensure,Problem,Settings} from '../domain';
export type Value=string|number|null; export type Row=Record<string,Value>; export type Input=Record<string,unknown>;
export interface Stmt {bind(...values:Value[]):Stmt;first<T=Row>():Promise<T|null>;all<T=Row>():Promise<{results:T[]}>;run():Promise<unknown>}
export interface Database {prepare(sql:string):Stmt;batch(statements:Stmt[]):Promise<unknown[]>}
export const uid=()=>crypto.randomUUID(); export const now=()=>new Date().toISOString();
export const json=(x:unknown)=>JSON.stringify(x); export function parse<T>(x:unknown,fallback:T):T{if(typeof x!=='string')return fallback;try{return JSON.parse(x) as T;}catch{return fallback;}}
export function input(x:unknown):Input{ensure(!!x&&typeof x==='object'&&!Array.isArray(x),'Invalid request.');return x as Input;}
export function list(x:unknown,max=150):Input[]{ensure(Array.isArray(x)&&x.length<=max,'Invalid list.');return x.map(input);}
export const s=(db:Database,sql:string,...values:Value[])=>db.prepare(sql).bind(...values);
export const one=(db:Database,sql:string,...values:Value[])=>s(db,sql,...values).first<Row>();
export const all=async(db:Database,sql:string,...values:Value[])=>(await s(db,sql,...values).all<Row>()).results;
const identifier=(name:string)=>{ensure(/^[a-z_]+$/.test(name),'Invalid database identifier.',500);return name;};
export const insert=(db:Database,table:string,data:Row)=>s(db,`INSERT INTO ${identifier(table)} (${Object.keys(data).map(identifier).join(',')}) VALUES (${Object.keys(data).map(()=>'?').join(',')})`,...Object.values(data));
export function guard(db:Database,condition:string,...values:Value[]){const id=uid();return[s(db,`INSERT INTO mutation_guards (id,ok) SELECT ?,CASE WHEN ${condition} THEN 1 ELSE 0 END`,id,...values),s(db,'DELETE FROM mutation_guards WHERE id=?',id)];}
export function cas(db:Database,table:string,id:string,version:number,fields:Row){const entries=Object.entries(fields);return[s(db,`UPDATE ${identifier(table)} SET ${entries.map(([k])=>identifier(k)+'=?').concat('version=version+1').join(',')} WHERE id=? AND version=?`,...entries.map(([,v])=>v),id,version),...guard(db,'changes()=1')];}
export function audit(db:Database,a:Actor,action:string,entity:string,id:string,old:unknown=null,next:unknown=null,reason='',approver:string|null=null){return insert(db,'audit_logs',{id:uid(),location_id:a.locationId,actor_id:a.id,actor_name:a.name,action,entity,entity_id:id,old_json:json(old),new_json:json(next),reason,approver_id:approver,terminal_id:a.terminalId,session_id:a.sessionId,created_at:now()});}
export async function atomic(db:Database,statements:Stmt[]){try{return await db.batch(statements);}catch(e){if(/UNIQUE|mutation_guard|constraint failed/i.test(String(e)))throw new Problem(409,'This record changed or the action was already recorded. Refresh and review before retrying.','CONFLICT');throw e;}}
export async function hash(text:string){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function canonical(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>json(k)+':'+canonical(v)).join(',')+'}';return json(value);}
export type Context={db:Database;actor:Actor;settings:Settings;key:string};
export async function mutation(c:Context,action:string,payload:Input,build:()=>Promise<{statements:Stmt[];result:unknown}>){
 ensure(/^[\w-]{16,100}$/.test(c.key),'A retry key is required.');const key=c.actor.id+':'+c.key,requestHash=await hash(canonical(payload));
 const previous=async()=>{const p=await one(c.db,'SELECT * FROM idempotency WHERE id=?',key);if(p){ensure(p.action===action&&p.request_hash===requestHash,'This retry key belongs to a different request.',409,'CONFLICT');return{found:true,result:parse(p.response_json,{})};}return{found:false,result:null};};const old=await previous();if(old.found)return old.result;
 const {statements,result}=await build();try{await atomic(c.db,[insert(c.db,'idempotency',{id:key,actor_id:c.actor.id,action,request_hash:requestHash,response_json:json(result),created_at:now()}),...statements]);}catch(e){const retried=await previous();if(retried.found)return retried.result;throw e;}return result;
}
export async function owned(db:Database,a:Actor,table:string,id:string){const row=await one(db,`SELECT * FROM ${identifier(table)} WHERE id=? AND location_id=?`,id,a.locationId);ensure(row,'Record not found.',404);return row;}
export async function nextSequence(db:Database,id:string){await s(db,'INSERT OR IGNORE INTO sequences (id,value) VALUES (?,0)',id).run();const r=await one(db,'SELECT value FROM sequences WHERE id=?',id);const value=Number(r?.value)+1;return{value,statements:[s(db,'UPDATE sequences SET value=? WHERE id=? AND value=?',value,id,value-1),...guard(db,'changes()=1')]};}
