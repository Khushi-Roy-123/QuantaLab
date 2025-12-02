# QuantaLab ⚛️

**Next-Generation Web-Based Quantum Chemistry Simulator**

QuantaLab is a full-stack application that allows users to build molecules, run rigorous quantum mechanical calculations (Geometry Optimization, Energy, Frequency Analysis) directly in the browser, and visualize results with interactive 3D rendering.

It combines a modern React frontend with a powerful Python backend powered by **Psi4** (Quantum Chemistry Engine) and **RDKit** (Cheminformatics). It also leverages **Google Gemini 2.0** to provide AI-powered explanations of chemical properties.

---

## 🚨 Vital Compatibility Note

The **Psi4** Quantum Engine is built for **Linux** and **macOS**. 

*   **Mac/Linux Users:** You can run this natively.
*   **Windows Users:** You **MUST** use **WSL2 (Windows Subsystem for Linux)** to run the backend. Psi4 will **not** install on standard Windows PowerShell/Command Prompt.
    *   *Don't have WSL?* Open PowerShell as Admin and run `wsl --install`, then restart your computer.

---

## 🛠 Option 1: The Full Experience (Backend + Frontend)

This requires installing **Miniconda**. If you are having trouble installing Conda, see the "Troubleshooting" section below.

### Step 1: Install Miniconda
1.  Download the **Miniconda Installer** for your OS: [https://docs.conda.io/en/latest/miniconda.html](https://docs.conda.io/en/latest/miniconda.html)
2.  **Windows Users:** Install it inside your WSL2 Ubuntu environment (type `wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh` in your Ubuntu terminal).
3.  **Mac/Linux:** Run the installer script.

### Step 2: Backend Setup (Python)

1.  Open your terminal (or WSL Ubuntu terminal).
2.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```

3.  **Create the Environment** (This installs Psi4 and RDKit):
    ```bash
    conda create -n quantalab -c psi4 -c conda-forge psi4 rdkit python=3.9
    ```
    *Note: This step may take 5-10 minutes as it downloads scientific binaries.*

4.  **Activate the Environment**:
    ```bash
    conda activate quantalab
    ```

5.  **Install Web Server Libraries**:
    ```bash
    pip install fastapi uvicorn pydantic celery redis
    ```

6.  **Set AI API Key (Optional)**:
    Required for the "Generate Report" feature.
    ```bash
    export API_KEY="your_google_ai_studio_api_key"
    ```

7.  **Run the Server**:
    ```bash
    uvicorn main:app --reload --port 8000
    ```
    You should see: `Uvicorn running on http://127.0.0.1:8000`

### Step 3: Frontend Setup (React)

1.  Open a **new** terminal window.
2.  Navigate to the project root:
    ```bash
    cd /path/to/QuantaLab
    ```
3.  Install Dependencies:
    ```bash
    npm install
    ```
4.  Start the App:
    ```bash
    npm run dev
    ```
5.  Open `http://localhost:3000` (or the port shown).

---

## ⚡ Option 2: Demo Mode (Frontend Only)

**Can't get Conda or Psi4 working?** No problem!

QuantaLab has a built-in **Demo Mode**. If the frontend cannot connect to the backend (e.g., if you don't run the Python server), it automatically switches to using **Mock Data**.

1.  Simply skip the "Backend Setup".
2.  Run the **Frontend Setup** instructions above.
3.  The app will detect that the backend is offline and simulate calculations. 
    *   *Note: Real calculations won't happen, but you can see how the UI works with pre-calculated results for molecules like Water, Benzene, and Ethanol.*

---

## 🔧 Troubleshooting

### "Conda command not found"
*   **Solution:** You need to add Conda to your PATH.
*   Try running: `source ~/miniconda3/bin/activate` (Mac/Linux) or `source ~/anaconda3/bin/activate`.
*   Then run: `conda init` and restart your terminal.

### "PackagesNotFoundError" when installing Psi4
*   **Cause:** You are likely on Windows (PowerShell/CMD) or an incompatible Mac architecture without Rosetta.
*   **Solution:** 
    1.  **Windows:** Use WSL2 (Ubuntu). Psi4 exists in the Linux channel, not the Windows channel.
    2.  **Mac M1/M2/M3:** Ensure you are using the `osx-arm64` channel or generic `conda-forge`. The command provided in Step 2 usually works, but sometimes `conda config --add channels conda-forge` is needed first.

### "npm start fails"
*   **Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again.

---

## 📜 License

MIT License. Built for educational and research purposes.