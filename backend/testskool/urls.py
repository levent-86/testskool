from django.urls import path
from testskool import views

urlpatterns = [
    path("subject/", views.SubjectListView.as_view(), name="subject"),
    path("register/", views.register, name="register"),
]
