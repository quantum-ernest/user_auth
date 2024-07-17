from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, null=False)

    @classmethod
    def get_user_by_email(cls, email):
        user = CustomUser.objects.filter(email=email).first()
        return user if user else None

    @classmethod
    def get_user_by_username(cls, username):
        user = CustomUser.objects.filter(username=username).first()
        return user if user else None


class Profile(models.Model):
    user_id = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, primary_key=True
    )
    full_name = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.user_id.username

    @classmethod
    def get_profile_by_user_id(cls, user_id):
        profile = Profile.objects.filter(user_id=user_id).first()
        return profile
