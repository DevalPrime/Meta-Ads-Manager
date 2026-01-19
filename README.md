# Meta Ads Manager

This project has two parts: a Python backend (Flask) and a React frontend. Follow the steps below to get it running. No coding is needed—just install the tools and run the provided commands once.

## What you need installed
- **Python 3.10+** (from python.org)
- **Node.js 18+** (from nodejs.org)

## One-time setup after unzipping
1) **Open the project folder** (where `app.py`, `start.bat`, and `frontend/` live).
2) **Create a virtual environment (venv)** in this folder:
   - Open PowerShell in the project folder and run:
   - `python -m venv .venv`
3) **Activate the venv** (PowerShell):
   - `.venv\Scripts\Activate.ps1`
4) **Install backend dependencies** (still in the project folder):
   - `pip install -r requirements.txt`
5) **Install frontend dependencies**:
   - `cd frontend`
   - `npm install`
   - When it finishes, close that window or type `cd ..` to return to the main folder.
6) **Add your Meta credentials** in `app.py` (near the top):
   - Replace `YOUR_APP_ID`, `YOUR_APP_SECRET`, `YOUR_ACCESS_TOKEN`, and `YOUR_ACCOUNT_ID` with your real values.
   - Save the file. Keep these values private.

## How to run (after setup)
- Simply double-click `start.bat` in the main folder.
- Two windows will open: one for the backend (Flask) and one for the frontend (React). Wait a few seconds for both to finish starting, then open your browser to the address shown in the frontend window (usually http://localhost:3000).

## Troubleshooting
- If a window closes immediately, the credentials might be wrong or Python/Node.js may not be installed correctly.
- If `python` is not recognized, reinstall Python and check "Add Python to PATH" during install.
- If the frontend says port 3000 is in use, close other apps using that port and run `start.bat` again.
- If Facebook API credentials are wrong or expired, the UI will not load data—double-check the values you entered in `app.py`.

That’s it—after the one-time setup, just use `start.bat` whenever you want to run the app.
