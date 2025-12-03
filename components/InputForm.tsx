
import React, { useState, useRef } from 'react';
import { THEORIES, BASIS_SETS, PRESET_MOLECULES } from '../constants';
import { MoleculeData, CalculationOptions } from '../types';
import { Atom, Play, UploadCloud, FileText, X, Zap, Move3d, Waves, Settings2, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';
import MoleculeViewer from './MoleculeViewer';

interface InputFormProps {
  onSubmit: (mol: MoleculeData, opts: CalculationOptions) => void;
  isLoading: boolean;
}

type InputMode = 'manual' | 'upload';

const JOB_TYPES = [
  { id: 'energy', label: 'Energy Point', icon: Zap, description: 'Calculate total energy' },
  { id: 'optimization', label: 'Geometry Opt', icon: Move3d, description: 'Find stable structure' },
  { id: 'frequency', label: 'Frequencies', icon: Waves, description: 'Vibrational analysis' }
] as const;

const SOLVENTS = ['Vacuum', 'Water', 'Ethanol', 'Benzene', 'Chloroform', 'THF'];

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [mode, setMode] = useState<InputMode>('manual');
  
  // Manual State
  const [smiles, setSmiles] = useState('CCO'); // Default Ethanol
  const [name, setName] = useState('Ethanol');
  
  // Upload State
  const [uploadedFile, setUploadedFile] = useState<{name: string, content: string, ext: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calc Options
  const [theory, setTheory] = useState(THEORIES[1]); // B3LYP
  const [basis, setBasis] = useState(BASIS_SETS[2]); // 6-31G*
  const [calcType, setCalcType] = useState<CalculationOptions['calcType']>('optimization');
  
  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [charge, setCharge] = useState(0);
  const [multiplicity, setMultiplicity] = useState(1);
  const [solvation, setSolvation] = useState(SOLVENTS[0]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const rawExt = fileName.split('.').pop() || '';
    const ext = rawExt.toLowerCase().trim();

    if (!['xyz', 'mol', 'pdb', 'sdf'].includes(ext)) {
      alert("Unsupported file format. Please use XYZ, MOL, PDB, or SDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setUploadedFile({
        name: fileName,
        content: content,
        ext: ext
      });
      // Auto-fill name based on filename if empty
      if (name === 'Ethanol' || name === '') {
        setName(fileName.split('.')[0]);
      }
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadPreset = (presetName: string) => {
      const preset = PRESET_MOLECULES.find(p => p.name === presetName);
      if (preset) {
          setSmiles(preset.smiles);
          setName(preset.name);
          setMode('manual');
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const moleculeData: MoleculeData = {
      name,
    };

    if (mode === 'manual') {
      moleculeData.smiles = smiles;
    } else {
      if (!uploadedFile) {
        alert("Please upload a molecule file.");
        return;
      }
      moleculeData.structure = uploadedFile.content;
      moleculeData.format = uploadedFile.ext;
    }

    onSubmit(moleculeData, { 
        theory, 
        basis, 
        calcType,
        charge,
        multiplicity,
        solvation
    });
  };

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 relative overflow-hidden">
      {/* Background Accent - Violet */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 shadow-lg shadow-cyan-900/20 flex-shrink-0">
            <Settings2 className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Configuration</h2>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">Set up your simulation parameters</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        
        {/* Input Mode Toggles */}
        <div className="flex p-1 bg-black/40 rounded-xl border border-white/10 backdrop-blur-sm">
            <button
                type="button"
                onClick={() => setMode('manual')}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 ${mode === 'manual' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-white'}`}
            >
                SMILES Input
            </button>
            <button
                type="button"
                onClick={() => setMode('upload')}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 ${mode === 'upload' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-white'}`}
            >
                File Upload
            </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Molecule Name</label>
             <select 
                onChange={(e) => loadPreset(e.target.value)}
                className="text-[10px] bg-white/5 border border-white/10 rounded px-2 py-0.5 text-cyan-400 cursor-pointer outline-none hover:bg-white/10"
                value=""
             >
                 <option value="" disabled>Quick Load...</option>
                 {PRESET_MOLECULES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
             </select>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
            placeholder="e.g. Caffeine"
            required
          />
        </div>

        {mode === 'manual' ? (
            <div className="animate-fade-in space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Structure (SMILES)</label>
                <div className="relative">
                    <Atom className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={smiles}
                        onChange={(e) => setSmiles(e.target.value)}
                        className="w-full glass-input rounded-xl pl-10 pr-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500/50 transition-all text-cyan-300 placeholder:text-slate-600"
                        placeholder="e.g. CN1C=NC2=C1C(=O)N(C(=O)N2C)C"
                        required
                    />
                </div>
            </div>
        ) : (
            <div className="animate-fade-in space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Structure File</label>
                {!uploadedFile ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-24 sm:h-28 border border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group hover:border-cyan-500/40"
                    >
                        <div className="p-2 sm:p-3 bg-black/20 rounded-full mb-2 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">Drop XYZ, MOL, PDB here</span>
                        <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept=".xyz,.mol,.pdb,.sdf" 
                            className="hidden" 
                            onChange={handleFileChange}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="w-full p-3 bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-xl flex items-center justify-between group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0">
                                    <FileText className="w-4 h-4 text-cyan-400" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm text-white truncate font-medium">{uploadedFile.name}</span>
                                    <span className="text-[10px] text-cyan-300/70 uppercase font-bold tracking-wider">{uploadedFile.ext} File</span>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={clearFile}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        {/* File Preview */}
                        <div className="animate-fade-in">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                Structure Preview
                            </div>
                            <MoleculeViewer 
                                structure={uploadedFile.content} 
                                ext={uploadedFile.ext} 
                                variant="preview"
                            />
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Responsive Grid for Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Theory</label>
            <div className="relative">
                <select
                value={theory}
                onChange={(e) => setTheory(e.target.value)}
                className="w-full appearance-none glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 transition-all [&>option]:bg-slate-900 cursor-pointer"
                >
                {THEORIES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Basis Set</label>
            <div className="relative">
                <select
                value={basis}
                onChange={(e) => setBasis(e.target.value)}
                className="w-full appearance-none glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 transition-all [&>option]:bg-slate-900 cursor-pointer"
                >
                {BASIS_SETS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings Toggle */}
        <div className="border border-white/5 rounded-xl overflow-hidden bg-black/20">
            <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
                <span className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" />
                    Advanced Settings
                </span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showAdvanced && (
                <div className="p-4 pt-0 grid grid-cols-2 gap-4 animate-fade-in border-t border-white/5 bg-black/10">
                    <div className="col-span-1 space-y-1.5 mt-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Charge</label>
                        <input
                            type="number"
                            value={charge}
                            onChange={(e) => setCharge(parseInt(e.target.value) || 0)}
                            className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500/50"
                        />
                    </div>
                    <div className="col-span-1 space-y-1.5 mt-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Multiplicity</label>
                        <input
                            type="number"
                            min="1"
                            value={multiplicity}
                            onChange={(e) => setMultiplicity(parseInt(e.target.value) || 1)}
                            className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500/50"
                        />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Solvation Model</label>
                        <div className="relative">
                            <select
                                value={solvation}
                                onChange={(e) => setSolvation(e.target.value)}
                                className="w-full appearance-none glass-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500/50 [&>option]:bg-slate-900 cursor-pointer"
                            >
                                {SOLVENTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-3 top-2.5 pointer-events-none text-slate-500">
                                <ChevronDown className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculation Type</label>
            <div className="grid grid-cols-3 gap-2">
                {JOB_TYPES.map((type) => {
                    const Icon = type.icon;
                    const active = calcType === type.id;
                    return (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => setCalcType(type.id as any)}
                            className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                                active 
                                ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10 hover:text-slate-200'
                            }`}
                        >
                            <Icon className={`w-5 h-5 mb-1.5 transition-colors ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span className="text-[10px] font-bold text-center leading-tight truncate w-full">{type.label}</span>
                            {active && <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />}
                        </button>
                    );
                })}
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 relative overflow-hidden group ${
            isLoading 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_25px_rgba(139,92,246,0.6)] border border-cyan-500/20'
          }`}
        >
          {isLoading ? (
             <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                 <span>PROCESSING...</span>
             </div>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              RUN SIMULATION
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
