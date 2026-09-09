import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
export class SQLiteD1 {
 constructor(path=':memory:'){this.sqlite=new DatabaseSync(path);this.sqlite.exec('PRAGMA foreign_keys=ON');}
 migrate(){for(const name of readdirSync('drizzle').filter(n=>n.endsWith('.sql')).sort())this.sqlite.exec(readFileSync('drizzle/'+name,'utf8'));}
 prepare(sql){const db=this.sqlite;let values=[];return{bind(...args){values=args;return this;},async first(){return db.prepare(sql).get(...values)||null;},async all(){return{results:db.prepare(sql).all(...values)};},async run(){const r=db.prepare(sql).run(...values);return{success:true,meta:{changes:Number(r.changes)}};},_sql:sql,_values:()=>values};}
 async batch(statements){this.sqlite.exec('BEGIN IMMEDIATE');try{const results=statements.map(x=>{const p=this.sqlite.prepare(x._sql);if(/^\s*(SELECT|PRAGMA)/i.test(x._sql))return{results:p.all(...x._values()),success:true};const result=p.run(...x._values());return{results:[],success:true,meta:{changes:Number(result.changes)}};});this.sqlite.exec('COMMIT');return results;}catch(error){this.sqlite.exec('ROLLBACK');throw error;}}
}
