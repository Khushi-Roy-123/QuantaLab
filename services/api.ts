import { Job, MoleculeData, CalculationOptions, SimulationResults } from '../types';
import { API_BASE_URL, MOCK_RESULTS } from '../constants';

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
    // If it's a specific API error (400/500), we want to show that to the user.
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
      mockJobs.push(newJob);
      
      // Simulate processing time
      setTimeout(() => {
          const j = mockJobs.find(x => x.id === newJob.id);
          if(j) {
              j.status = 'completed';
              j.results = MOCK_RESULTS;
          }
      }, 4000);
      
      return newJob;
    } else {
      // Re-throw actual API errors (e.g. Validation Error, Internal Server Error)
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
    // Fallback to mock store only on network error
    const isNetworkError = error.name === 'TypeError' || error.message.includes('Failed to fetch');

    if (isNetworkError) {
        console.warn("Backend unreachable during polling. Checking mock store.");
        const job = mockJobs.find((j) => j.id === jobId);
        if (!job) throw new Error('Job not found in local demo store');
        return job;
    }
    
    throw error;
  }
};

export const downloadReport = (jobId: string) => {
    // Direct link trigger
    window.open(`${API_BASE_URL}/download/${jobId}`, '_blank');
};