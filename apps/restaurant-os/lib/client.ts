'use client';
import {randomId} from '@/lib/uuid';
import {useCallback,useEffect,useRef,useState} from 'react';
import {toast} from 'sonner';
import type {Actor,Settings} from './domain';
export type Data=Record<string,unknown>;export type Rec=Record<string,string|number|null>;export type Bootstrap={actor:Actor;settings:Settings;settingsVersion:number;menu:Rec[];catalog:Record<string,Rec[]>;activeShift:{shift:Rec;payments:Rec[];refunds:Rec[];movements:Rec[];expectedPaise:number}|null;setupIssues:string[]};
export class ApiError extends Error{constructor(message:string,public status:number,public code:string){super(message);}}
export function csrf(){return document.cookie.split('; ').find(x=>x.startsWith('dawat_csrf='))?.slice(11)||'';}
export async function api<T=Data>(path:string,payload?:unknown,key=randomId()):Promise<T>{let response:Response;try{response=await fetch('/api/os/'+path,{method:payload===undefined?'GET':'POST',credentials:'same-origin',headers:payload===undefined?{}:{'content-type':'application/json','x-csrf-token':csrf(),'idempotency-key':key},...(payload===undefined?{}:{body:JSON.stringify(payload)})});}catch{throw new ApiError('Connection lost. Your input is preserved.',0,'NETWORK');}const result=await response.json() as Data;if(!response.ok)throw new ApiError(String(result.error||'The request could not be completed.'),response.status,String(result.code||'ERROR'));return result as T;}
export function useQuery<T>(path:string|null,interval=0){
 const [state,setState]=useState<{path:string|null;data:T|null;error:string|null;loading:boolean}>({path:null,data:null,error:null,loading:true});const pathRef=useRef(path);
 useEffect(()=>{pathRef.current=path;return()=>{if(pathRef.current===path)pathRef.current=null;};},[path]);
 const refresh=useCallback(async()=>{if(!path)return;try{const result=await api<T>(path);if(pathRef.current===path)setState({path,data:result,error:null,loading:false});}catch(e){if(pathRef.current===path)setState(old=>({path,data:old.path===path?old.data:null,error:e instanceof Error?e.message:'Unable to load.',loading:false}));}},[path]);
 useEffect(()=>{void refresh();const timer=interval?setInterval(refresh,interval):null;return()=>{if(timer)clearInterval(timer);};},[refresh,interval]);
 return{data:state.path===path?state.data:null,error:state.path===path?state.error:null,loading:state.path!==path||state.loading,refresh};
}
export const money=(value:unknown)=>value===null||value===undefined?'—':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:Number(value)%100?2:0,maximumFractionDigits:2}).format(Number(value)/100);
export const num=(value:unknown)=>Number(value||0);export const txt=(value:unknown)=>String(value??'');
export function decode<T>(value:unknown,fallback:T):T{try{return typeof value==='string'?JSON.parse(value):fallback;}catch{return fallback;}}
export const dateTime=(value:unknown)=>value?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(new Date(String(value))):'—';
export function download(content:Blob,name:string){const url=URL.createObjectURL(content),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function openDb(){return new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('dawat-terminal',1);request.onupgradeneeded=()=>{request.result.createObjectStore('drafts');request.result.createObjectStore('queue',{keyPath:'key'});};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
async function localStore<T>(store:string,mode:IDBTransactionMode,operation:(s:IDBObjectStore)=>IDBRequest<T>){const db=await openDb();return new Promise<T>((resolve,reject)=>{const transaction=db.transaction(store,mode),request=operation(transaction.objectStore(store));transaction.oncomplete=()=>{db.close();resolve(request.result);};transaction.onerror=()=>{db.close();reject(transaction.error);};});}
export const readDraft=<T>(key:string)=>localStore<T>('drafts','readonly',s=>s.get(key));
export const saveDraft=(key:string,value:unknown)=>localStore('drafts','readwrite',s=>s.put(value,key));
export type Queued={key:string;actorId:string;path:string;payload:unknown;createdAt:string;error?:string};
export const queued=()=>localStore<Queued[]>('queue','readonly',s=>s.getAll());
export const queueWrite=(entry:Queued)=>localStore('queue','readwrite',s=>s.put(entry));
export const removeQueued=(key:string)=>localStore('queue','readwrite',s=>s.delete(key));
export async function safeOrderWrite(actorId:string,path:string,payload:unknown,key:string){if(!/^(orders\/create|orders\/[^/]+\/items)$/.test(path))throw new Error('Only new orders and additional items can be queued.');try{return await api(path,payload,key);}catch(e){if(e instanceof ApiError&&(e.status===0||e.status===503)){await queueWrite({key,actorId,path,payload,createdAt:new Date().toISOString()});window.dispatchEvent(new Event('dawat-queue'));toast('Order saved on this terminal. It will synchronize when connected.');return{queued:true};}throw e;}}
export async function synchronize(actorId:string){const records=(await queued()).filter(x=>x.actorId===actorId),errors:Queued[]=[];for(const entry of records){if(entry.error){errors.push(entry);continue;}try{await api(entry.path,entry.payload,entry.key);await removeQueued(entry.key);}catch(e){if(e instanceof ApiError&&[400,404,409,422].includes(e.status)){const conflict={...entry,error:e.message};await queueWrite(conflict);errors.push(conflict);}else throw e;}}return errors;}
