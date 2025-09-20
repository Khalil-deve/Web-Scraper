import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { 
  FiSearch, 
  FiBookmark, 
  FiBell, 
  FiChevronDown, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { 
  HiOutlineSearch, 
  HiOutlineBookmark, 
  HiOutlineBell 
} from 'react-icons/hi';

export default function Header({ session, activeTab, setActiveTab }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl border-b border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
              <span className="text-white text-xl font-bold">🎬</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                CineTracker
              </h1>
              <p className="text-xs text-gray-400">Your Personal Movie Library</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700">
            <button
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                activeTab === 'search' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveTab('search')}
            >
              <FiSearch className="w-4 h-4 mr-2" />
              Discover
            </button>
            <button
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                activeTab === 'watchlist' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveTab('watchlist')}
            >
              <FiBookmark className="w-4 h-4 mr-2" />
              My Watchlist
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors relative">
              <FiBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Avatar and Menu */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Welcome back</p>
                  <p className="text-xs text-gray-400 truncate max-w-[120px]">{session.user.email}</p>
                </div>
                <FiChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-white font-medium">Signed in as</p>
                    <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-3 bg-gray-800/95 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="flex flex-col space-y-2">
              <button
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'search' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => {
                  setActiveTab('search');
                  setMobileMenuOpen(false);
                }}
              >
                <FiSearch className="w-5 h-5 mr-3" />
                <span className="font-medium">Discover Movies</span>
              </button>
              <button
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'watchlist' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => {
                  setActiveTab('watchlist');
                  setMobileMenuOpen(false);
                }}
              >
                <FiBookmark className="w-5 h-5 mr-3" />
                <span className="font-medium">My Watchlist</span>
              </button>
              
              {/* Mobile User Section */}
              <div className="px-4 py-3 border-t border-gray-700 mt-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{getUserInitials()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{session.user.email}</p>
                    <button
                      onClick={handleSignOut}
                      className="text-xs text-red-400 hover:text-red-300 mt-1 flex items-center"
                    >
                      <FiLogOut className="w-3 h-3 mr-1" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40">
          <div className="flex justify-around py-2">
            <button
              className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'search' ? 'text-purple-400' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('search')}
            >
              <HiOutlineSearch className="w-6 h-6 mb-1" />
              <span className="text-xs">Discover</span>
            </button>
            <button
              className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'watchlist' ? 'text-purple-400' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('watchlist')}
            >
              <HiOutlineBookmark className="w-6 h-6 mb-1" />
              <span className="text-xs">Watchlist</span>
            </button>
            <button className="flex flex-col items-center px-4 py-2 text-gray-400 hover:text-white transition-colors">
              <HiOutlineBell className="w-6 h-6 mb-1" />
              <span className="text-xs">Notifications</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for closing dropdown when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}