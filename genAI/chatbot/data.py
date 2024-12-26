# data_storage.py

# In-memory storage for job descriptions and applicant information
job_descriptions = {
    "flutter_developer": {
        "job_title": "Flutter Developer",
        "company": "Tech Solutions Ltd.",
        "description": "Responsible for developing mobile applications using Flutter.",
        "requirements": "Flutter, Dart, RESTful APIs, Git, Firebase",
        "salary": "₹5,00,000 - ₹8,00,000 per annum"
    },
    "backend_developer": {
        "job_title": "Backend Developer",
        "company": "InnovateX Corp.",
        "description": "Develop and maintain server-side applications.",
        "requirements": "Python, Django, REST APIs, PostgreSQL, Docker",
        "salary": "₹8,00,000 - ₹12,00,000 per annum"
    }
}

# In-memory storage for applicants
applicant_data = {
    "user_1": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "applied_job": "flutter_developer",
        "application_status": "Interview Scheduled"
    },
    "user_2": {
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "applied_job": "backend_developer",
        "application_status": "Interview Scheduled"
    }
}

def get_applicant_data(user_id):
    """Get the application details for a specific user."""
    return applicant_data.get(user_id)

def update_application_status(user_id, new_status):
    """Update the application status for a specific user."""
    if user_id in applicant_data:
        applicant_data[user_id]["application_status"] = new_status
        return True
    return False

def get_job_description(job_id):
    """Retrieve job description based on job ID."""
    return job_descriptions.get(job_id)
