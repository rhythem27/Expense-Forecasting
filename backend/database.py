import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load from the parent directory where .env is located
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

def get_supabase_client() -> Client:
    """
    Returns a configured Supabase client instance.
    Raises ValueError if credentials are missing or left as default placeholders.
    """
    if not url or not key or url == "your_supabase_url_here":
        raise ValueError("Valid Supabase URL and Key must be provided in the .env file")
    
    return create_client(url, key)
