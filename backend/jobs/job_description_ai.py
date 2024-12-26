from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser
from datetime import datetime, timedelta
import json
import os

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
model = GoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)

today_date = datetime.now()
deadline_date = today_date + timedelta(days=7)
formatted_deadline = deadline_date.strftime("%d/%m/%Y")

def generate_job_description(msg):
    # Define the system and human messages
    messages = [
        SystemMessage(content=f"Generate a job description for the following in JSON format only. Job Title, Job Description, Department, Job Location, Employment Type, Salary Range (starting with 'RS'), Application Deadline (use {formatted_deadline} in DD/MM/YYYY format), Required Qualifications, Preferred Qualifications, Responsibilities. Do not include json word at beginning."),
        HumanMessage(content=msg)
    ]

    # Invoke the model to generate the job description
    result = model.invoke(messages)

    # Parse the result if it's a JSON string
    try:
        return json.loads(result)  # Assuming result is a JSON-formatted string
    except json.JSONDecodeError:
        return {"error": "Failed to parse generated content."}