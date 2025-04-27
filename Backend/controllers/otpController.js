require('dotenv').config();
const twilio = require('twilio');

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

const sentOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        console.log("phoneNumber: ", phoneNumber)

        if (!phoneNumber) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        const verification = await client.verify.v2.services(serviceSid)
            .verifications
            .create({ to: `+91${phoneNumber}`, channel: 'sms' });

        console.log('Verification: ', verification);
        res.status(200).json({ success: true, message: 'OTP sent successfully', sid: verification.sid })
    } catch (error) {
        console.error('Error sending otp: ', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to send SMS.' })
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        console.log("phoneNumber: ", phoneNumber, "code: ", code)

        if (!phoneNumber || !code) {
            return res.status(400).json({ success: false, message: "Phone number and OTP code are required" });
        }

        const verificationCheck = await client.verify.v2.services(serviceSid).verificationChecks.create({
            to: `+91${phoneNumber}`,
            code
        });

        console.log('VerificationStatus: ', verificationCheck);
        if (verificationCheck.status === "approved") {
            res.status(200).json({ success: true, message: 'OTP verified successfully' })
        } else {
            res.status(400).json({ success: false, message: 'Invalid OTP.' })
        }
    } catch (error) {
        console.error('Error verifying otp: ', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to verify OTP.' })
    }
}

module.exports = { sentOTP, verifyOTP }