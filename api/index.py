import os
from fastapi import FastAPI, Response
from sqlalchemy import create_engine, text

app = FastAPI()

# Get the DATABASE_URL from Vercel's environment variables
DATABASE_URL = os.environ.get("DATABASE_URL")

@app.get("/api/hello")
def hello_world():
    return {"message": "Hello from the Python Backend!"}

@app.get("/api/db-test")
def test_db_connection(response: Response):
    # Check if the environment variable was loaded
    if not DATABASE_URL:
        response.status_code = 500
        return {"status": "error", "message": "The DATABASE_URL environment variable was not found."}

    try:
        # Attempt to connect to the database
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "success", "message": "Database connection successful!"}
    except Exception as e:
        # Return a detailed error if connection fails
        response.status_code = 500
        return {"status": "error", "message": f"Database connection failed. Error: {e}"}