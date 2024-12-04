from django.contrib import admin
from .models import *

# Register your models here.

# User model
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'is_teacher', 'is_student', 'email')  # Displaying fields
    search_fields = ('username', 'email')  # Search for users
    list_filter = ('is_teacher', 'is_student')  # Filter users
    filter_horizontal = ("subject",) # ManyToMany field control

# Subject model
@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    filter_horizontal = ('teachers',)
