const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/settings - Fetch public settings
router.get('/', (req, res) => {
  const settings = db.getSettings();
  res.json(settings);
});

// PUT /api/settings - Update settings (Admin authenticated)
router.put('/', auth, (req, res) => {
  try {
    const currentSettings = db.getSettings();
    const updateData = req.body;

    const updatedSettings = {
      ...currentSettings,
      phone: updateData.phone !== undefined ? updateData.phone : currentSettings.phone,
      whatsappNumber: updateData.whatsappNumber !== undefined ? updateData.whatsappNumber : currentSettings.whatsappNumber,
      email: updateData.email !== undefined ? updateData.email : currentSettings.email,
      address: updateData.address !== undefined ? updateData.address : currentSettings.address,
      officeHours: updateData.officeHours !== undefined ? updateData.officeHours : currentSettings.officeHours,
      socials: {
        ...currentSettings.socials,
        ...(updateData.socials || {})
      }
    };

    db.saveSettings(updatedSettings);
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Internal server error while saving settings' });
  }
});

module.exports = router;
