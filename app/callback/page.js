'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState('Processing authentication...');
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session (automatically handles URL fragments)
        const { data, error } = await supabase.auth.getSession();
        console.log('Session data:', data);
        
        if (error) {
          console.error('Auth callback error:', error);
          setMessage('Authentication failed. Please try again.');
          setStatus('error');
          return;
        }

        if (data?.session) {
          setMessage('Authentication successful! Redirecting...');
          setStatus('success');
          
          // Redirect to home page after a brief delay
          setTimeout(() => {
            router.push('/update-password');
          }, 2000);
        } else {
          // If no session, wait a moment for URL processing and try again
          setTimeout(async () => {
            const { data: retryData, error: retryError } = await supabase.auth.getSession();
            if (retryData?.session) {
              setMessage('Authentication successful! Redirecting...');
              setStatus('success');
              setTimeout(() => {
                router.push('/');
              }, 2000);
            } else {
              setMessage('No authentication data found. Please try signing in again.');
              setStatus('error');
            }
          }, 1000);
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setMessage('An unexpected error occurred. Please try again.');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        <div className="flex justify-center mb-6">
          {status === 'loading' && (
            <FiLoader className="w-12 h-12 text-purple-500 animate-spin" />
          )}
          {status === 'success' && (
            <FiCheckCircle className="w-12 h-12 text-green-500" />
          )}
          {status === 'error' && (
            <FiAlertCircle className="w-12 h-12 text-red-500" />
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Error'}
        </h1>
        
        <p className="text-gray-300 mb-6">{message}</p>
        
        {status === 'error' && (
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            Return to Home
          </button>
        )}
        
        {status === 'loading' && (
          <div className="mt-6">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
