import React from 'react';
import { User } from 'firebase/auth';
import { getAllUsers, deleteUserAccount, createNewUser } from '../../utils/admin';
import { PlusCircle, Trash2, Search } from 'lucide-react';
import { AddUserModal } from './AddUserModal';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  lastLogin: string;
  quizzesTaken: number;
}

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [showAddUser, setShowAddUser] = React.useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersList = await getAllUsers();
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (uid: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserAccount(uid);
        setUsers(users.filter(user => user.uid !== uid));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-[900px] mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1f4b43]">Admin Panel</h1>
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center space-x-2 bg-[#1f4b43] text-white px-4 py-2 rounded-xl hover:bg-[#2a6359] transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-xl focus:border-[#1f4b43] focus:ring focus:ring-[#1f4b43]/20 transition-all"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-3xl shadow-lg p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f4b43]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-[#1f4b43] font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-[#1f4b43] font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-[#1f4b43] font-medium">Joined</th>
                  <th className="text-left py-3 px-4 text-[#1f4b43] font-medium">Quizzes</th>
                  <th className="text-left py-3 px-4 text-[#1f4b43] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-600">{user.displayName || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-600">{user.quizzesTaken}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDeleteUser(user.uid)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddUser && (
        <AddUserModal onClose={() => setShowAddUser(false)} onUserAdded={fetchUsers} />
      )}
    </div>
  );
}; 