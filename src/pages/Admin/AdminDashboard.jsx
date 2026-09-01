import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Package, Settings, LogOut, Plus, Trash2, Edit2, Search, 
  X, Check, AlertCircle, Save, Upload, ListPlus, Sliders,
  FolderOpen, Briefcase, PlusCircle, Trash, CheckSquare
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'categories', 'projects', 'settings'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Lists states
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    phone: '',
    phoneMobile: '',
    email: '',
    salesEmail: '',
    whatsappNumber: '',
    address: '',
    officeHours: '',
    googleMapsEmbedUrl: '',
    socials: { facebook: '', linkedin: '', twitter: '' }
  });

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Editing items trackers
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '', brand: 'Suzuco', category: '', description: '', shortDescription: '',
    priceType: 'Price on Request', price: '', availability: 'In Stock', featured: false,
    countingSpeed: 'Below 1000', hopperCapacity: 'Below 200', displayType: 'LED',
    uvDetection: false, mgDetection: false, features: [''], specifications: []
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '', description: '', icon: 'Banknote', benefits: ['']
  });

  const [projectForm, setProjectForm] = useState({
    title: '', client: '', date: '', location: 'Kathmandu', industry: 'Banking',
    description: '', scope: [''], featured: false
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!api.isAdmin()) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [prods, cats, projs, settings] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getProjects(),
        api.getSettings()
      ]);
      
      setProductsList(prods);
      setCategoriesList(cats);
      setProjectsList(projs);

      // Default the category select inside product form to the first available category
      if (cats.length > 0) {
        setProductForm(prev => ({ ...prev, category: cats[0].slug }));
      }

      setSettingsForm({
        phone: settings.contact.phone,
        phoneMobile: settings.contact.phoneMobile,
        email: settings.contact.email,
        salesEmail: settings.contact.salesEmail,
        whatsappNumber: settings.whatsappNumber,
        address: settings.contact.address,
        officeHours: settings.contact.businessHours,
        googleMapsEmbedUrl: settings.contact.googleMapsEmbedUrl,
        socials: {
          facebook: settings.socials.facebook || '',
          linkedin: settings.socials.linkedin || '',
          twitter: settings.socials.twitter || ''
        }
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data from the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/admin/login');
  };

  // Utility message displayer
  const showToast = (message, type = 'success') => {
    if (type === 'success') {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 4000);
    }
  };

  // --- SETTINGS CONTROLLER ---
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      await api.updateSettings(settingsForm);
      showToast('B2B global contact settings updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update B2B settings', 'error');
    }
  };

  // --- PRODUCT CRUD ---
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', brand: 'Suzuco', category: categoriesList[0]?.slug || '', description: '', shortDescription: '',
      priceType: 'Price on Request', price: '', availability: 'In Stock', featured: false,
      countingSpeed: 'Below 1000', hopperCapacity: 'Below 200', displayType: 'LED',
      uvDetection: false, mgDetection: false, features: [''], specifications: [{ key: 'Counting Speed', value: '1000 notes/min' }]
    });
    setImageFile(null);
    setImagePreview('');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    const specsArray = Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value }));
    setProductForm({
      name: product.name || '',
      brand: product.brand || 'Suzuco',
      category: product.category || categoriesList[0]?.slug || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      priceType: product.priceType || 'Price on Request',
      price: product.price || '',
      availability: product.availability || 'In Stock',
      featured: product.featured || false,
      countingSpeed: product.countingSpeed || 'Below 1000',
      hopperCapacity: product.hopperCapacity || 'Below 200',
      displayType: product.displayType || 'LED',
      uvDetection: product.uvDetection || false,
      mgDetection: product.mgDetection || false,
      features: product.features?.length > 0 ? [...product.features] : [''],
      specifications: specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]
    });
    setImageFile(null);
    setImagePreview(product.images?.[0] || '');
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category) {
      showToast('Product title name and category select are required.', 'error');
      return;
    }
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, val]) => {
      if (key !== 'features' && key !== 'specifications') {
        formData.append(key, val);
      }
    });
    formData.append('features', JSON.stringify(productForm.features.filter(f => f.trim() !== '')));
    
    const specsObj = {};
    productForm.specifications.forEach(s => {
      if (s.key.trim() !== '') specsObj[s.key.trim()] = s.value.trim();
    });
    formData.append('specifications', JSON.stringify(specsObj));
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, formData);
        setProductsList(productsList.map(p => p.id === editingProduct.id ? res : p));
        showToast(`Product "${productForm.name}" updated successfully.`);
      } else {
        const res = await api.createProduct(formData);
        setProductsList([res, ...productsList]);
        showToast(`Product "${productForm.name}" published successfully!`);
      }
      setIsProductModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save product.', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      setProductsList(productsList.filter(p => p.id !== id));
      showToast(`Product "${name}" deleted.`);
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // --- CATEGORY CRUD ---
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', icon: 'Banknote', benefits: [''] });
    setImageFile(null);
    setImagePreview('');
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      description: cat.description || '',
      icon: cat.icon || 'Banknote',
      benefits: cat.benefits?.length > 0 ? [...cat.benefits] : ['']
    });
    setImageFile(null);
    setImagePreview(cat.image || '');
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      showToast('Category name is required.', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('name', categoryForm.name);
    formData.append('description', categoryForm.description);
    formData.append('icon', categoryForm.icon);
    formData.append('benefits', JSON.stringify(categoryForm.benefits.filter(b => b.trim() !== '')));
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingCategory) {
        const res = await api.updateCategory(editingCategory.id, formData);
        setCategoriesList(categoriesList.map(c => c.id === editingCategory.id ? res : c));
        showToast(`Category "${categoryForm.name}" updated successfully.`);
      } else {
        const res = await api.createCategory(formData);
        setCategoriesList([...categoriesList, res]);
        showToast(`Category "${categoryForm.name}" created successfully!`);
      }
      setIsCategoryModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save category.', 'error');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await api.deleteCategory(id);
      setCategoriesList(categoriesList.filter(c => c.id !== id));
      showToast(`Category "${name}" deleted.`);
    } catch (err) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  // --- PROJECT CRUD ---
  const openAddProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: '', client: '', date: '', location: 'Kathmandu', industry: 'Banking',
      description: '', scope: [''], featured: false
    });
    setImageFile(null);
    setImagePreview('');
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title || '',
      client: proj.client || '',
      date: proj.date || '',
      location: proj.location || 'Kathmandu',
      industry: proj.industry || 'Banking',
      description: proj.description || '',
      scope: proj.scope?.length > 0 ? [...proj.scope] : [''],
      featured: proj.featured || false
    });
    setImageFile(null);
    setImagePreview(proj.images?.[0] || '');
    setIsProjectModalOpen(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.title) {
      showToast('Project title is required.', 'error');
      return;
    }
    const formData = new FormData();
    Object.entries(projectForm).forEach(([key, val]) => {
      if (key !== 'scope') formData.append(key, val);
    });
    formData.append('scope', JSON.stringify(projectForm.scope.filter(s => s.trim() !== '')));
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingProject) {
        const res = await api.updateProject(editingProject.id, formData);
        setProjectsList(projectsList.map(p => p.id === editingProject.id ? res : p));
        showToast(`Project "${projectForm.title}" updated successfully.`);
      } else {
        const res = await api.createProject(formData);
        setProjectsList([res, ...projectsList]);
        showToast(`Project "${projectForm.title}" published successfully!`);
      }
      setIsProjectModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save project.', 'error');
    }
  };

  const handleDeleteProject = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete project "${name}"?`)) return;
    try {
      await api.deleteProject(id);
      setProjectsList(projectsList.filter(p => p.id !== id));
      showToast(`Project "${name}" deleted.`);
    } catch (err) {
      showToast(err.message || 'Failed to delete project', 'error');
    }
  };

  // File picker handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-6 gap-4 text-left">
        <div>
          <h1 className="text-3xl font-black text-dark-navy tracking-tight">PORTAL WORKSPACE</h1>
          <p className="text-slate-500 text-sm font-semibold mt-1">Manage B2B products, categories, clients, and corporate configurations</p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 font-extrabold text-sm px-4 py-2.5 rounded-lg transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {[
          { id: 'products', label: 'Products', icon: Package },
          { id: 'categories', label: 'Categories', icon: FolderOpen },
          { id: 'projects', label: 'Projects', icon: Briefcase },
          { id: 'settings', label: 'B2B Settings', icon: Settings }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setSearchTerm(''); }}
              className={`py-3 px-6 text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-primary-navy text-primary-navy font-black'
                  : 'border-transparent text-slate-500 hover:text-primary-navy'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* TOAST ALERTS */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl p-4 text-sm flex items-center space-x-2.5 max-w-2xl mx-auto shadow-sm">
          <Check className="h-5 w-5 flex-shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-4 text-sm flex items-center space-x-2.5 max-w-2xl mx-auto shadow-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-navy rounded-full animate-spin"></div>
          <span className="text-slate-500 font-bold text-sm">Syncing local JSON database tables...</span>
        </div>
      ) : (
        <div className="text-left">
          
          {/* TAB 1: PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 h-10" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products by title, category, brand..."
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-semibold text-dark-navy"
                  />
                </div>
                <button
                  onClick={openAddProductModal}
                  className="bg-primary-navy hover:bg-blue-accent text-white font-extrabold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center space-x-2 uppercase tracking-wide"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50 text-xs font-bold text-dark-navy uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-4">Product Name</th>
                      <th scope="col" className="px-6 py-4">Category</th>
                      <th scope="col" className="px-6 py-4">Brand</th>
                      <th scope="col" className="px-6 py-4">Availability</th>
                      <th scope="col" className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100 text-slate-600 font-semibold">
                    {productsList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3.5">
                          <div className="h-11 w-11 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center flex-shrink-0">
                            <img src={prod.images?.[0]} alt="" className="object-contain h-9 w-9" onError={(e) => e.target.src = '/images/products/counter-1.png'} />
                          </div>
                          <span className="font-bold text-dark-navy text-sm truncate max-w-xs">{prod.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{prod.category.replace('-', ' ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{prod.brand}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            prod.availability === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>{prod.availability}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                          <button onClick={() => openEditProductModal(prod)} className="h-8 w-8 text-primary-navy hover:bg-blue-50 rounded-lg inline-flex items-center justify-center transition-colors"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteProduct(prod.id, prod.name)} className="h-8 w-8 text-rose-600 hover:bg-rose-50 rounded-lg inline-flex items-center justify-center transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES CRUD */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-dark-navy uppercase tracking-wider">PRODUCT CATEGORIES</h3>
                <button
                  onClick={openAddCategoryModal}
                  className="bg-primary-navy hover:bg-blue-accent text-white font-extrabold text-sm px-5 py-2.5 rounded-lg shadow-sm flex items-center justify-center space-x-2 uppercase tracking-wide"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Category</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50 text-xs font-bold text-dark-navy uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-4">Category Name</th>
                      <th scope="col" className="px-6 py-4">Icon Identifier</th>
                      <th scope="col" className="px-6 py-4">Benefits Count</th>
                      <th scope="col" className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100 text-slate-600 font-semibold">
                    {categoriesList.map(cat => (
                      <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3.5">
                          <div className="h-11 w-11 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center flex-shrink-0">
                            <img src={cat.image} alt="" className="object-contain h-9 w-9" onError={(e) => e.target.src = '/images/products/counter-1.png'} />
                          </div>
                          <span className="font-bold text-dark-navy text-sm">{cat.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{cat.icon}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{cat.benefits?.length || 0} bullets</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                          <button onClick={() => openEditCategoryModal(cat)} className="h-8 w-8 text-primary-navy hover:bg-blue-50 rounded-lg inline-flex items-center justify-center transition-colors"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="h-8 w-8 text-rose-600 hover:bg-rose-50 rounded-lg inline-flex items-center justify-center transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS CRUD */}
          {activeTab === 'projects' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-dark-navy uppercase tracking-wider">PORTFOLIO PROJECTS</h3>
                <button
                  onClick={openAddProjectModal}
                  className="bg-primary-navy hover:bg-blue-accent text-white font-extrabold text-sm px-5 py-2.5 rounded-lg shadow-sm flex items-center justify-center space-x-2 uppercase tracking-wide"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publish Project</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50 text-xs font-bold text-dark-navy uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-4">Project Title</th>
                      <th scope="col" className="px-6 py-4">Client</th>
                      <th scope="col" className="px-6 py-4">Industry</th>
                      <th scope="col" className="px-6 py-4">Featured</th>
                      <th scope="col" className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100 text-slate-600 font-semibold">
                    {projectsList.map(proj => (
                      <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3.5">
                          <div className="h-11 w-11 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center flex-shrink-0">
                            <img src={proj.images?.[0]} alt="" className="object-contain h-9 w-9" onError={(e) => e.target.src = '/images/products/counter-1.png'} />
                          </div>
                          <span className="font-bold text-dark-navy text-sm truncate max-w-xs">{proj.title}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{proj.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{proj.industry}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {proj.featured ? (
                            <span className="inline-flex items-center text-xs font-bold text-primary-navy">
                              <Check className="h-4 w-4 mr-0.5 text-emerald-500 stroke-[3px]" /> Yes
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                          <button onClick={() => openEditProjectModal(proj)} className="h-8 w-8 text-primary-navy hover:bg-blue-50 rounded-lg inline-flex items-center justify-center transition-colors"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteProject(proj.id, proj.title)} className="h-8 w-8 text-rose-600 hover:bg-rose-50 rounded-lg inline-flex items-center justify-center transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: B2B CONTACT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-8 max-w-4xl mx-auto">
              <h2 className="text-xl font-black text-dark-navy mb-6 border-b border-slate-100 pb-3 flex items-center space-x-2 uppercase tracking-wide">
                <Settings className="h-5.5 w-5.5 text-primary-navy" />
                <span>B2B CONTACT CONFIGURATIONS</span>
              </h2>

              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-navy uppercase tracking-wider">Office Landline</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      placeholder="+977 1 4440000"
                      className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-semibold text-dark-navy"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-navy uppercase tracking-wider">Mobile Support Phone</label>
                    <input
                      type="text"
                      value={settingsForm.phoneMobile}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phoneMobile: e.target.value })}
                      placeholder="+977 9851100000"
                      className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-semibold text-dark-navy"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-navy uppercase tracking-wider">WhatsApp Number (e.g. 9851100000)</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      placeholder="9851100000"
                      className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-semibold text-dark-navy"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-navy uppercase tracking-wider">General Email Address</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      placeholder="info@bankingautomation.com.np"
                      className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-semibold text-dark-navy"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-navy uppercase tracking-wider">Sales Email Address</label>
                    <input
                      type="email"
                      value={settingsForm.salesEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, salesEmail: e.target.value })}
                      placeholder="sales@bankingautomation.com.np"
                      className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-semibold text-dark-navy"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-navy uppercase tracking-wider">Office Address Location</label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      placeholder="Putalisadak-28, Kathmandu, Nepal"
                      className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-semibold text-dark-navy"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-navy uppercase tracking-wider">Business Operating Hours</label>
                    <input
                      type="text"
                      value={settingsForm.officeHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, officeHours: e.target.value })}
                      placeholder="Sunday - Friday: 9:30 AM - 5:30 PM"
                      className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-semibold text-dark-navy"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-dark-navy uppercase tracking-wider">Google Maps Embed URL</label>
                    <textarea
                      rows="2"
                      value={settingsForm.googleMapsEmbedUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsEmbedUrl: e.target.value })}
                      className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-mono text-dark-navy"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    className="bg-primary-navy hover:bg-blue-accent text-white font-extrabold text-sm px-8 py-3.5 rounded-lg shadow transition-colors flex items-center space-x-2 uppercase tracking-wide"
                  >
                    <Save className="h-4.5 w-4.5" />
                    <span>Save Config Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* --- ADD/EDIT PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left">
            <div className="bg-dark-navy p-5 text-white flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-wider">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Automation Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-primary-navy uppercase tracking-widest border-b pb-2">Basic Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Product Name *</label>
                    <input type="text" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Brand</label>
                    <input type="text" value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Category *</label>
                    <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg bg-white">
                      {categoriesList.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Stock Status</label>
                    <select value={productForm.availability} onChange={e => setProductForm({ ...productForm, availability: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg bg-white">
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Price Label</label>
                    <input type="text" value={productForm.priceType} onChange={e => setProductForm({ ...productForm, priceType: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Short Description</label>
                    <textarea rows="2" value={productForm.shortDescription} onChange={e => setProductForm({ ...productForm, shortDescription: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Detailed Description</label>
                    <textarea rows="2" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" />
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center space-x-2 text-xs font-bold text-dark-navy cursor-pointer">
                    <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm({ ...productForm, featured: e.target.checked })} className="h-4 w-4" />
                    <span>Featured Product</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-dark-navy cursor-pointer">
                    <input type="checkbox" checked={productForm.uvDetection} onChange={e => setProductForm({ ...productForm, uvDetection: e.target.checked })} className="h-4 w-4" />
                    <span>UV Sensor</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-dark-navy cursor-pointer">
                    <input type="checkbox" checked={productForm.mgDetection} onChange={e => setProductForm({ ...productForm, mgDetection: e.target.checked })} className="h-4 w-4" />
                    <span>MG Sensor</span>
                  </label>
                </div>
              </div>

              {/* Specifications Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-extrabold text-primary-navy uppercase tracking-widest flex items-center space-x-1"><Sliders className="h-4 w-4" /><span>Technical Specifications</span></h4>
                  <button type="button" onClick={() => setProductForm({ ...productForm, specifications: [...productForm.specifications, { key: '', value: '' }] })} className="text-[10px] bg-slate-50 border px-2 py-1 rounded font-bold">Add Row</button>
                </div>
                <div className="space-y-2">
                  {productForm.specifications.map((s, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <input type="text" value={s.key} onChange={e => { const u = [...productForm.specifications]; u[idx].key = e.target.value; setProductForm({ ...productForm, specifications: u }); }} placeholder="Specification parameter name" className="flex-1 text-xs p-2 border rounded-lg" />
                      <input type="text" value={s.value} onChange={e => { const u = [...productForm.specifications]; u[idx].value = e.target.value; setProductForm({ ...productForm, specifications: u }); }} placeholder="Value (e.g. 5.8 kg)" className="flex-1 text-xs p-2 border rounded-lg" />
                      <button type="button" onClick={() => setProductForm({ ...productForm, specifications: productForm.specifications.filter((_, i) => i !== idx) })} className="text-rose-600"><Trash className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-extrabold text-primary-navy uppercase tracking-widest flex items-center space-x-1"><ListPlus className="h-4 w-4" /><span>Product Features</span></h4>
                  <button type="button" onClick={() => setProductForm({ ...productForm, features: [...productForm.features, ''] })} className="text-[10px] bg-slate-50 border px-2 py-1 rounded font-bold">Add Bullet</button>
                </div>
                <div className="space-y-2">
                  {productForm.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <span className="text-xs text-slate-400 font-bold w-4">#{idx+1}</span>
                      <input type="text" value={feat} onChange={e => { const u = [...productForm.features]; u[idx] = e.target.value; setProductForm({ ...productForm, features: u }); }} placeholder="Enter machine feature..." className="flex-1 text-xs p-2 border rounded-lg" />
                      <button type="button" onClick={() => setProductForm({ ...productForm, features: productForm.features.filter((_, i) => i !== idx) })} className="text-rose-600"><Trash className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload image */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-primary-navy uppercase tracking-widest border-b pb-2">Product Graphic</h4>
                <div className="flex items-center gap-6">
                  <div className="flex-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer relative bg-slate-50">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-dark-navy">Click to change product image</p>
                  </div>
                  {imagePreview && (
                    <div className="w-24 h-24 border rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2"><img src={imagePreview} alt="" className="object-contain max-h-full" /></div>
                  )}
                </div>
              </div>

              <div className="border-t pt-5 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="bg-slate-100 text-xs px-5 py-2.5 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="bg-primary-navy text-white text-xs px-5 py-2.5 rounded-lg font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT CATEGORY MODAL --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left">
            <div className="bg-dark-navy p-5 text-white flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-wider">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleCategorySubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Category Name *</label>
                    <input type="text" required value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Icon Class (from Lucide)</label>
                    <select value={categoryForm.icon} onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg bg-white bg-no-repeat">
                      <option value="Banknote">Banknote (Cash Counters)</option>
                      <option value="Layers">Layers (Sorters)</option>
                      <option value="ShieldAlert">ShieldAlert (Detectors)</option>
                      <option value="Users">Users (Queue Systems)</option>
                      <option value="Ticket">Ticket (Token keypads)</option>
                      <option value="Tv">Tv (LED Displays)</option>
                      <option value="Printer">Printer (Ticket Printer)</option>
                      <option value="Bell">Bell (School Bell)</option>
                      <option value="Cpu">Cpu (Other Automation)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Brief Description</label>
                  <textarea rows="2" value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" />
                </div>
              </div>

              {/* Category Benefits list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-extrabold text-primary-navy uppercase tracking-widest flex items-center space-x-1"><PlusCircle className="h-4 w-4" /><span>Key Advantages / Benefits</span></h4>
                  <button type="button" onClick={() => setCategoryForm({ ...categoryForm, benefits: [...categoryForm.benefits, ''] })} className="text-[10px] bg-slate-50 border px-2 py-1 rounded font-bold">Add Advantage</button>
                </div>
                <div className="space-y-2">
                  {categoryForm.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <span className="text-xs text-slate-400 font-bold w-4">#{idx+1}</span>
                      <input type="text" value={b} onChange={e => { const u = [...categoryForm.benefits]; u[idx] = e.target.value; setCategoryForm({ ...categoryForm, benefits: u }); }} placeholder="e.g. Save counting processing speeds by 30%..." className="flex-1 text-xs p-2 border rounded-lg" />
                      <button type="button" onClick={() => setCategoryForm({ ...categoryForm, benefits: categoryForm.benefits.filter((_, i) => i !== idx) })} className="text-rose-600"><Trash className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Image upload */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-primary-navy uppercase tracking-widest border-b pb-2">Category Illustration Image</h4>
                <div className="flex items-center gap-6">
                  <div className="flex-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer relative bg-slate-50">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-dark-navy">Click to change category image</p>
                  </div>
                  {imagePreview && (
                    <div className="w-24 h-24 border rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2"><img src={imagePreview} alt="" className="object-contain max-h-full" /></div>
                  )}
                </div>
              </div>

              <div className="border-t pt-5 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="bg-slate-100 text-xs px-5 py-2.5 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="bg-primary-navy text-white text-xs px-5 py-2.5 rounded-lg font-bold">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT PROJECT MODAL --- */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left">
            <div className="bg-dark-navy p-5 text-white flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-wider">
                {editingProject ? `Edit Project: ${editingProject.title}` : 'Publish New Client Project'}
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleProjectSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Project Title *</label>
                    <input type="text" required value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Client Institution</label>
                    <input type="text" value={projectForm.client} onChange={e => setProjectForm({ ...projectForm, client: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" placeholder="e.g. DAO Lalitpur" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Deployment Date</label>
                    <input type="text" value={projectForm.date} onChange={e => setProjectForm({ ...projectForm, date: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" placeholder="e.g. March 2026" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">District Location</label>
                    <input type="text" value={projectForm.location} onChange={e => setProjectForm({ ...projectForm, location: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Client Industry Sector</label>
                    <select value={projectForm.industry} onChange={e => setProjectForm({ ...projectForm, industry: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg bg-white">
                      <option value="Banking">Banking</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Government">Government</option>
                      <option value="Education">Education</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                  <div className="space-y-1 pt-6">
                    <label className="flex items-center space-x-2 text-xs font-bold text-dark-navy cursor-pointer">
                      <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })} className="h-4 w-4" />
                      <span>Feature Case Study on Home</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-dark-navy uppercase tracking-wider">Project Case Study Summary</label>
                  <textarea rows="3" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full text-xs p-2.5 border rounded-lg" />
                </div>
              </div>

              {/* Project scope checklists */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-extrabold text-primary-navy uppercase tracking-widest flex items-center space-x-1"><CheckSquare className="h-4 w-4" /><span>Scope of Work Checklist</span></h4>
                  <button type="button" onClick={() => setProjectForm({ ...projectForm, scope: [...projectForm.scope, ''] })} className="text-[10px] bg-slate-50 border px-2 py-1 rounded font-bold">Add Scope Item</button>
                </div>
                <div className="space-y-2">
                  {projectForm.scope.map((s, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <span className="text-xs text-slate-400 font-bold w-4">#{idx+1}</span>
                      <input type="text" value={s} onChange={e => { const u = [...projectForm.scope]; u[idx] = e.target.value; setProjectForm({ ...projectForm, scope: u }); }} placeholder="e.g. 10x Suzuco BC-100 Counters supplied & wired..." className="flex-1 text-xs p-2 border rounded-lg" />
                      <button type="button" onClick={() => setProjectForm({ ...projectForm, scope: projectForm.scope.filter((_, i) => i !== idx) })} className="text-rose-600"><Trash className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project image upload */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-primary-navy uppercase tracking-widest border-b pb-2">Case Study Banner Image</h4>
                <div className="flex items-center gap-6">
                  <div className="flex-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer relative bg-slate-50">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-dark-navy">Click to upload case study banner</p>
                  </div>
                  {imagePreview && (
                    <div className="w-24 h-24 border rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2"><img src={imagePreview} alt="" className="object-contain max-h-full" /></div>
                  )}
                </div>
              </div>

              <div className="border-t pt-5 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="bg-slate-100 text-xs px-5 py-2.5 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="bg-primary-navy text-white text-xs px-5 py-2.5 rounded-lg font-bold">Publish Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
