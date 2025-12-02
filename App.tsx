import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import InputForm from './components/InputForm';
import MoleculeViewer from './components/MoleculeViewer';
import ResultsDashboard from './components/ResultsDashboard';
import DocumentationPage from './components/DocumentationPage';
import { Job, MoleculeData, CalculationOptions } from './types';
import { submitJob, getJobStatus } from './services/api';
import { Home, ChevronRight, Activity, Clock, AlertTriangle, XCircle, History, FileText } from 'lucide-react';
import { MOCK_RESULTS } from './constants';

const METHANE_XYZ = `5
Methane
C     0.000000    0.000000    0.000000
H     0.629118    0.629118    0.629118
H    -0.629118   -0.629118    0.629118
H     0.629118   -0.629118   -0.629118
H    -0.629118    0.629118   -0.629118`;

const SimulatorPage: React.FC = () => {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobHistory, setJobHistory] = useState<Job[]>([]);

  // Viewer State
  const [viewerData, setViewerData] = useState<{structure: string, ext: string}>({
      structure: METHANE_XYZ.trim(),
      ext: 'xyz'
  });

  useEffect(() => {
    let interval: number;
    if (polling && currentJob?.id) {
      interval = window.setInterval(async () => {
        try {
          const updatedJob = await getJobStatus(currentJob.id);
          
          // Avoid state thrashing if nothing changed
          if (JSON.stringify(updatedJob) !== JSON.stringify(currentJob)) {
             setCurrentJob(updatedJob);
          }
          
          if (updatedJob.status === 'completed') {
            setPolling(false);
            setLoading(false);
            
            // Add to history if not exists
            setJobHistory(prev => {
                if (prev.find(j => j.id === updatedJob.id)) return prev;
                return [updatedJob, ...prev];
            });

            // If optimization job returned a new structure, update viewer
            if (updatedJob.results?.optimizedStructure) {
                 setViewerData({
                     structure: updatedJob.results.optimizedStructure,
                     ext: 'xyz'
                 });
            }
          } else if (updatedJob.status === 'failed') {
            setPolling(false);
            setLoading(false);
            setError(updatedJob.error || "Simulation failed during processing.");
          }
        } catch (e: any) {
          console.error("Polling error", e);
          if (!e.message.includes('fetch')) {
             // Stop polling on non-network errors
             setPolling(false);
             setLoading(false);
             setError(e.message);
          }
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [polling, currentJob]);

  const handleJobSubmit = async (mol: MoleculeData, opts: CalculationOptions) => {
    setLoading(true);
    setError(null);
    setCurrentJob(null);
    
    // Update viewer if a file structure was provided directly
    if (mol.structure && mol.format) {
        setViewerData({
            structure: mol.structure,
            ext: mol.format
        });
    }

    try {
      const job = await submitJob(mol, opts);
      setCurrentJob(job);
      setPolling(true);
    } catch (e: any) {
      console.error(e);
      setLoading(false);
      setError(e.message || "Failed to start job. Please check the backend connection.");
    }
  };

  const loadJobFromHistory = (job: Job) => {
      setCurrentJob(job);
      if (job.results?.optimizedStructure) {
          setViewerData({ structure: job.results.optimizedStructure, ext: 'xyz' });
      } else if (job.structure && job.format) {
          setViewerData({ structure: job.structure, ext: job.format });
      } else if (job.smiles) {
          // If only SMILES, we might not have a structure to view unless we generated one
          // This is a simplified fallback
          console.warn("Loading job without structure data");
      }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
                <Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <Home className="w-3 h-3" /> Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-300">Simulator</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Simulation Workspace</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl font-light">
                Configure your molecular system, run quantum calculations via Psi4, and analyze results in real-time.
            </p>
        </div>

        {currentJob && (
             <div className="glass-panel px-5 py-3 rounded-xl flex items-center gap-4 min-w-[200px]">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Job</span>
                    <span className="text-xs text-slate-500 font-mono">{currentJob.id}</span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex items-center gap-2">
                    {currentJob.status === 'running' || currentJob.status === 'pending' ? (
                        <div className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </div>
                    ) : currentJob.status === 'completed' ? (
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    ) : (
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    )}
                    <span className={`text-sm font-bold uppercase tracking-wide ${
                        currentJob.status === 'completed' ? 'text-emerald-400' :
                        currentJob.status === 'failed' ? 'text-red-400' : 'text-cyan-400'
                    }`}>
                        {currentJob.status}
                    </span>
                </div>
             </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start justify-between animate-fade-in shadow-lg shadow-red-900/10 backdrop-blur-md">
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-red-400">Simulation Error</h4>
                    <p className="text-sm opacity-90">{error}</p>
                </div>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white transition-colors">
                <XCircle className="w-5 h-5" />
            </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Inputs (Sticky) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          <InputForm onSubmit={handleJobSubmit} isLoading={loading && !currentJob} />
          
          {/* Job History / Status Mini-card */}
          <div className="glass-panel p-4 rounded-xl space-y-4 animate-fade-in border border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-medium">
                        <History className="w-4 h-4 text-cyan-400" />
                        <span>Job History</span>
                    </div>
                </div>
                
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    {jobHistory.length === 0 && !currentJob ? (
                        <p className="text-xs text-slate-500 italic py-2">No jobs run yet.</p>
                    ) : null}

                    {currentJob && (
                        <div className="p-2 rounded-lg bg-white/5 border border-cyan-500/30 flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{currentJob.moleculeName}</span>
                            <span className="text-[10px] text-cyan-400 font-mono">ACTIVE</span>
                        </div>
                    )}

                    {jobHistory.map((job) => (
                        <button 
                            key={job.id}
                            onClick={() => loadJobFromHistory(job)}
                            className="w-full p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 flex items-center justify-between group transition-all text-left"
                        >
                            <div>
                                <div className="text-xs font-medium text-slate-300 group-hover:text-white">{job.moleculeName}</div>
                                <div className="text-[10px] text-slate-500">{job.theory} / {job.basisSet}</div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${job.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </button>
                    ))}
                </div>
          </div>
        </div>

        {/* Right Panel: Visualization & Results */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Viewer Section */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    3D Structure
                </h3>
                {viewerData.ext && (
                    <span className="text-xs font-mono text-slate-500 uppercase px-2 py-1 bg-white/5 rounded">
                        {viewerData.ext} Format
                    </span>
                )}
             </div>
             <MoleculeViewer 
                structure={viewerData.structure} 
                ext={viewerData.ext} 
                dipoleMoment={currentJob?.results?.dipoleMoment}
             />
          </div>

          {/* Results Section */}
          {currentJob?.status === 'completed' && (
            <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Simulation Results</h3>
                </div>
                <ResultsDashboard job={currentJob} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;