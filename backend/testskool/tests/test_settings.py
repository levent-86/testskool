
from datetime import timedelta
from django.conf import settings
from django.test import override_settings
from django.core.cache import cache
import os
from django.test import TestCase



# Override throttling settings to not throttle for test cases
@override_settings(
    REST_FRAMEWORK = {
        'DEFAULT_THROTTLE_RATES': {
            'anon': '1/minute',
            'user': '1/minute',
        }
    }
)
class SettingsTest(TestCase):
    def setUp(self):
        cache.clear()
    

    def test_secret_key_loaded_from_env(self):
        """Test that the SECRET_KEY is loaded from the environment variables"""
        secret_key = os.getenv('SECRET_KEY')
        self.assertIsNotNone(secret_key, "SECRET_KEY is not set in the environment")
        self.assertNotEqual(secret_key, "", "SECRET_KEY should not be empty")


    def test_cache_backend(self):
        """Test that the cache backend is set to LocMemCache for tests"""
        # Accessing the CACHES setting
        cache_backend = settings.CACHES['default']['BACKEND']
        self.assertEqual(cache_backend, 'django.core.cache.backends.locmem.LocMemCache', "Cache backend is not LocMemCache")


    def test_cache_location(self):
        """Test the cache location setting"""
        # Accessing the CACHES location
        cache_location = settings.CACHES['default']['LOCATION']
        self.assertEqual(cache_location, 'testskool-cache', "Cache location is not set correctly")


    def test_cors_allowed_origins(self):
        """Test that CORS allowed origins are correctly set"""
        
        # Access CORS_ALLOWED_ORIGINS from settings
        cors_allowed_origins = settings.CORS_ALLOWED_ORIGINS
        
        # Check if necessary origins are included in the list
        self.assertIn('http://localhost:8080', cors_allowed_origins, "http://localhost:8080 should be in CORS_ALLOWED_ORIGINS")
        self.assertIn('http://localhost:5173', cors_allowed_origins, "http://localhost:5173 should be in CORS_ALLOWED_ORIGINS")
        self.assertIn('http://127.0.0.1:8000', cors_allowed_origins, "http://127.0.0.1:8000 should be in CORS_ALLOWED_ORIGINS")
        
        # Ensure that a malicious domain is not included
        self.assertNotIn('http://maliciousdomain.com', cors_allowed_origins, "http://maliciousdomain.com should NOT be in CORS_ALLOWED_ORIGINS")
    

    def test_media_files(self):
        media_root = settings.MEDIA_ROOT
        media_root = settings.MEDIA_URL
        """Test the MEDIA_ROOT and MEDIA_URL settings"""
        self.assertTrue(media_root.endswith('media/'))
        self.assertEqual(media_root, '/media/')


    def test_jwt_settings(self):
        """Test the JWT settings"""
        simple_jwt = settings.SIMPLE_JWT
        self.assertEqual(simple_jwt['ACCESS_TOKEN_LIFETIME'], timedelta(minutes=45))
        self.assertEqual(simple_jwt['REFRESH_TOKEN_LIFETIME'], timedelta(days=30))



