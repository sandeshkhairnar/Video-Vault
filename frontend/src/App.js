import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  Home, 
  Video, 
  Camera,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import VideoRecorder from './components/VideoRecorder';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden fixed top-4 left-4 z-50 bg-neutral-800 p-2 rounded-full"
        >
          {isMobileMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
        </button>

        {/* Sidebar Navigation */}
        <div className={`
          fixed inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col 
          transform transition-transform duration-300 z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}>
          <div className="mb-12">
            <h1 className="text-2xl font-extralight text-white tracking-tight flex items-center">
              <Video className="mr-3 text-indigo-500" size={28} />
              Video Vault
            </h1>
          </div>

          <nav className="space-y-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg transition duration-300 
                ${isActive 
                  ? 'bg-indigo-700 text-white' 
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="mr-3" size={20} />
              Dashboard
            </NavLink>

            <NavLink 
              to="/record" 
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg transition duration-300 
                ${isActive 
                  ? 'bg-indigo-700 text-white' 
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Camera className="mr-3" size={20} />
              Record Video
            </NavLink>
          </nav>

          <div className="mt-auto p-4 text-center">
            <p className="text-xs text-neutral-500">
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div 
          className={`
            flex-grow overflow-auto transition-all duration-300
            ${isMobileMenuOpen ? 'md:ml-0 blur-sm pointer-events-none md:blur-none md:pointer-events-auto' : ''}
          `}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/record" element={<VideoRecorder />} />
            <Route path="/play" element={<VideoPlayer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;