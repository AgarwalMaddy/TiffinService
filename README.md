# Tiffin - Food Delivery Platform

A modern food delivery platform that connects home chefs with customers, built with Next.js and TypeScript.

## Features

- User Authentication (Chef/Customer)
- Profile Management
- Menu Management for Chefs
- Order Management
- Real-time Order Tracking
- Responsive Design

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- MongoDB
- Express.js (Backend)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tiffin.git
cd tiffin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tiffin/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable components
│   ├── contexts/        # React contexts
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── public/             # Static assets
└── package.json        # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
