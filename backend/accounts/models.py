from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_hr = models.BooleanField(default=False)
    is_applicant = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    
class ApplicantProfile(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='applicant_profile')
    fullName = models.CharField(max_length=100, blank=False)
    dateOfBirth = models.DateField(blank=False, null=False)
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    skills = models.TextField(blank=True)
    experience = models.IntegerField(default=0)
    course = models.CharField(max_length=100, blank=False)
    department = models.CharField(max_length=100, blank=False)
    institution = models.CharField(max_length=100, blank=False)

    def __str__(self):
        return self.fullName