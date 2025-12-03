
import React, { useState } from 'react';
import { Job } from '../types';
import { analyzeResultsWithGemini } from '../services/geminiService';
import { downloadReport } from '../services/api';
import { Activity, Download, Zap, BrainCircuit, FileText, FileJson, ChevronDown, Printer, Copy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface ResultsDashboardProps {
  job: Job;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ job }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const results = job.results;

  if (!results) return null;

  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    const text = await analyzeResultsWithGemini(results, job.moleculeName);
    setAiAnalysis(text);
    setAnalyzing(false);
  };

  // Helper to convert Hartree to eV (1 Ha = 27.2114 eV)
  const toEV = (ha: number) => (ha * 27.2114).toFixed(2);

  const generateHTMLReport = () => {
      const date = new Date(job.createdAt).toLocaleString();
      const dipoleMag = Math.sqrt(results.dipoleMoment.reduce((a,b) => a + b*b, 0)).toFixed(4);
      
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>QuantaLab Report - ${job.moleculeName}</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
                .header { border-bottom: 2px solid #8b5cf6; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { margin: 0; color: #1a1a1a; font-size: 28px; }
                .header .meta { color: #666; font-size: 14px; margin-top: 5px; }
                .section { margin-bottom: 30px; background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
                .section h2 { margin-top: 0; font-size: 18px; color: #4b5563; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
                th { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
                .value { font-family: 'Courier New', monospace; font-weight: bold; color: #8b5cf6; }
                .ai-analysis { background: #f0fdfa; border: 1px solid #ccfbf1; padding: 20px; border-radius: 8px; color: #115e59; white-space: pre-wrap; }
                .structure-block { background: #111; color: #0ea5e9; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 12px; overflow-x: auto; }
                .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
                @media print {
                    body { padding: 0; }
                    .section { break-inside: avoid; border: 1px solid #ccc; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Computational Chemistry Report</h1>
                <div class="meta">
                    <strong>Molecule:</strong> ${job.moleculeName} &bull; 
                    <strong>Job ID:</strong> ${job.id} &bull; 
                    <strong>Date:</strong> ${date}
                </div>
            </div>

            <div class="section">
                <h2>Calculation Parameters</h2>
                <table>
                    <tr><th>Method (Theory)</th><td>${job.theory}</td></tr>
                    <tr><th>Basis Set</th><td>${job.basisSet}</td></tr>
                    <tr><th>Software Engine</th><td>Psi4 via QuantaLab</td></tr>
                </table>
            </div>

            <div class="section">
                <h2>Electronic Properties</h2>
                <table>
                    <tr>
                        <th>Property</th>
                        <th>Value (Atomic Units)</th>
                        <th>Value (eV / Debye)</th>
                    </tr>
                    <tr>
                        <td>Total Energy</td>
                        <td class="value">${results.energy.toFixed(6)} Ha</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>HOMO Energy</td>
                        <td class="value">${results.homoEnergy.toFixed(4)} Ha</td>
                        <td class="value">${toEV(results.homoEnergy)} eV</td>
                    </tr>
                    <tr>
                        <td>LUMO Energy</td>
                        <td class="value">${results.lumoEnergy.toFixed(4)} Ha</td>
                        <td class="value">${toEV(results.lumoEnergy)} eV</td>
                    </tr>
                    <tr>
                        <td>HOMO-LUMO Gap</td>
                        <td class="value">${results.gap.toFixed(4)} Ha</td>
                        <td class="value" style="color: #10b981;">${toEV(results.gap)} eV</td>
                    </tr>
                    <tr>
                        <td>Dipole Moment</td>
                        <td>Vector: [${results.dipoleMoment.map(n => n.toFixed(2)).join(', ')}]</td>
                        <td class="value">${dipoleMag} D</td>
                    </tr>
                </table>
            </div>

            ${aiAnalysis ? `
            <div class="section">
                <h2>AI Interpretation</h2>
                <div class="ai-analysis">${aiAnalysis}</div>
            </div>
            ` : ''}

            <div class="section">
                <h2>Optimized Geometry (XYZ)</h2>
                <div class="structure-block">
${results.optimizedStructure || job.structure || "Structure not available"}
                </div>
            </div>

            <div class="footer">
                Generated by QuantaLab Web Simulator
            </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Report_${job.moleculeName}_${new Date().toISOString().slice(0,10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };

  const handleJsonExport = () => {
      const exportData = {
          meta: {
              version: "1.0",
              generated: new Date().toISOString(),
              job_id: job.id
          },
          input: {
              molecule: job.moleculeName,
              smiles: job.smiles,
              theory: job.theory,
              basis: job.basisSet
          },
          output: results,
          ai_analysis: aiAnalysis || null
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Data_${job.moleculeName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
        <div className="glass-panel p-5 rounded-xl border border-[#8b5cf6]/20 shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Energy</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{results.energy.toFixed(5)} <span className="text-sm font-normal text-slate-500">Ha</span></div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-[#8b5cf6]/20 shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium uppercase tracking-wider">HOMO-LUMO Gap</span>
          </div>
          <div className="flex items-baseline gap-2">
             <div className="text-2xl font-bold text-emerald-400 tracking-tight">{results.gap.toFixed(4)} <span className="text-sm font-normal text-slate-500">Ha</span></div>
             <div className="text-sm text-slate-500">({toEV(results.gap)} eV)</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl sm:col-span-2 lg:col-span-1 border border-[#8b5cf6]/20 shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Dipole Moment</span>
          </div>
          <div className="text-2xl font-bold text-[#8b5cf6] tracking-tight">
             {Math.sqrt(results.dipoleMoment.reduce((a,b) => a + b*b, 0)).toFixed(3)}
             <span className="text-sm font-normal text-slate-500"> D</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orbital Diagram */}
        <div className="glass-panel p-6 rounded-xl flex flex-col border border-white/5">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-white">Molecular Orbitals</h3>
                <div className="text-xs text-slate-400 text-right">
                    <div>Frontier Orbitals Analysis</div>
                    <div>Theory: {job.theory}/{job.basisSet}</div>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 h-full">
                {/* Chart */}
                <div className="h-64 sm:h-auto flex-1 w-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={orbitalData} barSize={40} margin={{top: 20, right: 30, left: 0, bottom: 5}}>
                            <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} tickLine={{stroke: '#334155'}} axisLine={{stroke: '#334155'}} />
                            <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} tickLine={{stroke: '#334155'}} axisLine={{stroke: '#334155'}} label={{ value: 'Energy (Ha)', angle: -90, position: 'insideLeft', fill: '#64748b', offset: 10 }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                formatter={(value: number) => [value.toFixed(4) + ' Ha', 'Energy']}
                            />
                            <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
                            <Bar dataKey="energy">
                                {orbitalData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'HOMO' ? '#8b5cf6' : '#f43f5e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Values & Downloads */}
                <div className="sm:w-48 flex flex-col justify-center gap-4">
                     <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-rose-500/30 transition-colors">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">LUMO</div>
                        <div className="text-lg font-bold text-rose-400">{results.lumoEnergy.toFixed(4)} Ha</div>
                        <div className="text-xs text-slate-400">{toEV(results.lumoEnergy)} eV</div>
                        
                        {results.lumoCubeUrl && (
                             <a 
                                href={results.lumoCubeUrl}
                                download
                                onClick={(e) => { 
                                  if(results.lumoCubeUrl?.startsWith('/mock')) { 
                                    e.preventDefault(); 
                                    alert("Demo Mode: This would download the LUMO cube file in a production environment."); 
                                  }
                                }}
                                className="mt-2 flex items-center gap-1.5 text-[10px] text-rose-300 hover:text-white transition-colors cursor-pointer"
                             >
                                 <Download className="w-3 h-3" /> Cube File
                             </a>
                        )}
                     </div>

                     <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-[#8b5cf6]/30 transition-colors">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">HOMO</div>
                        <div className="text-lg font-bold text-[#8b5cf6]">{results.homoEnergy.toFixed(4)} Ha</div>
                        <div className="text-xs text-slate-400">{toEV(results.homoEnergy)} eV</div>

                        {results.homoCubeUrl && (
                             <a 
                                href={results.homoCubeUrl}
                                download
                                onClick={(e) => { 
                                  if(results.homoCubeUrl?.startsWith('/mock')) { 
                                    e.preventDefault(); 
                                    alert("Demo Mode: This would download the HOMO cube file in a production environment."); 
                                  }
                                }}
                                className="mt-2 flex items-center gap-1.5 text-indigo-300 hover:text-white transition-colors cursor-pointer"
                             >
                                 <Download className="w-3 h-3" /> Cube File
                             </a>
                        )}
                     </div>
                </div>
            </div>
        </div>

        {/* AI Analysis Section */}
        <div className="glass-panel p-6 rounded-xl flex flex-col border border-white/5">
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
                        <p className="text-xs mt-2 opacity-50">This analysis will be included in your downloadable report.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {/* Downloads */}
      <div className="flex justify-end pt-4 border-t border-white/5 relative">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setShowExportMenu(!showExportMenu)} 
                className="flex items-center gap-2 px-6 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl transition-all shadow-[0_4px_14px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] text-sm font-bold tracking-wide group"
            >
                <FileText className="w-4 h-4" />
                Export Results
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
        </div>

        {showExportMenu && (
            <div className="absolute bottom-16 right-0 w-64 glass-panel rounded-xl border border-white/10 shadow-2xl p-2 animate-fade-in-up z-20 flex flex-col gap-1">
                 <button 
                    onClick={() => { generateHTMLReport(); setShowExportMenu(false); }}
                    className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg text-left transition-colors group"
                >
                    <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30">
                        <Printer className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">Lab Report</div>
                        <div className="text-[10px] text-slate-400">Professional HTML format</div>
                    </div>
                </button>

                <div className="h-px bg-white/5 my-1"></div>

                 <button 
                    onClick={() => { handleJsonExport(); setShowExportMenu(false); }}
                    className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg text-left transition-colors group"
                >
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30">
                        <FileJson className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">Raw Data</div>
                        <div className="text-[10px] text-slate-400">JSON format for analysis</div>
                    </div>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;
