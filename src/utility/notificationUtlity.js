import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;


const client = twilio(accountSid, authToken);

export const sendOTPOnRequest = async (otp, phone) => {
    try {
      const message = await client.messages.create({
        body: `Your OTP is ${otp}`,
        to: `+91${phone}`, // This should be the user's phone number
        from: '063933 58107', // Replace with your Twilio verified number
      });
      console.log(`OTP sent: ${message}`);

      return message
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };


  
export const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

    return { otp, expiresAt };
};
  