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
class Register(serializers.ModelSerializer):
    """ Create a user """

    confirm = serializers.CharField(write_only=True)

    # https://www.django-rest-framework.org/api-guide/fields/#composite-fields
    subject = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )

    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "username",
            "password",
            "confirm",
            "subject",
            "is_teacher",
            "is_student",
        ]

        # https://www.django-rest-framework.org/api-guide/serializers/#additional-keyword-arguments
        extra_kwargs = {
            "password": {"write_only": True},
            "confirm": {"write_only": True},
            "subject": {"required": False},
        }
    
    # Validations
    # Object-level validations
    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm')
        subject = attrs.get("subject")
        is_teacher = attrs.get('is_teacher')

        if password != confirm_password:
            raise serializers.ValidationError({"confirm": ["Password and confirmation must match."]})
        
        if is_teacher:
            if not subject or not Subject.objects.filter(name__in=subject):
                raise serializers.ValidationError({"subject": ["Please select your subject(s)."]})
        
        if not is_teacher and subject:
            raise serializers.ValidationError({"subject": ["Only teachers can choose a subject."]})
        return attrs
    
    # Field-level validations
    # https://www.django-rest-framework.org/api-guide/serializers/#field-level-validation
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        return value
    
    def validate_is_teacher(self, value):
        if not isinstance(value, bool):
            raise serializers.ValidationError("Choose one field: student or teacher.")
        return value
        

    # Create user
    # https://www.django-rest-framework.org/api-guide/serializers/#saving-instances
    def create(self, validated_data):
        is_teacher = validated_data.pop('is_teacher', None)
        subjects_data = validated_data.pop('subject', None)

        # Exclude confirm field
        confirmed_data = validated_data.copy()
        confirmed_data.pop('confirm', None)

        # Create user
        user = get_user_model().objects.create_user(**confirmed_data)

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



class MyProfileSerializer(serializers.ModelSerializer):
    """ Send user information """

    subject = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()

        # Define serializing fields
        fields = [
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "is_teacher",
            "subject",
            "is_student",
            "about",
            "profile_picture",
            "date_joined",
        ]

        # Define serializer rules
        extra_kwargs = {
            "id": {"read_only": True},
            "username": {"read_only": True},
            "password": {"write_only": True, "required": False},
            "first_name": {"required": False},
            "last_name": {"required": False},
            "is_teacher": {"required": False, "read_only": True},
            "subject": {"required": False},
            "is_student": {"required": False, "read_only": True},
            "about": {"required": False},
            "profile_picture": {"required": False, "use_url": False},
            "date_joined": {'read_only': True, "required": False},
        }

    # Return subject names instead of numbers
    def get_subject(self, obj):
        if obj.subject:
            subjects = obj.subject.all()
            return [{"id": subject.id, "name": subject.name} for subject in subjects]
