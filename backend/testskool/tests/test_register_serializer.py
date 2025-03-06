from rest_framework.test import APITestCase
from django.test import override_settings
from django.core.cache import cache
from ..models import Subject
from ..serializers import Register
from django.contrib.auth import get_user_model

# Override throttling settings to not throttle for test cases
@override_settings(
    REST_FRAMEWORK = {
        'DEFAULT_THROTTLE_RATES': {
            'anon': '1/minute',
            'user': '1/minute',
        }
    }
)
class RegisterSerializerTestCase(APITestCase):
    def setUp(self):
        cache.clear()
        self.subject1 = Subject.objects.create(name="Math")
        self.subject2 = Subject.objects.create(name="Art")

        self.valid_data = {
            "username": "valid-user",
            "password": "12345678",
            "confirm": "12345678",
            "is_teacher": True,
            "subject": ["Math"],
        }

    # Test case is when username is not provided
    def test_register_missing_username(self):
        missing_username = self.valid_data.copy()
        missing_username["username"] = ""

        serializer = Register(data=missing_username)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)
        self.assertEqual(serializer.errors['username'][0], "This field may not be blank.")
    

     # Test case is when username includes space character
    def test_register_username_with_space(self):
        username_space = self.valid_data.copy()
        username_space["username"] = "space user"

        serializer = Register(data=username_space)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)
        self.assertEqual(serializer.errors['username'][0], "Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.")
    

    # Test case is when username is already exists
    def test_register_username_exists(self):
        get_user_model().objects.create_user(username="valid-user", password="12345678")
        
        new_user = self.valid_data.copy()
        serializer = Register(data=new_user)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)
        self.assertEqual(serializer.errors["username"][0], "A user with that username already exists.")
    

    # Test case is when password is NOT provided
    def test_register_without_password(self):
        missing_password = self.valid_data.copy()
        missing_password["password"] = ""

        serializer = Register(data=missing_password)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)
        self.assertEqual(serializer.errors["password"][0], "This field may not be blank.")
    

    # Test case is when password is short than 8 characters
    def test_register_short_password(self):
        short_password = self.valid_data.copy()
        short_password["password"] = "1234567"

        serializer = Register(data=short_password)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)
        self.assertEqual(serializer.errors["password"][0], "Password must be at least 8 characters.")
    

    # Test case is when password and confirmation are NOT match
    def test_register_password_mismatch(self):
        password_mismatch = self.valid_data.copy()
        password_mismatch["confirm"] = "mismatch-password"

        serializer = Register(data=password_mismatch)
        self.assertFalse(serializer.is_valid())
        self.assertIn("confirm", serializer.errors)
        self.assertEqual(serializer.errors["confirm"][0], "Password and confirmation must match.")
    

    # Test case is when user role is not a boolean
    def test_register_role_not_boolean(self):
        non_boolean_role = self.valid_data.copy()
        non_boolean_role["is_teacher"] = "non-boolean"

        serializer = Register(data=non_boolean_role)
        self.assertFalse(serializer.is_valid())
        self.assertIn("is_teacher", serializer.errors)
        self.assertEqual(serializer.errors["is_teacher"][0], "Must be a valid boolean.")
    

    # Test case is when a teacher trying to register without subject
    def test_register_teacher_without_subject(self):
        no_subject = self.valid_data.copy()
        no_subject["subject"] = []

        serializer = Register(data=no_subject)
        self.assertFalse(serializer.is_valid())
        self.assertIn("subject", serializer.errors)
        self.assertEqual(serializer.errors["subject"][0], "Please select your subject(s).")
    

    # Test case is when a teacher has an invalid subject
    def test_register_teacher_with_invalid_subject(self):
        invalid_subject = self.valid_data.copy()
        invalid_subject["subject"] = ["Not existing subject"]

        serializer = Register(data=invalid_subject)
        self.assertFalse(serializer.is_valid())
        self.assertIn("subject", serializer.errors)
        self.assertEqual(serializer.errors["subject"][0], "Please select your subject(s).")
    

    # Test case is when a student trying to register with a subject
    def test_register_student_with_subject(self):
        student_with_subject = self.valid_data.copy()
        student_with_subject["is_teacher"] = False
        student_with_subject["subject"] = ["Math"]

        serializer = Register(data=student_with_subject)
        self.assertFalse(serializer.is_valid())
        self.assertIn("subject", serializer.errors)
        self.assertEqual(serializer.errors["subject"][0], "Only teachers can choose a subject.")
    

    # Test case is registering a valid teacher
    def test_register_valid_teacher(self):
        serializer = Register(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()

        self.assertEqual(user.username, "valid-user")
        self.assertTrue(user.is_teacher)
        self.assertFalse(user.is_student)
        self.assertEqual(user.subject.count(), 1)
        self.assertEqual(user.subject.first().name, "Math")
    

    # Test case is registering a valid teacher with multi subject
    def test_register_valid_teacher_multi_subject(self):
        multi_subject = self.valid_data.copy()
        multi_subject["subject"] = ["Math", "Art"]

        serializer = Register(data=multi_subject)
        self.assertTrue(serializer.is_valid())

        user = serializer.save()
        self.assertEqual(user.subject.count(), 2)
        subjects = [subject.name for subject in user.subject.all()]
        self.assertEqual(sorted(subjects), sorted(["Math", "Art"]))
    

    # Test case is registering a valid student
    def test_register_valid_student(self):
        valid_student = self.valid_data.copy()
        valid_student["is_teacher"] = False
        valid_student["subject"] = []

        serializer = Register(data=valid_student)
        self.assertTrue(serializer.is_valid())

        user = serializer.save()
        self.assertEqual(user.is_teacher, False)
        self.assertEqual(user.is_student, True)