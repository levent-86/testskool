from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Subject


# Serialize the subjects to send (if any)
class Subjects(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "name",]
        read_only_fields = fields


# https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
class CreateUser(serializers.ModelSerializer):
    """ Create a user """

    # https://www.django-rest-framework.org/api-guide/fields/#composite-fields
    subject = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )

    isTeacher = serializers.BooleanField(source='is_teacher')

    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "username",
            "password", 
            "subject", 
            "isTeacher",
            "is_teacher", 
            "is_student",
        ]

        # https://www.django-rest-framework.org/api-guide/serializers/#additional-keyword-arguments
        extra_kwargs = {
            'password': {'write_only': True},
            "subject": {"required": False},
        }

    # https://www.django-rest-framework.org/api-guide/serializers/#saving-instances
    def create(self, validated_data):
        is_teacher = validated_data.pop('is_teacher', None)
        subjects_data = validated_data.pop('subject', None)

        # Create user
        user = get_user_model().objects.create_user(**validated_data)

        # Set if user a student or a teacher
        if is_teacher is not None:
            user.is_teacher = is_teacher
            user.is_student = not is_teacher
        
        # Set teacher's subject(s) if they're teacher
        if subjects_data:
            subjects = Subject.objects.filter(name__in=subjects_data)
            user.subject.set(subjects)

        user.save()
        return user

