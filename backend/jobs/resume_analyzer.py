import os
import re
import json
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

class ResumeAnalyzer:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        llm = GoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key)

        prompt_template = PromptTemplate(
            input_variables=["resume_text", "job_description", "required_skills"],
            template=(
                "You are an HR assistant. Evaluate this resume based on the job description and the required skills."
                "Score the resume on relevance, experience, skills match, and formatting."
                "The output should only be in JSON format with a maximum score of 10. Do not give any other explanation."
                "Resume: {resume_text}"
                "Job description: {job_description}"
                "Skills: {required_skills}"
            )
        )

        self.chain = LLMChain(llm=llm, prompt=prompt_template)

    def analyze(self, resume_text, job_description, required_skills) -> dict:
        score = self.chain.run(resume_text=resume_text, job_description=job_description, required_skills=required_skills)
        json_str = re.search(r'\{.*\}', score.replace('\n', ''))
        json_str = json.loads(json_str.group())
        return json_str
