
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

export const chatWithGemini = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  if (!process.env.API_KEY) return "API Key not configured. Please check your environment variables.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Transform simple history format to the API format
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  // Add the current message
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: `You are QuantaLab's virtual lab assistant, an expert in computational chemistry and quantum mechanics. 
        Your goal is to help students and researchers understand complex topics like:
        - Density Functional Theory (DFT) vs Hartree-Fock
        - Basis sets (STO-3G, 6-31G*, etc.)
        - Molecular orbitals (HOMO/LUMO)
        - Geometry optimization
        
        Keep your answers helpful, concise, and scientifically accurate. If asked about the app features, explain that QuantaLab can run Psi4 simulations in the browser.`,
      }
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I'm having trouble connecting to the quantum core (AI Service). Please try again later.";
  }
};
