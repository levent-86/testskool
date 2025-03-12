from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import (
    Subjects,
    Register,
    MyProfileSerializer
)
from .models import Subject
from .utils import Notification



class SubjectListView(generics.ListAPIView):
    """ List of Teacher / Quiz subjects """
    permission_classes = [AllowAny]
    queryset = Subject.objects.all().order_by("name")
    serializer_class = Subjects



@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """ Register a user """

    if request.method == "POST":
        serializer = Register(data=request.data)
        if serializer.is_valid():
            serializer.save()
            content = Notification.get_message("user_created")
            return Response(content, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class MyProfileView(generics.RetrieveAPIView):
    """ Send user's informations """
    queryset = get_user_model().objects.all()
    serializer_class = MyProfileSerializer

    def get_object(self):
        return self.request.user


class EditProfileView():
    ...

@api_view(['PUT'])
def edit_profile(request):
    print(request.data)
