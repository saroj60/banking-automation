const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const auth = require('../middleware/auth');

// Multer configurations for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET /api/products - Get all products with filters
router.get('/', (req, res) => {
  const products = db.getProducts();
  const { search, category, brand } = req.query;
  
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  if (brand) {
    filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// GET /api/products/:idOrSlug - Get single product by id or slug
router.get('/:idOrSlug', (req, res) => {
  const products = db.getProducts();
  const param = req.params.idOrSlug;
  const product = products.find(p => p.id === param || p.slug === param);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

// POST /api/products - Create a new product (Admin authenticated)
router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    const products = db.getProducts();
    const productData = req.body;

    // Validate fields
    if (!productData.name || !productData.category) {
      return res.status(400).json({ message: 'Name and Category are required fields' });
    }

    const slug = productData.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const id = 'prod-' + Date.now();

    // Check if image uploaded, construct path
    let imageUrl = '/images/products/counter-1.png'; // default placeholder
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }

    // Parse sub-objects
    let specifications = {};
    if (productData.specifications) {
      try {
        specifications = typeof productData.specifications === 'string' 
          ? JSON.parse(productData.specifications) 
          : productData.specifications;
      } catch (e) {
        specifications = {};
      }
    }

    let features = [];
    if (productData.features) {
      try {
        features = typeof productData.features === 'string'
          ? JSON.parse(productData.features)
          : productData.features;
      } catch (e) {
        features = [];
      }
    }

    let applications = [];
    if (productData.applications) {
      try {
        applications = typeof productData.applications === 'string'
          ? JSON.parse(productData.applications)
          : productData.applications;
      } catch (e) {
        applications = [];
      }
    }

    const newProduct = {
      id,
      name: productData.name,
      slug,
      category: productData.category,
      brand: productData.brand || 'BankingAut',
      description: productData.description || '',
      shortDescription: productData.shortDescription || '',
      price: productData.price ? parseFloat(productData.price) : null,
      priceType: productData.priceType || 'Price on Request',
      availability: productData.availability || 'In Stock',
      featured: productData.featured === 'true' || productData.featured === true,
      images: [imageUrl],
      features,
      specifications,
      applications,
      countingSpeed: productData.countingSpeed || 'Below 1000',
      hopperCapacity: productData.hopperCapacity || 'Below 200',
      displayType: productData.displayType || 'LED',
      uvDetection: productData.uvDetection === 'true' || productData.uvDetection === true,
      mgDetection: productData.mgDetection === 'true' || productData.mgDetection === true
    };

    products.push(newProduct);
    db.saveProducts(products);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error while creating product' });
  }
});

// PUT /api/products/:id - Update product (Admin authenticated)
router.put('/:id', auth, upload.single('image'), (req, res) => {
  try {
    const products = db.getProducts();
    const id = req.params.id;
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const currentProduct = products[index];
    const updateData = req.body;

    // Check if new image uploaded
    let images = [...currentProduct.images];
    if (req.file) {
      // Delete old local uploaded file if exists
      const oldImage = currentProduct.images[0];
      if (oldImage && oldImage.startsWith('/uploads/')) {
        const oldFilePath = path.join(__dirname, '..', oldImage);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      images = ['/uploads/' + req.file.filename];
    }

    // Parse JSON strings
    let specifications = currentProduct.specifications;
    if (updateData.specifications) {
      try {
        specifications = typeof updateData.specifications === 'string'
          ? JSON.parse(updateData.specifications)
          : updateData.specifications;
      } catch (e) {}
    }

    let features = currentProduct.features;
    if (updateData.features) {
      try {
        features = typeof updateData.features === 'string'
          ? JSON.parse(updateData.features)
          : updateData.features;
      } catch (e) {}
    }

    let applications = currentProduct.applications;
    if (updateData.applications) {
      try {
        applications = typeof updateData.applications === 'string'
          ? JSON.parse(updateData.applications)
          : updateData.applications;
      } catch (e) {}
    }

    const updatedProduct = {
      ...currentProduct,
      name: updateData.name || currentProduct.name,
      slug: updateData.name 
        ? updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : currentProduct.slug,
      category: updateData.category || currentProduct.category,
      brand: updateData.brand || currentProduct.brand,
      description: updateData.description !== undefined ? updateData.description : currentProduct.description,
      shortDescription: updateData.shortDescription !== undefined ? updateData.shortDescription : currentProduct.shortDescription,
      price: updateData.price ? parseFloat(updateData.price) : currentProduct.price,
      priceType: updateData.priceType || currentProduct.priceType,
      availability: updateData.availability || currentProduct.availability,
      featured: updateData.featured !== undefined 
        ? (updateData.featured === 'true' || updateData.featured === true) 
        : currentProduct.featured,
      images,
      features,
      specifications,
      applications,
      countingSpeed: updateData.countingSpeed || currentProduct.countingSpeed,
      hopperCapacity: updateData.hopperCapacity || currentProduct.hopperCapacity,
      displayType: updateData.displayType || currentProduct.displayType,
      uvDetection: updateData.uvDetection !== undefined 
        ? (updateData.uvDetection === 'true' || updateData.uvDetection === true) 
        : currentProduct.uvDetection,
      mgDetection: updateData.mgDetection !== undefined 
        ? (updateData.mgDetection === 'true' || updateData.mgDetection === true) 
        : currentProduct.mgDetection
    };

    products[index] = updatedProduct;
    db.saveProducts(products);

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error while updating product' });
  }
});

// DELETE /api/products/:id - Delete product (Admin authenticated)
router.delete('/:id', auth, (req, res) => {
  const products = db.getProducts();
  const id = req.params.id;
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const product = products[index];

  // Delete product image file if it is in uploads directory
  product.images.forEach(img => {
    if (img && img.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', img);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        } catch (e) {
          console.error(`Failed to delete file ${filePath}:`, e);
        }
      }
    }
  });

  products.splice(index, 1);
  db.saveProducts(products);

  res.json({ success: true, message: 'Product deleted successfully' });
});

module.exports = router;
