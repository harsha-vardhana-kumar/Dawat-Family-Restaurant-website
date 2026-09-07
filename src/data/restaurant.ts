export const restaurant = {
  name: 'Dawat Family Restaurant',
  phone: '+91 97019 19654',
  telephone: '+919701919654',
  street: 'Ward-19, Rajiv Chowk Center, 28-2-11, Velpur Road',
  city: 'Tanuku',
  region: 'Andhra Pradesh',
  country: 'IN',
  landmark: 'Opposite Reliance Digital',
  hours: '6:30 AM – 10:30 PM',
  opens: '06:30',
  closes: '22:30',
  zomato: 'https://www.zomato.com/tanuku/dawat-family-restaurant-tanuku-locality/order',
  mapQuery: 'Dawat Family Restaurant, Rajiv Chowk Center, Velpur Road, Tanuku, Andhra Pradesh',
  story: 'From the team behind Star Bawarchi in Tanuku, Dawat is a place for family dining, Indian flavours and time around the table.',
};
export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.mapQuery)}`;
export const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.mapQuery)}&output=embed`;
export const navigation = [
  {label: 'Home', href: '/'}, {label: 'Menu', href: '/menu/'},
  {label: 'Signature Dishes', href: '/signature-dishes/'}, {label: 'Our Story', href: '/our-story/'},
  {label: 'Gallery', href: '/gallery/'}, {label: 'Visit Us', href: '/contact/'},
];
