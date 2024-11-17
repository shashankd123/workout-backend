import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    age: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    bfp: {
        type: Number,
        required: false
    },
    experienceLevel: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    fitnessGoal: {
        type: String,
        required: true,
        enum: ['Weight Loss', 'Muscle Gain', 'Strength', 'Endurance', 'General Fitness', 'Athletic Performance']
    },
    equipmentAccess: {
        type: String,
        required: true,
        enum: ['No Equipment', 'Basic Home Gym', 'Full Gym Access']
    },
    injuries: {
        type: String,
        required: false
    },
    workoutType: {
        type: String,
        required: false,
        enum: ['Strength Training', 'Cardio', 'HIIT']
    },
    timeAvailable: {
        type: String,
        required: true,
        enum: ['Less than 30 minutes', '30-45 minutes', '45-60 minutes', '60-90 minutes', 'More than 90 minutes']
    },
    personalPreference: {
        type: String,
        required: false
    }
});

const User = mongoose.model('User', userSchema);

export default User;
