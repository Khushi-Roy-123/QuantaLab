
import { Job, MoleculeData, CalculationOptions, SimulationResults } from '../types';
import { API_BASE_URL, MOCK_RESULTS, MOLECULE_STRUCTURES } from '../constants';

// Simple mock store for demo purposes when backend isn't running
let mockJobs: Job[] = [];

export const submitJob = async (
  molecule: MoleculeData,
  options: CalculationOptions
): Promise<Job> => {
  try {
    const response = await fetch(`${API_BASE_URL}/run_simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...molecule, ...options }),
    });

    if (!response.ok) {
      // Try to parse detailed error from backend
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    // Only fall back to mock if it looks like a network connection error (backend not running)
    const isNetworkError = error.name === 'TypeError' || error.message.includes('Failed to fetch') || error.message.includes('NetworkError');

    if (isNetworkError) {
      console.warn("Backend unreachable (Network Error). Switching to Demo Mode with mock data.");
      
      const newJob: Job = {
        id: `mock_${Date.now()}`,
        status: 'pending',
        moleculeName: molecule.name || 'Unknown',
        smiles: molecule.smiles,
        theory: options.theory,
        basisSet: options.basis,
        createdAt: new Date().toISOString(),
      };
      
      // Pass the uploaded structure if available
      if (molecule.structure) {
          newJob.structure = molecule.structure;
          newJob.format = molecule.format;
      }
      
      mockJobs.push(newJob);
      
      // Simulate processing time
      setTimeout(() => {
          const j = mockJobs.find(x => x.id === newJob.id);
          if(j) {
              j.status = 'completed';
              
              // Select appropriate structure for the viewer
              let resultStructure = MOLECULE_STRUCTURES[j.moleculeName] || MOLECULE_STRUCTURES['Methane'];
              
              // If user uploaded a file, keep that structure
              if (j.structure) {
                  resultStructure = j.structure;
              }

              j.results = {
                  ...MOCK_RESULTS,
                  optimizedStructure: resultStructure
              };
          }
      }, 2500); // 2.5s simulated delay
      
      return newJob;
    } else {
      throw error;
    }
  }
};

export const getJobStatus = async (jobId: string): Promise<Job> => {
  try {
    const response = await fetch(`${API_BASE_URL}/results/${jobId}`);
    
    if (!response.ok) {
        if (response.status === 404) throw new Error("Job not found");
        throw new Error(`Failed to fetch status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    const isNetworkError = error.name === 'TypeError' || error.message.includes('Failed to fetch');

    if (isNetworkError) {
        // console.warn("Backend unreachable during polling. Checking mock store.");
        const job = mockJobs.find((j) => j.id === jobId);
        if (!job) throw new Error('Job not found in local demo store');
        return job;
    }
    
    throw error;
  }
};

export const downloadReport = (jobId: string) => {
    window.open(`${API_BASE_URL}/download/${jobId}`, '_blank');
};
