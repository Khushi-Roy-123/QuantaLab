
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Layers, BrainCircuit, Atom, Play, FileJson, CheckCircle2, ChevronRight, Microscope, GraduationCap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="glass-panel p-8 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-150 duration-700" />
        <div className="bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 relative z-10">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-3 relative z-10">{title}</h3>
        <p className="text-slate-400 leading-relaxed font-light relative z-10">{description}</p>
    </div>
);

const StepCard = ({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) => (
    <div className="flex flex-col items-center text-center space-y-4 relative z-10">
        <div className="w-16 h-16 rounded-full bg-black/50 border border-cyan-500/30 flex items-center justify-center relative group">
             <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
             {icon}
             <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 text-black font-bold text-xs flex items-center justify-center">
                {number}
             </div>
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in bg-black">
      
      {/* MEGA HERO SECTION */}
      <section className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2680&auto=format&fit=crop" 
                alt="Abstract Molecular Structure Background" 
                className="w-full h-full object-cover opacity-40"
            />
            {/* Gradient Overlays for Readability and Style */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90 z-10" />
        </div>
        
        {/* Abstract Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[5000ms]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[7000ms]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center flex flex-col items-center justify-center h-full pt-16">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:bg-cyan-900/40 transition-colors cursor-default select-none animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Next Gen Research Platform
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-8 drop-shadow-2xl animate-fade-in-up delay-100">
            Quanta<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Lab</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-12 leading-relaxed font-light drop-shadow-lg animate-fade-in-up delay-200">
            The advanced web-based platform for quantum chemistry simulations.
            <span className="block mt-2 text-slate-400 text-lg">Build molecules, run Psi4 calculations, and visualize orbitals—all in your browser.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md sm:max-w-none animate-fade-in-up delay-300">
            <Link 
              to="/simulator" 
              className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-[0_0_30px_rgba(8,145,178,0.4)] hover:shadow-[0_0_50px_rgba(8,145,178,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-3 group text-lg"
            >
              Launch Simulator
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/docs" 
              className="w-full sm:w-auto px-8 py-5 rounded-2xl glass-panel text-slate-200 font-semibold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Read Documentation
            </Link>
          </div>

          <div className="hidden lg:grid grid-cols-4 gap-12 w-full max-w-5xl border-t border-white/10 pt-10 mt-auto mb-12 animate-fade-in delay-500 opacity-80">
             {[
                { label: 'Calculations', value: 'Psi4 Engine' },
                { label: 'Visualization', value: 'NGL Viewer' },
                { label: 'Cheminformatics', value: 'RDKit' },
                { label: 'AI Insights', value: 'Gemini 2.0' },
            ].map((stat, idx) => (
                <div key={idx} className="space-y-1">
                    <div className="text-cyan-500/70 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
                    <div className="text-white font-mono text-lg tracking-tight">{stat.value}</div>
                </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50 z-20">
            <div className="w-6 h-10 rounded-full border-2 border-slate-500 flex items-start justify-center p-1">
                <div className="w-1 h-2 bg-slate-500 rounded-full" />
            </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">From Structure to Insight</h2>
                <p className="text-slate-400">A streamlined workflow for computational chemistry.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-cyan-900 to-transparent z-0"></div>

                <StepCard 
                    number="01"
                    title="Input Structure"
                    description="Draw via SMILES or upload XYZ/PDB files directly into the 3D editor."
                    icon={<Atom className="w-7 h-7 text-cyan-400" />}
                />
                <StepCard 
                    number="02"
                    title="Run Simulation"
                    description="Execute Geometry Optimization or Energy calculations on our cloud servers."
                    icon={<Play className="w-7 h-7 text-cyan-400 ml-1" />}
                />
                <StepCard 
                    number="03"
                    title="Analyze Results"
                    description="Visualize Orbitals (HOMO/LUMO) and get AI-powered interpretations."
                    icon={<BrainCircuit className="w-7 h-7 text-cyan-400" />}
                />
            </div>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section id="features" className="py-24 relative bg-gradient-to-b from-black to-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
                <div className="inline-block px-3 py-1 rounded bg-blue-900/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
                    Capabilities
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Scientific Precision. <br/> Modern Interface.</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    QuantaLab abstracts the complexity of command-line tools without sacrificing the accuracy required for serious research.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard 
                    icon={<Cpu className="w-8 h-8 text-blue-400" />}
                    title="High-Performance Backend"
                    description="Powered by Psi4, capable of Hartree-Fock and DFT calculations (B3LYP, PBE0) with standard basis sets."
                />
                <FeatureCard 
                    icon={<Layers className="w-8 h-8 text-cyan-400" />}
                    title="Interactive 3D Visualization"
                    description="Manipulate structures in real-time. Inspect bond lengths, angles, and molecular orbitals directly in the browser."
                />
                <FeatureCard 
                    icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
                    title="AI-Assisted Interpretation"
                    description="Integrates Google's Gemini AI to interpret complex dipole moments and energy gaps into plain English."
                />
                 <FeatureCard 
                    icon={<FileJson className="w-8 h-8 text-emerald-400" />}
                    title="Structured Data Export"
                    description="Download full simulation logs, raw output files, and JSON summaries for external processing."
                />
                 <FeatureCard 
                    icon={<CheckCircle2 className="w-8 h-8 text-orange-400" />}
                    title="Geometry Optimization"
                    description="Automatically find the minimum energy structure of your molecule using gradient descent algorithms."
                />
                 <FeatureCard 
                    icon={<Microscope className="w-8 h-8 text-rose-400" />}
                    title="Frequency Analysis"
                    description="Calculate vibrational modes and IR spectra to identify molecules and thermodynamic properties."
                />
            </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-[#050505]" />
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Built for Discovery</h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Whether you are an undergraduate student learning VSEPR theory or a researcher conducting preliminary screens, QuantaLab scales to your needs.
                    </p>
                    
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 bg-cyan-900/20 p-2 rounded-lg h-fit border border-cyan-500/20">
                                <GraduationCap className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-lg">For Education</h4>
                                <p className="text-slate-400 text-sm mt-1">Visualize abstract concepts like molecular orbitals and vibrational modes interactively.</p>
                            </div>
                        </div>
                         <div className="flex gap-4">
                            <div className="mt-1 bg-purple-900/20 p-2 rounded-lg h-fit border border-purple-500/20">
                                <Microscope className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-lg">For Research</h4>
                                <p className="text-slate-400 text-sm mt-1">Quickly prototype structures and estimate properties before committing to expensive cluster time.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-2xl blur-3xl" />
                    <div className="glass-panel p-2 rounded-2xl relative">
                        <img 
                            src="https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=3200&auto=format&fit=crop" 
                            alt="Interface Preview" 
                            className="rounded-xl border border-white/5 opacity-80"
                        />
                        <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-mono text-green-400">SIMULATION COMPLETE</span>
                            </div>
                            <div className="text-sm text-slate-300 font-mono">
                                > Energy: -76.421 Ha<br/>
                                > Dipole: 1.85 D<br/>
                                > HOMO-LUMO Gap: 0.45 eV
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-black pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to experiment?</h2>
            <p className="text-xl text-slate-400 mb-10 font-light">
                Join the platform transforming how computational chemistry is taught and practiced.
            </p>
            <Link 
              to="/simulator" 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black hover:bg-slate-200 font-bold text-lg transition-all"
            >
              Start for Free
              <ChevronRight className="w-5 h-5" />
            </Link>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#020202] pt-16 pb-8 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                  
                  {/* Brand Column */}
                  <div className="space-y-6">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                          <span className="text-white font-bold text-sm">Q</span>
                          </div>
                          <span className="text-xl font-bold tracking-tight text-white">
                          Quanta<span className="text-cyan-400">Lab</span>
                          </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                          Accelerating chemical discovery through accessible, high-performance web simulation tools.
                      </p>
                      <div className="flex items-center gap-4">
                          <a href="https://github.com/Khushi-Roy-123/QuantaLab" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors border border-white/5">
                              <Github className="w-4 h-4" />
                          </a>
                          <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-cyan-400 transition-colors border border-white/5">
                              <Twitter className="w-4 h-4" />
                          </a>
                          <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-blue-400 transition-colors border border-white/5">
                              <Linkedin className="w-4 h-4" />
                          </a>
                      </div>
                  </div>

                  {/* Links Columns */}
                  <div>
                      <h4 className="text-white font-semibold mb-6">Product</h4>
                      <ul className="space-y-4 text-sm text-slate-400">
                          <li><Link to="/simulator" className="hover:text-cyan-400 transition-colors">Simulator</Link></li>
                          <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
                          <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                          <li><a href="#" className="hover:text-cyan-400 transition-colors">Changelog</a></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="text-white font-semibold mb-6">Resources</h4>
                      <ul className="space-y-4 text-sm text-slate-400">
                          <li><Link to="/docs" className="hover:text-cyan-400 transition-colors">Documentation</Link></li>
                          <li><a href="#" className="hover:text-cyan-400 transition-colors">API Reference</a></li>
                          <li><a href="#" className="hover:text-cyan-400 transition-colors">Community</a></li>
                          <li><a href="#" className="hover:text-cyan-400 transition-colors">Research Papers</a></li>
                      </ul>
                  </div>

                  {/* Newsletter */}
                  <div>
                      <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
                      <p className="text-slate-400 text-sm mb-4">Get the latest updates on quantum chemistry algorithms.</p>
                      <form className="flex flex-col gap-2">
                          <div className="relative">
                              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                              <input 
                                  type="email" 
                                  placeholder="Enter your email" 
                                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                              />
                          </div>
                          <button type="button" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-cyan-900/20">
                              Subscribe
                          </button>
                      </form>
                  </div>
              </div>

              <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-slate-600 text-xs">
                      &copy; {new Date().getFullYear()} QuantaLab Inc. All rights reserved.
                  </p>
                  <div className="flex gap-6 text-xs text-slate-600">
                      <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                      <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
                      <a href="#" className="hover:text-slate-400 transition-colors">Cookie Settings</a>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
