
import React, { useEffect, useRef, useState } from 'react';
import { Maximize, RotateCw, RefreshCw, Camera, Layers, Disc, Palette, Plus, Minus, Eye, EyeOff } from 'lucide-react';

// Declare NGL globally as it is loaded via script tag
declare const NGL: any;

interface MoleculeViewerProps {
  structure: string; // PDB, SDF, XYZ string
  ext: string;       // extension like "xyz", "pdb"
  dipoleMoment?: number[];
  orbitals?: {
    homo?: string;
    lumo?: string;
  };
  variant?: 'default' | 'preview';
}

type RepresentationType = 'ball+stick' | 'hyperball' | 'spacefill' | 'licorice';

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ structure, ext, dipoleMoment, orbitals, variant = 'default' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const shapeCompRef = useRef<any>(null); // Ref for dipole arrow
  const orbitalCompRef = useRef<any>(null); // Ref for orbital surface
  
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [bgColor, setBgColor] = useState('#050505');
  const [loadedComponent, setLoadedComponent] = useState<any>(null);
  
  const [activeOrbital, setActiveOrbital] = useState<'none' | 'homo' | 'lumo'>('none');
  const [showPositive, setShowPositive] = useState(true);
  const [showNegative, setShowNegative] = useState(true);
  
  const [representation, setRepresentation] = useState<RepresentationType>('ball+stick');

  const isPreview = variant === 'preview';

  // Initialize NGL Stage
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Check if NGL is loaded
    if (typeof NGL === 'undefined') {
        console.error("NGL.js not loaded. Please check your internet connection or script tag.");
        setLoading(false);
        return;
    }

    // Initialize with high quality settings
    const stage = new NGL.Stage(containerRef.current, { 
        backgroundColor: bgColor,
        quality: 'high',
        sampleLevel: 1,
        tooltip: !isPreview // Disable tooltip in preview mode if needed
    });
    stageRef.current = stage;

    const handleResize = () => stage.handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      try { stage.dispose(); } catch (e) { /* ignore */ }
    };
  }, []);

  // Update background
  useEffect(() => {
      if(stageRef.current) {
          stageRef.current.setParameters({ backgroundColor: bgColor });
      }
  }, [bgColor]);

  // Load Structure
  useEffect(() => {
    if (!stageRef.current) return;
    
    // Reset components when structure changes
    setLoadedComponent(null);
    setActiveOrbital('none'); // Reset orbital view
    
    // Clear shapes/orbitals
    if (shapeCompRef.current) {
        stageRef.current.removeComponent(shapeCompRef.current);
        shapeCompRef.current = null;
    }
    if (orbitalCompRef.current) {
        stageRef.current.removeComponent(orbitalCompRef.current);
        orbitalCompRef.current = null;
    }

    if (!structure || !structure.trim()) {
        setLoading(false);
        return;
    }

    const stage = stageRef.current;
    stage.removeAllComponents();
    setLoading(true);

    const cleanStructure = structure.trim();
    // Use File object to ensure NGL auto-detection works based on filename
    const fileExt = ext ? ext.toLowerCase().trim() : 'xyz';
    const fileName = `molecule.${fileExt}`;

    try {
        const file = new File([cleanStructure], fileName, { type: 'text/plain' });
        
        // Load the file
        stage.loadFile(file, { defaultRepresentation: false }).then((component: any) => {
            setLoadedComponent(component);
            component.autoView();
            setLoading(false);
        }).catch((err: any) => {
            console.error("NGL Load Error:", err);
            setLoading(false);
        });

    } catch (e) {
        console.error("File API Error:", e);
        // Fallback for environments without File API (unlikely in modern browsers)
        const blob = new Blob([cleanStructure], { type: 'text/plain' });
        stage.loadFile(blob, { ext: fileExt, defaultRepresentation: false }).then((component: any) => {
            setLoadedComponent(component);
            component.autoView();
            setLoading(false);
        });
    }

  }, [structure, ext]);


  // Handle Representation Switching
  useEffect(() => {
      if (!loadedComponent) return;

      loadedComponent.removeAllRepresentations();

      const commonProps = { selenium: true, quality: 'high' };

      switch (representation) {
          case 'ball+stick':
              loadedComponent.addRepresentation('ball+stick', { 
                  ...commonProps,
                  aspectRatio: 2.0,
                  radiusScale: 2.0,
              });
              break;
          case 'hyperball':
              loadedComponent.addRepresentation('hyperball', {
                  ...commonProps,
                  scale: 0.3
              });
              break;
          case 'spacefill':
              loadedComponent.addRepresentation('spacefill', {
                  ...commonProps,
                  scale: 1.0
              });
              break;
          case 'licorice':
              loadedComponent.addRepresentation('licorice', {
                  ...commonProps,
                  aspectRatio: 2.0,
                  radiusScale: 2.0,
              });
              break;
      }
  }, [loadedComponent, representation]);


  // Handle Spin
  useEffect(() => {
    if (stageRef.current) {
      if (spinning) {
        stageRef.current.setSpin(true);
      } else {
        stageRef.current.setSpin(false);
      }
    }
  }, [spinning]);


  // Handle Dipole Visualization
  useEffect(() => {
      if (!stageRef.current || !dipoleMoment || !loadedComponent) {
          // Cleanup if dipole removed
          if (shapeCompRef.current && stageRef.current) {
              stageRef.current.removeComponent(shapeCompRef.current);
              shapeCompRef.current = null;
          }
          return;
      }

      // Cleanup previous
      if (shapeCompRef.current) {
          stageRef.current.removeComponent(shapeCompRef.current);
      }

      // Calculate Center of Molecule
      const center = loadedComponent.structure.getCenter();
      
      const shape = new NGL.Shape('dipole');
      
      // Scale arrow length
      const magnitude = Math.sqrt(dipoleMoment.reduce((a,b) => a + b*b, 0));
      const scaleFactor = 2.0; 
      
      const end = [
          center.x + dipoleMoment[0] * scaleFactor, 
          center.y + dipoleMoment[1] * scaleFactor, 
          center.z + dipoleMoment[2] * scaleFactor
      ];

      shape.addArrow([center.x, center.y, center.z], end, [0, 1, 1], 0.2, "Dipole");
      shape.addText(end, [0, 1, 1], 1.5, ` ${magnitude.toFixed(2)} D`);

      shapeCompRef.current = stageRef.current.addComponentFromObject(shape);
      shapeCompRef.current.addRepresentation('buffer');

  }, [dipoleMoment, loadedComponent]);


  // Handle Orbital Visualization
  useEffect(() => {
      const stage = stageRef.current;
      if (!stage || !orbitals || activeOrbital === 'none') {
          if (orbitalCompRef.current) {
              stage.removeComponent(orbitalCompRef.current);
              orbitalCompRef.current = null;
          }
          return;
      }

      const url = activeOrbital === 'homo' ? orbitals.homo : orbitals.lumo;
      if (!url) return;

      // Avoid reloading if it's the same component (basic check)
      if (orbitalCompRef.current && orbitalCompRef.current.name === activeOrbital) {
          // Just update visibility if needed, but for now we reload to be safe or update representation
          // We'll update representation below
      } else {
           if (orbitalCompRef.current) {
              stage.removeComponent(orbitalCompRef.current);
          }

          setLoading(true);
          stage.loadFile(url, { name: activeOrbital, defaultRepresentation: false })
            .then((comp: any) => {
                orbitalCompRef.current = comp;
                setLoading(false);
            })
            .catch((e: any) => {
                console.error("Failed to load orbital cube:", e);
                setLoading(false);
            });
      }

  }, [activeOrbital, orbitals]);

  // Update Orbital Representations (Phases)
  useEffect(() => {
      if (orbitalCompRef.current) {
          orbitalCompRef.current.removeAllRepresentations();
          
          if (showPositive) {
              orbitalCompRef.current.addRepresentation('surface', {
                  isolevelType: 'value',
                  isolevel: 0.02,
                  color: 'red',
                  opacity: 0.5,
                  side: 'front',
                  quality: 'high'
              });
          }
          
          if (showNegative) {
              orbitalCompRef.current.addRepresentation('surface', {
                  isolevelType: 'value',
                  isolevel: -0.02,
                  color: 'blue',
                  opacity: 0.5,
                  side: 'front',
                  quality: 'high'
              });
          }
      }
  }, [showPositive, showNegative, activeOrbital, loading]);


  const toggleRepresentation = () => {
      const modes: RepresentationType[] = ['ball+stick', 'hyperball', 'spacefill', 'licorice'];
      const nextIndex = (modes.indexOf(representation) + 1) % modes.length;
      setRepresentation(modes[nextIndex]);
  };

  return (
    <div 
        className={`relative rounded-2xl overflow-hidden border border-white/10 group transition-all duration-500 ${isPreview ? 'h-48' : 'h-[500px] hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]'}`}
        ref={containerRef}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center gap-3">
             <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="text-xs font-bold text-cyan-400 tracking-wider">RENDERING</span>
          </div>
        </div>
      )}
      
      {/* Interactive Badge */}
      {!isPreview && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Move3dIcon className="w-3 h-3" />
                Interactive View
            </div>
        </div>
      )}

      {/* Control Toolbar */}
      {!isPreview && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 p-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
            
            <TooltipButton label="Spin" onClick={() => setSpinning(!spinning)} active={spinning}>
                <RotateCw className="w-4 h-4" />
            </TooltipButton>
            
            <TooltipButton label="Reset View" onClick={() => loadedComponent?.autoView()}>
                <Maximize className="w-4 h-4" />
            </TooltipButton>

            <TooltipButton label="Screenshot" onClick={() => stageRef.current?.makeImage().then((blob: Blob) => {
                 const link = document.createElement('a');
                 link.href = URL.createObjectURL(blob);
                 link.download = `structure_view.png`;
                 link.click();
            })}>
                <Camera className="w-4 h-4" />
            </TooltipButton>

            <div className="w-px h-4 bg-white/10 mx-1"></div>

            <TooltipButton label={`Style: ${representation}`} onClick={toggleRepresentation}>
                <Palette className="w-4 h-4 text-emerald-400" />
            </TooltipButton>
            
            <TooltipButton label="Theme" onClick={() => setBgColor(bgColor === '#050505' ? '#0f172a' : '#050505')}>
                <Disc className="w-4 h-4 text-purple-400" />
            </TooltipButton>

            {orbitals && (
                <>
                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/5">
                        <button 
                            onClick={() => setActiveOrbital(activeOrbital === 'homo' ? 'none' : 'homo')}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${activeOrbital === 'homo' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            HOMO
                        </button>
                        <button 
                             onClick={() => setActiveOrbital(activeOrbital === 'lumo' ? 'none' : 'lumo')}
                             className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${activeOrbital === 'lumo' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            LUMO
                        </button>

                        {activeOrbital !== 'none' && (
                             <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-white/10">
                                <button onClick={() => setShowPositive(!showPositive)} className={`p-0.5 rounded ${showPositive ? 'text-red-400' : 'text-slate-600'}`} title="Toggle Positive Phase">
                                    {showPositive ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                </button>
                                <button onClick={() => setShowNegative(!showNegative)} className={`p-0.5 rounded ${showNegative ? 'text-blue-400' : 'text-slate-600'}`} title="Toggle Negative Phase">
                                    {showNegative ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                </button>
                             </div>
                        )}
                    </div>
                </>
            )}
          </div>
      )}
    </div>
  );
};

// Helper for toolbar buttons
const TooltipButton = ({ children, onClick, active, label }: any) => (
    <button
        onClick={onClick}
        title={label}
        className={`p-2 rounded-lg transition-all ${active ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
    >
        {children}
    </button>
);

// Simple icon for the badge
const Move3dIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" />
        <path d="M12 12L12 21" />
        <path d="M12 12L20 7.5" />
        <path d="M12 12L4 7.5" />
    </svg>
);

export default MoleculeViewer;
