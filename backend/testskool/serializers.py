from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Subject
from django.contrib.auth.hashers import check_password


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



class UpdateProfileSerializer(serializers.ModelSerializer):
    """ Update user """

    old_password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    # Accept as name instead pirmary key (pk)
    # https://www.django-rest-framework.org/api-guide/relations/#slugrelatedfield
    subject = serializers.SlugRelatedField(
        slug_field="name",
        queryset=Subject.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = get_user_model()

        fields = [
            "old_password",
            "password",
            "confirm_password",
            "first_name",
            "last_name",
            "subject",
            "about",
            "profile_picture",
        ]

        # Field rules
        extra_kwargs = {
            "old_password": {"write_only": True, "required": False},
            "password": {"write_only": True, "required": False},
            "confirm_password": {"write_only": True, "required": False},
            "first_name": {"required": False},
            "last_name": {"required": False},
            "subject": {"required": False},
            "about": {"required": False},
            "profile_picture": {"required": False},
        }

    # Validation
    def validate(self, attrs):
        old_password = attrs.get('old_password')
        new_password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        profile_picture = attrs.get("profile_picture")
        subject = attrs.get("subject")

        # Password validation
        if any([old_password, new_password, confirm_password]):
            if not all([old_password, new_password, confirm_password]):
                raise serializers.ValidationError({"confirm_password":["Please fill all fields to change your password."]})
            if new_password != confirm_password:
                raise serializers.ValidationError({"confirm_password":["New Password and Confirm New Password are not same."]})
            if not check_password(old_password, self.instance.password):
                raise serializers.ValidationError({"password": ["Password is not correct."]})
            if len(new_password) < 8:
                raise serializers.ValidationError({"new_password": ["Must be at least 8 characters."]})
        
        # Subject validation
        if subject and self.instance.is_student:
            raise serializers.ValidationError({"subject": ["Only teachers can choose a subject."]})
        if self.instance.is_teacher and "subject" in attrs and not subject:
            raise serializers.ValidationError({"subject": ["Teachers must have at least one subject."]})
        
        # Profile picture validation
        if profile_picture:
            if profile_picture.size > 307200:
                raise serializers.ValidationError({"profile_picture":["The maximum image size can be 300 KB."]})
            if profile_picture.content_type not in ["image/jpeg", "image/png", "image/gif"]:
                raise serializers.ValidationError({"profile_picture":["Only JPEG, PNG and GIF images are allowed."]})

        return attrs
    
    # Update
    def update(self, instance, validated_data):
        first_name = validated_data.get("first_name")
        last_name = validated_data.get("last_name")
        about = validated_data.get("about")
        subject = validated_data.get("subject")
        new_password = validated_data.get("password")
        profile_picture = validated_data.get("profile_picture")

        if first_name:
            instance.first_name = first_name
        if last_name:
            instance.last_name = last_name
        if about:
            instance.about = about
        if "subject" in validated_data:
            instance.subject.set(subject)
        if new_password:
            instance.set_password(new_password)
        
        if profile_picture:
            # Remove previous profile picture before save
            if instance.profile_picture:
                instance.profile_picture.delete()
            instance.profile_picture = profile_picture
        
        instance.save()
        return instance



class DeleteAccountSerializer(serializers.Serializer):
    """ Delete account """
    password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        user = self.context.get("request").user
        if not check_password(value, user.password):
            raise serializers.ValidationError("Incorrect password.")
        return value

    def delete(self):
        user = self.context.get("request").user
        if user.profile_picture:
            user.profile_picture.delete(save=False)
        user.delete()
