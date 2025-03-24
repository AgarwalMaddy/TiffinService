'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const inputStyles = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm";
const labelStyles = "block text-sm font-medium text-gray-700 mb-1";
const readOnlyStyles = "mt-1 block w-full px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900";

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Initialize editedUser when user data changes
  useEffect(() => {
    if (user) {
      const initialUserData = {
        ...user,
        phone: user.phone || '',
        address: user.address || '',
        kitchenName: user.kitchenName || '',
        kitchenAddress: user.kitchenAddress || '',
        specialties: user.specialties || [],
        experience: user.experience?.toString() || '',
        maxOrdersPerDay: user.maxOrdersPerDay?.toString() || '',
        deliveryRadius: user.deliveryRadius?.toString() || '',
        preferences: {
          dietaryRestrictions: user.preferences?.dietaryRestrictions || [],
          spiceLevel: user.preferences?.spiceLevel || null
        }
      };
      setEditedUser(initialUserData);
    }
  }, [user]);

  // Handle authentication and profile completion check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const requiredFields = user.role === 'customer' 
        ? ['address', 'phone']
        : ['phone', 'kitchenName', 'kitchenAddress', 'specialties', 'experience'];
      
      const hasIncompleteFields = requiredFields.some(field => {
        const value = user[field];
        return value === null || value === undefined || value === '' || 
          (Array.isArray(value) && value.length === 0);
      });
      
      setShowProfilePrompt(hasIncompleteFields);
      setIsProfileComplete(!hasIncompleteFields);
    }
  }, [user, loading, router]);

  // Show loading state only when we don't have user data yet
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null;
  }

  // Show loading state when we have user but editedUser is not initialized yet
  if (!editedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Create a copy of editedUser with only the fields we want to update
      const fieldsToUpdate: any = {
        phone: editedUser.phone,
        address: editedUser.address,
      };

      // Add role-specific fields
      if (editedUser.role === 'chef') {
        Object.assign(fieldsToUpdate, {
          kitchenName: editedUser.kitchenName,
          kitchenAddress: editedUser.kitchenAddress,
          specialties: editedUser.specialties,
          experience: editedUser.experience !== '' ? Number(editedUser.experience) : null,
          maxOrdersPerDay: editedUser.maxOrdersPerDay !== '' ? Number(editedUser.maxOrdersPerDay) : null,
          deliveryRadius: editedUser.deliveryRadius !== '' ? Number(editedUser.deliveryRadius) : null
        });
      } else if (editedUser.role === 'customer') {
        Object.assign(fieldsToUpdate, {
          preferences: {
            dietaryRestrictions: editedUser.preferences?.dietaryRestrictions || [],
            spiceLevel: editedUser.preferences?.spiceLevel || null
          }
        });
      }

      // Only filter out undefined values, keep empty strings and null
      const cleanedUserData = Object.fromEntries(
        Object.entries(fieldsToUpdate)
          .filter(([_, value]) => value !== undefined)
      );

      console.log('Sending update data:', cleanedUserData);
      const updatedUser = await updateUser(cleanedUserData);
      console.log('Received updated user:', updatedUser);

      // Update editedUser state with the received data
      const newEditedUser = {
        ...updatedUser,
        // Convert number fields to strings for form display
        experience: updatedUser.experience?.toString() || '',
        maxOrdersPerDay: updatedUser.maxOrdersPerDay?.toString() || '',
        deliveryRadius: updatedUser.deliveryRadius?.toString() || '',
        // Ensure preferences are properly set
        preferences: {
          dietaryRestrictions: updatedUser.preferences?.dietaryRestrictions || [],
          spiceLevel: updatedUser.preferences?.spiceLevel || null
        }
      };

      setEditedUser(newEditedUser);
      setIsEditing(false);
      setShowProfilePrompt(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (user) {
      // Reset to current user data
      setEditedUser({
        ...user,
        phone: user.phone || '',
        address: user.address || '',
        kitchenName: user.kitchenName || '',
        kitchenAddress: user.kitchenAddress || '',
        specialties: user.specialties || [],
        experience: user.experience || '',
        maxOrdersPerDay: user.maxOrdersPerDay || '',
        deliveryRadius: user.deliveryRadius || '',
        preferences: {
          dietaryRestrictions: user.preferences?.dietaryRestrictions || [],
          spiceLevel: user.preferences?.spiceLevel || null
        }
      });
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setEditedUser(prev => {
      // Special handling for specialties array
      if (name === 'specialties') {
        return {
          ...prev,
          specialties: value ? [value] : []
        };
      }
      
      // Special handling for preferences
      if (name === 'dietaryPreference' || name === 'spiceLevel') {
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            [name === 'dietaryPreference' ? 'dietaryRestrictions' : 'spiceLevel']: value
          }
        };
      }

      // Special handling for number fields
      if (name === 'experience' || name === 'maxOrdersPerDay' || name === 'deliveryRadius') {
        return {
          ...prev,
          [name]: value
        };
      }

      // Default handling for other fields
      return {
        ...prev,
        [name]: value
      };
    });
  };

  // Function to format display value
  const getDisplayValue = (value: any, type: string = 'text') => {
    if (value === null || value === undefined || value === '') return 'Not provided';
    switch (type) {
      case 'array':
        return Array.isArray(value) && value.length > 0 ? value.join(', ') : 'Not provided';
      case 'number':
        return value.toString();
      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Completion Prompt */}
        {showProfilePrompt && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-700">
                  Please complete your profile to help us serve you better.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Edit Profile
              </button>
            ) : null}
          </div>

          {/* Profile Information */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Common Fields */}
                <div>
                  <label className={labelStyles}>Email</label>
                  <div className={readOnlyStyles}>{editedUser.email}</div>
                </div>

                <div>
                  <label className={labelStyles}>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedUser.phone}
                      onChange={handleChange}
                      className={inputStyles}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className={readOnlyStyles}>{editedUser.phone}</div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className={labelStyles}>Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={editedUser.address || ''}
                      onChange={handleChange}
                      className={inputStyles}
                      placeholder="Enter your address"
                      rows={3}
                    />
                  ) : (
                    <div className={readOnlyStyles}>{editedUser.address || 'Not provided'}</div>
                  )}
                </div>

                {/* Customer-specific Fields */}
                {editedUser.role === 'customer' && (
                  <>
                    <div>
                      <label className={labelStyles}>Dietary Preference</label>
                      {isEditing ? (
                        <select
                          name="dietaryPreference"
                          value={editedUser.preferences?.dietaryRestrictions?.[0] || ''}
                          onChange={handleChange}
                          className={inputStyles}
                        >
                          <option value="">Select preference</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="non-vegetarian">Non-Vegetarian</option>
                        </select>
                      ) : (
                        <div className={readOnlyStyles}>
                          {editedUser.preferences?.dietaryRestrictions?.[0] || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className={labelStyles}>Spice Level</label>
                      {isEditing ? (
                        <select
                          name="spiceLevel"
                          value={editedUser.preferences?.spiceLevel || ''}
                          onChange={handleChange}
                          className={inputStyles}
                        >
                          <option value="">Select spice level</option>
                          <option value="mild">Mild</option>
                          <option value="medium">Medium</option>
                          <option value="hot">Hot</option>
                        </select>
                      ) : (
                        <div className={readOnlyStyles}>
                          {editedUser.preferences?.spiceLevel || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Chef-specific Fields */}
                {editedUser.role === 'chef' && (
                  <>
                    <div>
                      <label className={labelStyles}>Kitchen Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="kitchenName"
                          value={editedUser.kitchenName || ''}
                          onChange={handleChange}
                          className={inputStyles}
                          placeholder="Enter your kitchen name"
                        />
                      ) : (
                        <div className={readOnlyStyles}>{getDisplayValue(editedUser.kitchenName)}</div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelStyles}>Kitchen Address</label>
                      {isEditing ? (
                        <textarea
                          name="kitchenAddress"
                          value={editedUser.kitchenAddress || ''}
                          onChange={handleChange}
                          className={inputStyles}
                          placeholder="Enter your kitchen address"
                          rows={3}
                        />
                      ) : (
                        <div className={readOnlyStyles}>{getDisplayValue(editedUser.kitchenAddress)}</div>
                      )}
                    </div>

                    <div>
                      <label className={labelStyles}>Specialization</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="specialties"
                          value={editedUser.specialties?.[0] || ''}
                          onChange={(e) => handleChange('specialties', [e.target.value])}
                          className={inputStyles}
                          placeholder="Enter your specialization"
                        />
                      ) : (
                        <div className={readOnlyStyles}>{getDisplayValue(editedUser.specialties, 'array')}</div>
                      )}
                    </div>

                    <div>
                      <label className={labelStyles}>Years of Experience</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="experience"
                          value={editedUser.experience || ''}
                          onChange={handleChange}
                          className={inputStyles}
                          placeholder="Enter years of experience"
                          min="0"
                        />
                      ) : (
                        <div className={readOnlyStyles}>{getDisplayValue(editedUser.experience)} years</div>
                      )}
                    </div>

                    <div>
                      <label className={labelStyles}>Maximum Orders Per Day</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="maxOrdersPerDay"
                          value={editedUser.maxOrdersPerDay || ''}
                          onChange={handleChange}
                          className={inputStyles}
                          placeholder="Enter maximum orders per day"
                          min="1"
                        />
                      ) : (
                        <div className={readOnlyStyles}>{getDisplayValue(editedUser.maxOrdersPerDay, 'number')} orders</div>
                      )}
                    </div>

                    <div>
                      <label className={labelStyles}>Delivery Radius (km)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="deliveryRadius"
                          value={editedUser.deliveryRadius || ''}
                          onChange={handleChange}
                          className={inputStyles}
                          placeholder="Enter delivery radius in kilometers"
                          min="1"
                        />
                      ) : (
                        <div className={readOnlyStyles}>{getDisplayValue(editedUser.deliveryRadius, 'number')} km</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Save/Cancel Buttons - Only show when editing */}
          {isEditing && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4">
              <div className="flex justify-end space-x-3 px-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
