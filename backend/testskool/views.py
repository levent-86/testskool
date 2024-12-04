from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import (
    Subjects,
    CreateUser
)
from .models import Subject
from .utils import Notification



class SubjectListView(generics.ListAPIView):
    """ Teacher / Quiz subjects """
    permission_classes = [AllowAny]
    queryset = Subject.objects.all().order_by("name")
    serializer_class = Subjects


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """ Register a user """

    if request.method == "POST":
        username = request.data.get("username")
        password = request.data.get("password")
        is_teacher = request.data.get("isTeacher")
        subject = request.data.get("subject")

        # Ensure if username field is filled
        if not username:
            content = Notification.get_message("missing_username")
            return Response(content, status=status.HTTP_412_PRECONDITION_FAILED)
        
        # Ensure if username has no space character
        if ' ' in username:
            content = Notification.get_message("space_not_allowed")
            return Response(content, status=status.HTTP_412_PRECONDITION_FAILED)

        # Check if username is exists
        if get_user_model().objects.filter(username=username).exists():
            content = Notification.get_message("username_exists")
            return Response(content, status=status.HTTP_409_CONFLICT)
        
        # Ensure if password field is filled
        if not password:
            content = Notification.get_message("missing_password")
            return Response(content, status=status.HTTP_412_PRECONDITION_FAILED)
        
        # Check the password lengt
        if len(password) < 8:
            content = Notification.get_message("short_password")
            return Response(content, status=status.HTTP_412_PRECONDITION_FAILED)

        # Ensure if password matches confirmation
        if password != request.data.get("confirm"):
            content = Notification.get_message("password_mismatch")
            return Response(content, status=status.HTTP_417_EXPECTATION_FAILED)

        # Check if role is a bool
        if not isinstance(is_teacher, bool):
            content = Notification.get_message("missing_role")
            return Response(content, status=status.HTTP_417_EXPECTATION_FAILED)

        # Check if a subject sent or sent subject is in database
        if is_teacher:
            if not subject or not Subject.objects.filter(name__in=subject):
                content = Notification.get_message("missing_subject")
                return Response(content, status=status.HTTP_417_EXPECTATION_FAILED)
        
        # Check if a student trying to have a subject
        if not is_teacher and subject:
            content = Notification.get_message("only_teachers")
            return Response(content, status=status.HTTP_417_EXPECTATION_FAILED)

        # Save data
        serializer = CreateUser(data=request.data)
        if serializer.is_valid():
            serializer.save()
            content = Notification.get_message("user_created")
            return Response(content, status=status.HTTP_201_CREATED)
        else:
            content = Notification.get_message("unable_register")
            return Response(content, status=status.HTTP_417_EXPECTATION_FAILED)
