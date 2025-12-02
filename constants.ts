
// In a real app, this would be an env var
export const API_BASE_URL = 'http://localhost:8000';

export const THEORIES = ['HF', 'B3LYP', 'PBE0', 'MP2'];
export const BASIS_SETS = ['STO-3G', '3-21G', '6-31G*', 'cc-pVDZ'];

export const MOCK_JOB_ID = 'job_12345';
export const MOCK_RESULTS = {
  energy: -76.421,
  dipoleMoment: [0.0, 0.0, 1.85],
  homoEnergy: -0.45,
  lumoEnergy: 0.12,
  gap: 0.57,
  frequencies: [1600, 3200, 3400],
};

export const PRESET_MOLECULES = [
  { name: 'Ethanol', smiles: 'CCO' },
  { name: 'Water', smiles: 'O' },
  { name: 'Benzene', smiles: 'c1ccccc1' },
  { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
  { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' }
];
