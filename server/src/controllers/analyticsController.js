import Crime from '../models/Crime.js';
import ErrorResponse from '../utils/ErrorResponse.js';

const getMatchStage = (req) => {
  const match = {};
  if (req.query.city) match.city = req.query.city;
  if (req.query.crimeType) match.crimeType = req.query.crimeType;
  if (req.query.startDate && req.query.endDate) {
    match.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }
  return match;
};

export const getSummary = async (req, res, next) => {
  try {
    const matchStage = getMatchStage(req);
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalCrimes = await Crime.countDocuments(matchStage);
    const thisMonthCrimes = await Crime.countDocuments({
      ...matchStage,
      date: { $gte: firstDayOfMonth }
    });

    const openCases = await Crime.countDocuments({ ...matchStage, caseStatus: { $in: ['Under Investigation', 'Pending'] } });
    const closedCases = await Crime.countDocuments({ ...matchStage, caseStatus: { $in: ['Solved', 'Closed'] } });

    const mostCommonType = await Crime.aggregate([
      { $match: matchStage },
      { $group: { _id: '$crimeType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const topLocation = await Crime.aggregate([
      { $match: matchStage },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    res.status(200).json({
      success: true,
      message: 'Summary analytics retrieved',
      data: {
        totalCrimes,
        thisMonthCrimes,
        openCases,
        closedCases,
        mostCommonType: mostCommonType[0] ? mostCommonType[0]._id : null,
        topLocation: topLocation[0] ? topLocation[0]._id : null
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req, res, next) => {
  try {
    const matchStage = getMatchStage(req);
    const trends = await Crime.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Trends analytics retrieved',
      data: trends,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getByType = async (req, res, next) => {
  try {
    const matchStage = getMatchStage(req);
    const byType = await Crime.aggregate([
      { $match: matchStage },
      { $group: { _id: '$crimeType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Crime by type analytics retrieved',
      data: byType,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getByLocation = async (req, res, next) => {
  try {
    const matchStage = getMatchStage(req);
    const byLocation = await Crime.aggregate([
      { $match: matchStage },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Crime by location analytics retrieved',
      data: byLocation,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getByTime = async (req, res, next) => {
  try {
    const matchStage = getMatchStage(req);
    const crimes = await Crime.find(matchStage).select('time');
    
    let timeBuckets = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
    
    crimes.forEach(crime => {
      const hour = parseInt(crime.time.split(':')[0]);
      if (hour >= 6 && hour < 12) timeBuckets.Morning++;
      else if (hour >= 12 && hour < 17) timeBuckets.Afternoon++;
      else if (hour >= 17 && hour < 21) timeBuckets.Evening++;
      else timeBuckets.Night++;
    });

    res.status(200).json({
      success: true,
      message: 'Crime by time analytics retrieved',
      data: timeBuckets,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getSeverityAnalysis = async (req, res, next) => {
  try {
    const matchStage = getMatchStage(req);
    const severityData = await Crime.aggregate([
      { $match: matchStage },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Severity analytics retrieved',
      data: severityData,
      error: null
    });
  } catch (error) {
    next(error);
  }
};
