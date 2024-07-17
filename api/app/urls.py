from app.views import (GenerateOTPEndpoint, LoginEndpoint,
                       LoginViaUsernameEndpoint, ProfileEndpoint, UserEndpoint)
from django.urls import include, path
from rest_framework import routers

router = routers.DefaultRouter()
router.register(prefix=r"users", basename="users", viewset=UserEndpoint)
router.register(prefix=r"profile", basename="profile", viewset=ProfileEndpoint)

urlpatterns = [
    path("", include(router.urls)),
    path("generate-otp/", GenerateOTPEndpoint.as_view(), name="generate_otp"),
    path("login/", LoginEndpoint.as_view(), name="login"),
    path(
        "login/username/", LoginViaUsernameEndpoint.as_view(), name="login_via_username"
    ),
]
