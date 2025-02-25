import { LogoutButton } from './LogoutButton';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';

interface NavbarProps {
  onHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHome }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '';
    
    // Remove extra spaces and split
    const words = name.trim().split(/\s+/);
    
    // Take first letter of each word, limit to 2 characters
    return words
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">
              Quizlyy
            </h1>
            <button
              onClick={onHome}
              className="flex items-center px-3 py-2 text-[#f6f6f6] hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {user?.displayName && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-medium">
                  {getInitials(user.displayName)}
                </div>
                <span className="text-[#f6f6f6] font-medium">
                  {user.displayName}
                </span>
              </div>
            )}
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}; 