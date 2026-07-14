# FinSight MIS Platform
Tally XLS to Automated MIS Reports. SiyanTech Global Innovations.

## Stack
- Backend: FastAPI + Supabase PostgreSQL (Mumbai)
- Frontend: Next.js 16 + Tailwind
- Parser: xlrd + openpyxl

## Quick Start

### Backend
cd finsight-api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000

### Frontend
cd finsight-web
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev

### Database
Run database/schema.sql in Supabase SQL Editor.

## Client: Mudduluru Infratech Pvt. Ltd. (KA)
FY 2025-26 · 59,007 rows · 30,490 vouchers · 1,406 ledgers
Trial Balance: DR = CR = Rs.560.51 Cr · Diff Rs.0.00
30/30 accounting checks passing
