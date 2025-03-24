import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'chef' | 'admin';
  address?: string;
  experience?: string;
  specialties?: string[];
  kitchenAddress?: string;
  kitchenName?: string;
  maxOrdersPerDay?: number;
  deliveryRadius?: number;
  rating?: number;
  totalOrders?: number;
  isVerified?: boolean;
  preferences?: {
    dietaryRestrictions?: string[];
    spiceLevel?: 'mild' | 'medium' | 'hot';
  };
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['customer', 'chef', 'admin'], required: true },
    address: { type: String },
    experience: { type: String },
    specialties: [{ type: String }],
    kitchenAddress: { type: String },
    kitchenName: { type: String },
    maxOrdersPerDay: { type: Number },
    deliveryRadius: { type: Number },
    rating: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    preferences: {
      dietaryRestrictions: [{ type: String }],
      spiceLevel: { type: String, enum: ['mild', 'medium', 'hot'] }
    },
    permissions: [{ type: String }]
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model<IUser>('User', userSchema); 
