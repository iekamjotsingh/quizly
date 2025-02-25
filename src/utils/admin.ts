import { auth, db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  deleteDoc,
  doc,
  addDoc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser
} from 'firebase/auth';

export const createNewUser = async ({ 
  email, 
  password, 
  displayName 
}: { 
  email: string; 
  password: string; 
  displayName: string; 
}) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }

  await addDoc(collection(db, 'questionBank'), {
    type: 'user',
    uid: userCredential.user.uid,
    email,
    displayName,
    createdAt: new Date().toISOString(),
    quizzesTaken: 0
  });

  return userCredential.user;
}; 