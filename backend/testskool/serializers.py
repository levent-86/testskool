from rest_framework import serializers
from .models import Subject

# Serialize the subjects to send (if any)
class Subjects(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "name",]
        read_only_fields = fields
