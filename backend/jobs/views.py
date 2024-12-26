import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Job, JobApplication
from accounts.models import ApplicantProfile
from .serializers import JobSerializer, JobApplicationDetailSerializer
from .resume_analyzer import ResumeAnalyzer
from .utils import get_resume_text
from django.http import JsonResponse
from .job_description_ai import generate_job_description  


class JobCreateView(APIView):
    def post(self, request, format=None):
        print(request.data)
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, format=None):
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

class JobDescriptionGeneratorView(APIView):
    def post(self, request, format=None):
        data = json.loads(request.body)
        job_title = data.get('jobTitle', '')
        if job_title:
            generated_data = generate_job_description(job_title)
            return JsonResponse(generated_data, safe=False)
        return JsonResponse({'error': 'Job title is required'}, status=400)

class JobApplicationsView(APIView):
    def get(self, request, job_id):
        applications = JobApplication.objects.filter(job_id=job_id)
        serializer = JobApplicationDetailSerializer(applications, many=True)
        return Response(serializer.data)
    
class ApplyForJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        job = Job.objects.get(id=job_id)
        applicant_profile = ApplicantProfile.objects.get(user=request.user)

        application = JobApplication.objects.create(
            job=job,
            applicant_profile=applicant_profile
        )
        
        return Response({"message": "Application submitted successfully!"}, status=status.HTTP_201_CREATED)




class JobApplicantsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        # Ensure the user is an HR user
        if not request.user.is_hr:
            return Response({"detail": "You do not have permission to view this."}, status=403)

        applications = JobApplication.objects.filter(job_id=job_id)
        applicants_data = []

        # Fetch all applicants without analyzing resumes
        for application in applications:
            applicant_profile = application.applicant_profile
            # Construct each applicant's data manually
            applicant_data = {
                'id': applicant_profile.id,
                'fullName': applicant_profile.fullName,
                'phone_number': applicant_profile.phone_number,
                'resume': request.build_absolute_uri(applicant_profile.resume.url) if applicant_profile.resume else None,
                'score': None  # Score will be analyzed separately
            }
            applicants_data.append(applicant_data)

        # Optionally, if you still want to use the serializer to avoid repetitive manual data processing
        # serializer = JobApplicationDetailSerializer(applications, many=True, context={'request': request})

        return Response(applicants_data)



class AnalyzeResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, applicant_id, job_id):
        # Ensure the user is an HR user
        if not request.user.is_hr:
            return Response({"detail": "You do not have permission to perform this action."}, status=403)

        try:
            applicant_profile = ApplicantProfile.objects.get(id=applicant_id)
            job = Job.objects.get(id=job_id)
        except (ApplicantProfile.DoesNotExist, Job.DoesNotExist):
            return Response({"detail": "Applicant or Job not found."}, status=404)

        resume_analyzer = ResumeAnalyzer()
        resume_text = get_resume_text(applicant_profile.resume.path)  # Extract resume text
        job_description = job.jobDescription
        required_skills = job.qualifications  # Assuming qualifications contain skills

        if resume_text:
            score = resume_analyzer.analyze(resume_text, job_description, required_skills)
            return Response({"score": score})
        else:
            return Response({"detail": "Resume not found or could not be read."}, status=400)
