import React, { useState } from 'react';
import { Job } from '../types';
import { analyzeResultsWithGemini } from '../services/geminiService';
import { Activity, Download, Zap, BrainCircuit, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsDashboardProps {
  job: Job;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ job }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const results = job.results;

  if (!results) return null;

  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    const text = await analyzeResultsWithGemini(results, job.moleculeName);
    setAiAnalysis(text);
    setAnalyzing(false);
  };

  const orbitalData = [
    { name: 'HOMO', energy: results.homoEnergy },
    { name: 'LUMO', energy: results.lumoEnergy },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Key Metrics Cards */}
        <div className="glass-panel p-5 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Energy</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{results.energy.toFixed(5)} <span className="text-sm font-normal text-slate-500">Ha</span></div>
        </div>

        <div className="glass-panel p-5 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium uppercase tracking-wider">HOMO-LUMO Gap</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">{results.gap.toFixed(4)} <span className="text-sm font-normal text-slate-500">Ha</span></div>
        </div>

        <div className="glass-panel p-5 rounded-xl sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Dipole Moment</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400 tracking-tight">
             {Math.sqrt(results.dipoleMoment.reduce((a,b) => a + b*b, 0)).toFixed(3)}
             <span className="text-sm font-normal text-slate-500"> D</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orbital Diagram */}
        <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-6">Molecular Orbitals</h3>
            <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orbitalData} barSize={60}>
                        <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} tickLine={{stroke: '#334155'}} axisLine={{stroke: '#334155'}} />
                        <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} tickLine={{stroke: '#334155'}} axisLine={{stroke: '#334155'}} label={{ value: 'Energy (Ha)', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        />
                        <Bar dataKey="energy">
                            {orbitalData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name === 'HOMO' ? '#0ea5e9' : '#f43f5e'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* AI Analysis Section */}
        <div className="glass-panel p-6 rounded-xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                    QuantaLab AI
                </h3>
                <button 
                    onClick={handleAIAnalysis}
                    disabled={analyzing || !!aiAnalysis}
                    className="text-xs font-medium bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-md transition-all disabled:opacity-50"
                >
                    {analyzing ? 'Thinking...' : aiAnalysis ? 'Analyzed' : 'Generate Report'}
                </button>
            </div>
            <div className="flex-1 bg-black/40 rounded-lg p-4 overflow-y-auto max-h-[250px] sm:max-h-[300px] border border-white/5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {aiAnalysis ? (
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-light">{aiAnalysis}</p>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                        <p className="text-sm">Click 'Generate Report' for AI interpretation.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {/* Downloads */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={() => window.alert("In a real deployment, this downloads a PDF report generated by the backend.")} 
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 rounded-lg transition-colors border border-white/10 text-sm font-medium w-full sm:w-auto justify-center"
        >
            <FileText className="w-4 h-4" />
            Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;