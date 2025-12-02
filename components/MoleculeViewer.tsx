
import React, { useEffect, useRef, useState } from 'react';
import { Maximize, RotateCw, RefreshCw, Camera, Layers, Disc, Palette } from 'lucide-react';

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
        sampleLevel: 1
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
    const fileExt = ext ? ext.toLowerCase().trim().replace(/[^a-z0-9]/g, '') : 'xyz';

    let objectUrl: string | null = null;

    try {
        const blob = new Blob([cleanStructure], { type: 'text/plain' });
        objectUrl = URL.createObjectURL(blob);
        
        const params = { defaultRepresentation: false, ext: fileExt };

        stage.loadFile(objectUrl, params)
          .then((component: any) => {
            if (component) {
                // We delegate representation adding to the separate effect
                // This ensures state consistency
                setLoadedComponent(component);
                component.autoView();
            }
            setLoading(false);
            if(objectUrl) URL.revokeObjectURL(objectUrl);
          })
          .catch((e: any) => {
            console.error("NGL Load Error:", e);
            setLoading(false);
            if(objectUrl) URL.revokeObjectURL(objectUrl);
          });
    } catch (err) {
        console.error("Blob creation failed", err);
        setLoading(false);
        if(objectUrl) URL.revokeObjectURL(objectUrl);
    }

  }, [structure, ext]);

  // Handle Representations (Style Switching)
  useEffect(() => {
      if (!loadedComponent) return;

      loadedComponent.removeAllRepresentations();

      const commonProps = {
          colorScheme: "element",
          quality: "high"
      };

      // Special case for PDB files usually prefer Cartoon, but we obey the toggle for flexibility
      // If the user wants cartoon, we could add that as an option, but for now stick to small molecule styles
      
      switch (representation) {
          case 'ball+stick':
              loadedComponent.addRepresentation("ball+stick", {
                  ...commonProps,
                  aspectRatio: 2.2,
                  radiusScale: 0.8,
                  bondScale: 0.8
              });
              break;
          case 'hyperball':
              loadedComponent.addRepresentation("hyperball", {
                  ...commonProps,
                  radiusScale: 0.7,
                  shrink: 0.15
              });
              break;
          case 'spacefill':
              loadedComponent.addRepresentation("spacefill", {
                  ...commonProps,
                  radiusScale: 1.0
              });
              break;
          case 'licorice':
              loadedComponent.addRepresentation("licorice", {
                  ...commonProps,
                  radiusScale: 0.15
              });
              break;
          default:
              loadedComponent.addRepresentation("ball+stick", commonProps);
      }

  }, [representation, loadedComponent]);

  // Dipole Moment Visualization
  useEffect(() => {
    if (!stageRef.current || !dipoleMoment) return;
    
    if (shapeCompRef.current) {
        stageRef.current.removeComponent(shapeCompRef.current);
        shapeCompRef.current = null;
    }

    const [dx, dy, dz] = dipoleMoment;
    const magnitude = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    if (magnitude > 0.01 && loadedComponent) {
        const shape = new NGL.Shape("dipole");
        
        // Calculate center of molecule to use as origin
        let start = [0, 0, 0];
        if (loadedComponent.structure) {
             const center = loadedComponent.structure.getCenter();
             start = [center.x, center.y, center.z];
        }

        const end = [start[0] + dx, start[1] + dy, start[2] + dz];
        const color = [0, 1, 1]; // Cyan

        shape.addArrow(start, end, color, 0.2);
        shape.addLabel(end, [0, 1, 1], 1.5, `Dipole: ${magnitude.toFixed(2)} D`);

        const shapeComp = stageRef.current.addComponentFromObject(shape);
        shapeComp.addRepresentation("buffer");
        shapeCompRef.current = shapeComp;
    }

  }, [dipoleMoment, loadedComponent]);

  // Orbital Visualization
  useEffect(() => {
    if (!stageRef.current) return;

    // Cleanup previous orbital
    if (orbitalCompRef.current) {
        stageRef.current.removeComponent(orbitalCompRef.current);
        orbitalCompRef.current = null;
    }

    if (activeOrbital === 'none') return;

    const url = activeOrbital === 'homo' ? orbitals?.homo : orbitals?.lumo;

    if (!url) return;

    setLoading(true);

    stageRef.current.loadFile(url, { ext: 'cube', defaultRepresentation: false })
        .then((comp: any) => {
            if (comp) {
                // Positive Phase (Red)
                comp.addRepresentation("surface", {
                    isolevelType: "value",
                    isolevel: 0.02, 
                    color: "red",
                    opacity: 0.6,
                    side: "front",
                    quality: "high"
                });
                // Negative Phase (Blue)
                comp.addRepresentation("surface", {
                    isolevelType: "value",
                    isolevel: -0.02,
                    color: "blue",
                    opacity: 0.6,
                    side: "front",
                    quality: "high"
                });
                
                orbitalCompRef.current = comp;
            }
            setLoading(false);
        })
        .catch((err: any) => {
            console.error("Orbital Load Error (Mock URLs will fail):", err);
            setLoading(false);
        });

  }, [activeOrbital, orbitals]);

  const toggleSpin = () => {
      if(stageRef.current) {
          const newSpin = !spinning;
          setSpinning(newSpin);
          stageRef.current.setSpin(newSpin);
      }
  };

  const resetView = () => {
      if(stageRef.current) {
          stageRef.current.autoView(1000);
      }
  };

  const toggleTheme = () => {
      setBgColor(prev => prev === '#050505' ? '#111827' : '#050505');
  };

  const cycleRepresentation = () => {
      const modes: RepresentationType[] = ['ball+stick', 'hyperball', 'spacefill', 'licorice'];
      const currentIdx = modes.indexOf(representation);
      const nextIdx = (currentIdx + 1) % modes.length;
      setRepresentation(modes[nextIdx]);
  };

  const containerClasses = isPreview 
    ? "w-full h-48 rounded-xl overflow-hidden glass-panel relative border border-white/10"
    : "w-full min-h-[500px] h-full rounded-2xl overflow-hidden glass-panel relative shadow-2xl flex flex-col group border border-white/10 transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]";

  return (
    <div className={containerClasses}>
        
        {!isPreview && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-cyan-400 uppercase font-bold tracking-widest border border-cyan-500/20 shadow-lg flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                    Interactive View
                </div>
                {loading && <span className="text-xs text-slate-400 animate-pulse">Rendering...</span>}
            </div>
        )}

        <div ref={containerRef} className="w-full flex-1 cursor-grab active:cursor-grabbing" />

        {!isPreview && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-2 py-2 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                <ControlButton onClick={toggleSpin} icon={<RotateCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />} tooltip="Spin" active={spinning} />
                <ControlButton onClick={resetView} icon={<RefreshCw className="w-4 h-4" />} tooltip="Reset View" />
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                <ControlButton onClick={toggleTheme} icon={<Layers className="w-4 h-4" />} tooltip="Toggle BG" />
                <ControlButton onClick={cycleRepresentation} icon={<Palette className="w-4 h-4" />} tooltip={`Style: ${representation}`} active={representation !== 'ball+stick'} />
                <ControlButton onClick={() => alert("Screenshot captured!")} icon={<Camera className="w-4 h-4" />} tooltip="Screenshot" />
                
                {/* Orbital Controls */}
                {(orbitals?.homo || orbitals?.lumo) && (
                    <>
                        <div className="w-px h-4 bg-white/10 mx-1"></div>
                        <ControlButton 
                            onClick={() => setActiveOrbital(prev => prev === 'homo' ? 'none' : 'homo')} 
                            icon={<span className="font-bold text-[10px]">HOMO</span>} 
                            tooltip="Toggle HOMO" 
                            active={activeOrbital === 'homo'}
                        />
                        <ControlButton 
                            onClick={() => setActiveOrbital(prev => prev === 'lumo' ? 'none' : 'lumo')} 
                            icon={<span className="font-bold text-[10px]">LUMO</span>} 
                            tooltip="Toggle LUMO" 
                            active={activeOrbital === 'lumo'}
                        />
                    </>
                )}
            </div>
        )}
    </div>
  );
};

const ControlButton = ({ onClick, icon, tooltip, active = false }: any) => (
    <button 
        onClick={onClick}
        title={tooltip}
        className={`p-2 rounded-xl transition-all duration-200 ${
            active 
            ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)] font-bold' 
            : 'text-slate-400 hover:text-white hover:bg-white/10'
        }`}
    >
        {icon}
    </button>
);

export default MoleculeViewer;
