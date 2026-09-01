import { products as mockProducts } from '../data/products';
import { SETTINGS as mockSettings } from '../config/settings';

const API_BASE = '/api';

// Helper to get authorization headers
function getAuthHeader() {
  const token = localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
  // --- AUTH SERVICES ---
  async login(username, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      console.error('API Login error:', err);
      throw err;
    }
  },

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  async verifySession() {
    const token = localStorage.getItem('admin_token');
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: getAuthHeader()
      });
      return res.ok;
    } catch (err) {
      // If server offline, assume true if token exists just for local demonstration robustness
      return true;
    }
  },

  isAdmin() {
    return !!localStorage.getItem('admin_token');
  },

  // --- PRODUCTS CRUD SERVICES ---
  async getProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.brand) queryParams.append('brand', filters.brand);

      const url = `${API_BASE}/products?${queryParams.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('Backend server offline. Falling back to local products mock database.', err);
      // Filter mock products in client-side to emulate API behavior
      let filtered = [...mockProducts];
      if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      if (filters.brand) {
        filtered = filtered.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
        );
      }
      return filtered;
    }
  },

  async getProduct(idOrSlug) {
    try {
      const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (err) {
      console.warn(`Backend offline. Finding product slug "${idOrSlug}" in mock database.`);
      const found = mockProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (!found) throw new Error('Product not found in mock database');
      return found;
    }
  },

  async createProduct(formData) {
    // Note: formData should be a FormData instance to handle multipart image uploads
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeader(), // Do NOT add Content-Type, browser will set it with boundary
      body: formData
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create product');
    return data;
  },

  async updateProduct(id, formData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: formData
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete product');
    return data;
  },

  // --- SETTINGS SERVICES ---
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const apiSettings = await res.json();
      
      // Merge fetched settings into mock settings schema
      return {
        ...mockSettings,
        whatsappNumber: apiSettings.whatsappNumber || mockSettings.whatsappNumber,
        contact: {
          ...mockSettings.contact,
          phone: apiSettings.phone || mockSettings.contact.phone,
          phoneMobile: apiSettings.phoneMobile || mockSettings.contact.phoneMobile,
          email: apiSettings.email || mockSettings.contact.email,
          salesEmail: apiSettings.salesEmail || mockSettings.contact.salesEmail,
          address: apiSettings.address || mockSettings.contact.address,
          businessHours: apiSettings.officeHours || mockSettings.contact.businessHours,
          googleMapsEmbedUrl: apiSettings.googleMapsEmbedUrl || mockSettings.contact.googleMapsEmbedUrl
        },
        socials: {
          ...mockSettings.socials,
          facebook: apiSettings.socials?.facebook || mockSettings.socials.facebook,
          linkedin: apiSettings.socials?.linkedin || mockSettings.socials.linkedin,
          twitter: apiSettings.socials?.twitter || mockSettings.socials.twitter,
          whatsappDirect: `https://wa.me/977${apiSettings.whatsappNumber || '9851100000'}`
        }
      };
    } catch (err) {
      console.warn('Backend server offline. Falling back to local configuration settings.', err);
      return mockSettings;
    }
  },

  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(settingsData)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update settings');
    return data;
  },

  // --- CATEGORIES CRUD SERVICES ---
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch (err) {
      console.warn('Backend server offline. Falling back to local static categories.', err);
      const { categories: mockCats } = await import('../data/categories');
      return mockCats;
    }
  },

  async getCategory(idOrSlug) {
    try {
      const res = await fetch(`${API_BASE}/categories/${idOrSlug}`);
      if (!res.ok) throw new Error('Category not found');
      return await res.json();
    } catch (err) {
      console.warn(`Backend offline. Finding category slug "${idOrSlug}" in mock database.`);
      const { categories: mockCats } = await import('../data/categories');
      const found = mockCats.find(c => c.id === idOrSlug || c.slug === idOrSlug);
      if (!found) throw new Error('Category not found in mock database');
      return found;
    }
  },

  async createCategory(formData) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create category');
    return data;
  },

  async updateCategory(id, formData) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update category');
    return data;
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete category');
    return data;
  },

  // --- PROJECTS CRUD SERVICES ---
  async getProjects() {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      return await res.json();
    } catch (err) {
      console.warn('Backend server offline. Falling back to local static projects.', err);
      const { projects: mockProjs } = await import('../data/projects');
      return mockProjs;
    }
  },

  async getProject(idOrSlug) {
    try {
      const res = await fetch(`${API_BASE}/projects/${idOrSlug}`);
      if (!res.ok) throw new Error('Project not found');
      return await res.json();
    } catch (err) {
      console.warn(`Backend offline. Finding project slug "${idOrSlug}" in mock database.`);
      const { projects: mockProjs } = await import('../data/projects');
      const found = mockProjs.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (!found) throw new Error('Project not found in mock database');
      return found;
    }
  },

  async createProject(formData) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create project');
    return data;
  },

  async updateProject(id, formData) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update project');
    return data;
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete project');
    return data;
  }
};
