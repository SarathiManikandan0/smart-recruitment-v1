from django.urls import path
from .views import JobCreateView, JobApplicationsView, ApplyForJobView, JobApplicantsView, JobDescriptionGeneratorView, AnalyzeResumeView

urlpatterns = [
    path('jobs/', JobCreateView.as_view(), name='job-create'),
    path('jobs/<int:job_id>/applications/', JobApplicationsView.as_view(), name='job-applications'),
    path('jobs/<int:job_id>/apply/', ApplyForJobView.as_view(), name='apply-for-job'),
    path('jobs/<int:job_id>/applicants/', JobApplicantsView.as_view(), name='job-applicants'),
    path('jobs/analyze_resume/<int:applicant_id>/<int:job_id>/', AnalyzeResumeView.as_view(), name='analyze-resume'),
    path('jobs/generate-job/', JobDescriptionGeneratorView.as_view(), name='generate-job'),  

]