from django.db import models
from accounts.models import ApplicantProfile

class Job(models.Model):
    jobTitle = models.CharField(max_length=200)
    jobDescription = models.TextField()
    department = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    employmentType = models.CharField(max_length=50)
    salaryRange = models.CharField(max_length=100)
    applicationDeadline = models.DateField()
    qualifications = models.TextField()
    responsibilities = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.job_title
    
class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant_profile = models.ForeignKey(ApplicantProfile, on_delete=models.CASCADE, related_name='applications')
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant_profile.fullName} applied to {self.job.jobTitle}"

