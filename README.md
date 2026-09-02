# JALRAKSHAK — Full Stack Urban Flood Nowcasting Demo

This package is the runnable prototype for the JALRAKSHAK urban-flood command center. It contains a React/Vite frontend, Node/Express backend, PostgreSQL/PostGIS schema + seed data, and a real FastAPI/scikit-learn ML service.

## What is connected

Browser → React frontend → Node/Express `/api` → PostgreSQL/PostGIS + ML service → response → UI.

The frontend stores the JWT returned by `/api/auth/login` and sends `Authorization: Bearer ...` with protected requests. Mock fallback is OFF by default.

## Demo login

- `authority@jalrakshak.local` / `Jal@1234`
- `admin@jalrakshak.local` / `Jal@1234`

All operational data in this demo is synthetic pilot-city data and is labelled as synthetic in the UI/API.

## Fastest local run (without Docker)

### Frontend
```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```
Open http://localhost:5173.

### Backend
```powershell
cd backend
npm install
copy .env.example .env
npm run dev
```
Backend: http://localhost:4000/api/health

### ML service
Python 3.12+ recommended:
```powershell
cd ml-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python train.py
uvicorn app:app --host 0.0.0.0 --port 8000
```
ML: http://localhost:8000/health

## Full Docker demo

From the repository root:
```powershell
docker compose up --build
```
Then open http://localhost:5173.

The PostGIS database seeds the pilot city, drainage nodes, water bodies, rainfall and demo accounts. Backend port 4000 and ML port 8000 are exposed for verification.

## API groups

- `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/dashboard`, `/api/geo`, `/api/flood/risk`
- `GET /api/drainage`, `/api/water-bodies`, `/api/rainfall`, `/api/terrain`
- `GET /api/alerts`, `POST /api/alerts/generate`
- `GET /api/history`, `/api/models`, `/api/data/status`
- `POST /api/predictions`, `/api/simulation`, `/api/routes`, `/api/chat/query`
- `GET /api/db/health`

## ML

The ML service trains a Random Forest classifier for flood level and a Random Forest regressor for water depth. The saved model artifact and metrics are generated from `data/synthetic_flood_training.csv`. Feature-importance values are returned as explainability reasons.

## Netlify deployment

For the frontend, connect the `frontend` directory/repository to Netlify:
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://YOUR-BACKEND.onrender.com/api`
- Keep `VITE_USE_MOCK_FALLBACK=false`

The included `netlify.toml` handles SPA routing.

## What is intentionally synthetic

Pilot-city rainfall, terrain, drainage state, road graph, water-body levels, shelters, infrastructure, historical events and ML training labels are synthetic. The architecture is designed so real data providers can replace these adapters later without changing the main frontend contract.
