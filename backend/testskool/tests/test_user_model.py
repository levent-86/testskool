from rest_framework.test import APITestCase
from django.test import override_settings
from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from ..models import Subject  # Assuming you have a 'Subject' model



# Override throttling settings to not throttle for test cases
@override_settings(
    REST_FRAMEWORK = {
        'DEFAULT_THROTTLE_RATES': {
            'anon': '1/minute',
            'user': '1/minute',
        }
    }
)
class UserModelTest(APITestCase):
    def setUp(self):
        cache.clear()

        # Subject to associate with the user
        self.subject1 = Subject.objects.create(name='Math')
        self.subject2 = Subject.objects.create(name='Art')

        # Create a test user
        self.user_data = {
            'username': 'user-model',
            'password': '12345678',
            'email': 'user-model@example.com',
            'about': 'Test for User model.',
            'is_teacher': True,
            'is_student': False,
        }
        
        # Create user
        self.user = get_user_model().objects.create_user(**self.user_data)
        
        # Add subjects to the user after creation
        self.user.subject.add(self.subject1, self.subject2)
        self.user.save()
    
    def test_user_creation(self):
        """Test creating a user with basic attributes."""
        self.assertEqual(self.user.username, 'user-model')
        self.assertEqual(self.user.email, 'user-model@example.com')
        self.assertEqual(self.user.about, 'Test for User model.')
        self.assertTrue(self.user.is_teacher)
        self.assertFalse(self.user.is_student)
        self.assertEqual(self.user.subject.count(), 2)
        

    def test_user_default_values(self):
        """Test default values of the user model fields."""
        user = get_user_model().objects.create_user(username="newuser", password="newpassword")
        self.assertEqual(user.about, '')
        self.assertEqual(user.subject.name, None)
        self.assertFalse(user.is_teacher)
        self.assertFalse(user.is_student)
        self.assertTrue(user.profile_picture.name in [None, ''])
    

    def test_user_subjects_m2m_relationship(self):
        """Test the Many-to-Many relationship with the Subject model."""
        
        # Add a new subject to the user in the test itself
        new_subject = Subject.objects.create(name="Science")
        self.user.subject.add(new_subject)
        
        # Verify that the user is associated with the subjects
        self.assertIn(self.subject1, self.user.subject.all())
        self.assertIn(self.subject2, self.user.subject.all())
        self.assertIn(new_subject, self.user.subject.all())
        

    def test_user_profile_picture_upload(self):
        """Test profile picture upload functionality."""
        image_data = SimpleUploadedFile(
            name="test_image.jpg",
            content=b"file_content",
            content_type="image/jpeg"
        )

        # Create user with profile picture
        user_with_image = get_user_model().objects.create_user(
            username="user_with_image",
            password="password",
            profile_picture=image_data
        )

        # Check that the file path starts and ends with the correct folder and file name
        self.assertTrue(user_with_image.profile_picture.name.startswith("profile-pictures/test_image"))
        self.assertTrue(user_with_image.profile_picture.name.endswith(".jpg"))
    
    
    def test_user_profile_picture_blank(self):
        """Test that profile_picture can be blank."""
        user_without_image = get_user_model().objects.create_user(
            username="user_without_image", 
            password="password"
        )
        
        # Profile picture should be None if not provided
        self.assertTrue(user_without_image.profile_picture.name in [None, ''])
    

    def test_str_method(self):
        """Test the string representation of the User model."""
        self.assertEqual(str(self.user), 'user-model')
