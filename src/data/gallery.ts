import biryani from '../assets/biryani.webp';
import butterFlux from '../assets/butter-flux.webp';
import cheeseBalls from '../assets/cheese-balls.webp';
import chai from '../assets/chai.webp';
import ambience from '../assets/ambience.webp';
import table from '../assets/table.webp';
export const photographs = {
  'biryani': {src: biryani, alt: 'Illustrative mutton dum biryani with saffron rice, mint and fried onions in a copper pot'},
  'butter-flux': {src: butterFlux, alt: 'Illustrative buttery chicken starter on a burgundy ceramic plate'},
  'cheese-balls': {src: cheeseBalls, alt: 'Illustrative golden chicken cheese balls with a soft cheese centre'},
  'chai': {src: chai, alt: 'Illustrative Irani chai served in a glass with biscuits'},
  'ambience': {src: ambience, alt: 'Illustrative family dining interior with warm lighting and burgundy seating'},
  'table': {src: table, alt: 'Illustrative Indian table with paneer curry, tandoori skewers and naan'},
};
export type PhotoKey = keyof typeof photographs;
export const gallery = [
 {id:'biryani', title:'A little celebration', category:'Biryani', label:'DUM BIRYANI'},
 {id:'butter-flux', title:'Begin with something bold', category:'Starters', label:'CHICKEN BUTTER FLUX'},
 {id:'chai', title:'One more conversation', category:'Drinks', label:'IRANI CHAI'},
 {id:'ambience', title:'Room for everyone', category:'Restaurant', label:'A DINING MOOD'},
 {id:'cheese-balls', title:'Good things are shared', category:'Starters', label:'CHICKEN CHEESE BALLS'},
 {id:'table', title:'A table full of flavours', category:'Main Course', label:'CURRIES · TANDOORI · BREADS'},
] as const;
export const photoNotice = 'Imagery is illustrative. Actual dishes and restaurant interiors may vary.';
