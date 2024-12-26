from rest_framework import serializers
from .models import User, ApplicantProfile 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'is_hr', 'is_applicant'] 
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            is_hr=validated_data.get('is_hr', False), 
            is_applicant=validated_data.get('is_applicant', False)
        )
        user.set_password(validated_data['password'])  
        user.save()
        return user

class ApplicantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantProfile
        fields = ['fullName', 'dateOfBirth', 'gender', 'phone_number', 'address', 
                  'resume', 'skills', 'experience', 'course', 'department', 'institution']
        
    def get_resume(self, obj):
        request = self.context.get('request')
        if obj.resume:
            return request.build_absolute_uri(obj.resume.url)  # Full URL for resume
        return None

    def create(self, validated_data):
        user = self.context['request'].user  # Fetch the user from the request context
        applicant_profile = ApplicantProfile.objects.create(user=user, **validated_data)
        return applicant_profile

    def update(self, instance, validated_data):
        user_id = validated_data.pop('user_id', None)
        if user_id:
            instance.user.id = user_id  # Directly setting the user ID
        
        # Update the applicant profile fields
        instance.fullName = validated_data.get('fullName', instance.fullName)
        instance.dateOfBirth = validated_data.get('dateOfBirth', instance.dateOfBirth)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.address = validated_data.get('address', instance.address)
        instance.resume = validated_data.get('resume', instance.resume)
        instance.skills = validated_data.get('skills', instance.skills)
        instance.experience = validated_data.get('experience', instance.experience)
        instance.course = validated_data.get('course', instance.course)
        instance.department = validated_data.get('department', instance.department)
        instance.institution = validated_data.get('institution', instance.institution)

        instance.save()
        return instance
