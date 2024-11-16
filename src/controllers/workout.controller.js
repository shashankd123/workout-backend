import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import OpenAI from 'openai';
import User from '../models/user.model.js';
import WorkoutHistory from '../models/workout.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '..', '.env') });

// Get API key from environment
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

// Validate API key
if (!OPENROUTER_KEY) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

// Configure OpenAI client
const openai = new OpenAI({
    apiKey: OPENROUTER_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

const SYSTEM_PROMPT = `Generate a 7-day personalized workout plan in JSON format based on the user's information. Follow these rules STRICTLY:

1. Response MUST be a valid JSON object with this EXACT structure for ALL 7 days:
{
    "Monday": {
        "workout": "Workout Type",
        "exercises": [
            {
                "name": "Exercise Name",
                "sets": number,
                "reps": "rep range"
            }
        ]
    },
    "Tuesday": { same structure as Monday },
    "Wednesday": { same structure as Monday },
    "Thursday": { same structure as Monday },
    "Friday": { same structure as Monday },
    "Saturday": { same structure as Monday },
    "Sunday": { same structure as Monday }
}

2. MUST include all 7 days (Monday through Sunday)
3. For rest days, use:
   {
       "workout": "Rest Day",
       "exercises": []
   }

4. Follow these workout volume rules based on time:
   - 30 minutes: 3-4 exercises per workout day
   - 45 minutes: 4-5 exercises per workout day
   - 60 minutes: 5-6 exercises per workout day
   - 90 minutes: 6-7 exercises per workout day

5. Consider:
   - Experience level for exercise complexity
   - Available equipment
   - Fitness goals
   - Any injuries
   - Time constraints
   - Proper rest between muscle groups

6. DO NOT include any additional fields, notes, or explanations
7. ONLY include the fields specified in the example structure above`;

const generateWorkout = async (req, res) => {
    try {
        const {
            userId,
            name,
            gender,
            age,
            height,
            weight,
            experienceLevel,
            fitnessGoal,
            equipmentAccess,
            timeAvailable,
            bodyFatPercentage,
            workoutType,
            injuries
        } = req.body;

        // Validate required fields
        if (!userId || !name || !gender || !age || !height || !weight || !experienceLevel || !fitnessGoal || !equipmentAccess || !timeAvailable) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Convert string values to numbers
        const userProfile = {
            userId,
            name,
            gender,
            age: parseInt(age),
            height: parseInt(height),
            weight: parseInt(weight),
            bfp: bodyFatPercentage ? parseInt(bodyFatPercentage) : undefined,
            experienceLevel,
            fitnessGoal,
            equipmentAccess,
            injuries,
            workoutType,
            timeAvailable
        };

        // Update or create user profile
        await User.findOneAndUpdate(
            { userId: userProfile.userId },
            userProfile,
            { upsert: true, new: true }
        );

        const userPrompt = `Create a personalized workout plan for:
- Name: ${name}
- Gender: ${gender}
- Age: ${age}
- Height: ${height}cm
- Weight: ${weight}kg
- Experience Level: ${experienceLevel}
- Fitness Goal: ${fitnessGoal}
${bodyFatPercentage ? `- Body Fat Percentage: ${bodyFatPercentage}%` : ''}
${workoutType ? `- Workout Type: ${workoutType}` : ''}
- Equipment Access: ${equipmentAccess}
${injuries ? `- Injuries: ${injuries}` : ''}
- Time Available: ${timeAvailable}`;

        console.log("Generating workout plan...");

        const completion = await openai.chat.completions.create({
            model: "anthropic/claude-3.5-sonnet",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            headers: {
                "HTTP-Referer": "https://github.com/openrouter-dev",
                "X-Title": "Workout Generator App"
            }
        });

        console.log('Workout plan generated successfully');
        
        const workoutPlan = JSON.parse(completion.choices[0].message.content);

        // Save workout to history
        await WorkoutHistory.create({
            userId: userProfile.userId,
            workoutPlan,
            userStats: {
                age: userProfile.age,
                weight: userProfile.weight,
                height: userProfile.height,
                bfp: userProfile.bfp,
                experienceLevel: userProfile.experienceLevel,
                fitnessGoal: userProfile.fitnessGoal
            }
        });

        return res.json(workoutPlan);

    } catch (error) {
        console.error('=== Error Details ===');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
        return res.status(500).json({ error: 'Failed to generate workout plan' });
    }
};

export { generateWorkout };
