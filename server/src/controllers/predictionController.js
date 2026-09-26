import Prediction from '../models/Prediction.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import * as mlService from '../services/mlService.js';

export const createPrediction = async (req, res, next) => {
  try {
    const { city, month, dayOfWeek, hour, severity } = req.body;

    if (!city || month === undefined || dayOfWeek === undefined || hour === undefined) {
      return next(new ErrorResponse('Please provide city, month, dayOfWeek, and hour', 400));
    }

    const inputFeatures = { city, month: parseInt(month), dayOfWeek: parseInt(dayOfWeek), hour: parseInt(hour), severity: severity || 'Medium' };
    
    // Map to ML service expected field names (snake_case)
    const mlInput = {
      city: inputFeatures.city,
      month: inputFeatures.month,
      day_of_week: inputFeatures.dayOfWeek,
      hour: inputFeatures.hour,
      severity: inputFeatures.severity
    };

    // Call ML service
    const mlResponse = await mlService.getPrediction(mlInput);

    const prediction = await Prediction.create({
      inputFeatures,
      predictedCategory: mlResponse.predictedCategory,
      confidence: mlResponse.confidence,
      modelVersion: mlResponse.modelVersion || '1.0',
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Prediction generated successfully',
      data: prediction,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getPredictions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = { createdBy: req.user.id };

    const total = await Prediction.countDocuments(query);
    const predictions = await Prediction.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Predictions retrieved successfully',
      data: {
        predictions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getPrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!prediction) {
      return next(new ErrorResponse(`Prediction not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Prediction retrieved successfully',
      data: prediction,
      error: null
    });
  } catch (error) {
    next(error);
  }
};
