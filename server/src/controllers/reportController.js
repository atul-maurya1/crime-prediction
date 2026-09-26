import Crime from '../models/Crime.js';
import { createObjectCsvStringifier } from 'csv-writer';

export const exportCrimesCSV = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.crimeType) query.crimeType = req.query.crimeType;
    if (req.query.city) query.city = req.query.city;
    if (req.query.state) query.state = req.query.state;
    if (req.query.severity) query.severity = req.query.severity;
    
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const crimes = await Crime.find(query).sort({ date: -1 });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'crimeId', title: 'CRIME ID' },
        { id: 'crimeType', title: 'TYPE' },
        { id: 'date', title: 'DATE' },
        { id: 'time', title: 'TIME' },
        { id: 'location', title: 'LOCATION' },
        { id: 'city', title: 'CITY' },
        { id: 'state', title: 'STATE' },
        { id: 'severity', title: 'SEVERITY' },
        { id: 'caseStatus', title: 'STATUS' }
      ]
    });

    const records = crimes.map(crime => ({
      crimeId: crime.crimeId,
      crimeType: crime.crimeType,
      date: crime.date.toISOString().split('T')[0],
      time: crime.time,
      location: crime.location,
      city: crime.city,
      state: crime.state,
      severity: crime.severity,
      caseStatus: crime.caseStatus
    }));

    const header = csvStringifier.getHeaderString();
    const csvContent = csvStringifier.stringifyRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="crimes_export.csv"');
    
    res.status(200).send(header + csvContent);
  } catch (error) {
    next(error);
  }
};
