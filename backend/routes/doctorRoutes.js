const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// POST /add-doctor
router.post('/add-doctor', async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add doctor', details: err.message });
  }
});

// GET /list-doctor-with-filter
router.get('/list-doctor-with-filter', async (req, res) => {
  const {
    page = 1,
    limit = 10,
    gender,
    availability,
    minFee,
    maxFee,
    language,
    mode_of_consult,
    specialty,
    hospital,
    search,  // Add search parameter for name or specialty
  } = req.query;

  const filter = {};

  // Apply filters if specified
  if (gender) {
    const genders = gender.split(',');  // Support multiple gender values
    filter.gender = { $in: genders };  // MongoDB $in operator
  }

  if (availability) filter.availability = availability;
  if (specialty) filter.specialty = specialty;
  if (hospital) filter.hospital = hospital;
  if (mode_of_consult) filter.mode_of_consult = mode_of_consult;

  // Language filter allows multiple languages (comma separated)
  if (language) {
    const langs = language.split(',');
    filter.language = { $in: langs };
  }

  // Fee filter
  if (minFee || maxFee) filter.consultation_fee = {};
  if (minFee) filter.consultation_fee.$gte = parseInt(minFee);
  if (maxFee) filter.consultation_fee.$lte = parseInt(maxFee);

  // Search filter: Search by name or specialty
  if (search) {
    const searchRegex = new RegExp(search, 'i');  // Case-insensitive search
    filter.$or = [
      { name: { $regex: searchRegex } },
      { specialty: { $regex: searchRegex } },
    ];
  }

  try {
    // Fetch doctors based on filters, pagination applied
    const doctors = await Doctor.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await Doctor.countDocuments(filter);

    // Return the response with total count, doctors on current page, and pagination info
    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      doctors,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors', details: err.message });
  }
});

module.exports = router;
