from django.shortcuts import render
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from twilio.rest import Client

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_SERVICE_SID = os.getenv("TWILIO_SERVICE_SID")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

@api_view(['POST'])
def send_otp(request):
    phone = request.data.get('phoneNumber')
    if not phone:
        return Response({'success': False, 'message': 'Phone number is required'}, status=400)

    try:
        verification = client.verify.v2.services(TWILIO_SERVICE_SID).verifications.create(
            to=f'+91{phone}',
            channel='sms'
        )
        return Response({'success': True, 'message': 'OTP sent successfully', 'sid': verification.sid})
    except Exception as e:
        return Response({'success': False, 'message': str(e)}, status=500)


@api_view(['POST'])
def verify_otp(request):
    phone = request.data.get('phoneNumber')
    code = request.data.get('code')

    if not phone or not code:
        return Response({'success': False, 'message': 'Phone number and code are required'}, status=400)

    try:
        verification_check = client.verify.v2.services(TWILIO_SERVICE_SID).verification_checks.create(
            to=f'+91{phone}',
            code=code
        )
        if verification_check.status == 'approved':
            return Response({'success': True, 'message': 'OTP verified successfully'})
        else:
            return Response({'success': False, 'message': 'Invalid OTP'}, status=400)
    except Exception as e:
        return Response({'success': False, 'message': str(e)}, status=500)
