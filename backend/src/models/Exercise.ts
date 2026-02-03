import mongoose, { Schema, Document } from 'mongoose';

// Allowed exercise names - extend this list as needed
export const EXERCISE_NAMES = ['Deadlift', 'Power Clean'] as const;
export type ExerciseName = typeof EXERCISE_NAMES[number];

export interface IExercise extends Document {
  userId: string;
  name: ExerciseName;
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
    required: true,
    enum: {
      values: EXERCISE_NAMES,
      message: '{VALUE} is not a valid exercise. Allowed exercises: ' + EXERCISE_NAMES.join(', ')
    }
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