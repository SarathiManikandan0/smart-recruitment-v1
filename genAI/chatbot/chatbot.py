# chatbot.py

from langchain_google_genai import GoogleGenerativeAI
from chatbot.data import get_applicant_data, get_job_description, update_application_status
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Initialize Google Generative AI
ai_model = GoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key)

def generate_response(prompt):
    """Generate a response using Google Generative AI."""
    response = ai_model.generate([prompt])
    print(response.generations[0][0].text)
    generated_text = response.generations[0][0].text
    return generated_text

def handle_user_query(user_id, query):
    """Handles user queries based on job applied for and status."""
    user_data = get_applicant_data(user_id)
    
    if not user_data:
        return "No application details found for your profile."

    # Extract job description based on applied job
    job_data = get_job_description(user_data["applied_job"])
    
    # Formulate the prompt for the AI
    prompt = (
        f"User applied for the position of {job_data['job_title']} at {job_data['company']}.\n"
        f"Job description: {job_data['description']}\n"
        f"Requirements: {job_data['requirements']}\n"
        f"Salary: {job_data['salary']}\n\n"
        f"Current application status: {user_data['application_status']}.\n\n"
        f"User asked: {query}"
    )

    # Get AI response
    return generate_response(prompt)

def update_user_status(user_id, new_status):
    """Update the application status for a user."""
    if update_application_status(user_id, new_status):
        return f"Your application status has been updated to: {new_status}."
    else:
        return "Unable to update your application status. Please check your profile."
