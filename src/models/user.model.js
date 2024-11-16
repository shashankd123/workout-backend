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
        required: true
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
    bfp: Number,
    experienceLevel: {
        type: String,
        required: true
    },
    fitnessGoal: {
        type: String,
        required: true
    },
    equipmentAccess: {
        type: String,
        required: true
    },
    injuries: String,
    workoutType: String,
    timeAvailable: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
export default User;
