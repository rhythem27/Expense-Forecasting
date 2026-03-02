import pandas as pd
from typing import Dict, Any
from backend.database import get_supabase_client
from datetime import datetime
from dateutil.relativedelta import relativedelta
from fastapi import HTTPException

def get_company_data(company_id: str):
    """Fetches company details and expenses from Supabase."""
    supabase = get_supabase_client()
    
    # Get company info
    company_res = supabase.table("companies").select("*").eq("id", company_id).execute()
    if not company_res.data:
        raise HTTPException(status_code=404, detail="Company not found")
        
    company = company_res.data[0]
    
    # Get expenses
    expenses_res = supabase.table("expenses").select("*").eq("company_id", company_id).execute()
    
    return company, expenses_res.data

def calculate_metrics(company_id: str) -> Dict[str, Any]:
    """Calculates burn rate, runway, and cash flow forecast."""
    company, expenses_data = get_company_data(company_id)
    
    if not expenses_data:
         return {
            "burn_rate": 0,
            "runway_months": "Infinite",
            "runway_days": 0,
            "forecast": [],
            "message": "No expenses found to calculate metrics."
         }
         
    df = pd.DataFrame(expenses_data)
    df['date'] = pd.to_datetime(df['date'])
    df['amount'] = pd.to_numeric(df['amount'])
    
    # 1. Burn Rate Calculation
    # Aggregate by month
    df_monthly = df.set_index('date').resample('ME')['amount'].sum().reset_index()
    
    # Calculate average monthly burn rate (using all available history for simplicity, can be adjusted to e.g., last 3-6 months)
    avg_monthly_burn = df_monthly['amount'].mean()
    
    # 2. Runway Calculation
    current_cash = company.get('current_cash_balance', 0)
    current_cash = float(current_cash) if current_cash else 0.0
    
    if avg_monthly_burn > 0:
        runway_in_months_exact = current_cash / avg_monthly_burn
        runway_months = int(runway_in_months_exact)
        runway_days = int((runway_in_months_exact - runway_months) * 30.44) # Average days in a month
    else:
        runway_months = "Infinite"
        runway_days = 0
        
    # 3. Cash Flow Forecast (6 months)
    # Using Simple Moving Average for projection
    # First, ensure we have at least complete months
    df_monthly = df_monthly.sort_values('date')
    
    if len(df_monthly) < 2:
         # Not enough data for moving average, use simple average for forecast
        projected_monthly = avg_monthly_burn
    else:
        # 3-month simple moving average (or less if not enough data)
        window = min(3, len(df_monthly))
        projected_monthly = df_monthly['amount'].rolling(window=window).mean().iloc[-1]
        
    # Generate next 6 months forecast
    forecast_data = []
    historical_data = []
    
    if not df_monthly.empty:
         for _, row in df_monthly.iterrows():
             historical_data.append({
                 "month": row['date'].strftime('%Y-%m'),
                 "historical_expense": round(float(row['amount']), 2)
             })
             
         last_date = df_monthly['date'].iloc[-1]
         for i in range(1, 7):
             next_month = last_date + relativedelta(months=i)
             forecast_data.append({
                 "month": next_month.strftime('%Y-%m'),
                 "predicted_expense": round(float(projected_monthly), 2)
             })

    return {
        "current_balance": current_cash,
        "average_monthly_burn": round(float(avg_monthly_burn), 2),
        "runway_months": runway_months,
        "runway_days": runway_days,
        "forecast": forecast_data,
        "historical": historical_data
    }
