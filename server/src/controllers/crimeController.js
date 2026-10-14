import Crime from '../models/Crime.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';

export const getCrimes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};

    // Search by crimeId, city, crimeType
    if (req.query.search) {
      query.$or = [
        { crimeId: { $regex: req.query.search, $options: 'i' } },
        { city: { $regex: req.query.search, $options: 'i' } },
        { crimeType: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filters
    if (req.query.crimeType) query.crimeType = req.query.crimeType;
    if (req.query.city) query.city = req.query.city;
    if (req.query.state) query.state = req.query.state;
    if (req.query.severity) query.severity = req.query.severity;
    const status = req.query.caseStatus || req.query.status;
    if (status) query.caseStatus = status;

    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const total = await Crime.countDocuments(query);
    const crimes = await Crime.find(query).skip(startIndex).limit(limit).sort({ date: -1 });

    const pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };

    res.status(200).json({
      success: true,
      message: 'Crimes retrieved successfully',
      data: { crimes, pagination },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getCrime = async (req, res, next) => {
  try {
    const crime = await Crime.findById(req.params.id);
    if (!crime) {
      return next(new ErrorResponse(`Crime not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      message: 'Crime retrieved successfully',
      data: crime,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const createCrime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    // Auto-generate crimeId
    req.body.crimeId = `CR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const crime = await Crime.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Crime created successfully',
      data: crime,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const updateCrime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const crime = await Crime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!crime) {
      return next(new ErrorResponse(`Crime not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Crime updated successfully',
      data: crime,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCrime = async (req, res, next) => {
  try {
    const crime = await Crime.findByIdAndDelete(req.params.id);
    if (!crime) {
      return next(new ErrorResponse(`Crime not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      message: 'Crime deleted successfully',
      data: {},
      error: null
    });
  } catch (error) {
    next(error);
  }
};
