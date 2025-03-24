'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import RoleSelector, { UserRole } from '@/components/auth/RoleSelector';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Chef-specific fields
    experience: '',
    specialties: '',
    kitchenAddress: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Prepare user data based on role
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: selectedRole,
        ...(selectedRole === 'chef' && {
          experience: formData.experience,
          specialties: formData.specialties.split(',').map(s => s.trim()),
          kitchenAddress: formData.kitchenAddress,
        }),
      };

      await signup(userData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const renderCustomerFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label="Full Name"
        id="name"
        name="name"
        type="text"
        required
        value={formData.name}
        onChange={handleChange}
        placeholder="Full name"
      />

      <Input
        label="Email Address"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
      />

      <Input
        label="Phone Number"
        id="phone"
        name="phone"
        type="tel"
        required
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
      />

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        required
        value={formData.password}
        onChange={handleChange}
        placeholder="Create a Password"
      />

      <Input
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        required
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
      />
    </div>
  );

  const renderChefFields = () => (
    <div className="space-y-6">
      {renderCustomerFields()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Years of Experience"
          id="experience"
          name="experience"
          type="number"
          required
          value={formData.experience}
          onChange={handleChange}
          placeholder="Experience"
        />

        <Input
          label="Specialties"
          id="specialties"
          name="specialties"
          type="text"
          required
          value={formData.specialties}
          onChange={handleChange}
          placeholder="e.g., North Indian, South Indian"
        />

        <div className="md:col-span-2">
          <Textarea
            label="Kitchen Address"
            id="kitchenAddress"
            name="kitchenAddress"
            rows={2}
            required
            value={formData.kitchenAddress}
            onChange={handleChange}
            placeholder="Kitchen Address"
          />
        </div>
      </div>
    </div>
  );

  const renderAdminFields = () => (
    <div className="space-y-6">
      {renderCustomerFields()}
      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p>Administrator accounts require additional verification and approval.</p>
        <p>Please contact the system administrator for access.</p>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Choose your role and fill in your details"
    >
      <form className="space-y-6 max-w-4xl mx-auto" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <RoleSelector
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />

        <div className="mt-6">
          {selectedRole === 'customer' && renderCustomerFields()}
          {selectedRole === 'chef' && renderChefFields()}
          {selectedRole === 'admin' && renderAdminFields()}
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
} 
