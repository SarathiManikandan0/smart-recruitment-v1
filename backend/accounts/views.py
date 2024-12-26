from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from .models import User
from jobs.models import Job, JobApplication
from .serializers import UserSerializer
from .models import ApplicantProfile
from .serializers import ApplicantProfileSerializer
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class HRRegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_hr = True
            user.is_approved = False 
            user.save()
            return Response({"message": "HR registration successful!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class HRLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_approved:  # Check if the user is approved
                refresh = RefreshToken.for_user(user)  # Generate refresh and access tokens
                user_data = {
                    'id': user.id,
                    'username': user.username,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                return Response({"message": "Login successful!", "user": user_data}, status=status.HTTP_200_OK)
            return Response({"error": "Account not approved."}, status=status.HTTP_403_FORBIDDEN)

        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    
class ApplicantRegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_applicant = True
            user.save()
            return Response({"message": "Applicant registration successful!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ApplicantLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            user_data = {
                'id': user.id,
                'username': user.username,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response({"message": "Login successful!", "user": user_data}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


# APIView for handling ApplicantProfile
class ApplicantProfileAPIView(APIView):
    def get(self, request, format=None):
        try:
            applicant_profile = ApplicantProfile.objects.get(user=request.user)
            serializer = ApplicantProfileSerializer(applicant_profile, context={'request': request})
            return Response(serializer.data)
        except ApplicantProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        serializer = ApplicantProfileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format=None):
        try:
            applicant_profile = ApplicantProfile.objects.get(user=request.user)
            serializer = ApplicantProfileSerializer(applicant_profile, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ApplicantProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
# class AppliedJobsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         applicant_profile = ApplicantProfile.objects.get(user=request.user)
#         applied_jobs = JobApplication.objects.filter(applicant_profile=applicant_profile).values_list('job_id', flat=True)
#         return Response(applied_jobs)

