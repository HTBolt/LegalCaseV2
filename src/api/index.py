import os
from fastapi import FastAPI
from sqlalchemy import create_engine, text

# Initialize the FastAPI app
app = FastAPI()

# Get the database URL from the environment variables you set in Vercel
DATABASE_URL = os.environ.get("DATABASE_URL")

# A simple "hello world" endpoint to show the API is running
@app.get("/api/hello")
def hello_world():
    return {"message": "Hello from your Python Backend!"}

# An endpoint to test the database connection
@app.get("/api/db-test")
def test_db_connection():
    if DATABASE_URL is None:
        return {"status": "error", "message": "DATABASE_URL is not set."}
    try:
        # Create a database engine to connect
        engine = create_engine(DATABASE_URL)
        # Try to connect and run a simple query
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            # If the query runs, the connection is successful
            return {"status": "success", "message": "Successfully connected to the database!"}
    except Exception as e:
        # If there's an error, return the error message
        return {"status": "error", "message": f"Database connection failed: {e}"}