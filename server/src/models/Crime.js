import mongoose from 'mongoose';
import { CRIME_TYPES, SEVERITIES, CASE_STATUSES, REPORTING_SOURCES } from '../config/constants.js';

const crimeSchema = new mongoose.Schema(
  {
    crimeId: {
      type: String,
      required: [true, 'Please add a crime ID'],
      unique: true,
      index: true,
    },
    crimeType: {
      type: String,
      required: [true, 'Please add a crime type'],
      enum: CRIME_TYPES,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    time: {
      type: String,
      required: [true, 'Please add a time (HH:mm format)'],
      match: [/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Please add a valid time'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      index: true,
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
    },
    latitude: {
      type: Number,
      required: [true, 'Please add latitude'],
    },
    longitude: {
      type: Number,
      required: [true, 'Please add longitude'],
    },
    severity: {
      type: String,
      required: [true, 'Please add severity'],
      enum: SEVERITIES,
    },
    caseStatus: {
      type: String,
      required: [true, 'Please add case status'],
      enum: CASE_STATUSES,
      default: 'Under Investigation',
    },
    reportingSource: {
      type: String,
      required: [true, 'Please add reporting source'],
      enum: REPORTING_SOURCES,
    }
  },
  {
    timestamps: true,
  }
);

// Compound indexes for analytics and common queries
crimeSchema.index({ city: 1, crimeType: 1 });
crimeSchema.index({ date: 1, city: 1 });
crimeSchema.index({ date: 1, crimeType: 1 });

const Crime = mongoose.model('Crime', crimeSchema);
export default Crime;
