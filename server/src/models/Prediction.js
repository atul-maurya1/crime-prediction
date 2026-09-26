import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    inputFeatures: {
      type: Object,
      required: [true, 'Please provide input features for the prediction'],
    },
    predictedCategory: {
      type: String,
      required: [true, 'Please provide the predicted category'],
    },
    confidence: {
      type: Number,
      required: [true, 'Please provide prediction confidence score'],
    },
    modelVersion: {
      type: String,
      default: 'v1.0',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user ID'],
    }
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;
