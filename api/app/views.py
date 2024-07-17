import random

import redis
from app.models import CustomUser, Profile
from config.env import envConfig
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.mixins import (CreateModelMixin, ListModelMixin,
                                   RetrieveModelMixin, UpdateModelMixin)
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from utils.mail_templates import login_otp_template

from .serializers import (GenerateOTPSerializer, LoginSerializer,
                          LoginViaUsernameSerializer, ProfileSerializer,
                          UserSerializer)

_redis = redis.Redis(
    host=envConfig.REDIS_HOST, port=envConfig.REDIS_PORT, decode_responses=True
)


class UserEndpoint(
    CreateModelMixin, ListModelMixin, RetrieveModelMixin, GenericViewSet
):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    @classmethod
    def get_user_by_email(cls, email):
        user = CustomUser.objects.filter(email=email).first()
        if not user:
            return Response(
                data={"error": f"User with email {email} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        elif self.action == "list":
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class ProfileEndpoint(
    RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet
):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]


class GenerateOTPEndpoint(APIView):
    @classmethod
    def generate_otp(cls) -> str:
        return str(random.randint(100000, 999999))

    @classmethod
    def post(cls, request):
        serializer = GenerateOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            user = CustomUser.get_user_by_email(email)
            if not user:
                return Response(
                    data={"error": f"User with email {email} not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            otp = cls.generate_otp()
            _redis.setex(name=email, value=otp, time=300)
            subject = "OTP for Login"
            plain_message = f"Your OTP is {otp}"
            html_message = login_otp_template.replace("{{otp}}", otp)
            from_email = envConfig.EMAIL_HOST_USER
            recipient_list = [email]
            try:
                send_mail(
                    subject=subject,
                    message=plain_message,
                    from_email=from_email,
                    recipient_list=recipient_list,
                    html_message=html_message,
                )
                return Response(
                    {"message": "OTP sent successfully"}, status=status.HTTP_200_OK
                )
            except Exception as e:
                return Response(
                    {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginEndpoint(APIView):
    @classmethod
    def verity_email_otp(cls, email, otp) -> bool:
        return True if (_redis.get(name=email) == otp) else False

    @classmethod
    def generate_token(cls, user):
        return Token.objects.get_or_create(user=user)[0].key

    @classmethod
    def post(cls, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            otp = serializer.validated_data["otp"]
            user = CustomUser.get_user_by_email(email)
            if not user:
                return Response(
                    data={"error": f"User with email {email} not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            profile = Profile.get_profile_by_user_id(user.id)
            verify_otp = cls.verity_email_otp(email, otp)
            if verify_otp:
                token = cls.generate_token(user)
                return Response(
                    {"token": token, "user": ProfileSerializer(profile).data},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"message": "OTP verification failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LoginViaUsernameEndpoint(APIView):
    @classmethod
    def post(cls, request):
        serializer = LoginViaUsernameSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = CustomUser.get_user_by_username(username)
            if not user:
                return Response(
                    data={"error": f"User with username {username} not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            auth_user = cls.authenticate_user(username=username, password=password)
            if auth_user:
                token = LoginEndpoint.generate_token(user)
                profile = Profile.get_profile_by_user_id(user.id)
                return Response(
                    {"token": token, "user": ProfileSerializer(profile).data},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"message": "Invalid Username or Password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @classmethod
    def authenticate_user(cls, username, password):
        user = authenticate(username=username, password=password)
        return user if user else None
