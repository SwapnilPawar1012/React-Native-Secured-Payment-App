from django.urls import path
from otp.views import send_otp, verify_otp

urlpatterns = [
    path('api/send-otp/', send_otp),
    path('api/verify-otp/', verify_otp),
]