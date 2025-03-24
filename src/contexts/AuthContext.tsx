'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setLoading(false);

      // Redirect based on user role
      if (data.user.role === 'chef') {
        router.push('/chef');
      } else {
        router.push('/');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      console.log('Attempting signup with URL:', `${API_URL}/auth/signup`);
      console.log('User data:', userData);

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Signup response error:', error);
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      localStorage.setItem('token', data.token);
      setUser(data.user);

      // Redirect based on user role after signup
      if (data.user.role === 'chef') {
        router.push('/chef');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      console.log('Sending update data:', userData);

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      const responseData = await response.json();
      console.log('Received response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update profile');
      }

      // Merge the sent data with the response data
      const updatedUser = {
        ...user,                // Start with current user data
        ...userData,           // Apply the changes we sent
        ...responseData,       // Override with server response
        // Ensure number fields are properly handled
        experience: responseData.experience ?? userData.experience ?? user?.experience,
        maxOrdersPerDay: responseData.maxOrdersPerDay ?? userData.maxOrdersPerDay ?? user?.maxOrdersPerDay,
        deliveryRadius: responseData.deliveryRadius ?? userData.deliveryRadius ?? user?.deliveryRadius,
        // Ensure text fields are properly handled
        kitchenName: responseData.kitchenName ?? userData.kitchenName ?? user?.kitchenName,
        kitchenAddress: responseData.kitchenAddress ?? userData.kitchenAddress ?? user?.kitchenAddress,
        specialties: responseData.specialties ?? userData.specialties ?? user?.specialties,
        // Ensure preferences are properly handled
        preferences: {
          dietaryRestrictions: responseData.preferences?.dietaryRestrictions ?? userData.preferences?.dietaryRestrictions ?? user?.preferences?.dietaryRestrictions ?? [],
          spiceLevel: responseData.preferences?.spiceLevel ?? userData.preferences?.spiceLevel ?? user?.preferences?.spiceLevel ?? null
        }
      };

      console.log('Setting updated user:', updatedUser);
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      console.error('User update failed:', error);
      throw new Error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
