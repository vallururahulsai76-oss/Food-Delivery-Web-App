# 🍴 FeastFlow - Food Delivery Application

A modern, full-stack food delivery application built with React, Node.js, Express, and MongoDB. Order from your favorite restaurants and get food delivered fast.

![FeastFlow](https://img.shields.io/badge/FeastFlow-v1.0-2ECC71?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-9.6-13AA52?style=flat-square&logo=mongodb)

---

## ✨ Features

### User Features
- 🔐 **User Authentication** - Secure registration and login with JWT
- 🍽️ **Restaurant Discovery** - Browse 23+ restaurants with filtering and search
- 🔍 **Advanced Search** - Find restaurants by name or cuisine
- 🛒 **Shopping Cart** - Add/remove items with real-time updates
- 💳 **Orders** - Place orders and track delivery status
- ⭐ **Reviews** - Rate and review restaurants
- 👤 **Profile Management** - Update personal information and view order history
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

### Restaurant Features
- 📋 **Menu Management** - Display 30-40+ menu items per restaurant
- 🖼️ **Image Support** - High-quality images for restaurants and dishes
- 📊 **Ratings & Reviews** - Aggregated customer feedback
- 🚚 **Delivery Info** - Delivery time and fees
- 🔄 **Status Updates** - Real-time order status tracking

### Admin/System Features
- 🗄️ **Database Seeding** - Pre-populated with 23 restaurants and 800+ menu items
- 📸 **Local Image Management** - Restaurants and menu items with local image support
- 🔄 **REST API** - Fully documented API endpoints
- 🛡️ **Error Handling** - Comprehensive error management

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Next-generation build tool
- **React Router v6** - Client-side routing
- **Context API** - State management
- **CSS3** - Responsive styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

---

## 📁 Project Structure

```
Food Delivery App/
├── frontend/
│   ├── public/
│   │   ├── restaurants/          # Restaurant images
│   │   ├── items/                # Menu item images
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service layer
│   │   ├── context/              # State management
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── config/
    │   └── db.js                 # Database configuration
    ├── middleware/
    │   └── auth.js               # JWT authentication
    ├── models/
    │   ├── User.js
    │   ├── Restaurant.js
    │   ├── MenuItem.js
    │   ├── Order.js
    │   └── Review.js
    ├── routes/
    │   ├── auth.js
    │   ├── restaurants.js
    │   ├── menu.js
    │   ├── orders.js
    │   ├── reviews.js
    │   └── users.js
    ├── server.js                 # Main server file
    ├── seed.js                   # Database seeding script
    ├── package.json
    └── .env
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or cloud)
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/feastflow.git
cd "Food Delivery App"
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file with your MongoDB URI and port
echo "MONGO_URI=mongodb://localhost:27017/feastflow" > .env
echo "PORT=5000" >> .env
echo "JWT_SECRET=your_jwt_secret_key" >> .env

# Seed the database
npm run seed

# Start the development server
npm run dev
```

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 📊 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Database Seeding

To populate the database with sample restaurants and menu items:
```bash
cd backend
npm run seed
```

This creates:
- 23 restaurants with detailed information
- 30-40 menu items per restaurant
- Sample ratings and delivery information
- Local image references

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### Menu Items
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get menu item details

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `DELETE /api/orders/:id` - Cancel order

### Reviews
- `GET /api/reviews/restaurant/:id` - Get restaurant reviews
- `POST /api/reviews` - Create review

### Users
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update user profile
- `GET /api/users/me/cart` - Get user's cart
- `POST /api/users/me/cart` - Update cart
- `DELETE /api/users/me/cart` - Clear cart
- `GET /api/users/me/notifications` - Get notifications
- `PATCH /api/users/me/notifications/read` - Mark notifications as read

---

## 🎨 UI/UX Features

### Design System
- **Brand Color:** Green (#2ECC71) - Fresh, healthy, delivery-focused
- **Secondary Color:** Deep Green (#27AE60)
- **Accent Background:** Light Green (#F0FFF4)
- **Responsive Grid:** 3-column layout on desktop, 1-column on mobile
- **Card-based Layout:** Modern card components with shadows and hover effects

### Key Pages
1. **Home** - Restaurant discovery with search
2. **Restaurant Detail** - Menu browsing with images
3. **Cart** - Order review and checkout
4. **Orders** - Order history and tracking
5. **Profile** - User settings and account info
6. **Authentication** - Login and registration

---

## 🖼️ Image Management

### Adding Restaurant Images
1. Place images in `frontend/public/restaurants/`
2. Name format: `Restaurant Name.png` (e.g., `Masala Mornings.png`)
3. Supported formats: PNG, JPG, JPEG
4. Run `npm run seed` to regenerate database references

### Adding Menu Item Images
1. Place images in `frontend/public/items/`
2. Name format: `itemname.jpg` (e.g., `icecream1.jpg`)
3. Update seed script mapping for item-specific images

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **CORS** - Cross-origin request protection
- **Input Validation** - express-validator for request validation
- **Protected Routes** - Auth middleware on sensitive endpoints

---

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/feastflow

# Server
PORT=5000

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
```

---

## 🧪 Testing

### Manual Testing
1. Register a new account
2. Browse restaurants on the home page
3. Click on a restaurant to view its menu
4. Add items to cart
5. Review cart and checkout
6. Track order status

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Get all restaurants
curl http://localhost:5000/api/restaurants

# Health check
curl http://localhost:5000/api/health
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🐛 Known Issues & Roadmap

### Current Version (v1.0)
- ✅ Restaurant browsing
- ✅ Menu display with images
- ✅ Shopping cart functionality
- ✅ Order placement
- ✅ User authentication
- ✅ Reviews system

### Planned Features
- 🔜 Real-time order tracking with WebSocket
- 🔜 Payment gateway integration
- 🔜 Restaurant admin panel
- 🔜 Email notifications
- 🔜 Analytics dashboard
- 🔜 Ratings and recommendations
- 🔜 Multi-language support
- 🔜 Dark mode

---

## 🆘 Support

For support, email support@feastflow.com or open an issue in the repository.

---

## 👥 Team

- **Lead Developer** - Your Name
- **UI/UX Designer** - Designer Name
- **Project Manager** - PM Name

---

## 🙏 Acknowledgments

- Icons and emojis from Unicode
- Food images sourced locally
- Inspired by modern food delivery apps
- Built with ❤️ for food lovers

---

**Happy ordering! 🍽️**

Made with React + Node.js + MongoDB
