'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ChefHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [todayOrders, setTodayOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayRevenue: 0,
    averageRating: 4.8,
    totalCustomers: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
              <p className="text-orange-100">Manage your kitchen and orders</p>
            </div>
            <Link
              href="/kitchen/menu"
              className="px-4 py-2 bg-white text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
            >
              Manage Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Today's Orders</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Today's Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.todayRevenue}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageRating}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCustomers}</p>
          </div>
        </div>
      </div>

      {/* Today's Orders */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Today's Orders</h2>
          </div>
          <div className="p-6">
            {todayOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders for today</p>
            ) : (
              <div className="space-y-4">
                {/* Order items would be mapped here */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/kitchen/menu"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-medium mb-2">Update Menu</h3>
            <p className="text-gray-600">Add or modify your menu items</p>
          </Link>
          <Link
            href="/kitchen/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-medium mb-2">View All Orders</h3>
            <p className="text-gray-600">Check order history and status</p>
          </Link>
          <Link
            href="/kitchen/settings"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-medium mb-2">Kitchen Settings</h3>
            <p className="text-gray-600">Manage your kitchen preferences</p>
          </Link>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Customer Feedback</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-4">No recent feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
