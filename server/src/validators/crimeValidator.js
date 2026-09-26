import { body } from 'express-validator';
import { CRIME_TYPES, SEVERITIES, CASE_STATUSES, REPORTING_SOURCES } from '../config/constants.js';

export const crimeValidator = [
  body('crimeType').isIn(CRIME_TYPES).withMessage(`crimeType must be one of: ${CRIME_TYPES.join(', ')}`),
  body('description').notEmpty().withMessage('Description is required').trim(),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Valid time in HH:mm format is required'),
  body('location').notEmpty().withMessage('Location is required').trim(),
  body('city').notEmpty().withMessage('City is required').trim(),
  body('state').notEmpty().withMessage('State is required').trim(),
  body('latitude').isNumeric().withMessage('Latitude must be a number'),
  body('longitude').isNumeric().withMessage('Longitude must be a number'),
  body('severity').isIn(SEVERITIES).withMessage(`severity must be one of: ${SEVERITIES.join(', ')}`),
  body('caseStatus').optional().isIn(CASE_STATUSES).withMessage(`caseStatus must be one of: ${CASE_STATUSES.join(', ')}`),
  body('reportingSource').isIn(REPORTING_SOURCES).withMessage(`reportingSource must be one of: ${REPORTING_SOURCES.join(', ')}`)
];

export const crimeUpdateValidator = [
  body('crimeType').optional().isIn(CRIME_TYPES).withMessage(`crimeType must be one of: ${CRIME_TYPES.join(', ')}`),
  body('description').optional().notEmpty().withMessage('Description cannot be empty').trim(),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('time').optional().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Valid time in HH:mm format is required'),
  body('location').optional().notEmpty().withMessage('Location cannot be empty').trim(),
  body('city').optional().notEmpty().withMessage('City cannot be empty').trim(),
  body('state').optional().notEmpty().withMessage('State cannot be empty').trim(),
  body('latitude').optional().isNumeric().withMessage('Latitude must be a number'),
  body('longitude').optional().isNumeric().withMessage('Longitude must be a number'),
  body('severity').optional().isIn(SEVERITIES).withMessage(`severity must be one of: ${SEVERITIES.join(', ')}`),
  body('caseStatus').optional().isIn(CASE_STATUSES).withMessage(`caseStatus must be one of: ${CASE_STATUSES.join(', ')}`),
  body('reportingSource').optional().isIn(REPORTING_SOURCES).withMessage(`reportingSource must be one of: ${REPORTING_SOURCES.join(', ')}`)
];
