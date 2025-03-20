from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework import status
from django.core.cache import cache

@override_settings(
    REST_FRAMEWORK={
        'DEFAULT_THROTTLE_RATES': {
            'anon': '1/minute',
            'user': '1/minute',
        }
    }
)
class EditProfileViewTest(APITestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        
        # Create user
        self.user = get_user_model().objects.create_user(
            username="test-user",
            password="password",
            email="test@example.com",
            is_teacher=False,
            is_student=True,
        )
        # auth user
        self.client.force_authenticate(user=self.user)

    # Test case for success request
    def test_edit_profile_success_returns_202(self):
        valid_data = {
            "username": "new-username"
        }
        response = self.client.put('/testskool/edit-profile/', data=valid_data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(response.data, {"status": "success", "message": "Profile updated successfully."})

    # Test case for error request
    def test_edit_profile_invalid_data_returns_400(self):
        invalid_data = {
            "password": "password"
        }
        response = self.client.put('/testskool/edit-profile/', data=invalid_data, format='multipart')
        
        # 400 durum kodunu kontrol et
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data)
