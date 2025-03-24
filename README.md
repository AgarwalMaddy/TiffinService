# Tiffin Service

A modern food delivery platform connecting home chefs with customers, built with Next.js and TypeScript.

## About

Tiffin Service is a platform that bridges the gap between home chefs and food enthusiasts. It provides a seamless experience for both chefs to showcase their culinary skills and customers to discover authentic homemade meals.

### Key Features

- **Dual User Roles**: Separate interfaces for chefs and customers
- **Real-time Order Tracking**: Live updates on order status
- **Secure Authentication**: JWT-based authentication system
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Modern Stack**: Built with Next.js 13+ and MongoDB

### For Home Chefs
- Create and manage your kitchen profile
- Set your daily menu and pricing
- Track orders and manage delivery
- Set your delivery radius and maximum orders
- Showcase your specialties and experience

### For Customers
- Browse local home chefs
- View daily menus and place orders
- Track order status in real-time
- Rate and review chefs
- Save favorite chefs and dishes

## Tech Stack

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT
- **Styling**: Tailwind CSS, Shadcn UI
- **Development**: TypeScript, ESLint, Prettier

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AgarwalMaddy/TiffinService.git
cd TiffinService
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
tiffin/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # Reusable components
│   ├── contexts/           # React contexts
│   └── types/              # TypeScript type definitions
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.ts       # Server entry point
│   └── package.json
├── public/                 # Static assets
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Shadcn UI](https://ui.shadcn.com/)
