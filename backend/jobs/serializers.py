from .models import Job, JobApplication
from rest_framework import serializers

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id','jobTitle', 'jobDescription', 'department', 'location', 'employmentType', 'salaryRange', 'applicationDeadline', 'qualifications', 'responsibilities']


class JobApplicationDetailSerializer(serializers.ModelSerializer):
    applicant_profile = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'applicant_profile', 'applied_at']

    def get_applicant_profile(self, obj):
        request = self.context.get('request')  
        resume_url = obj.applicant_profile.resume.url if obj.applicant_profile.resume else None
        full_resume_url = request.build_absolute_uri(resume_url) if resume_url else None
        
        return {
            'fullName': obj.applicant_profile.fullName,
            'phone_number': obj.applicant_profile.phone_number,
            'resume': full_resume_url,  
        }