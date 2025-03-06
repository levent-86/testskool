from rest_framework.test import APITestCase
from ..serializers import Subjects
from ..models import Subject
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
class SubjectSerializerTestCase(APITestCase):
    def setUp(self):
        cache.clear()
        
        # Create a subject for test
        self.subject = Subject.objects.create(name="Mathematics")
    
    def test_valid_subject_serialization(self):
        serializer = Subjects(instance=self.subject)
        data = serializer.data
        
        # Are they serialized right
        self.assertEqual(data["id"], self.subject.id)
        self.assertEqual(data["name"], self.subject.name)


    def test_read_only_fields(self):
        serializer = Subjects(instance=self.subject)
        
        # Fields should be read only
        self.assertFalse(serializer.fields['id'].write_only)
        self.assertFalse(serializer.fields['name'].write_only)
