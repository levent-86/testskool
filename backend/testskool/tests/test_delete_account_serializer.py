from rest_framework.test import APITestCase, APIRequestFactory
from django.test import override_settings
from django.core.cache import cache
from ..serializers import DeleteAccountSerializer
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
class DeleteAccountSerializerTest(APITestCase):
    def setUp(self):
        cache.clear()

        self.factory = APIRequestFactory()

        # Create a user
        self.user = get_user_model().objects.create_user(
            username="test-user",
            password="password",
            is_teacher=False,
            is_student=True,
        )

    # Test case when a user trying to delete account with a wrong password
    def test_delete_with_wrong_password(self):
        # Create a request
        request = self.factory.delete('/delete-account/', data={"password": "wrong-password"})
        request.user = self.user

        serializer = DeleteAccountSerializer(data={"password": "wrong-password"}, context={"request": request})
        
        # Now should raise error
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)
        self.assertEqual(serializer.errors["password"][0], "Incorrect password.")
    
    # Test case when a user deletes account successfully
    def test_delete_with_correct_password(self):
        request = self.factory.delete('/delete-account/', data={"password": "password"})
        request.user = self.user

        serializer = DeleteAccountSerializer(data={"password": "password"}, context={"request": request})
        
        # Now should delete successfully
        self.assertTrue(serializer.is_valid())
        serializer.delete()
        self.assertFalse(get_user_model().objects.filter(username="test-user").exists())
