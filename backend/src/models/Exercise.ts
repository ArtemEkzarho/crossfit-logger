import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  userId: string;
  name: string;
  weight?: number;
  reps?: number;
  sets?: number;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  weight: {
    type: Number
  },
  reps: {
    type: Number
  },
  sets: {
    type: Number
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);