import pandas as pd
import io
import math
from fastapi import HTTPException
from backend.database import get_supabase_client

def process_and_insert_expenses(file_content: bytes, company_id: str):
    """
    Parses a CSV file, validates columns, cleans data, and inserts into Supabase.
    """
    try:
        # Load CSV into pandas DataFrame
        df = pd.read_csv(io.BytesIO(file_content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV file. Error: {str(e)}")
        
    # Standardize column headers to avoid case-sensitivity issues
    df.columns = df.columns.str.strip().str.title()
    
    # Validation: Check expected columns
    expected_columns = ['Date', 'Amount', 'Category', 'Description']
    missing_cols = [col for col in expected_columns if col not in df.columns]
    
    if missing_cols:
        raise HTTPException(
            status_code=400, 
            detail=f"Missing expected columns: {missing_cols}. Expected: {expected_columns}"
        )
        
    # Clean step 1: Drop rows where any critical info is missing (Date, Amount, Category)
    df = df.dropna(subset=['Date', 'Amount', 'Category'])
    
    if df.empty:
        raise HTTPException(status_code=400, detail="No readable content left after dropping empty rows.")
    
    # Clean step 2: Amount string formats and conversion to numeric
    if df['Amount'].dtype == object:
        # Remove '$' signs and commas before conversion
        df['Amount'] = df['Amount'].apply(lambda x: str(x).replace('$', '').replace(',', '').strip())
    
    df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce')
    
    if df['Amount'].isnull().any():
        raise HTTPException(status_code=400, detail="Found invalid values in 'Amount' column. Must be numeric.")

    # Clean step 3: Parse Dates and normalize format to strings for the database
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    
    if df['Date'].isnull().any():
         raise HTTPException(status_code=400, detail="Found invalid values in 'Date' column format.")
         
    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')

    # Clean step 4: Handle Descriptions (replace NaN with empty strings)
    df['Description'] = df['Description'].fillna("").astype(str)
    
    # Prepare data payloads for bulk insertion
    records_to_insert = []
    for _, row in df.iterrows():
        records_to_insert.append({
            "company_id": str(company_id),
            "date": row['Date'],
            "amount": float(row['Amount']),
            "category": str(row['Category']),
            "description": str(row['Description'])
        })
        
    if not records_to_insert:
        raise HTTPException(status_code=400, detail="No valid records found after cleaning.")
        
    # Supabase operations
    supabase = get_supabase_client()
    try:
        # Post the records to the 'expenses' table
        response = supabase.table("expenses").insert(records_to_insert).execute()
        return {"inserted_count": len(response.data), "records": response.data}
    except Exception as e:
        # Depending on supabase-py's version, execute exceptions or postgrest exceptions may be raised
        raise HTTPException(status_code=500, detail=f"Database insertion failed: {str(e)}")
