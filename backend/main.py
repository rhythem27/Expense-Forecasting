from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid

from backend.services import process_and_insert_expenses

app = FastAPI(title="Expense Forecasting API", description="Data Ingestion API Backend")

# Support frontend origins via permissive CORS policy for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-expenses/")
async def upload_expenses(
    company_id: str = Form(..., description="UUID of the company"),
    file: UploadFile = File(..., description="CSV file with columns: Date, Amount, Category, Description")
):
    """
    Endpoint to receive a CSV file of expenses, validate, clean, and batch insert into Supabase for a given company.
    """
    # Quick extension check
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    # Pre-validate UUID format of company_id
    try:
        uuid_obj = uuid.UUID(company_id)
    except ValueError:
        raise HTTPException(
            status_code=400, 
            detail="Invalid company_id format. Must be a valid UUID according to the database schema."
        )
        
    try:
        # FastAPI resolves files in memory for smaller sizes
        contents = await file.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not read the uploaded file: {str(e)}")
        
    # Send content bytes and parameter for processing logic
    result = process_and_insert_expenses(contents, company_id)
    
    return {
        "message": "Expenses successfully parsed and inserted.",
        "details": result
    }

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Expense Forecasting API is running."}
