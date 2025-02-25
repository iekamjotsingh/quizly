import { Question } from '../types';
import { openai } from '../lib';
import { getUnusedQuestions, markQuestionAsUsed, saveQuestion } from '../lib/firestore';
import { QuestionBank } from '../types';

export const getQuestions = async (
  userId: string,
  subject: string,
  grade: string,
  difficulty: string,
  numberOfQuestions: number
): Promise<Question[]> => {
  try {
    // First try to get unused questions from the database
    const unusedQuestions = await getUnusedQuestions(
      userId, 
      subject, 
      grade, 
      difficulty,
      numberOfQuestions
    );

    // Mark these questions as used by this user
    for (const question of unusedQuestions) {
      if (question.id) {
        await markQuestionAsUsed(question.id, userId);
      }
    }

    // If we have enough questions, return them
    if (unusedQuestions.length >= numberOfQuestions) {
      return unusedQuestions.slice(0, numberOfQuestions);
    }

    // If we don't have enough unused questions, generate new ones
    const remainingCount = numberOfQuestions - unusedQuestions.length;
    const prompt = `Generate ${remainingCount} ${difficulty} level questions for subject - ${subject} and for grade ${grade}. Return ONLY a JSON array with no markdown formatting or backticks. Each object should have: question (string), options (array of 4 strings), correctAnswer (string matching one option).`;

    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let newQuestions;
    try {
      newQuestions = JSON.parse(response.choices[0].message.content || '[]');
      // Validate the structure
      if (!Array.isArray(newQuestions)) {
        throw new Error('Response is not an array');
      }
    } catch (error) {
      console.error('Invalid response from OpenAI:', response.choices[0].message.content);
      throw new Error('Failed to parse questions from OpenAI response');
    }

    // Save new questions to database and mark them as used
    for (const question of newQuestions) {
      const questionWithMetadata: QuestionBank = {
        ...question,
        difficulty,
        subject,
        grade,
        usedBy: [userId]
      };
      await saveQuestion(questionWithMetadata);
    }

    // Combine unused and new questions
    return [...unusedQuestions, ...newQuestions].slice(0, numberOfQuestions);
  } catch (error) {
    throw error;
  }
};