import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AnimatedBackground from '../../components/layout/AnimatedBackground';

interface User {
  _id: string;
  email: string;
  role: string;
  mfaEnabled: boolean;
  mfaMethod?: 'email' | 'totp';
}

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    userId: string;
    currentStatus: boolean;
  }>({ show: false, userId: '', currentStatus: false });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    role: 'user',
    mfaEnabled: true,
  });
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean;
    userId: string;
    email: string;
  }>({ show: false, userId: '', email: '' });
  const [resetMethodDialog, setResetMethodDialog] = useState<{
    show: boolean;
    userId: string;
    email: string;
  }>({ show: false, userId: '', email: '' });
  const [totpSetupDialog, setTotpSetupDialog] = useState<{
    show: boolean;
    userId: string;
    email: string;
    qrCode?: string;
    secret?: string;
  }>({ show: false, userId: '', email: '' });
  const [settingUpTotp, setSettingUpTotp] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState<{
    show: boolean;
    userId: string;
    email: string;
  }>({ show: false, userId: '', email: '' });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMfa = async (userId: string, currentStatus: boolean) => {
    setConfirmDialog({ show: true, userId, currentStatus });
  };

  const confirmToggleMfa = async () => {
    if (!confirmDialog) return;

    try {
      const newStatus = !confirmDialog.currentStatus;
      await api.patch(`/users/${confirmDialog.userId}/mfa`, { enabled: newStatus });
      
      // Update local state
      setUsers(users.map(user => 
        user._id === confirmDialog.userId 
          ? { ...user, mfaEnabled: newStatus }
          : user
      ));
      
      setConfirmDialog({ show: false, userId: '', currentStatus: false });
    } catch (error) {
      console.error('Failed to toggle MFA:', error);
      alert('Failed to update MFA status. Please try again.');
    }
  };

  const handleCreateUser = async () => {
    if (!createForm.email || !createForm.password) {
      alert('Email and password are required');
      return;
    }

    setCreating(true);
    try {
      const response = await api.post('/users', createForm);
      
      // Add new user to list
      setUsers([...users, response.data.user]);
      
      // Reset form and close dialog
      setCreateForm({ email: '', password: '', role: 'user', mfaEnabled: true });
      setShowCreateDialog(false);
      
      alert('User created successfully!');
    } catch (error: any) {
      console.error('Failed to create user:', error);
      alert(error.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog.show) return;

    try {
      await api.delete(`/users/${deleteDialog.userId}`);
      
      // Remove user from list
      setUsers(users.filter(user => user._id !== deleteDialog.userId));
      
      setDeleteDialog({ show: false, userId: '', email: '' });
      alert('User deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      alert(error.response?.data?.message || 'Failed to delete user. Please try again.');
    }
  };

  const handleResetToEmail = async () => {
    if (!resetMethodDialog.show) return;

    try {
      await api.patch(`/users/${resetMethodDialog.userId}/mfa-method`, { method: 'email' });
      
      // Update local state
      setUsers(users.map(u => 
        u._id === resetMethodDialog.userId 
          ? { ...u, mfaMethod: 'email' } 
          : u
      ));
      
      setResetMethodDialog({ show: false, userId: '', email: '' });
      alert('MFA method reset to Email successfully!');
    } catch (error: any) {
      console.error('Failed to reset MFA method:', error);
      alert(error.response?.data?.message || 'Failed to reset MFA method. Please try again.');
    }
  };

  const handleSetupTotp = async (userId: string, userEmail: string) => {
    setSettingUpTotp(true);
    try {
      const response = await api.post('/auth/setup-totp', { userId, email: userEmail });
      
      setTotpSetupDialog({
        show: true,
        userId,
        email: userEmail,
        qrCode: response.data.qrCode,
        secret: response.data.secret,
      });
      
      // Update user's MFA method to TOTP
      await api.patch(`/users/${userId}/mfa-method`, { method: 'totp' });
      
      // Refresh users list
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to setup TOTP:', error);
      alert(error.response?.data?.message || 'Failed to setup Google Authenticator. Please try again.');
    } finally {
      setSettingUpTotp(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      alert('Please enter a new password');
      return;
    }

    try {
      await api.patch(`/users/${changePasswordDialog.userId}/password`, { password: newPassword });
      setChangePasswordDialog({ show: false, userId: '', email: '' });
      setNewPassword('');
      alert('Password updated successfully!');
    } catch (error: any) {
      console.error('Failed to update password:', error);
      alert(error.response?.data?.message || 'Failed to update password. Please try again.');
    }
  };

  const handleChangeMfaMethod = async (userId: string, method: 'email' | 'totp') => {
    try {
      await api.patch(`/users/${userId}/mfa-method`, { method });
      
      // Update local state
      setUsers(users.map(u => 
        u._id === userId 
          ? { ...u, mfaMethod: method } 
          : u
      ));
      
      // If switching to TOTP, optionally prompt to setup
      if (method === 'totp') {
        const user = users.find(u => u._id === userId);
        if (user && !user.mfaMethod) {
          // User is switching to TOTP for the first time
          const shouldSetup = window.confirm(
            `MFA method changed to TOTP. Would you like to setup Google Authenticator for ${user.email} now?`
          );
          if (shouldSetup) {
            handleSetupTotp(userId, user.email);
          }
        }
      }
    } catch (error: any) {
      console.error('Failed to update MFA method:', error);
      alert(error.response?.data?.message || 'Failed to update MFA method. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage user accounts and security settings</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateDialog(true)}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create User
            </button>
            <button 
              onClick={() => navigate('/portal')}
              className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Total Users</p>
            <p className="text-3xl font-bold text-blue-400">{users.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
            <p className="text-gray-400 text-sm mb-1">MFA Enabled</p>
            <p className="text-3xl font-bold text-green-400">
              {users.filter(u => u.mfaEnabled).length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
            <p className="text-gray-400 text-sm mb-1">MFA Disabled</p>
            <p className="text-3xl font-bold text-orange-400">
              {users.filter(u => !u.mfaEnabled).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">MFA Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">MFA Method</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">MFA Toggle</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.mfaEnabled 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-orange-500/20 text-orange-300'
                        }`}>
                          {user.mfaEnabled ? '✓ Enabled' : '✗ Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.mfaEnabled ? (
                          <select
                            value={user.mfaMethod || 'email'}
                            onChange={(e) => handleChangeMfaMethod(user._id, e.target.value as 'email' | 'totp')}
                            className="px-3 py-1 bg-white/5 border border-white/20 text-white rounded-lg text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="email" className="bg-gray-800">📧 Email</option>
                            <option value="totp" className="bg-gray-800">📱 TOTP</option>
                          </select>
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleMfa(user._id, user.mfaEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            user.mfaEnabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              user.mfaEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSetupTotp(user._id, user.email)}
                            disabled={settingUpTotp}
                            className="px-2 py-1 md:px-3 md:py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Setup Auth
                          </button>
                          
                          <button
                            onClick={() => setChangePasswordDialog({ show: true, userId: user._id, email: user.email })}
                            className="px-2 py-1 md:px-3 md:py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2"
                            title="Change Password"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Password
                          </button>

                          <button
                            onClick={() => setDeleteDialog({ show: true, userId: user._id, email: user.email })}
                            className="px-2 py-1 md:px-3 md:py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog?.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Confirm MFA Change</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to {confirmDialog.currentStatus ? 'disable' : 'enable'} MFA for this user?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmDialog({ show: false, userId: '', currentStatus: false })}
                className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm md:text-base rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleMfa}
                className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Delete User</h3>
            </div>
            <p className="text-gray-300 mb-2">
              Are you sure you want to delete this user?
            </p>
            <p className="text-red-400 font-semibold mb-6">
              {deleteDialog.email}
            </p>
            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone. All user data will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteDialog({ show: false, userId: '', email: '' })}
                className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm md:text-base rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white text-sm md:text-base rounded-lg transition-colors font-semibold"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOTP Setup Dialog */}
      {totpSetupDialog.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Setup Google Authenticator</h3>
            </div>
            
            <p className="text-gray-300 mb-4">
              For: <span className="text-green-400 font-semibold">{totpSetupDialog.email}</span>
            </p>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-xl mb-4 flex justify-center">
              <img src={totpSetupDialog.qrCode} alt="QR Code" className="w-48 h-48" />
            </div>

            {/* Manual Entry */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
              <p className="text-gray-300 text-xs mb-2">Can't scan? Enter this code manually:</p>
              <div className="bg-black/30 rounded p-2 font-mono text-white text-sm text-center break-all">
                {totpSetupDialog.secret}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
              <h4 className="text-white font-semibold text-sm mb-2">📱 Instructions:</h4>
              <ol className="text-gray-300 text-xs space-y-1 list-decimal list-inside">
                <li>Download Google Authenticator from app store</li>
                <li>Open app and tap "+" to add account</li>
                <li>Choose "Scan a QR code"</li>
                <li>Scan the code above</li>
                <li>User will use codes from app to login</li>
              </ol>
            </div>

            <button
              onClick={() => setTotpSetupDialog({ show: false, userId: '', email: '' })}
              className="w-full px-3 py-1.5 md:px-4 md:py-2 bg-green-600 hover:bg-green-700 text-white text-sm md:text-base rounded-lg transition-colors font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Create User Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Create New User</h3>
            
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="user@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Role
                </label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="user" className="bg-gray-800">User</option>
                  <option value="admin" className="bg-gray-800">Admin</option>
                </select>
              </div>

              {/* MFA Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="text-white font-semibold">Multi-Factor Authentication</p>
                  <p className="text-gray-400 text-sm">Require OTP for login</p>
                </div>
                <button
                  onClick={() => setCreateForm({ ...createForm, mfaEnabled: !createForm.mfaEnabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    createForm.mfaEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      createForm.mfaEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  setCreateForm({ email: '', password: '', role: 'user', mfaEnabled: true });
                }}
                disabled={creating}
                className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm md:text-base rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={creating}
                className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reset Method Dialog */}
      {resetMethodDialog.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Reset MFA Method?</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to reset the MFA method for <strong>{resetMethodDialog.email}</strong> to Email?
              This will disable Google Authenticator for this user.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setResetMethodDialog({ show: false, userId: '', email: '' })}
                className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToEmail}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base rounded-lg transition-colors"
              >
                Reset to Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Dialog */}
      {changePasswordDialog.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
            <p className="text-gray-300 mb-4">
              Enter new password for <strong>{changePasswordDialog.email}</strong>
            </p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 mb-6"
              placeholder="New Password"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setChangePasswordDialog({ show: false, userId: '', email: '' });
                  setNewPassword('');
                }}
                className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm md:text-base rounded-lg transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
