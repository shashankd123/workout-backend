import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true
    },
    reps: {
        type: String,
        required: true
    }
});

const workoutDaySchema = new mongoose.Schema({
    workout: {
        type: String,
        required: true
    },
    exercises: [exerciseSchema]
});

const workoutHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    workoutPlan: {
        type: Map,
        of: workoutDaySchema,
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    userStats: {
        age: Number,
        weight: Number,
        height: Number,
        bfp: Number,
        experienceLevel: String,
        fitnessGoal: String,
        personalPreference: String  // Added new field
    }
});

const WorkoutHistory = mongoose.model('WorkoutHistory', workoutHistorySchema);

export default WorkoutHistory;
