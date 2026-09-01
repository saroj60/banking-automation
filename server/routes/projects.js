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
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

// GET /api/projects - Get all projects
router.get('/', (req, res) => {
  res.json(db.getProjects());
});

// GET /api/projects/:idOrSlug
router.get('/:idOrSlug', (req, res) => {
  const projects = db.getProjects();
  const param = req.params.idOrSlug;
  const project = projects.find(p => p.id === param || p.slug === param);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

// POST /api/projects - Create project (Admin authenticated)
router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    const projects = db.getProjects();
    const data = req.body;

    if (!data.title) return res.status(400).json({ message: 'Project title is required' });

    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const id = 'proj-' + Date.now();

    let imageUrl = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop';
    if (req.file) imageUrl = '/uploads/' + req.file.filename;

    let scope = [];
    if (data.scope) {
      try {
        scope = typeof data.scope === 'string' ? JSON.parse(data.scope) : data.scope;
      } catch (e) {
        scope = [];
      }
    }

    const newProject = {
      id,
      title: data.title,
      slug,
      location: data.location || 'Kathmandu',
      industry: data.industry || 'Banking',
      description: data.description || '',
      images: [imageUrl],
      featured: data.featured === 'true' || data.featured === true,
      client: data.client || '',
      date: data.date || '',
      scope
    };

    projects.push(newProject);
    db.saveProjects(projects);

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal server error while creating project' });
  }
});

// PUT /api/projects/:id - Update project (Admin authenticated)
router.put('/:id', auth, upload.single('image'), (req, res) => {
  try {
    const projects = db.getProjects();
    const id = req.params.id;
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) return res.status(404).json({ message: 'Project not found' });

    const current = projects[index];
    const data = req.body;

    let images = [...current.images];
    if (req.file) {
      // delete old uploaded file if exists
      const oldImage = current.images[0];
      if (oldImage && oldImage.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', oldImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      images = ['/uploads/' + req.file.filename];
    }

    let scope = current.scope;
    if (data.scope) {
      try {
        scope = typeof data.scope === 'string' ? JSON.parse(data.scope) : data.scope;
      } catch (e) {}
    }

    const updated = {
      ...current,
      title: data.title || current.title,
      slug: data.title 
        ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : current.slug,
      location: data.location !== undefined ? data.location : current.location,
      industry: data.industry !== undefined ? data.industry : current.industry,
      description: data.description !== undefined ? data.description : current.description,
      images,
      featured: data.featured !== undefined 
        ? (data.featured === 'true' || data.featured === true) 
        : current.featured,
      client: data.client !== undefined ? data.client : current.client,
      date: data.date !== undefined ? data.date : current.date,
      scope
    };

    projects[index] = updated;
    db.saveProjects(projects);

    res.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Internal server error while updating project' });
  }
});

// DELETE /api/projects/:id - Delete project (Admin authenticated)
router.delete('/:id', auth, (req, res) => {
  const projects = db.getProjects();
  const id = req.params.id;
  const index = projects.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).json({ message: 'Project not found' });

  const current = projects[index];

  // delete project image if it is an uploaded file
  current.images.forEach(img => {
    if (img && img.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', img);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error(e);
        }
      }
    }
  });

  projects.splice(index, 1);
  db.saveProjects(projects);

  res.json({ success: true, message: 'Project deleted successfully' });
});

module.exports = router;
