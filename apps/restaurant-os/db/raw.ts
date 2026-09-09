import {env} from 'cloudflare:workers';
import type {Database} from '@/lib/server/db';
export function services(){if(!env.DB)throw new Error('Database binding unavailable');return{db:env.DB as unknown as Database,bucket:env.BUCKET};}
