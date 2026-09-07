export type Diet = 'veg' | 'non-veg' | 'unspecified';
export interface MenuItem { id: string; name: string; price: number; category: string; group: string; diet: Diet }
export const menu: MenuItem[] = [
  {
    "id": "veg-hot-and-sour-soup",
    "name": "Veg Hot And Sour Soup",
    "price": 140.0,
    "category": "soups",
    "group": "VEG SOUPS",
    "diet": "veg"
  },
  {
    "id": "veg-manchow-soup",
    "name": "Veg Manchow Soup",
    "price": 140.5,
    "category": "soups",
    "group": "VEG SOUPS",
    "diet": "veg"
  },
  {
    "id": "veg-sweet-corn-soup",
    "name": "Veg Sweet Corn Soup",
    "price": 140.0,
    "category": "soups",
    "group": "VEG SOUPS",
    "diet": "veg"
  },
  {
    "id": "veg-lemon-coriander-soup",
    "name": "Veg Lemon Coriander Soup",
    "price": 150.0,
    "category": "soups",
    "group": "VEG SOUPS",
    "diet": "veg"
  },
  {
    "id": "veg-burnt-garlic-soup",
    "name": "Veg Burnt Garlic Soup",
    "price": 150.0,
    "category": "soups",
    "group": "VEG SOUPS",
    "diet": "veg"
  },
  {
    "id": "chicken-burnt-garlic-soup",
    "name": "Chicken Burnt Garlic Soup",
    "price": 170.0,
    "category": "soups",
    "group": "NON VEG SOUPS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-hot-and-sour-soup",
    "name": "Chicken Hot And Sour Soup",
    "price": 160.0,
    "category": "soups",
    "group": "NON VEG SOUPS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-manchow-soup",
    "name": "Chicken Manchow Soup",
    "price": 160.0,
    "category": "soups",
    "group": "NON VEG SOUPS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-sweet-corn-soup",
    "name": "Chicken Sweet Corn Soup",
    "price": 160.0,
    "category": "soups",
    "group": "NON VEG SOUPS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-lemon-coriander-soup",
    "name": "Chicken Lemon Coriander Soup",
    "price": 170.0,
    "category": "soups",
    "group": "NON VEG SOUPS",
    "diet": "non-veg"
  },
  {
    "id": "mutton-hot-and-sour-soup",
    "name": "Mutton Hot And Sour Soup",
    "price": 180.0,
    "category": "soups",
    "group": "NON VEG SOUPS",
    "diet": "non-veg"
  },
  {
    "id": "baby-corn-salt-and-pepper",
    "name": "Baby Corn Salt And Pepper",
    "price": 318.0,
    "category": "veg-starters",
    "group": "VEG STARTERS",
    "diet": "veg"
  },
  {
    "id": "paneer-majestic",
    "name": "Paneer Majestic",
    "price": 340.0,
    "category": "veg-starters",
    "group": "VEG STARTERS",
    "diet": "veg"
  },
  {
    "id": "chilli-paneer",
    "name": "Chilli Paneer",
    "price": 350.0,
    "category": "veg-starters",
    "group": "VEG STARTERS",
    "diet": "veg"
  },
  {
    "id": "chilli-mushroom",
    "name": "Chilli Mushroom",
    "price": 369.0,
    "category": "veg-starters",
    "group": "VEG STARTERS",
    "diet": "veg"
  },
  {
    "id": "veg-crispy",
    "name": "Veg Crispy",
    "price": 289.0,
    "category": "veg-starters",
    "group": "VEG STARTERS",
    "diet": "veg"
  },
  {
    "id": "chilli-baby-corn",
    "name": "Chilli Baby Corn",
    "price": 319.0,
    "category": "veg-starters",
    "group": "VEG STARTERS",
    "diet": "veg"
  },
  {
    "id": "baby-corn-manchurian",
    "name": "Baby Corn Manchurian",
    "price": 319.0,
    "category": "veg-starters",
    "group": "VEG STARTERS",
    "diet": "veg"
  },
  {
    "id": "paneer-tikka",
    "name": "Paneer Tikka",
    "price": 369.0,
    "category": "veg-starters",
    "group": "VEG STARTERS",
    "diet": "veg"
  },
  {
    "id": "paneer-malai-tikka",
    "name": "Paneer Malai Tikka",
    "price": 369.0,
    "category": "veg-starters",
    "group": "VEG STARTERS",
    "diet": "veg"
  },
  {
    "id": "mushroom-manchurian",
    "name": "Mushroom Manchurian",
    "price": 369.0,
    "category": "veg-starters",
    "group": "VEG STARTERS",
    "diet": "veg"
  },
  {
    "id": "chicken-65",
    "name": "Chicken 65",
    "price": 359.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "chilli-chicken",
    "name": "Chilli Chicken",
    "price": 359.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-manchurian",
    "name": "Chicken Manchurian",
    "price": 369.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "dragon-chicken",
    "name": "Dragon Chicken",
    "price": 369.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-butter-flux",
    "name": "Chicken Butter Flux",
    "price": 399.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "spicy-chicken-95",
    "name": "Spicy Chicken 95",
    "price": 399.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-tangdi-kabab",
    "name": "Chicken Tangdi Kabab",
    "price": 420.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-tikka-masala",
    "name": "Chicken Tikka Masala",
    "price": 420.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "boneless-chicken-curry",
    "name": "Boneless Chicken Curry",
    "price": 350.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-majestic",
    "name": "Chicken Majestic",
    "price": 369.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-lollipop-dry",
    "name": "Chicken Lollipop Dry",
    "price": 359.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "tandoori-chicken",
    "name": "Tandoori Chicken",
    "price": 310.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "chicken-tikka",
    "name": "Chicken Tikka",
    "price": 420.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "apollo-fish",
    "name": "Apollo Fish",
    "price": 463.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "chilli-fish",
    "name": "Chilli Fish",
    "price": 469.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "loose-prawns",
    "name": "Loose Prawns",
    "price": 469.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "grilled-chicken",
    "name": "Grilled Chicken",
    "price": 750.0,
    "category": "non-veg-starters",
    "group": "NON VEG STARTERS",
    "diet": "non-veg"
  },
  {
    "id": "mix-veg-curry",
    "name": "Mix Veg Curry",
    "price": 269.0,
    "category": "veg-main-course",
    "group": "VEG MAIN COURSE",
    "diet": "veg"
  },
  {
    "id": "palak-paneer",
    "name": "Palak Paneer",
    "price": 320.0,
    "category": "veg-main-course",
    "group": "VEG MAIN COURSE",
    "diet": "veg"
  },
  {
    "id": "methi-chaman",
    "name": "Methi Chaman",
    "price": 359.0,
    "category": "veg-main-course",
    "group": "VEG MAIN COURSE",
    "diet": "veg"
  },
  {
    "id": "mushroom-masala",
    "name": "Mushroom Masala",
    "price": 389.0,
    "category": "veg-main-course",
    "group": "VEG MAIN COURSE",
    "diet": "veg"
  },
  {
    "id": "baby-corn-curry",
    "name": "Baby Corn Curry",
    "price": 389.0,
    "category": "veg-main-course",
    "group": "VEG MAIN COURSE",
    "diet": "veg"
  },
  {
    "id": "plain-palak",
    "name": "Plain Palak",
    "price": 269.0,
    "category": "veg-main-course",
    "group": "VEG MAIN COURSE",
    "diet": "veg"
  },
  {
    "id": "kaju-paneer",
    "name": "Kaju Paneer",
    "price": 379.0,
    "category": "veg-main-course",
    "group": "VEG MAIN COURSE",
    "diet": "veg"
  },
  {
    "id": "kaju-tomato",
    "name": "Kaju Tomato",
    "price": 379.0,
    "category": "veg-main-course",
    "group": "VEG MAIN COURSE",
    "diet": "veg"
  },
  {
    "id": "chicken-lollipop-gravy",
    "name": "Chicken Lollipop Gravy",
    "price": 369.0,
    "category": "non-veg-main-course",
    "group": "NON VEG MAIN COURSE",
    "diet": "non-veg"
  },
  {
    "id": "butter-chicken",
    "name": "Butter Chicken",
    "price": 399.0,
    "category": "non-veg-main-course",
    "group": "NON VEG MAIN COURSE",
    "diet": "non-veg"
  },
  {
    "id": "chicken-changezi",
    "name": "Chicken Changezi",
    "price": 399.0,
    "category": "non-veg-main-course",
    "group": "NON VEG MAIN COURSE",
    "diet": "non-veg"
  },
  {
    "id": "achari-chicken",
    "name": "Achari Chicken",
    "price": 399.0,
    "category": "non-veg-main-course",
    "group": "NON VEG MAIN COURSE",
    "diet": "non-veg"
  },
  {
    "id": "kaju-chicken-curry",
    "name": "Kaju Chicken Curry",
    "price": 420.0,
    "category": "non-veg-main-course",
    "group": "NON VEG MAIN COURSE",
    "diet": "non-veg"
  },
  {
    "id": "methi-chicken",
    "name": "Methi Chicken",
    "price": 399.0,
    "category": "non-veg-main-course",
    "group": "NON VEG MAIN COURSE",
    "diet": "non-veg"
  },
  {
    "id": "kadhai-chicken",
    "name": "Kadhai Chicken",
    "price": 410.0,
    "category": "non-veg-main-course",
    "group": "NON VEG MAIN COURSE",
    "diet": "non-veg"
  },
  {
    "id": "andhra-chicken",
    "name": "Andhra Chicken",
    "price": 399.0,
    "category": "non-veg-main-course",
    "group": "NON VEG MAIN COURSE",
    "diet": "non-veg"
  },
  {
    "id": "punjabi-chicken",
    "name": "Punjabi Chicken",
    "price": 420.0,
    "category": "non-veg-main-course",
    "group": "NON VEG MAIN COURSE",
    "diet": "non-veg"
  },
  {
    "id": "prawns-curry",
    "name": "Prawns Curry",
    "price": 410.0,
    "category": "non-veg-main-course",
    "group": "NON VEG MAIN COURSE",
    "diet": "non-veg"
  },
  {
    "id": "tandoori-roti",
    "name": "Tandoori Roti",
    "price": 80.0,
    "category": "breads",
    "group": "BREADS",
    "diet": "unspecified"
  },
  {
    "id": "butter-roti",
    "name": "Butter Roti",
    "price": 70.0,
    "category": "breads",
    "group": "BREADS",
    "diet": "unspecified"
  },
  {
    "id": "plain-naan",
    "name": "Plain Naan",
    "price": 54.0,
    "category": "breads",
    "group": "BREADS",
    "diet": "unspecified"
  },
  {
    "id": "butter-naan",
    "name": "Butter Naan",
    "price": 65.0,
    "category": "breads",
    "group": "BREADS",
    "diet": "unspecified"
  },
  {
    "id": "garlic-naan",
    "name": "Garlic Naan",
    "price": 75.0,
    "category": "breads",
    "group": "BREADS",
    "diet": "unspecified"
  },
  {
    "id": "plain-kulcha",
    "name": "Plain Kulcha",
    "price": 70.0,
    "category": "breads",
    "group": "BREADS",
    "diet": "unspecified"
  },
  {
    "id": "butter-kulcha",
    "name": "Butter Kulcha",
    "price": 85.0,
    "category": "breads",
    "group": "BREADS",
    "diet": "unspecified"
  },
  {
    "id": "egg-biryani",
    "name": "Egg Biryani",
    "price": 320.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "chicken-fry-piece-biryani",
    "name": "Chicken Fry Piece Biryani",
    "price": 329.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "chicken-mughlai-biryani",
    "name": "Chicken Mughlai Biryani",
    "price": 369.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "chicken-lollipop-biryani",
    "name": "Chicken Lollipop Biryani",
    "price": 369.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "chicken-special-biryani",
    "name": "Chicken Special Biryani",
    "price": 369.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "shadi-ka-chicken-dum-biryani",
    "name": "Shadi Ka Chicken Dum Biryani",
    "price": 329.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "sapon-ka-hyderabadi-chicken-dum-biryani",
    "name": "Sapon Ka Hyderabadi Chicken Dum Biryani",
    "price": 399.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "chicken-dum-mughlai-biryani",
    "name": "Chicken Dum Mughlai Biryani",
    "price": 369.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "chicken-tangdi-kabab-biryani",
    "name": "Chicken Tangdi Kabab Biryani",
    "price": 399.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "mixed-biryani",
    "name": "Mixed Biryani",
    "price": 499.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "prawns-special-biryani",
    "name": "Prawns Special Biryani",
    "price": 430.0,
    "category": "biryani",
    "group": "NON VEG BIRYANI",
    "diet": "non-veg"
  },
  {
    "id": "veg-special-biryani",
    "name": "Veg Special Biryani",
    "price": 349.0,
    "category": "biryani",
    "group": "VEG BIRYANI",
    "diet": "veg"
  },
  {
    "id": "kaju-paneer-biryani",
    "name": "Kaju Paneer Biryani",
    "price": 359.0,
    "category": "biryani",
    "group": "VEG BIRYANI",
    "diet": "veg"
  },
  {
    "id": "mushroom-biryani",
    "name": "Mushroom Biryani",
    "price": 359.0,
    "category": "biryani",
    "group": "VEG BIRYANI",
    "diet": "veg"
  },
  {
    "id": "baby-corn-biryani",
    "name": "Baby Corn Biryani",
    "price": 359.0,
    "category": "biryani",
    "group": "VEG BIRYANI",
    "diet": "veg"
  },
  {
    "id": "veg-schezwan-fried-rice",
    "name": "Veg Schezwan Fried Rice",
    "price": 289.0,
    "category": "fried-rice",
    "group": "VEG FRIED RICE",
    "diet": "veg"
  },
  {
    "id": "kaju-paneer-fried-rice",
    "name": "Kaju Paneer Fried Rice",
    "price": 399.0,
    "category": "fried-rice",
    "group": "VEG FRIED RICE",
    "diet": "veg"
  },
  {
    "id": "veg-special-fried-rice",
    "name": "Veg Special Fried Rice",
    "price": 399.0,
    "category": "fried-rice",
    "group": "VEG FRIED RICE",
    "diet": "veg"
  },
  {
    "id": "veg-fried-rice",
    "name": "Veg Fried Rice",
    "price": 269.0,
    "category": "fried-rice",
    "group": "VEG FRIED RICE",
    "diet": "veg"
  },
  {
    "id": "egg-fried-rice",
    "name": "Egg Fried Rice",
    "price": 269.0,
    "category": "fried-rice",
    "group": "NON VEG FRIED RICE",
    "diet": "non-veg"
  },
  {
    "id": "chicken-tangdi-kabab-fried-rice",
    "name": "Chicken Tangdi Kabab Fried Rice",
    "price": 399.0,
    "category": "fried-rice",
    "group": "NON VEG FRIED RICE",
    "diet": "non-veg"
  },
  {
    "id": "chicken-fried-rice",
    "name": "Chicken Fried Rice",
    "price": 289.0,
    "category": "fried-rice",
    "group": "NON VEG FRIED RICE",
    "diet": "non-veg"
  },
  {
    "id": "chicken-special-fried-rice",
    "name": "Chicken Special Fried Rice",
    "price": 299.0,
    "category": "fried-rice",
    "group": "NON VEG FRIED RICE",
    "diet": "non-veg"
  },
  {
    "id": "chicken-lollipop-fried-rice",
    "name": "Chicken Lollipop Fried Rice",
    "price": 299.0,
    "category": "fried-rice",
    "group": "NON VEG FRIED RICE",
    "diet": "non-veg"
  },
  {
    "id": "prawns-special-fried-rice",
    "name": "Prawns Special Fried Rice",
    "price": 369.0,
    "category": "fried-rice",
    "group": "NON VEG FRIED RICE",
    "diet": "non-veg"
  },
  {
    "id": "mixed-fried-rice",
    "name": "Mixed Fried Rice",
    "price": 399.0,
    "category": "fried-rice",
    "group": "NON VEG FRIED RICE",
    "diet": "non-veg"
  },
  {
    "id": "salted-french-fries",
    "name": "Salted French Fries",
    "price": 160.0,
    "category": "snacks",
    "group": "SNACKS",
    "diet": "unspecified"
  },
  {
    "id": "crispy-corn",
    "name": "Crispy Corn",
    "price": 319.0,
    "category": "snacks",
    "group": "SNACKS",
    "diet": "unspecified"
  }
];
export const menuCategories = [
  {id:'all', label:'All'}, {id:'soups', label:'Soups'},
  {id:'veg-starters', label:'Veg Starters'}, {id:'non-veg-starters', label:'Non-Veg Starters'},
  {id:'veg-main-course', label:'Veg Main Course'}, {id:'non-veg-main-course', label:'Non-Veg Main Course'},
  {id:'breads', label:'Breads'}, {id:'biryani', label:'Biryani'},
  {id:'fried-rice', label:'Fried Rice'}, {id:'snacks', label:'Snacks'},
];
export const formatPrice = (price: number) => '₹' + price.toLocaleString('en-IN', {minimumFractionDigits: Number.isInteger(price) ? 0 : 2, maximumFractionDigits: 2});
export const signatures = [
 {id:'mutton-biryani', name:'Shadi Ka Mutton Dum Biryani', short:'A celebration, in every grain.', image:'biryani', label:'THE HEART OF DAWAT', description:'Mutton dum biryani takes centre stage. Make room at the table for the Dawat signature that brings a sense of occasion to your meal.', diet:'non-veg', menuId:undefined},
 {id:'butter-flux', name:'Chicken Butter Flux', short:'Rich. Bold. Unmistakably Dawat.', image:'butter-flux', label:'A DAWAT SIGNATURE', description:'Meet Chicken Butter Flux: one of our four signature dishes, and a flavourful way to begin your Dawat.', diet:'non-veg', menuId:'chicken-butter-flux'},
 {id:'cheese-balls', name:'Chicken Cheese Balls', short:'A little bite. A lot to love.', image:'cheese-balls', label:'PASS THEM AROUND', description:'Chicken and cheese, made for the middle of the table. A signature starter to share while you settle into your meal.', diet:'non-veg', menuId:undefined},
 {id:'irani-chai', name:'Authentic Irani Chai', short:'Stay a little longer.', image:'chai', label:'THE PERFECT PAUSE', description:'Some conversations deserve another cup. Make time for authentic Irani chai, a signature part of the Dawat experience.', diet:'unspecified', menuId:undefined},
] as const;
export const previewTabs = [
 {label:'Biryani',ids:['shadi-ka-chicken-dum-biryani','chicken-fry-piece-biryani','kaju-paneer-biryani','prawns-special-biryani']},
 {label:'Starters',ids:['chicken-butter-flux','paneer-majestic','chicken-65','chilli-mushroom']},
 {label:'Main Course',ids:['butter-chicken','palak-paneer','andhra-chicken','kaju-paneer']},
 {label:'Chinese',ids:['chicken-fried-rice','veg-schezwan-fried-rice','chilli-chicken','baby-corn-manchurian']},
 {label:'Breads',ids:['garlic-naan','butter-naan','plain-kulcha','tandoori-roti']},
 {label:'Soups',ids:['veg-hot-and-sour-soup','chicken-lemon-coriander-soup','veg-manchow-soup','mutton-hot-and-sour-soup']},
];
