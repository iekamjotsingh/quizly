import React from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else {
        if (password.length < 6) {
          throw new Error('Password should be at least 6 characters long');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name && userCredential.user) {
          try {
            await updateProfile(userCredential.user, {
              displayName: name
            });
            await userCredential.user.reload();
            navigate('/dashboard');
          } catch (profileError) {
            console.error('Error updating profile:', profileError);
          }
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let errorMessage = 'An error occurred during authentication';
      
      // Handle specific Firebase error codes
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please login instead.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters long.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password.';
            break;
          default:
            errorMessage = err.message.replace('Firebase: ', '');
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1f4b43] py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1f4b43] mb-2">
              Welcome to Quizlyy
            </h1>
            <p className="text-gray-500">Your learning journey starts here</p>
          </div>

          <div className="bg-[#f6f6f6] p-1 rounded-xl mb-8">
            <div className="grid grid-cols-2 gap-1">
              <button
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all
                  ${isLogin 
                    ? 'bg-white text-[#1f4b43] shadow-sm' 
                    : 'text-gray-500 hover:text-[#1f4b43]'
                  }`}
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
              >
                <LogIn className="w-4 h-4 inline-block mr-2" />
                Login
              </button>
              <button
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all
                  ${!isLogin 
                    ? 'bg-white text-[#1f4b43] shadow-sm' 
                    : 'text-gray-500 hover:text-[#1f4b43]'
                  }`}
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
              >
                <UserPlus className="w-4 h-4 inline-block mr-2" />
                Register
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 rounded-xl flex items-start"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#1f4b43] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#f6f6f6] bg-[#f6f6f6] text-[#1f4b43] placeholder-gray-400 
                  focus:border-[#1f4b43] focus:bg-white transition-all"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1f4b43] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#f6f6f6] bg-[#f6f6f6] text-[#1f4b43] placeholder-gray-400 
                focus:border-[#1f4b43] focus:bg-white transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f4b43] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#f6f6f6] bg-[#f6f6f6] text-[#1f4b43] placeholder-gray-400 
                focus:border-[#1f4b43] focus:bg-white transition-all"
                placeholder={isLogin ? "Enter your password" : "Create a password (min. 6 characters)"}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1f4b43] text-white rounded-xl text-lg font-medium
              hover:bg-[#2a6359] transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isLogin ? 'Logging in...' : 'Registering...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Login' : 'Register'}</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
