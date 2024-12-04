from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import Subject
from django.contrib.auth import get_user_model
from django.test import override_settings
from django.core.cache import cache


# Override throttling settings to not throttle for test cases
@override_settings(
    REST_FRAMEWORK = {
        'DEFAULT_THROTTLE_RATES': {
            'anon': '1/minute',
            'user': '1/minute',
        }
    }
)
class RegisterViewTest(APITestCase):
    """ Register view tests """


    # Provide data for test
    def setUp(self):
        cache.clear()
        self.subject = Subject.objects.create(name="Math")
        self.subject = Subject.objects.create(name="Art")
        self.url = reverse('register')

    # Test case is when username is not provided
    def test_register_missing_username(self):
        data = {
            "username": "",
            "password": "12345678",
            "confirm": "12345678",
            "isTeacher": True,
            "subject": ["Math"],
        }

        response = self.client.post(self.url, data, format='json')

        # Missing username should show error message with status code
        self.assertEqual(response.status_code, status.HTTP_412_PRECONDITION_FAILED)
        self.assertIn("Please provide a username.", response.data['message'])


    # Test case is when username includes space character
    def test_register_username_with_space(self):
        data = {
          "username": "john doe",
          "password": "12345678",
          "confirm": "12345678",
          "isTeacher": False,
          "Subject": []
        }
        response = self.client.post(self.url, data, format="json")

        # Space character should show error message with status code
        self.assertEqual(response.status_code, status.HTTP_412_PRECONDITION_FAILED)
        self.assertIn("Space is not allowed on username.", response.data["message"])


    # Test case is when username is already exists
    def test_register_username_exists(self):
        get_user_model().objects.create_user(username="existing_user", password="12345678")
        
        data = {
            "username": "existing_user",
            "password": "12345678",
            "confirm": "12345678",
            "isTeacher": True,
            "subject": ["Math"],
        }

        response = self.client.post(self.url, data, format='json')

        # Existing user should show error message with status code
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertIn("This username is already exists.", response.data['message'])


    # Test case is when password is NOT provided
    def test_register_without_password(self):
      data = {
        "username": "missing_password_user",
        "password": "",
        "confirm":"12345678",
        "isTeacher": False,
        "subject": [],
      }

      response = self.client.post(self.url, data, format="json")

      # Missing password should show error message with status code
      self.assertEqual(response.status_code, status.HTTP_412_PRECONDITION_FAILED)
      self.assertIn("Please provide a password.", response.data["message"])


    # Test case is when password is short than 8 characters
    def test_register_short_password(self):
        data = {
            "username": "short_password_user",
            "password": "1234567",
            "confirm": "1234567",
            "isTeacher": True,
            "subject": ["Math"],
        }

        response = self.client.post(self.url, data, format='json')

        # Short password should show error message with status code
        self.assertEqual(response.status_code, status.HTTP_412_PRECONDITION_FAILED)
        self.assertIn("Password must be at least 8 characters.", response.data['message'])


    # Test case is when password and confirmation are NOT match
    def test_register_password_mismatch(self):
        data = {
            "username": "mismatch_password_user",
            "password": "12345678",
            "confirm": "01234567",
            "isTeacher": False,
            "subject": [],
        }

        response = self.client.post(self.url, data, format='json')

        # Password and confirmation mismatch should show error message with status code
        self.assertEqual(response.status_code, status.HTTP_417_EXPECTATION_FAILED)
        self.assertIn("Password and confirmation didn't match.", response.data['message'])


    # Test case is when user role is not a boolean
    def test_register_role_not_boolean(self):
        data = {
            "username": "role_not_boolean_user",
            "password": "12345678",
            "confirm": "12345678",
            "isTeacher": "string",
            "subject": [],
        }

        response = self.client.post(self.url, data, format='json')

        # Non-boolean user role should show error message with status code
        self.assertEqual(response.status_code, status.HTTP_417_EXPECTATION_FAILED)
        self.assertIn("Choose one field: student or teacher.", response.data['message'])


    # Test case is when a teacher trying to register without subject
    def test_register_teacher_without_subject(self):
        data = {
            "username": "teacher_without_subject",
            "password": "12345678",
            "confirm": "12345678",
            "isTeacher": True,
            "subject": [],
        }

        response = self.client.post(self.url, data, format='json')

        # Teacher role without subject should show error message with status code
        self.assertEqual(response.status_code, status.HTTP_417_EXPECTATION_FAILED)
        self.assertIn("Please select your subject(s) (ex: \"Math\", \"Art\" ...).", response.data['message'])


    # Test case is when a teacher has an invalid subject
    def test_register_teacher_with_invalid_subject(self):
        data = {
            "username": "teacher_with_invalid_subject",
            "password": "12345678",
            "confirm": "12345678",
            "isTeacher": True,
            "subject": ["Non Existing Subject"],
        }

        response = self.client.post(self.url, data, format='json')

        # Teacher role with invalid subject should show error message with status code
        self.assertEqual(response.status_code, status.HTTP_417_EXPECTATION_FAILED)
        self.assertIn("Please select your subject(s) (ex: \"Math\", \"Art\" ...).", response.data['message'])


    # Test case is when a student trying to register with a subject
    def test_register_student_with_subject(self):
        data = {
            "username": "student_with_subject",
            "password": "12345678",
            "confirm": "12345678",
            "isTeacher": False,
            "subject": ["Math"],
        }

        response = self.client.post(self.url, data, format='json')

        # Student role with subject should show error message with status code
        self.assertEqual(response.status_code, status.HTTP_417_EXPECTATION_FAILED)
        self.assertIn("Only teachers can choose a subject.", response.data['message'])


    # Test case is registering a valid teacher
    def test_register_valid_teacher(self):
        data = {
            "username": "teacher_user",
            "password": "12345678",
            "confirm": "12345678",
            "isTeacher": True,
            "subject": ["Math"],
        }

        response = self.client.post(self.url, data, format='json')

        # Valid teacher registration should show a success message with status code
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("Account registered successfully. You are ready to log in!", response.data['message'])

        # Check if teacher is registered
        self.assertTrue(get_user_model().objects.filter(username="teacher_user").exists())


    # Test case is registering a valid teacher with multi subject
    def test_register_valid_teacher_multi_subject(self):
        data = {
            "username": "teacher_user_with_multi_subject",
            "password": "12345678",
            "confirm": "12345678",
            "isTeacher": True,
            "subject": ["Math", "Art"],
        }

        response = self.client.post(self.url, data, format='json')

        # Valid teacher registration should show a success message with status code
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("Account registered successfully. You are ready to log in!", response.data['message'])

        # Check if teacher is registered
        self.assertTrue(get_user_model().objects.filter(username="teacher_user_with_multi_subject").exists())


    # Test case is registering a valid student
    def test_register_valid_student(self):
        data = {
            "username": "student_user",
            "password": "12345678",
            "confirm": "12345678",
            "isTeacher": False,
            "subject": [],
        }

        response = self.client.post(self.url, data, format='json')

        # Valid student registration should show a success message with status code
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("Account registered successfully. You are ready to log in!", response.data['message'])

        # Check if student is registered
        self.assertTrue(get_user_model().objects.filter(username="student_user").exists())
