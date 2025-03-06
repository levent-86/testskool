from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

# Model for users
class User(AbstractUser):
    about = models.CharField(max_length=2048, blank=True)
    subject = models.ManyToManyField("Subject", blank=True, related_name="teachers_set")
    is_teacher = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to="profile-pictures", blank=True, null=True)

    def __str__(self):
        return self.username

# Model for subjects
class Subject(models.Model):
    name = models.CharField(max_length=64)
    teachers = models.ManyToManyField(User, related_name="subjects_set", blank=True)

    def __str__(self):
        return f"Subject: {self.name}"
