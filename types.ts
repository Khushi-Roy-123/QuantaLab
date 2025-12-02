
export interface Job {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  moleculeName: string;
  smiles?: string;
  structure?: string; // Raw content for XYZ/PDB/MOL
  format?: string;    // 'xyz', 'pdb', 'mol', 'sdf'
  theory: string;
  basisSet: string;
  createdAt: string;
  results?: SimulationResults;
  error?: string;
}

export interface SimulationResults {
  energy: number;
  dipoleMoment: number[];
  homoEnergy: number;
  lumoEnergy: number;
  gap: number;
  frequencies?: number[];
  orbitalsUrl?: string;
  outputLog?: string;
  optimizedStructure?: string; // XYZ string of the optimized geometry
  intensities?: number[];
}

export interface MoleculeData {
  smiles?: string;
  name: string;
  structure?: string;
  format?: string;
}

export interface CalculationOptions {
  theory: string;
  basis: string;
  calcType: 'energy' | 'optimization' | 'frequency';
  charge?: number;
  multiplicity?: number;
  solvation?: string;
}

export interface MoleculePreset {
  name: string;
  smiles: string;
}
