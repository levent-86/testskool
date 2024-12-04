from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import Subject
from django.test import override_settings
from django.core.cache import cache
from django.conf import settings



# Override throttling settings to not throttle for test cases
@override_settings(
    REST_FRAMEWORK = {
        'DEFAULT_THROTTLE_RATES': {
            'anon': '1/minute',
            'user': '1/minute',
        }
    }
)
class SubjectListViewTest(APITestCase):
  """ Subject list view test """

  def setUp(self):
      cache.clear()
      
      # Provide test data
      self.subject1 = Subject.objects.create(name="Math")
      self.subject2 = Subject.objects.create(name="Science")

      # print(settings.REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'])


  def test_get_subjects(self):
    # Get url
    url = reverse("subject")
    
    # Get request
    response = self.client.get(url)
    
    # Lookup response
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    # Lookup response data
    self.assertEqual(len(response.data), 2) # Must be two data in the response
    self.assertEqual(response.data[0]['name'], self.subject1.name) # Both data should be same as provieded data
    self.assertEqual(response.data[1]['name'], self.subject2.name)

  def test_subject_list_empty(self):
    """Test without data."""
    
    # Remove the previous data
    Subject.objects.all().delete()
    
    url = reverse('subject')
    response = self.client.get(url)

    self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Now response should be empty
    self.assertEqual(response.data, [])
