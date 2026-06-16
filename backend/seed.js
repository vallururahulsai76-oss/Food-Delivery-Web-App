require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

const restaurantImagesPath = path.resolve(__dirname, '../frontend/public/restaurants');
const restaurantImageFiles = fs.existsSync(restaurantImagesPath) ? fs.readdirSync(restaurantImagesPath) : [];
const normalizedRestaurantImageMap = restaurantImageFiles.reduce((map, filename) => {
  const normalized = filename.replace(path.extname(filename), '').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
  map[normalized] = filename;
  return map;
}, {});

function findLocalRestaurantImage(name) {
  const normalized = name.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
  if (normalizedRestaurantImageMap[normalized]) {
    return `/restaurants/${normalizedRestaurantImageMap[normalized]}`;
  }
  const fallbackKey = Object.keys(normalizedRestaurantImageMap).find(key => key.includes(normalized) || normalized.includes(key));
  return fallbackKey ? `/restaurants/${normalizedRestaurantImageMap[fallbackKey]}` : null;
}

const restaurants = [
  { name: 'Biryani Brothers', cuisine: ['Biryani', 'Indian'], rating: 4.6, deliveryTime: '25-35 min', deliveryFee: 29, minOrder: 149 },
  { name: 'South Spice', cuisine: ['South Indian'], rating: 4.7, deliveryTime: '20-30 min', deliveryFee: 19, minOrder: 99 },
  { name: 'Urban Tadka', cuisine: ['Indian', 'Street Food'], rating: 4.5, deliveryTime: '25-35 min', deliveryFee: 25, minOrder: 129 },
  { name: 'Curry Junction', cuisine: ['Indian', 'North Indian'], rating: 4.4, deliveryTime: '30-40 min', deliveryFee: 29, minOrder: 149 },
  { name: 'Masala Mornings', cuisine: ['South Indian', 'Breakfast'], rating: 4.8, deliveryTime: '20-30 min', deliveryFee: 19, minOrder: 99 },
  { name: 'Noodle Nook', cuisine: ['Chinese'], rating: 4.3, deliveryTime: '25-35 min', deliveryFee: 35, minOrder: 149 },
  { name: 'Pasta Planet', cuisine: ['Italian'], rating: 4.5, deliveryTime: '30-40 min', deliveryFee: 39, minOrder: 199 },
  { name: 'Pizza Pulse', cuisine: ['Italian', 'Fast Food'], rating: 4.6, deliveryTime: '25-35 min', deliveryFee: 29, minOrder: 149 },
  { name: 'Grill & Chill', cuisine: ['Barbecue', 'Fast Food'], rating: 4.4, deliveryTime: '35-45 min', deliveryFee: 39, minOrder: 199 },
  { name: 'Wrap World', cuisine: ['Fast Food', 'Salads'], rating: 4.2, deliveryTime: '20-30 min', deliveryFee: 25, minOrder: 129 },
  { name: 'Sushi Street', cuisine: ['Japanese'], rating: 4.7, deliveryTime: '35-45 min', deliveryFee: 49, minOrder: 249 },
  { name: 'Burger Barn', cuisine: ['Fast Food'], rating: 4.3, deliveryTime: '20-30 min', deliveryFee: 25, minOrder: 129 },
  { name: 'Taco Town', cuisine: ['Mexican'], rating: 4.4, deliveryTime: '25-35 min', deliveryFee: 29, minOrder: 149 },
  { name: 'Salad Station', cuisine: ['Healthy'], rating: 4.5, deliveryTime: '20-30 min', deliveryFee: 19, minOrder: 99 },
  { name: 'Mediterranean Magic', cuisine: ['Mediterranean'], rating: 4.6, deliveryTime: '30-40 min', deliveryFee: 39, minOrder: 199 },
  { name: 'Seafood Shack', cuisine: ['Seafood'], rating: 4.5, deliveryTime: '35-45 min', deliveryFee: 49, minOrder: 249 },
  { name: 'Kabob Corner', cuisine: ['Middle Eastern'], rating: 4.4, deliveryTime: '30-40 min', deliveryFee: 39, minOrder: 199 },
  { name: 'Dessert Deli', cuisine: ['Desserts'], rating: 4.8, deliveryTime: '15-25 min', deliveryFee: 19, minOrder: 99 },
  { name: 'Juice Junction', cuisine: ['Beverages'], rating: 4.7, deliveryTime: '15-25 min', deliveryFee: 19, minOrder: 99 },
  { name: 'Healthy Harvest', cuisine: ['Healthy', 'Salads'], rating: 4.6, deliveryTime: '20-30 min', deliveryFee: 19, minOrder: 119 },
  { name: 'Café Connoisseur', cuisine: ['Cafe', 'Bakery'], rating: 4.5, deliveryTime: '20-30 min', deliveryFee: 19, minOrder: 119 },
  { name: 'Street Food Safari', cuisine: ['Indian', 'Street Food'], rating: 4.4, deliveryTime: '25-35 min', deliveryFee: 29, minOrder: 139 },
  { name: 'Fusion Fiesta', cuisine: ['Asian', 'Fusion'], rating: 4.6, deliveryTime: '30-40 min', deliveryFee: 35, minOrder: 169 }
];

