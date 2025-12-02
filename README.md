# QuantumLab

A full-stack web application for quantum chemistry simulations using React, FastAPI, Psi4, and RDKit.

## Project Structure

- `frontend/`: React + Vite + Tailwind CSS application.
- `backend/`: FastAPI application handling Psi4 simulations.
- `jobs/`: Directory where simulation artifacts are stored.

## Setup Instructions

### 1. Backend (Python/Conda)

It is highly recommended to use **Conda** because Psi4 and RDKit have complex binary dependencies.

```bash
# Create environment
conda create -n quantumlab python=3.9
conda activate quantumlab

# Install Scientific Packages
conda install -c psi4 psi4
conda install -c conda-forge rdkit

# Install Server Packages
pip install fastapi uvicorn pydantic

# Run Server
cd backend
python main.py
```

The API will be available at `http://localhost:8000`.

### 2. Frontend (React)

```bash
# Install dependencies
npm install

# Run Development Server
npm start
```

Open `http://localhost:3000` (or whatever port Vite uses).

## Features

- **Molecule Input**: Enter SMILES strings to generate 3D structures.
- **Quantum Calculations**: Run Geometry Optimizations and Energy calculations using Psi4.
- **Visualizations**: 3D interactive viewer using NGL.
- **AI Analysis**: Use Google Gemini to interpret HOMO-LUMO gaps and dipole moments.

## Demo Mode

If the backend is not running, the frontend will automatically switch to a "Mock Mode", returning fake simulation data so you can test the UI logic.
