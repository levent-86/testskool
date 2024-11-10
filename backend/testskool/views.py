from rest_framework.permissions import AllowAny
from rest_framework import generics
from .serializers import Subjects
from .models import Subject

# Create your views here.

class SubjectListView(generics.ListAPIView):
    """ Teacher / Quiz subjects """
    queryset = Subject.objects.all().order_by("name")
    serializer_class = Subjects
    permission_classes = [AllowAny]
