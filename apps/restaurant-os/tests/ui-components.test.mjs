import assert from 'node:assert/strict';
import test from 'node:test';
import {receiptHtml} from '../.test-build/printing.mjs';
import {calculate,defaults,randomId} from '../.test-build/engine.mjs';

function receipt(width='80') {
 const calculation=calculate([{id:'qa-line',menuItemId:'qa-menu',name:'QA <dish>',category:'QA',quantity:1,unitPaise:10500,modifierPaise:0,modifiers:[],note:'',seat:'',discountPaise:0,tax:{id:'qa-tax',name:'QA tax',inclusive:true,components:[{name:'QA tax',rateBps:500}]}}]);
 return {kind:'bill',reprint:true,document:{number:'QA-0001',snapshot_json:JSON.stringify({calculation,settings:{...defaults,legalName:'QA & Co',receiptWidth:width},tables:['QA-T1'],cashier:'QA Owner',finalizedAt:'2026-09-09T00:00:00.000Z'}),payments:[{method:'Cash',amount_paise:10500,change_paise:500}],refunds:[],events:[]}};
}
test('receipts escape user content and show a reconcilable inclusive-tax breakdown',()=>{
 const html=receiptHtml(receipt());assert.match(html,/QA &lt;dish&gt;/);assert.match(html,/QA &amp; Co/);assert.doesNotMatch(html,/<dish>/);assert.match(html,/Amount before tax \(after discounts\) <b>₹100<\/b>/);assert.match(html,/QA tax 5% <b>₹5<\/b>/);assert.match(html,/TOTAL <b>₹105<\/b>/);assert.match(html,/REPRINT/);assert.match(html,/Change <b>₹5<\/b>/);
});
test('receipt paper settings support 58 mm, 80 mm and A4 with a real print dialog',()=>{
 for(const width of ['58','80','A4']){const html=receiptHtml(receipt(width));assert.ok(html.includes('@page{size:'+(width==='A4'?'A4':width+'mm auto')));assert.match(html,/window.print\(\)/);}
});
test('kitchen tickets preserve only their sent snapshot and escape cooking notes',()=>{
 const html=receiptHtml({kind:'kot',document:{number:'QA-KOT',created_at:'2026-09-09',items:[{quantity:2,snapshot_json:JSON.stringify({name:'QA Soup',note:'<script>QA</script>',seat:'2',modifiers:[]})}]}});assert.match(html,/2 × QA Soup/);assert.match(html,/NOTE: &lt;script&gt;QA&lt;\/script&gt;/);assert.doesNotMatch(html,/<script>QA/);
});
test('browser identifier fallback uses cryptographic UUID v4 identifiers',()=>{
 const descriptor=Object.getOwnPropertyDescriptor(globalThis.crypto,'randomUUID');Object.defineProperty(globalThis.crypto,'randomUUID',{value:undefined,configurable:true});try{const a=randomId(),b=randomId();assert.match(a,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);assert.notEqual(a,b);}finally{if(descriptor)Object.defineProperty(globalThis.crypto,'randomUUID',descriptor);else delete globalThis.crypto.randomUUID;}
});
