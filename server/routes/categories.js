const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const auth = require('../middleware/auth');

// Multer configs
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
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

// GET /api/categories - Get all categories
router.get('/', (req, res) => {
  res.json(db.getCategories());
});

// GET /api/categories/:idOrSlug
router.get('/:idOrSlug', (req, res) => {
  const categories = db.getCategories();
  const param = req.params.idOrSlug;
  const category = categories.find(c => c.id === param || c.slug === param);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

// POST /api/categories - Create category (Admin authenticated)
router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    const categories = db.getCategories();
    const data = req.body;

    if (!data.name) return res.status(400).json({ message: 'Category name is required' });

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const id = slug; // use slug as id to maintain references

    // Check if category already exists
    if (categories.some(c => c.id === id)) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    let imageUrl = 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop';
    if (req.file) imageUrl = '/uploads/' + req.file.filename;

    let benefits = [];
    if (data.benefits) {
      try {
        benefits = typeof data.benefits === 'string' ? JSON.parse(data.benefits) : data.benefits;
      } catch (e) {
        benefits = [];
      }
    }

    const newCategory = {
      id,
      name: data.name,
      slug,
      description: data.description || '',
      image: imageUrl,
      icon: data.icon || 'Cpu',
      benefits
    };

    categories.push(newCategory);
    db.saveCategories(categories);

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error while creating category' });
  }
});

// PUT /api/categories/:id - Update category (Admin authenticated)
router.put('/:id', auth, upload.single('image'), (req, res) => {
  try {
    const categories = db.getCategories();
    const id = req.params.id;
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) return res.status(404).json({ message: 'Category not found' });

    const current = categories[index];
    const data = req.body;

    let imageUrl = current.image;
    if (req.file) {
      // delete old uploaded file if exists
      if (current.image && current.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', current.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      imageUrl = '/uploads/' + req.file.filename;
    }

    let benefits = current.benefits;
    if (data.benefits) {
      try {
        benefits = typeof data.benefits === 'string' ? JSON.parse(data.benefits) : data.benefits;
      } catch (e) {}
    }

    const updated = {
      ...current,
      name: data.name || current.name,
      description: data.description !== undefined ? data.description : current.description,
      image: imageUrl,
      icon: data.icon || current.icon,
      benefits
    };

    categories[index] = updated;
    db.saveCategories(categories);

    res.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal server error while updating category' });
  }
});

// DELETE /api/categories/:id - Delete category (Admin authenticated)
router.delete('/:id', auth, (req, res) => {
  const categories = db.getCategories();
  const id = req.params.id;
  const index = categories.findIndex(c => c.id === id);

  if (index === -1) return res.status(404).json({ message: 'Category not found' });

  const current = categories[index];

  // delete category image if it is an uploaded file
  if (current.image && current.image.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', current.image);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error(e);
      }
    }
  }

  categories.splice(index, 1);
  db.saveCategories(categories);

  res.json({ success: true, message: 'Category deleted successfully' });
});

module.exports = router;
