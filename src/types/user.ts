export type UserRole = 'customer' | 'chef' | 'admin';

export type DietaryPreference = 'vegetarian' | 'non-vegetarian' | 'both';
export type MaritalStatus = 'single' | 'married' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  createdAt: string;
  updatedAt: string;
  
  // Customer specific fields
  dietaryPreference?: DietaryPreference;
  maritalStatus?: MaritalStatus;
  profession?: string;
  mealsPerDay?: number;
  deliveryInstructions?: string;
  foodAllergies?: string[];
  preferredMealTime?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  
  // Chef specific fields
  experience?: string;
  specialties?: string[];
  kitchenAddress?: string;
}

export interface Customer extends User {
  role: 'customer';
  address?: string;
  preferences?: {
    dietaryRestrictions?: string[];
    spiceLevel?: 'mild' | 'medium' | 'hot';
  };
}

export interface Chef extends User {
  role: 'chef';
  experience: string;
  specialties: string[];
  kitchenAddress: string;
  rating?: number;
  totalOrders?: number;
  isVerified: boolean;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export type User = Customer | Chef | Admin; 
