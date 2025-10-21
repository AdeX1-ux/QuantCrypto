import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Wallet,
  Brain,
  Settings,
  Menu,
  X,
  TrendingUp,
  Activity
} from 'lucide-react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch {}
    }
  };
  return (
    <button onClick={toggle} className="px-3 py-1.5 rounded-lg text-sm bg-white/70 dark:bg-white/10 border border-white/30 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-white/90 dark:hover:bg-white/5 transition">
      {dark ? 'Light' : 'Dark'}
    </button>
  );
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Portfolio', href: '/portfolio', icon: Wallet },
    { name: 'AI Insights', href: '/ai-insights', icon: Brain },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0b1020] dark:to-[#0a0f1a]">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary-600 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">CryptoQuant AI</span>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`${
                      isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 bg-white/40 dark:bg-white/5 backdrop-blur-xl border-r border-white/20 dark:border-white/10">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-6 py-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl shadow-sm">
                    <TrendingUp className="h-6 w-6 text-white drop-shadow" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">CryptoQuant AI</span>
                </div>
              </div>
              <nav className="mt-5 flex-1 px-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-primary-100/80 to-blue-50 text-primary-900 dark:from-indigo-500/10 dark:to-indigo-400/10 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50/70 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    } group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200`}
                  >
                    <item.icon
                      className={`${
                        isActive(item.href) ? 'text-primary-500 drop-shadow' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Status indicator */}
            <div className="flex-shrink-0 flex border-t border-white/20 dark:border-white/10 p-5">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">System Online</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">AI Trading Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="lg:hidden flex-shrink-0 flex h-16 bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
          <button
            type="button"
            className="px-4 border-r border-white/20 dark:border-white/10 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Activity className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-8 pr-3 py-2 bg-transparent border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search symbols..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center pr-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
