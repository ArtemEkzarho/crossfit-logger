import mongoose, { Schema, Document, Types } from 'mongoose';

// Allowed exercise names - extend this list as needed
export const EXERCISE_NAMES = [
  'Deadlift',
  'Power Clean',
  'Bench Press',
  'Front Squat',
  'Back Squat',
  'Push Press',
  'Strict Press',
  'Overhead Squat',
  'Power Snatch',
  'Back Lunges',
  'Push Up',
  'Pull Up',
] as const;
export type ExerciseName = typeof EXERCISE_NAMES[number];

export interface IWeightEntry {
  _id: Types.ObjectId;
  weight: number;
  reps?: number;
  sets?: number;
  notes?: string;
  date: Date;
}

export interface IExercise extends Document {
  userId: string;
  name: ExerciseName;
  weightHistory: IWeightEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const WeightEntrySchema = new Schema<IWeightEntry>({
  weight: {
    type: Number,
    min: [1, 'Weight must be at least 1 kg'],
    max: [300, 'Weight cannot exceed 300 kg'],
  },
  reps: {
    type: Number,
    min: [1, 'Reps must be at least 1'],
    max: [500, 'Reps cannot exceed 500'],
  },
  sets: {
    type: Number,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const ExerciseSchema = new Schema<IExercise>(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      enum: {
        values: EXERCISE_NAMES,
        message: '{VALUE} is not a valid exercise. Allowed exercises: ' + EXERCISE_NAMES.join(', '),
      },
    },
    weightHistory: {
      type: [WeightEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// One exercise per type per user
ExerciseSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);
