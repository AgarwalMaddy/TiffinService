'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m6.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

interface MenuItem {
  name: string;
  price: number;
  description?: string;
}

interface MenuForm {
  cuisine: string;
  curry: {
    enabled: boolean;
    items: MenuItem[];
  };
  rice: {
    enabled: boolean;
    items: MenuItem[];
  };
  roti: {
    enabled: boolean;
    items: MenuItem[];
  };
  drySabji: {
    enabled: boolean;
    items: MenuItem[];
  };
  sweets: {
    enabled: boolean;
    items: MenuItem[];
  };
  salads: {
    enabled: boolean;
    items: MenuItem[];
  };
  extras: {
    enabled: boolean;
    items: MenuItem[];
  };
}

const cuisines = [
  'North Indian',
  'South Indian',
  'Gujarati',
  'Maharashtrian',
  'Punjabi',
  'Bengali',
  'Rajasthani',
  'Other'
];

const inputStyles = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm";
const labelStyles = "block text-sm font-medium text-gray-700 mb-1";

export default function MenuManagementPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [menuForm, setMenuForm] = useState<MenuForm>({
    cuisine: '',
    curry: { enabled: true, items: [{ name: '', price: 0, description: '' }] },
    rice: { enabled: true, items: [{ name: '', price: 0, description: '' }] },
    roti: { enabled: true, items: [{ name: '', price: 0, description: '' }] },
    drySabji: { enabled: true, items: [{ name: '', price: 0, description: '' }] },
    sweets: { enabled: false, items: [] },
    salads: { enabled: false, items: [] },
    extras: { enabled: false, items: [] }
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'chef')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleCuisineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMenuForm(prev => ({
      ...prev,
      cuisine: e.target.value
    }));
  };

  const handleMainCategoryToggle = (category: 'curry' | 'rice' | 'roti' | 'drySabji') => {
    setMenuForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        enabled: !prev[category].enabled,
        items: !prev[category].enabled ? [{ name: '', price: 0, description: '' }] : []
      }
    }));
  };

  const handleAddMainItem = (category: 'curry' | 'rice' | 'roti' | 'drySabji') => {
    setMenuForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: [...prev[category].items, { name: '', price: 0, description: '' }]
      }
    }));
  };

  const handleMainItemChange = (
    category: 'curry' | 'rice' | 'roti' | 'drySabji',
    index: number,
    field: keyof MenuItem,
    value: string | number
  ) => {
    setMenuForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const handleRemoveMainItem = (
    category: 'curry' | 'rice' | 'roti' | 'drySabji',
    index: number
  ) => {
    setMenuForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleOptionalCategoryToggle = (category: 'sweets' | 'salads' | 'extras') => {
    setMenuForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        enabled: !prev[category].enabled,
        items: !prev[category].enabled ? [{ name: '', price: 0, description: '' }] : []
      }
    }));
  };

  const handleAddOptionalItem = (category: 'sweets' | 'salads' | 'extras') => {
    setMenuForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: [...prev[category].items, { name: '', price: 0, description: '' }]
      }
    }));
  };

  const handleOptionalItemChange = (
    category: 'sweets' | 'salads' | 'extras',
    index: number,
    field: keyof MenuItem,
    value: string | number
  ) => {
    setMenuForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const handleRemoveOptionalItem = (
    category: 'sweets' | 'salads' | 'extras',
    index: number
  ) => {
    setMenuForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/kitchen/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(menuForm)
      });

      if (!response.ok) {
        throw new Error('Failed to save menu');
      }

      // Reset form or show success message
      setMenuForm({
        cuisine: '',
        curry: { enabled: true, items: [{ name: '', price: 0, description: '' }] },
        rice: { enabled: true, items: [{ name: '', price: 0, description: '' }] },
        roti: { enabled: true, items: [{ name: '', price: 0, description: '' }] },
        drySabji: { enabled: true, items: [{ name: '', price: 0, description: '' }] },
        sweets: { enabled: false, items: [] },
        salads: { enabled: false, items: [] },
        extras: { enabled: false, items: [] }
      });
    } catch (error) {
      console.error('Failed to save menu:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'chef') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cuisine Selection */}
            <div>
              <label className={labelStyles}>Select Cuisine</label>
              <select
                value={menuForm.cuisine}
                onChange={handleCuisineChange}
                className={inputStyles}
                required
              >
                <option value="">Select a cuisine</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            {/* Main Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Main Items</h3>
              
              {/* Curry */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className={labelStyles}>Curry</label>
                  {!menuForm.curry.enabled && (
                    <button
                      type="button"
                      onClick={() => handleMainCategoryToggle('curry')}
                      className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                    >
                      +
                    </button>
                  )}
                </div>
                {menuForm.curry.enabled && menuForm.curry.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className={labelStyles}>Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleMainItemChange('curry', index, 'name', e.target.value)}
                        className={inputStyles}
                        placeholder="Enter curry name"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Price</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleMainItemChange('curry', index, 'price', Number(e.target.value))}
                          className={inputStyles}
                          placeholder="Enter price"
                          min="0"
                          required
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddMainItem('curry')}
                            className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (menuForm.curry.items.length === 1) {
                                handleMainCategoryToggle('curry');
                              } else {
                                handleRemoveMainItem('curry', index);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rice */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className={labelStyles}>Rice</label>
                  {!menuForm.rice.enabled && (
                    <button
                      type="button"
                      onClick={() => handleMainCategoryToggle('rice')}
                      className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                    >
                      +
                    </button>
                  )}
                </div>
                {menuForm.rice.enabled && menuForm.rice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className={labelStyles}>Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleMainItemChange('rice', index, 'name', e.target.value)}
                        className={inputStyles}
                        placeholder="Enter rice name"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Price</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleMainItemChange('rice', index, 'price', Number(e.target.value))}
                          className={inputStyles}
                          placeholder="Enter price"
                          min="0"
                          required
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddMainItem('rice')}
                            className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (menuForm.rice.items.length === 1) {
                                handleMainCategoryToggle('rice');
                              } else {
                                handleRemoveMainItem('rice', index);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Roti */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className={labelStyles}>Roti</label>
                  {!menuForm.roti.enabled && (
                    <button
                      type="button"
                      onClick={() => handleMainCategoryToggle('roti')}
                      className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                    >
                      +
                    </button>
                  )}
                </div>
                {menuForm.roti.enabled && menuForm.roti.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className={labelStyles}>Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleMainItemChange('roti', index, 'name', e.target.value)}
                        className={inputStyles}
                        placeholder="Enter roti name"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Price</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleMainItemChange('roti', index, 'price', Number(e.target.value))}
                          className={inputStyles}
                          placeholder="Enter price"
                          min="0"
                          required
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddMainItem('roti')}
                            className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (menuForm.roti.items.length === 1) {
                                handleMainCategoryToggle('roti');
                              } else {
                                handleRemoveMainItem('roti', index);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dry Sabji */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className={labelStyles}>Dry Sabji</label>
                  {!menuForm.drySabji.enabled && (
                    <button
                      type="button"
                      onClick={() => handleMainCategoryToggle('drySabji')}
                      className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                    >
                      +
                    </button>
                  )}
                </div>
                {menuForm.drySabji.enabled && menuForm.drySabji.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className={labelStyles}>Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleMainItemChange('drySabji', index, 'name', e.target.value)}
                        className={inputStyles}
                        placeholder="Enter dry sabji name"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Price</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleMainItemChange('drySabji', index, 'price', Number(e.target.value))}
                          className={inputStyles}
                          placeholder="Enter price"
                          min="0"
                          required
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddMainItem('drySabji')}
                            className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (menuForm.drySabji.items.length === 1) {
                                handleMainCategoryToggle('drySabji');
                              } else {
                                handleRemoveMainItem('drySabji', index);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Optional Items</h3>

              {/* Sweets */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sweets"
                    checked={menuForm.sweets.enabled}
                    onChange={() => handleOptionalCategoryToggle('sweets')}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sweets" className="ml-2 block text-sm text-gray-900">
                    Sweets
                  </label>
                </div>
                {menuForm.sweets.enabled && (
                  <div className="ml-6 space-y-4">
                    {menuForm.sweets.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className={labelStyles}>Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleOptionalItemChange('sweets', index, 'name', e.target.value)}
                            className={inputStyles}
                            placeholder="Enter sweet name"
                          />
                        </div>
                        <div>
                          <label className={labelStyles}>Price</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => handleOptionalItemChange('sweets', index, 'price', Number(e.target.value))}
                              className={inputStyles}
                              placeholder="Enter price"
                              min="0"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleAddOptionalItem('sweets')}
                                className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                              >
                                +
                              </button>
                              {menuForm.sweets.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOptionalItem('sweets', index)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Salads */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="salads"
                    checked={menuForm.salads.enabled}
                    onChange={() => handleOptionalCategoryToggle('salads')}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="salads" className="ml-2 block text-sm text-gray-900">
                    Salads
                  </label>
                </div>
                {menuForm.salads.enabled && (
                  <div className="ml-6 space-y-4">
                    {menuForm.salads.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className={labelStyles}>Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleOptionalItemChange('salads', index, 'name', e.target.value)}
                            className={inputStyles}
                            placeholder="Enter salad name"
                          />
                        </div>
                        <div>
                          <label className={labelStyles}>Price</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => handleOptionalItemChange('salads', index, 'price', Number(e.target.value))}
                              className={inputStyles}
                              placeholder="Enter price"
                              min="0"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleAddOptionalItem('salads')}
                                className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                              >
                                +
                              </button>
                              {menuForm.salads.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOptionalItem('salads', index)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Extras */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="extras"
                    checked={menuForm.extras.enabled}
                    onChange={() => handleOptionalCategoryToggle('extras')}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="extras" className="ml-2 block text-sm text-gray-900">
                    Extras
                  </label>
                </div>
                {menuForm.extras.enabled && (
                  <div className="ml-6 space-y-4">
                    {menuForm.extras.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className={labelStyles}>Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleOptionalItemChange('extras', index, 'name', e.target.value)}
                            className={inputStyles}
                            placeholder="Enter extra item name"
                          />
                        </div>
                        <div>
                          <label className={labelStyles}>Price</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => handleOptionalItemChange('extras', index, 'price', Number(e.target.value))}
                              className={inputStyles}
                              placeholder="Enter price"
                              min="0"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleAddOptionalItem('extras')}
                                className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                              >
                                +
                              </button>
                              {menuForm.extras.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOptionalItem('extras', index)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Save Menu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
