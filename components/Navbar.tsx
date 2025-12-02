
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Beaker, Github, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all duration-300">
              <Beaker className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Quanta<span className="text-cyan-400">Lab</span>
            </span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                to="/" 
                className={`transition-colors duration-200 text-sm font-medium ${isActive('/') ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              >
                Home
              </Link>
              <Link 
                to="/simulator" 
                className={`transition-colors duration-200 text-sm font-medium ${isActive('/simulator') ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              >
                Simulator
              </Link>
              <Link 
                to="/docs" 
                className={`transition-colors duration-200 text-sm font-medium ${isActive('/docs') ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              >
                Documentation
              </Link>
              <a 
                href="https://github.com/Khushi-Roy-123/QuantaLab" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-medium border border-white/10"
              >
                <Github className="w-3.5 h-3.5"/> GitHub
              </a>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white/5 p-2 rounded-md text-slate-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">Home</Link>
            <Link to="/simulator" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10">Simulator</Link>
            <Link to="/docs" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10">Documentation</Link>
            <a 
                href="https://github.com/Khushi-Roy-123/QuantaLab" 
                target="_blank" 
                rel="noreferrer" 
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10"
            >
                GitHub Repo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