const menuTemplates = {
  Biryani: [
    { name: 'Chicken Dum Biryani', price: 209, isVeg: false, description: 'Fragrant basmati rice layered with marinated chicken.' },
    { name: 'Veg Hyderabadi Biryani', price: 179, isVeg: true, description: 'Aromatic rice with mixed vegetables and spices.' },
    { name: 'Mutton Biryani', price: 249, isVeg: false, description: 'Rich mutton biryani cooked with saffron.' }
  ],
  Indian: [
    { name: 'Paneer Butter Masala', price: 179, isVeg: true, description: 'Creamy tomato gravy with soft paneer cubes.' },
    { name: 'Butter Chicken', price: 199, isVeg: false, description: 'Classic creamy tomato chicken curry.' },
    { name: 'Chole Bhature', price: 159, isVeg: true, description: 'Spiced chickpeas with fluffy fried bread.' },
    { name: 'Rogan Josh', price: 229, isVeg: false, description: 'Slow-cooked lamb curry with fragrant spices.' },
    { name: 'Dal Tadka', price: 139, isVeg: true, description: 'Yellow lentils tempered with garlic and chili.' },
    { name: 'Naan Basket', price: 79, isVeg: true, description: 'Plain, butter, and garlic naan assortment.' }
  ],
  'South Indian': [
    { name: 'Masala Dosa', price: 99, isVeg: true, description: 'Crispy dosa filled with spiced potatoes.' },
    { name: 'Rava Idli', price: 89, isVeg: true, description: 'Soft semolina dumplings served with chutney.' },
    { name: 'Filter Coffee', price: 69, isVeg: true, description: 'Strong South Indian coffee with milk.' },
    { name: 'Medu Vada', price: 89, isVeg: true, description: 'Crispy lentil donuts served with sambhar.' },
    { name: 'Upma', price: 79, isVeg: true, description: 'Savory semolina with vegetables and spices.' }
  ],
  Chinese: [
    { name: 'Veg Manchurian', price: 149, isVeg: true, description: 'Veg balls in spicy soy sauce.' },
    { name: 'Chilli Chicken', price: 189, isVeg: false, description: 'Crispy chicken tossed in chili sauce.' },
    { name: 'Schezuan Noodles', price: 159, isVeg: true, description: 'Spicy noodles with vegetables.' },
    { name: 'Honey Chilli Potato', price: 139, isVeg: true, description: 'Sweet and spicy crispy potatoes.' },
    { name: 'Veg Spring Rolls', price: 129, isVeg: true, description: 'Crunchy rolls with mixed vegetables.' }
  ],
  Italian: [
    { name: 'Margherita Pizza', price: 229, isVeg: true, description: 'Classic pizza with tomato and cheese.' },
    { name: 'Pepperoni Pizza', price: 269, isVeg: false, description: 'Pizza topped with pepperoni slices.' },
    { name: 'Penne Alfredo', price: 199, isVeg: true, description: 'Creamy pasta with parmesan cheese.' },
    { name: 'Chicken Lasagna', price: 249, isVeg: false, description: 'Layers of pasta, chicken, and cheese.' },
    { name: 'Bruschetta', price: 139, isVeg: true, description: 'Garlic toast topped with tomato and basil.' }
  ],
  'Fast Food': [
    { name: 'Cheese Burger', price: 149, isVeg: false, description: 'Juicy burger with cheese and veggies.' },
    { name: 'Veggie Wrap', price: 129, isVeg: true, description: 'Fresh veggies wrapped in soft tortilla.' },
    { name: 'Fries', price: 79, isVeg: true, description: 'Golden crispy french fries.' },
    { name: 'Chicken Nuggets', price: 159, isVeg: false, description: 'Crispy chicken bites with dip.' },
    { name: 'Club Sandwich', price: 169, isVeg: false, description: 'Triple-layer sandwich with chicken and bacon.' }
  ],
  Mexican: [
    { name: 'Paneer Taco', price: 139, isVeg: true, description: 'Spiced paneer in soft taco shell.' },
    { name: 'Chicken Burrito', price: 189, isVeg: false, description: 'Hearty burrito with chicken and beans.' },
    { name: 'Nachos', price: 149, isVeg: true, description: 'Crispy nachos loaded with salsa and cheese.' },
    { name: 'Quesadilla', price: 169, isVeg: true, description: 'Grilled tortilla with cheese and veggies.' },
    { name: 'Salsa Bowl', price: 99, isVeg: true, description: 'Fresh tomato salsa with chips.' }
  ],
  Beverage: [
    { name: 'Mango Lassi', price: 89, isVeg: true, description: 'Sweet mango yogurt drink.' },
    { name: 'Lemonade', price: 69, isVeg: true, description: 'Refreshing lemon drink.' },
    { name: 'Cold Coffee', price: 99, isVeg: true, description: 'Iced coffee with milk and sugar.' },
    { name: 'Green Tea', price: 79, isVeg: true, description: 'Light and healthy green tea.' }
  ],
  Desserts: [
    { name: 'Gulab Jamun', price: 99, isVeg: true, description: 'Soft syrup-soaked milk dumplings.' },
    { name: 'Chocolate Brownie', price: 119, isVeg: true, description: 'Warm brownie with chocolate sauce.' },
    { name: 'Ice Cream Scoop', price: 89, isVeg: true, description: 'Choice of vanilla or chocolate.' },
    { name: 'Panna Cotta', price: 129, isVeg: true, description: 'Creamy dessert with berry sauce.' }
  ],
  Healthy: [
    { name: 'Caesar Salad', price: 169, isVeg: true, description: 'Fresh greens with Caesar dressing.' },
    { name: 'Quinoa Bowl', price: 199, isVeg: true, description: 'Protein-rich quinoa with veggies.' },
    { name: 'Grilled Chicken Salad', price: 219, isVeg: false, description: 'Grilled chicken with mixed greens.' },
    { name: 'Avocado Toast', price: 149, isVeg: true, description: 'Toasted bread topped with avocado mash.' }
  ],
  Seafood: [
    { name: 'Fish Fry', price: 249, isVeg: false, description: 'Spice-rubbed fried fish.' },
    { name: 'Prawn Curry', price: 269, isVeg: false, description: 'Creamy prawn curry with rice.' },
    { name: 'Grilled Salmon', price: 299, isVeg: false, description: 'Herb-grilled salmon fillet.' },
    { name: 'Fish Tacos', price: 239, isVeg: false, description: 'Soft tacos with crispy fish.' }
  ],
  Bakery: [
    { name: 'Croissant', price: 89, isVeg: true, description: 'Buttery flaky croissant.' },
    { name: 'Blueberry Muffin', price: 99, isVeg: true, description: 'Soft muffin with blueberries.' },
    { name: 'Cappuccino', price: 119, isVeg: true, description: 'Espresso with steamed milk foam.' },
    { name: 'Banana Bread', price: 109, isVeg: true, description: 'Moist bread with banana and nuts.' }
  ],
  'Middle Eastern': [
    { name: 'Chicken Shawarma', price: 219, isVeg: false, description: 'Seasoned chicken wrap with garlic sauce.' },
    { name: 'Falafel Plate', price: 179, isVeg: true, description: 'Crispy falafel with hummus and salad.' },
    { name: 'Hummus Platter', price: 149, isVeg: true, description: 'Creamy hummus served with pita.' },
    { name: 'Tabbouleh', price: 159, isVeg: true, description: 'Fresh parsley salad with bulgur wheat.' }
  ],
  Japanese: [
    { name: 'California Roll', price: 229, isVeg: false, description: 'Crab and avocado sushi roll.' },
    { name: 'Veg Sushi', price: 199, isVeg: true, description: 'Vegetable sushi roll with rice.' },
    { name: 'Miso Soup', price: 89, isVeg: true, description: 'Warm broth with tofu and seaweed.' },
    { name: 'Teriyaki Chicken', price: 239, isVeg: false, description: 'Chicken with teriyaki glaze.' }
  ]
};

