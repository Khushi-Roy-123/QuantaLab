import { GoogleGenAI } from "@google/genai";
import { SimulationResults } from "../types";

export const analyzeResultsWithGemini = async (
  results: SimulationResults,
  moleculeName: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Gemini API Key not found. Please set a valid API key to generate reports.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are a computational chemistry expert.
    Analyze the following simulation results for the molecule "${moleculeName}".
    
    Results:
    - Total Energy: ${results.energy} Hartrees
    - Dipole Moment: ${results.dipoleMoment.join(", ")} Debye
    - HOMO Energy: ${results.homoEnergy} Hartree
    - LUMO Energy: ${results.lumoEnergy} Hartree
    - HOMO-LUMO Gap: ${results.gap} Hartree
    
    Please explain:
    1. The stability of the molecule based on the energy and gap.
    2. The polarity based on the dipole moment.
    3. Potential reactivity (nucleophilic/electrophilic) based on orbitals.
    Keep the explanation concise and suitable for an undergraduate chemistry student.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Failed to generate analysis using AI.";
  }
};
