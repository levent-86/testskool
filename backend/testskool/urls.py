from django.urls import path
from testskool import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html#project-configuration
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path("subject-list/", views.SubjectListView.as_view(), name="subject-list"),
    path("register/", views.register, name="register"),
    path("my-profile/", views.MyProfileView.as_view(), name="my-profile"),
]
