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
class DeleteAccountViewTest(APITestCase):
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
        # Auth user
        self.client.force_authenticate(user=self.user)

    # Test case when request is successfull
    def test_delete_account_success_returns_200(self):
        valid_data = {
            "password": "password"
        }
        response = self.client.delete('/testskool/delete-account/', data=valid_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"status": "success", "message": "Account deleted successfully."})

    # Test case when request is not successfull
    def test_delete_account_invalid_data_returns_400(self):
        invalid_data = {
            "password": "wrong-password"
        }
        response = self.client.delete('/testskool/delete-account/', data=invalid_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data)
