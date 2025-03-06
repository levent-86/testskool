from rest_framework.test import APITestCase
from django.test import override_settings
from django.core.cache import cache
from django.contrib.auth import get_user_model
from ..models import Subject


# Override throttling settings to not throttle for test cases
@override_settings(
    REST_FRAMEWORK = {
        'DEFAULT_THROTTLE_RATES': {
            'anon': '1/minute',
            'user': '1/minute',
        }
    }
)
class SubjectModelTest(APITestCase):

    def setUp(self):
        cache.clear()

        # Create users (teachers)
        self.teacher1 = get_user_model().objects.create_user(
            username='teacher1',
            password='12345678',
            is_teacher=True
        )
        self.teacher2 = get_user_model().objects.create_user(
            username='teacher2',
            password='12345678',
            is_teacher=True
        )

        # Create subjects
        self.math = Subject.objects.create(name='Math')
        self.art = Subject.objects.create(name='Art')
        self.history = Subject.objects.create(name='History')

    def test_teacher_can_add_subject(self):
        """Test that a teacher can add subjects to their profile."""
        # Teacher1 adds subjects to their profile
        self.teacher1.subjects_set.add(self.math, self.art)

        # Verify that teacher1 has the right subjects
        self.assertIn(self.math, self.teacher1.subjects_set.all())
        self.assertIn(self.art, self.teacher1.subjects_set.all())

      
    def test_teacher_can_remove_subject(self):
        """Test that a teacher can remove subjects from their profile."""
        # Add subjects to teacher1
        self.teacher1.subjects_set.add(self.math, self.art)

        # teacher1 has subjects now
        self.assertIn(self.art, self.teacher1.subjects_set.all())

        # Remove a subject from teacher1's profile
        self.teacher1.subjects_set.remove(self.art)

        # Verify that teacher1 no longer has the 'Art' subject
        self.assertNotIn(self.art, self.teacher1.subjects_set.all())

      
    def test_teacher_can_only_see_their_assigned_subjects(self):
        """Test that a teacher can only see the subjects they are assigned to."""
        # Teacher1 adds Math and Art subjects
        self.teacher1.subjects_set.add(self.math, self.art)

        # Teacher2 adds History subject
        self.teacher2.subjects_set.add(self.history)

        # Verify that teacher1 have no History
        self.assertIn(self.math, self.teacher1.subjects_set.all())
        self.assertIn(self.art, self.teacher1.subjects_set.all())
        self.assertNotIn(self.history, self.teacher1.subjects_set.all())

        # Verify that teacher2 have no Math or Art
        self.assertIn(self.history, self.teacher2.subjects_set.all())
        self.assertNotIn(self.math, self.teacher2.subjects_set.all())
        self.assertNotIn(self.art, self.teacher2.subjects_set.all())


    def test_subject_can_exist_without_teachers(self):
        """Test that a subject can exist without teachers."""
        # Create a subject with no teachers
        subject_without_teachers = Subject.objects.create(name='Geography')

        # Verify that the subject can exist without teachers
        self.assertEqual(subject_without_teachers.teachers.count(), 0)


    def test_str_method(self):
        """Test the string representation of the Subject model."""
        self.assertEqual(str(self.math), 'Subject: Math')
        self.assertEqual(str(self.art), 'Subject: Art')
        self.assertEqual(str(self.history), 'Subject: History')