const categoryMap = {
  Biryani: ['Biryani', 'Indian', 'Beverage', 'Desserts'],
  Indian: ['Indian', 'Biryani', 'Beverage', 'Desserts'],
  'South Indian': ['South Indian', 'Indian', 'Beverage', 'Desserts'],
  'Street Food': ['Indian', 'Fast Food', 'Beverage', 'Desserts'],
  Chinese: ['Chinese', 'Beverage', 'Desserts', 'Fast Food'],
  Italian: ['Italian', 'Beverage', 'Desserts', 'Fast Food'],
  'Fast Food': ['Fast Food', 'Beverage', 'Desserts', 'Healthy'],
  Mexican: ['Mexican', 'Beverage', 'Desserts', 'Fast Food'],
  Healthy: ['Healthy', 'Beverage', 'Desserts', 'Salads'],
  Mediterranean: ['Middle Eastern', 'Beverage', 'Desserts', 'Bakery'],
  Seafood: ['Seafood', 'Beverage', 'Desserts', 'Fast Food'],
  'Middle Eastern': ['Middle Eastern', 'Beverage', 'Desserts', 'Bakery'],
  Desserts: ['Desserts', 'Beverage', 'Bakery'],
  Beverages: ['Beverage', 'Desserts', 'Bakery'],
  Bakery: ['Bakery', 'Beverage', 'Desserts'],
  Cafe: ['Bakery', 'Beverage', 'Desserts']
};

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMenuItems(restaurant, count) {
  const categories = categoryMap[restaurant.cuisine[0]] || ['Indian', 'Beverage', 'Desserts'];
  const items = [];
  const used = new Set();

  while (items.length < count) {
    const category = randomChoice(categories);
    const templateList = menuTemplates[category] || menuTemplates['Indian'];
    const template = randomChoice(templateList);
    let name = template.name;
    let suffix = '';

    if (used.has(name) || items.length % 8 === 0) {
      suffix = ` ${['Deluxe', 'Special', 'Classic', 'Supreme'][items.length % 4]}`;
    }
    const finalName = name + suffix;
    if (used.has(finalName)) continue;

    used.add(finalName);
    // Prefer local item images for common dessert/beverage names; fallback to Unsplash
    const localItemMap = {
      'ice cream': '/items/icecream1.jpg',
      'ice cream scoop': '/items/icecream1.jpg',
      'ice cream scoop deluxe': '/items/icecream2.jpg',
      'panna cotta': '/items/pannacotta.jpg',
      'gulab jamun': '/items/gulabjamun.jpg',
      'chocolate brownie': '/items/brownie.jpg',
      'mango lassi': '/items/mangolassi.jpg',
      'lemonade': '/items/lemonade.jpg',
      'croissant': '/items/croissant.jpg'
    };
    const lower = finalName.toLowerCase();
    const mapped = Object.keys(localItemMap).find(k => lower.includes(k));
    const imageUrl = mapped ? localItemMap[mapped] : `https://source.unsplash.com/280x180/?${encodeURIComponent(finalName)},food`;

    items.push({
      restaurant: restaurant._id,
      name: finalName,
      description: template.description,
      price: Math.max(79, template.price + Math.floor(Math.random() * 41) - 20),
      category,
      isVeg: template.isVeg,
      isAvailable: Math.random() > 0.02,
      image: imageUrl
    });
  }

  return items;
}

function buildAddress(index) {
  return {
    street: `${100 + index} Food Street`,
    city: 'Nellore',
    pincode: `5240${(index % 9) + 1}`
  };
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected for seeding...');
  await Restaurant.deleteMany();
  await MenuItem.deleteMany();

  for (let i = 0; i < restaurants.length; i++) {
    const rest = restaurants[i];
    // Use a local restaurant image path if present in frontend/public/restaurants
    const localRestaurantImage = findLocalRestaurantImage(rest.name);
    const created = await Restaurant.create({
      ...rest,
      address: buildAddress(i),
      image: localRestaurantImage || `https://source.unsplash.com/640x360/?${encodeURIComponent(rest.name)},food`
    });
    const menuItems = generateMenuItems(created, 35);
    await MenuItem.insertMany(menuItems);
    console.log(`Created ${created.name} with ${menuItems.length} items`);
  }

  console.log('Database seeding completed.');
  process.exit(0);
}).catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});