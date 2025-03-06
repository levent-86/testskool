from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
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
class SubjectListViewTest(APITestCase):
  # Subject list view test

  def setUp(self):
      cache.clear()
      
      # Provide test data
      self.subject1 = Subject.objects.create(name="Science")
      self.subject2 = Subject.objects.create(name="Math")

      # print(settings.REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'])


  def test_get_subjects_response(self):
      # Get url
      url = reverse("subject-list")
      
      # Get request
      response = self.client.get(url)
      
      # Lookup response
      self.assertEqual(response.status_code, status.HTTP_200_OK)


  def test_subject_data_size(self):
      url = reverse("subject-list")
      response = self.client.get(url)
  
      # Must be two data in the response
      self.assertEqual(len(response.data), 2)

  
  def test_subject_list_ordering(self):
      # Test response order
      url = reverse("subject-list")
      response = self.client.get(url)
      self.assertEqual(response.data[0]['name'], 'Math')
      self.assertEqual(response.data[1]['name'], 'Science')


  def test_subject_list_empty(self):
      # Test without data.
      
      # Remove the previous data
      Subject.objects.all().delete()
      
      url = reverse('subject-list')
      response = self.client.get(url)

      # Now response should be empty
      self.assertEqual(response.data, [])
