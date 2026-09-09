import type {AnchorHTMLAttributes} from 'react';
import {router} from './navigation';
export default function Link({href,onClick,...props}:AnchorHTMLAttributes<HTMLAnchorElement>){return <a {...props} href={'#'+href} onClick={event=>{onClick?.(event);if(!event.defaultPrevented){event.preventDefault();router.push(href||'/');}}}/>;}
