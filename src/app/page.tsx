'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setIsRedirecting(true);
        router.push('/login');
      } else if (user.role === 'chef') {
        setIsRedirecting(true);
        router.push('/chef');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated or redirecting
  if (!user || isRedirecting) return null;

  // Only render customer home page if user is confirmed to be a customer
  return <CustomerHomePage />;
}

// Move the customer home page to a separate component
function CustomerHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  const cuisines = [
    'North Indian', 'South Indian', 'Chinese', 'Continental',
    'Mexican', 'Italian', 'Thai', 'Japanese'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Home-Cooked Meal</h1>
            <p className="text-xl mb-8">Connect with talented home chefs in your area</p>
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by location or cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white text-orange-500 border-2 border-orange-500 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button className="px-6 py-2 bg-white text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors border-2 border-orange-500">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cuisine Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Browse by Cuisine</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedCuisine === cuisine
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Chefs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Chefs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chef Card Template */}
          {[1, 2, 3].map((chef) => (
            <div key={chef} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {/* Chef Image would go here */}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Chef's Kitchen {chef}</h3>
                <p className="text-gray-600 mb-4">Specializing in North Indian Cuisine</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">4.8</span>
                  </div>
                  <Link
                    href={`/chef/${chef}`}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No recent orders. Start exploring chefs to place your first order!</p>
        </div>
      </div>

      {/* Special Offers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">First Order Discount</h3>
            <p className="text-gray-600 mb-4">Get 20% off on your first order from any chef</p>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
              Learn More
            </button>
          </div>
          <div className="bg-orange-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Referral Bonus</h3>
            <p className="text-gray-600 mb-4">Refer a friend and get ₹100 off on your next order</p>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
              Share Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
