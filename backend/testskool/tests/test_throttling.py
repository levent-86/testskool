from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from django.test import override_settings
from django.conf import settings
from django.core.cache import cache
from ..models import Subject

@override_settings(
    REST_FRAMEWORK = {
        'DEFAULT_THROTTLE_RATES': {
            'anon': '5/minute',
            'user': '5/minute',
        }
    }
)
class ThrottlingTestCase(APITestCase):
    def setUp(self):
        cache.clear()
        self.subject = Subject.objects.create(name="Math")
        self.subject = Subject.objects.create(name="Art")
        self.url = reverse('register')
        

    # Test case is exceeding throttling limit
    def test_throttling_limit_exceeded(self):
        
        for _ in range(5):
            response = self.client.post(self.url, {
                "username": "throttling_user",
                "password": "1234367",
                "confirm": "1234567",
                "isTeacher": True,
                "subject": ["Math"]
            })

            if _ < 5:
                self.assertEqual(response.status_code, status.HTTP_412_PRECONDITION_FAILED)
            else:
                self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)