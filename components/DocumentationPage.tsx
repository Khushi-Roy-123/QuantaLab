import React from 'react';
import { Book, Code, Terminal, FileText, FlaskConical, Layers, AlertCircle, Cpu } from 'lucide-react';

const DocumentationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24 glass-panel rounded-xl p-4 border border-white/5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Book className="w-4 h-4 text-cyan-400" />
              Contents
            </h3>
            <nav className="space-y-1">
              <a href="#intro" className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Introduction</a>
              <a href="#quickstart" className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Quick Start</a>
              <a href="#input-formats" className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Input Formats</a>
              <a href="#theory" className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Theory & Methods</a>
              <a href="#advanced" className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Advanced Settings</a>
              <a href="#visualization" className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Visualization</a>
              <a href="#api" className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">API Reference</a>
              <a href="#troubleshooting" className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Troubleshooting</a>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-12">
          
          {/* Introduction */}
          <section id="intro" className="glass-panel p-8 rounded-xl border border-white/5">
            <h1 className="text-3xl font-bold text-white mb-6">QuantaLab Documentation</h1>
            <p className="text-slate-400 leading-relaxed text-lg font-light">
              QuantaLab is a modern, web-based platform for computational chemistry. It bridges the gap between complex command-line simulation engines (like Psi4) and accessible, interactive visualization. 
              Designed for students and researchers, it allows for real-time geometry optimization, molecular orbital analysis, and property prediction directly in the browser.
            </p>
          </section>

          {/* Quick Start */}
          <section id="quickstart" className="glass-panel p-8 rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Terminal className="w-6 h-6 text-emerald-400" />
              Quick Start Guide
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>Follow these steps to run your first simulation:</p>
              <ol className="list-decimal list-inside space-y-4 ml-2 text-slate-400">
                <li className="pl-2">
                    <strong className="text-white">Configure Structure:</strong> Navigate to the Simulator. Enter a molecule name (e.g., "Water") and use a SMILES string (e.g., "O") or upload a structure file.
                </li>
                <li className="pl-2">
                    <strong className="text-white">Select Parameters:</strong> Choose your method (Theory) and Basis Set. For beginners, <code className="text-xs bg-black/50 px-1 py-0.5 rounded text-cyan-300">B3LYP / 6-31G*</code> is a great balance of speed and accuracy.
                </li>
                <li className="pl-2">
                    <strong className="text-white">Run Simulation:</strong> Click the "Run Simulation" button. The system will queue your job.
                </li>
                <li className="pl-2">
                    <strong className="text-white">Analyze:</strong> Once complete, interact with the 3D model, view the dipole moment, and inspect the HOMO-LUMO gap in the dashboard.
                </li>
              </ol>
            </div>
          </section>

          {/* Input Formats */}
          <section id="input-formats" className="glass-panel p-8 rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-400" />
              Supported Input Formats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">SMILES <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Recommended for Organic</span></h4>
                    <p className="text-sm text-slate-400 mb-3">Simplified Molecular Input Line Entry System. Ideal for quickly generating 3D structures of organic molecules.</p>
                    <code className="block text-xs bg-black/60 p-3 rounded-lg text-emerald-300 font-mono">
                        Ethanol: CCO<br/>
                        Benzene: c1ccccc1<br/>
                        Aspirin: CC(=O)OC1=CC=CC=C1C(=O)O
                    </code>
                </div>
                <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">Structure Files <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Precise</span></h4>
                    <p className="text-sm text-slate-400 mb-3">Upload standard 3D coordinate files (.xyz, .mol, .pdb, .sdf) for exact structural control or inorganic complexes.</p>
                    <code className="block text-xs bg-black/60 p-3 rounded-lg text-cyan-300 font-mono">
                        5<br/>
                        Methane<br/>
                        C 0.000 0.000 0.000<br/>
                        H 0.629 0.629 0.629...
                    </code>
                </div>
            </div>
          </section>

          {/* Theory & Methods */}
          <section id="theory" className="glass-panel p-8 rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Cpu className="w-6 h-6 text-pink-400" />
              Theory & Computational Methods
            </h2>
            
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium text-white mb-2">Electronic Structure Methods</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        QuantaLab supports both Wavefunction-based methods and Density Functional Theory (DFT).
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-cyan-400 font-bold text-sm block mb-1">Hartree-Fock (HF)</span>
                            <p className="text-xs text-slate-400">Mean-field approximation. Good starting point but neglects electron correlation. Generally yields higher energies than reality.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-cyan-400 font-bold text-sm block mb-1">B3LYP (DFT)</span>
                            <p className="text-xs text-slate-400">Hybrid functional. The standard workhorse for organic chemistry. Includes electron correlation at a reasonable cost.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-cyan-400 font-bold text-sm block mb-1">PBE0</span>
                            <p className="text-xs text-slate-400">Parameter-free hybrid functional. Often more accurate for inorganic systems and transition metals.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-cyan-400 font-bold text-sm block mb-1">MP2</span>
                            <p className="text-xs text-slate-400">Møller–Plesset perturbation theory. Adds correlation correction to HF. Computationally expensive but accurate for weak interactions.</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-white mb-2">Basis Sets</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        The basis set defines the mathematical functions used to describe the electron orbitals.
                    </p>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                            <span className="min-w-[80px] font-mono text-emerald-400">STO-3G</span>
                            <span>Minimal basis set. Very fast, qualitative results only. Poor for geometry optimization.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="min-w-[80px] font-mono text-emerald-400">3-21G</span>
                            <span>Small split-valence set. Better than STO-3G but still rough.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="min-w-[80px] font-mono text-emerald-400">6-31G*</span>
                            <span>Split-valence with polarization functions on heavy atoms. The standard for general organic molecules.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="min-w-[80px] font-mono text-emerald-400">cc-pVDZ</span>
                            <span>Correlation-consistent polarized Valence Double Zeta. Designed for high-accuracy correlation methods (like MP2).</span>
                        </li>
                    </ul>
                </div>
            </div>
          </section>

          {/* Advanced Settings */}
          <section id="advanced" className="glass-panel p-8 rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <FlaskConical className="w-6 h-6 text-purple-400" />
              Advanced Configuration
            </h2>
            <p className="text-slate-400 mb-6">
                Fine-tune your simulation environment for ions, radicals, or solvated systems.
            </p>
            
            <div className="space-y-6">
                 <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                    <h4 className="text-white font-bold text-sm mb-3">Charge & Multiplicity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Charge</span>
                            <p className="text-sm text-slate-300 mt-1">Net electrical charge of the system. e.g., -1 for Anion, +1 for Cation.</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Multiplicity</span>
                            <p className="text-sm text-slate-300 mt-1">Defined as <code className="font-mono text-xs">2S + 1</code>. 1 = Singlet (paired electrons), 2 = Doublet (one unpaired radical), 3 = Triplet.</p>
                        </div>
                    </div>
                 </div>

                 <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                    <h4 className="text-white font-bold text-sm mb-3">Solvation Models (PCM)</h4>
                    <p className="text-sm text-slate-400 mb-3">
                        Simulates the molecule in a solvent environment using the Polarizable Continuum Model (PCM). This affects energy levels and dipole moments.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {['Water', 'Ethanol', 'Benzene', 'Chloroform'].map(s => (
                            <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/10">{s}</span>
                        ))}
                    </div>
                 </div>
            </div>
          </section>

          {/* Visualization */}
          <section id="visualization" className="glass-panel p-8 rounded-xl border border-white/5">
             <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Layers className="w-6 h-6 text-orange-400" />
              Visualization Controls
            </h2>
            <p className="text-slate-400 mb-6">
                The 3D viewer is powered by NGL. It provides interactive tools to inspect your molecule.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-black/40 rounded-lg text-center">
                    <div className="text-white font-bold text-sm mb-1">Spin</div>
                    <p className="text-[10px] text-slate-400">Auto-rotate the molecule for a 360° view.</p>
                </div>
                 <div className="p-3 bg-black/40 rounded-lg text-center">
                    <div className="text-white font-bold text-sm mb-1">Reset</div>
                    <p className="text-[10px] text-slate-400">Re-center the camera if you get lost.</p>
                </div>
                 <div className="p-3 bg-black/40 rounded-lg text-center">
                    <div className="text-white font-bold text-sm mb-1">Theme</div>
                    <p className="text-[10px] text-slate-400">Toggle between Dark and Midnight backgrounds.</p>
                </div>
                 <div className="p-3 bg-black/40 rounded-lg text-center">
                    <div className="text-white font-bold text-sm mb-1">Dipole</div>
                    <p className="text-[10px] text-slate-400">Visualizes the electric dipole vector (cyan arrow).</p>
                </div>
            </div>
          </section>

          {/* API Reference */}
          <section id="api" className="glass-panel p-8 rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Code className="w-6 h-6 text-indigo-400" />
              API Reference
            </h2>
            <p className="text-slate-400 mb-6">The backend exposes a RESTful API powered by FastAPI.</p>
            
            <div className="space-y-4">
                <div className="flex flex-col gap-2 font-mono text-sm bg-black/40 p-4 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">POST</span>
                        <span className="text-slate-200">/run_simulation</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 pl-14">Submits a new job. Accepts molecule data and calc options.</p>
                </div>
                
                <div className="flex flex-col gap-2 font-mono text-sm bg-black/40 p-4 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
                        <span className="text-slate-200">/results/{'{job_id}'}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 pl-14">Polls for job status. Returns 'running', 'completed', or 'failed' with results.</p>
                </div>

                <div className="flex flex-col gap-2 font-mono text-sm bg-black/40 p-4 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">GET</span>
                        <span className="text-slate-200">/download/{'{job_id}'}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 pl-14">Downloads a generated JSON report of the simulation.</p>
                </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="glass-panel p-8 rounded-xl border border-white/5">
             <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              Troubleshooting
            </h2>
            <div className="space-y-4">
                <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/10">
                    <h5 className="text-red-300 font-bold text-sm mb-1">SCF Convergence Failure</h5>
                    <p className="text-xs text-slate-400">
                        If the simulation fails with "Convergence Error", try increasing the Basis Set size or switching from HF to a DFT method (like B3LYP). Complex molecules often struggle to converge in minimal basis sets.
                    </p>
                </div>
                <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/10">
                    <h5 className="text-red-300 font-bold text-sm mb-1">NGL Viewer "Unknown Format"</h5>
                    <p className="text-xs text-slate-400">
                        Ensure your uploaded file has a standard extension (.xyz, .mol, .pdb). If pasting raw text, ensure there are no leading blank lines.
                    </p>
                </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;