from rest_framework.test import APITestCase
from django.test import override_settings
from django.core.cache import cache
from ..models import Subject
from ..serializers import UpdateProfileSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

# Override throttling settings to not throttle for test cases
@override_settings(
    REST_FRAMEWORK = {
        'DEFAULT_THROTTLE_RATES': {
            'anon': '1/minute',
            'user': '1/minute',
        }
    }
)
class UpdateUserSerializerTest(APITestCase):
    def setUp(self):
        cache.clear()

        self.subject1 = Subject.objects.create(name="Math")
        self.subject2 = Subject.objects.create(name="Art")

        # Create teacher user
        self.user = get_user_model().objects.create_user(
            username="teacher-user",
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
        self.serializer = UpdateProfileSerializer(instance=self.user)

    # Test case when a user trying to change password only with new password field
    def test_update_with_only_password_field(self):
        new_password = {
            "password": "new-password",
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=new_password)
        self.assertFalse(serializer.is_valid())
        self.assertIn("confirm_password", serializer.errors)
        self.assertEqual(serializer.errors["confirm_password"][0], "Please fill all fields to change your password.")
    
    # Test case when a user trying to change password without entering old password
    def test_update_without_old_password(self):
        missing_password = {
            "password": "new-password",
            "confirm_password": "mismatch-password",
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=missing_password)
        self.assertFalse(serializer.is_valid())
        self.assertIn("confirm_password", serializer.errors)
        self.assertEqual(serializer.errors["confirm_password"][0], "Please fill all fields to change your password.")
    
    # Test case when a user trying to change password without confirm password
    def test_update_without_confirm_password(self):
        missing_confirm = {
            "old_password": "password",
            "password": "new12345678",
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=missing_confirm)
        self.assertFalse(serializer.is_valid())
        self.assertIn("confirm_password", serializer.errors)
        self.assertEqual(serializer.errors["confirm_password"][0], "Please fill all fields to change your password.")
    
    # Test case is when password and confirmation are NOT match
    def test_update_password_mismatch(self):
        password_mismatch = {
            "old_password": "password",
            "password": "new-password",
            "confirm_password": "mismatch-password",
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=password_mismatch)
        self.assertFalse(serializer.is_valid())
        self.assertIn("confirm_password", serializer.errors)
        self.assertEqual(serializer.errors["confirm_password"][0], "New Password and Confirm New Password are not same.")
    
    # Test case when user trying to update password less than 8 characters
    def test_update_short_password(self):
        short_password = {
            "old_password": "password",
            "password": "1234567",
            "confirm_password": "1234567",
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=short_password)
        self.assertFalse(serializer.is_valid())
        self.assertIn("new_password", serializer.errors)
        self.assertEqual(serializer.errors["new_password"][0], "Must be at least 8 characters.")
    
    # Test case when user enters wrong old password
    def test_update_invalid_old_password(self):
        invalid_old_password = {
            "old_password": "invalid-password",
            "password": "12345678",
            "confirm_password": "12345678",
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=invalid_old_password)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)
        self.assertEqual(serializer.errors["password"][0], "Password is not correct.")
    
    # Test case for valid password change
    def test_update_valid_password(self):
        valid_password = {
            "old_password": "password",
            "password": "new-password",
            "confirm_password": "new-password",
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=valid_password)
        self.assertTrue(serializer.is_valid())

        updated_user = serializer.save()
        
        # now new password is "new-password", not "password"
        self.assertTrue(check_password("new-password", updated_user.password))
        self.assertFalse(check_password("password", updated_user.password))
    
    # Test case is when user trying to add a subject which is doesn't exists in database
    def test_update_subject_not_exists(self):
        wrong_subject = {
            "subject": ["wrong-subject"]
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=wrong_subject)
        self.assertFalse(serializer.is_valid())
        self.assertIn("subject", serializer.errors)
        self.assertEqual(serializer.errors["subject"][0], "Object with name=wrong-subject does not exist.")
    
    # Test case is when empty subject sent
    def test_update_empty_subject(self):
        empty_subject = {
            "subject": []
        }
        serializer = UpdateProfileSerializer(instance=self.user, data=empty_subject)
        self.assertFalse(serializer.is_valid())
        self.assertIn("subject", serializer.errors)
        self.assertEqual(serializer.errors["subject"][0], "Teachers must have at least one subject.")

    # Test case is when a student trying to specify a subject
    def test_update_student_subject(self):
        # Create student
        self.user = get_user_model().objects.create_user(
            username="student-user",
            password="password",
            is_teacher=False,
            is_student=True,
        )

        subject_choose = {
            "subject": ["Art"]
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=subject_choose)
        self.assertFalse(serializer.is_valid())
        self.assertIn("subject", serializer.errors)
        self.assertEqual(serializer.errors["subject"][0], "Only teachers can choose a subject.")

    # Test case for valid subject change
    def test_update_valid_subject(self):
        valid_subject = {
            "subject": ["Math"]
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=valid_subject)
        self.assertTrue(serializer.is_valid())

        updated_user = serializer.save()

        # now new subject is "Math", not "Art"
        self.assertEqual(updated_user.subject.count(), 1)
        self.assertEqual(updated_user.subject.first().name, "Math")
        self.assertFalse(updated_user.subject.filter(name="Art").exists())
    
    # Test case when user trying to add bio longer than 2048 characters
    def test_update_about_exceeds_max_length(self):
        long_about = "a" * 2049
        data = {
            "about": long_about
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("about", serializer.errors)
        self.assertEqual(serializer.errors["about"][0], "Ensure this field has no more than 2048 characters.")
    
    # Test case for valid "about" field
    def test_update_valid_about(self):
        valid_about = {
            "about": "Valid about user."
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=valid_about)
        self.assertTrue(serializer.is_valid())

        updated_user = serializer.save()
        self.assertEqual(updated_user.about, "Valid about user.")
        self.assertNotEqual(updated_user.about, "Test bio")
    
    # Test case for valid First name and Last name fields
    def test_update_valid_first_name_last_name(self):
        valid_names = {
            "first_name": "New First Name",
            "last_name": "New Last Name"
        }

        serializer = UpdateProfileSerializer(instance=self.user, data=valid_names)
        self.assertTrue(serializer.is_valid())

        updated_user = serializer.save()

        # Now First Name and Last Name is no "John Doe"
        self.assertEqual(updated_user.first_name, "New First Name")
        self.assertEqual(updated_user.last_name, "New Last Name")
        self.assertNotEqual(updated_user.first_name, "John")
        self.assertNotEqual(updated_user.last_name, "Doe")
    

    # Helper function for creating images
    def create_image_file(self, size_kb, format="JPEG", filename="test_image"):
        from PIL import Image
        from io import BytesIO
        from django.core.files.base import ContentFile
        
        # 1 KB = 1024 bytes, basit bir görüntü oluştur
        img = Image.new("RGB", (100, 100), color="red")
        buffer = BytesIO()
        img.save(buffer, format=format)
        buffer.seek(0)
        
        # Boyutu ayarla (yaklaşık olarak)
        content = buffer.getvalue()
        multiplier = int(size_kb * 1024 / len(content)) + 1
        large_content = content * multiplier
        return ContentFile(large_content[:size_kb * 1024], name=f"{filename}.{format.lower()}")

    # Test case when user sends bigger than 300 KB image file
    def test_profile_picture_too_large(self):
        large_image = self.create_image_file(size_kb=310, format="JPEG", filename="large_image")
        data = {"profile_picture": large_image}

        serializer = UpdateProfileSerializer(instance=self.user, data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("profile_picture", serializer.errors)
        self.assertEqual(serializer.errors["profile_picture"][0], "The maximum image size can be 300 KB.")

    # Test case when user sends an invalid file type
    def test_profile_picture_invalid_type(self):
        from django.core.files.base import ContentFile
        txt_file = ContentFile(b"Some text content", name="test.txt")
        data = {"profile_picture": txt_file}

        serializer = UpdateProfileSerializer(instance=self.user, data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("profile_picture", serializer.errors)
        self.assertEqual(serializer.errors["profile_picture"][0], "Upload a valid image. The file you uploaded was either not an image or a corrupted image.")

    # Test case when user sends image file other than JPEG, PNG and GIF types
    def test_profile_picture_invalid_image_type(self):
        bmp_image = self.create_image_file(size_kb=100, format="BMP", filename="test_bmp")
        data = {"profile_picture": bmp_image}

        serializer = UpdateProfileSerializer(instance=self.user, data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("profile_picture", serializer.errors)
        self.assertEqual(serializer.errors["profile_picture"][0], "Only JPEG, PNG and GIF images are allowed.")

    # Test case for valid image
    def test_profile_picture_valid_size(self):
        valid_image = self.create_image_file(size_kb=300, format="JPEG", filename="valid_image")
        data = {"profile_picture": valid_image}

        serializer = UpdateProfileSerializer(instance=self.user, data=data)
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()
        self.assertEqual(updated_user.profile_picture.name, "profile-pictures/valid_image.jpeg")

    # Test case for if old image will be deleted when new valid image file sent (A.jpeg -> B.jpeg)
    def test_profile_picture_replacement(self):
        # First valid image file
        first_image = self.create_image_file(size_kb=200, format="JPEG", filename="A")
        data1 = {"profile_picture": first_image}
        serializer1 = UpdateProfileSerializer(instance=self.user, data=data1)
        self.assertTrue(serializer1.is_valid())
        updated_user1 = serializer1.save()
        self.assertEqual(updated_user1.profile_picture.name, "profile-pictures/A.jpeg")

        # Second valid image file
        second_image = self.create_image_file(size_kb=250, format="JPEG", filename="B")
        data2 = {"profile_picture": second_image}
        serializer2 = UpdateProfileSerializer(instance=updated_user1, data=data2)
        self.assertTrue(serializer2.is_valid())
        updated_user2 = serializer2.save()
        self.assertEqual(updated_user2.profile_picture.name, "profile-pictures/B.jpeg")
