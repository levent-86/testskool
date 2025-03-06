from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from ..models import Subject
from django.test import override_settings
from django.core.cache import cache
from ..serializers import MyProfileSerializer
from datetime import datetime


# Override throttling settings to not throttle for test cases
@override_settings(
    REST_FRAMEWORK = {
        'DEFAULT_THROTTLE_RATES': {
            'anon': '1/minute',
            'user': '1/minute',
        }
    }
)
class MyProfileSerializerTestCase(APITestCase):
    def setUp(self):
        cache.clear()


        self.subject1 = Subject.objects.create(name="Math")
        self.subject2 = Subject.objects.create(name="Art")

        # Create teacher
        self.user = get_user_model().objects.create_user(
            username="testuser",
            password="password",
            first_name="John",
            last_name="Doe",
            is_teacher=True,
            is_student=False,
            profile_picture="test-path/to/profile-picture.jpg",
            about="Test bio",
        )

        # Add subjects to teacher
        self.user.subject.add(self.subject1, self.subject2)

        # Serializer instance for testing
        self.serializer = MyProfileSerializer(instance=self.user)
    

    def test_read_only_fields(self):
        data = self.serializer.data
        
        self.assertEqual(data["id"], self.user.id)
        self.assertEqual(data["username"], self.user.username)
        self.assertEqual(data["is_teacher"], self.user.is_teacher)
        self.assertEqual(data["is_student"], self.user.is_student)
        self.assertEqual(datetime.strptime(data["date_joined"], "%Y-%m-%dT%H:%M:%S.%f%z"), self.user.date_joined)


    def test_serializer_optional_fields(self):
        data = self.serializer.data

        self.assertIn("first_name", data)
        self.assertIn("last_name", data)
        self.assertIn("about", data)
        self.assertIn("profile_picture", data)
    

    def test_subject_field(self):
        """Test if the 'subject' field returns the correct values."""
        data = self.serializer.data
        subject_data = data["subject"]
        
        # Check if the subject field returns a list
        self.assertIsInstance(subject_data, list)
        # Should be 2 entry inside
        self.assertEqual(len(subject_data), 2)
        
        # Test subject content
        subject_ids = [subject["id"] for subject in subject_data]
        self.assertIn(self.subject1.id, subject_ids)
        self.assertIn(self.subject2.id, subject_ids)
        
        # What is the name of subjects
        subject_names = [subject["name"] for subject in subject_data]
        self.assertIn("Math", subject_names)
        self.assertIn("Art", subject_names)
    

    def test_write_only_password_field(self):
        """Test that password is not returned in the serialized data."""
        data = self.serializer.data
        self.assertNotIn("password", data)
        self.assertTrue(self.serializer.fields["password"].write_only)
