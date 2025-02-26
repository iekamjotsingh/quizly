import { Question } from '../types';
import { getAnsweredQuestions } from '../lib/firestore';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getQuestions = async (
  userId: string,
  subject: string,
  grade: string,
  difficulty: string,
  numberOfQuestions: number
): Promise<Question[]> => {
  try {
    // Get previously answered questions
    const answeredQuestions = await getAnsweredQuestions(userId, subject, grade);
    
    // Create a system message that includes information about previously answered questions
    const systemMessage = `You are a quiz generator. Generate ${numberOfQuestions} multiple-choice questions for ${grade} level ${subject} with ${difficulty} difficulty.

Your response must be a valid JSON array of question objects. Each question object must have exactly these properties:
- question: string (the question text)
- options: string[] (array of 4 possible answers)
- correctAnswer: string (must be one of the options)

Example format:
[
  {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": "4"
  }
]

${answeredQuestions.length > 0 ? `
Previously answered questions to avoid:
${answeredQuestions
  .filter(q => q.isCorrect)
  .map(q => q.question)
  .join('\n')}
` : ''}

Respond only with the JSON array, no additional text.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "You are a quiz generator that responds only with valid JSON arrays containing question objects."
          },
          { role: "user", content: systemMessage }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content in response');
      }

      console.log('OpenAI response:', content); // For debugging

      // Try to clean the response if needed
      const cleanedContent = content.trim().replace(/^```json\n?|\n?```$/g, '');
      
      // Parse the response to get questions
      const parsedContent = JSON.parse(cleanedContent);
      
      // Validate the structure
      if (!Array.isArray(parsedContent)) {
        throw new Error('Response is not an array');
      }

      const questions = parsedContent.map(q => {
        if (!q.question || !Array.isArray(q.options) || !q.correctAnswer) {
          throw new Error('Invalid question format');
        }
        return {
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        };
      });
      
      return questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      if (error instanceof SyntaxError) {
        console.error('Invalid JSON response from OpenAI');
      }
      throw new Error('Failed to generate questions');
    }
  } catch (error) {
    console.error('Error in getQuestions:', error);
    throw error;
  }
};