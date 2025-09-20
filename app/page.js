// pages/index.js
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MovieSearch from '../components/MovieSearch';
import Watchlist from '../components/Watchlist';
import Header from '../components/Header';
import CustomAuth from '../components/CustomAuth';

export default function Home() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
  const [authView, setAuthView] = useState('sign_in');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      
      // Handle password recovery
      if (event === 'PASSWORD_RECOVERY') {
        setAuthView('forgotten_password');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-purple-500">
              🎬 Movie & Show Tracker
            </h1>
            <p className="text-center mb-8 text-gray-300">
              Track your favorite movies and shows. Save them to your personal watchlist.
            </p>
            <CustomAuth />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header session={session} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-3 md:px-4 py-8">
        {activeTab === 'search' ? <MovieSearch userId={session.user.id} /> : <Watchlist userId={session.user.id} />}
      </main>
    </div>
  );
}