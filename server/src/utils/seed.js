import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Crime from '../models/Crime.js';
import Prediction from '../models/Prediction.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await User.deleteMany({});
    await Crime.deleteMany({});
    await Prediction.deleteMany({});

    console.log('✓ Collections cleared');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@crimeanalysis.org',
      password: 'Admin@123456',
      role: 'admin'
    });
    console.log(`✓ Admin created: ${admin.email}`);

    // Create Demo User
    const user = await User.create({
      name: 'Demo User',
      email: 'user@crimeanalysis.org',
      password: 'User@123456',
      role: 'user'
    });
    console.log(`✓ Demo user created: ${user.email}`);

    // Read and parse CSV - go up from server/src/utils to project root
    const projectRoot = path.resolve(__dirname, '../../../');
    const csvPath = path.join(projectRoot, 'dataset', 'crime_data.csv');

    if (fs.existsSync(csvPath)) {
      const csvData = fs.readFileSync(csvPath, 'utf8');
      const lines = csvData.split('\n');

      if (lines.length > 1) {
        const headers = lines[0].split(',').map(h => h.trim());
        const crimes = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Parse CSV row - handle potential commas in quoted fields
          const values = [];
          let current = '';
          let inQuotes = false;
          for (const char of line) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());

          if (values.length === headers.length) {
            const crimeObj = {};
            headers.forEach((header, index) => {
              crimeObj[header] = values[index];
            });

            // Convert types
            if (crimeObj.latitude) crimeObj.latitude = parseFloat(crimeObj.latitude);
            if (crimeObj.longitude) crimeObj.longitude = parseFloat(crimeObj.longitude);
            if (crimeObj.date) crimeObj.date = new Date(crimeObj.date);

            crimes.push(crimeObj);
          }
        }

        if (crimes.length > 0) {
          await Crime.insertMany(crimes);
          console.log(`✓ ${crimes.length} crime records seeded from dataset`);
        }
      }
    } else {
      console.log(`⚠ No dataset found at ${csvPath}. Skipping crime data seeding.`);
    }

    console.log('\n✓ Seeding completed successfully');
    console.log('\n--- Default Credentials (Development Only) ---');
    console.log('Admin: admin@crimeanalysis.org / Admin@123456');
    console.log('User:  user@crimeanalysis.org / User@123456');
    process.exit(0);
  } catch (error) {
    console.error(`✗ Error during seeding: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedData();
