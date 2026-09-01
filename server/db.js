const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');
const CATEGORIES_FILE = path.join(__dirname, 'data', 'categories.json');
const PROJECTS_FILE = path.join(__dirname, 'data', 'projects.json');

// Helper to safely read a JSON file
function readJsonFile(filePath, defaultVal = []) {
  try {
    if (!fs.existsSync(filePath)) {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2));
      return defaultVal;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading database file ${filePath}:`, error);
    return defaultVal;
  }
}

// Helper to safely write JSON to file (atomic-like writing)
function writeJsonFile(filePath, data) {
  try {
    const tempPath = filePath + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`Error writing database file ${filePath}:`, error);
    return false;
  }
}

module.exports = {
  getProducts: () => readJsonFile(PRODUCTS_FILE, []),
  saveProducts: (products) => writeJsonFile(PRODUCTS_FILE, products),
  
  getSettings: () => readJsonFile(SETTINGS_FILE, {}),
  saveSettings: (settings) => writeJsonFile(SETTINGS_FILE, settings),
  
  getCategories: () => readJsonFile(CATEGORIES_FILE, []),
  saveCategories: (categories) => writeJsonFile(CATEGORIES_FILE, categories),
  
  getProjects: () => readJsonFile(PROJECTS_FILE, []),
  saveProjects: (projects) => writeJsonFile(PROJECTS_FILE, projects)
};
