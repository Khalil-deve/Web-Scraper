'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if(!newPassword || !confirmPassword) {
        setMessage('Please enter your Password.')
        return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Update Password</h1>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-sm text-purple-200">{message}</div>
        )}
      </div>
    </div>
  );
}