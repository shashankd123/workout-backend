const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { generateWorkout } = require('../controllers/workout.controller');

// Validation middleware
const validateWorkoutRequest = [
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('age').notEmpty().withMessage('Age is required'),
    body('height').notEmpty().withMessage('Height is required'),
    body('weight').notEmpty().withMessage('Weight is required'),
    body('experienceLevel').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid experience level'),
    body('fitnessGoal').isIn([
        'Weight Loss', 'Muscle Gain', 'Strength', 'Endurance', 
        'General Fitness', 'Athletic Performance'
    ]).withMessage('Invalid fitness goal'),
    body('equipmentAccess').isIn([
        'No Equipment', 'Basic Home Gym', 'Full Gym Access'
    ]).withMessage('Invalid equipment access'),
    body('preferredWorkoutTypes').isIn([
        'Strength Training', 'Cardio', 'HIIT'
    ]).withMessage('Invalid workout type'),
    body('timeAvailable').isIn([
        'Less than 30 minutes', '30-45 minutes', '45-60 minutes',
        '60-90 minutes', 'More than 90 minutes'
    ]).withMessage('Invalid time available')
];

router.post('/generate-workout', validateWorkoutRequest, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    generateWorkout(req, res, next);
});

module.exports = router;
