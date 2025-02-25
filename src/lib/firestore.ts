import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc, arrayUnion, limit as firestoreLimit } from 'firebase/firestore';
import { QuizHistory, QuestionBank } from '../types';

export const saveQuizResult = async (userId: string, result: QuizHistory) => {
  try {
    await addDoc(collection(db, 'quizHistory'), {
      userId,
      ...result,
      date: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

export const getQuizHistory = async (userId: string): Promise<QuizHistory[]> => {
  try {
    const q = query(
      collection(db, 'quizHistory'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const history = querySnapshot.docs.map(doc => ({
      date: doc.data().date,
      subject: doc.data().subject,
      grade: doc.data().grade,
      score: doc.data().score,
      totalQuestions: doc.data().totalQuestions
    }));
    
    return history;
  } catch (error) {
    throw error;
  }
};

export const saveQuestion = async (question: QuestionBank) => {
  try {
    const docRef = await addDoc(collection(db, 'questionBank'), question);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUnusedQuestions = async (
  userId: string,
  subject: string,
  grade: string,
  difficulty: string,
  limit: number
): Promise<QuestionBank[]> => {
  try {
    const q = query(
      collection(db, 'questionBank'),
      where('subject', '==', subject),
      where('grade', '==', grade),
      where('difficulty', '==', difficulty),
      where('usedBy', 'not-in', [[userId]]),
      firestoreLimit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as QuestionBank));
  } catch (error) {
    throw error;
  }
};

export const markQuestionAsUsed = async (questionId: string, userId: string) => {
  try {
    const docRef = doc(db, 'questionBank', questionId);
    await updateDoc(docRef, {
      usedBy: arrayUnion(userId)
    });
  } catch (error) {
    throw error;
  }
}; 