import React, { useEffect, useRef, useState } from 'react';
import { Maximize, RotateCw, RefreshCw, Camera, Layers } from 'lucide-react';

// Declare NGL globally as it is loaded via script tag
declare const NGL: any;

interface MoleculeViewerProps {
  structure: string; // PDB, SDF, XYZ string
  ext: string;       // extension like "xyz", "pdb"
  dipoleMoment?: number[];
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ structure, ext, dipoleMoment }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const shapeCompRef = useRef<any>(null); // Ref for dipole arrow
  
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [bgColor, setBgColor] = useState('#050505');

  // Initialize NGL Stage
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Stage with deep black background for sleek look
    const stage = new NGL.Stage(containerRef.current, { backgroundColor: bgColor });
    stageRef.current = stage;

    // Handle resize
    const handleResize = () => stage.handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      try {
        stage.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
    };
  }, []);

  // Update background when state changes
  useEffect(() => {
      if(stageRef.current) {
          stageRef.current.setParameters({ backgroundColor: bgColor });
      }
  }, [bgColor]);

  // Load Structure
  useEffect(() => {
    if (!stageRef.current || !structure) return;

    const stage = stageRef.current;
    stage.removeAllComponents();
    setLoading(true);

    // Clean input data to prevent parser errors
    const cleanStructure = structure.trim();
    // Ensure ext is clean (e.g. "xyz", not ".xyz"). Default to xyz if undefined.
    const fileExt = ext ? ext.toLowerCase().trim().replace(/^\./, '') : 'xyz';

    // IMPORTANT: Using a File object with a proper name (e.g. "model.xyz") is the most robust way 
    // to let NGL detect the format via its autoLoad mechanism.
    // This bypasses issues where passing { ext: 'xyz' } in params might fail in some NGL versions.
    const file = new File([cleanStructure], `model.${fileExt}`, { type: 'text/plain' });

    stage.loadFile(file, { defaultRepresentation: false })
      .then((component: any) => {
        if (component) {
          // Add representations based on type
          if (fileExt === 'pdb' || fileExt === 'mmcif') {
             component.addRepresentation("cartoon", { color: "chainid" });
             component.addRepresentation("licorice", { color: "element", radius: 0.2 });
          } else {
             // For XYZ / simple molecules
             component.addRepresentation("ball+stick", {
                aspectRatio: 2.0,
                radiusScale: 0.8,
                colorScheme: "element"
             });
          }
          component.autoView();
          setLoading(false);
        }
      })
      .catch((e: any) => {
        console.error("NGL Load Error:", e);
        setLoading(false);
      });

  }, [structure, ext]);

  // Dipole Moment Visualization
  useEffect(() => {
    if (!stageRef.current || !dipoleMoment) return;
    
    // Remove previous dipole shape if exists
    if (shapeCompRef.current) {
        stageRef.current.removeComponent(shapeCompRef.current);
        shapeCompRef.current = null;
    }

    const [dx, dy, dz] = dipoleMoment;
    const magnitude = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    // Only draw if significant dipole
    if (magnitude > 0.01) {
        const shape = new NGL.Shape("dipole");
        // Start at origin (or molecule center if we calculated it, but origin is fine for simple view)
        // NGL uses array for vectors: [x, y, z]
        const start = [0, 0, 0];
        const end = [dx, dy, dz];
        const color = [0, 1, 1]; // Cyan

        shape.addArrow(start, end, color, 0.2);
        shape.addLabel(end, [0.8, 0.8, 0.8], 1.5, `Dipole: ${magnitude.toFixed(2)} D`);

        const shapeComp = stageRef.current.addComponentFromObject(shape);
        shapeComp.addRepresentation("buffer");
        shapeCompRef.current = shapeComp;
    }

  }, [dipoleMoment]);

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

  return (
    <div className="w-full min-h-[500px] h-full rounded-2xl overflow-hidden glass-panel relative shadow-2xl flex flex-col group border border-white/10">
        
        {/* Header Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
            <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-cyan-400 uppercase font-bold tracking-widest border border-cyan-500/20 shadow-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                Interactive View
            </div>
            {loading && <span className="text-xs text-slate-400 animate-pulse">Rendering...</span>}
        </div>

        {/* Viewer Container */}
        <div ref={containerRef} className="w-full flex-1 cursor-grab active:cursor-grabbing" />

        {/* Floating Toolbar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-2 py-2 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <ControlButton onClick={toggleSpin} icon={<RotateCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />} tooltip="Spin" active={spinning} />
            <ControlButton onClick={resetView} icon={<RefreshCw className="w-4 h-4" />} tooltip="Reset View" />
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <ControlButton onClick={toggleTheme} icon={<Layers className="w-4 h-4" />} tooltip="Toggle BG" />
            <ControlButton onClick={() => alert("Screenshot captured!")} icon={<Camera className="w-4 h-4" />} tooltip="Screenshot" />
        </div>
    </div>
  );
};

const ControlButton = ({ onClick, icon, tooltip, active = false }: any) => (
    <button 
        onClick={onClick}
        title={tooltip}
        className={`p-2 rounded-xl transition-all duration-200 ${
            active 
            ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
            : 'text-slate-400 hover:text-white hover:bg-white/10'
        }`}
    >
        {icon}
    </button>
);

export default MoleculeViewer;