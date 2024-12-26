from django.urls import path
from .views import HRRegisterView, HRLoginView, ApplicantRegisterView, ApplicantLoginView, ApplicantProfileAPIView

urlpatterns=[
    path('register/',HRRegisterView.as_view(),name='hr-register'),
    path('login/', HRLoginView.as_view(), name='hr-login'),
    path('applicant/register/', ApplicantRegisterView.as_view(), name='applicant-register'),
    path('applicant/login/', ApplicantLoginView.as_view(), name='applicant-login'),
    path('applicants/', ApplicantProfileAPIView.as_view(), name='applicant_profile'),
    path('applicants/<int:pk>/', ApplicantProfileAPIView.as_view()),
    path('applicant/applied-jobs/', ApplicantProfileAPIView.as_view()),
    
]