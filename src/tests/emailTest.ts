import { sendEmail, sendSimpleEmail, sendHtmlEmail } from '../utils/sendEmail';

async function testEmailFunctions() {
  try {
    // Test 1: Simple text email
    console.log('Testing simple email...');
    await sendSimpleEmail(
      'fox3000foxy@gmail.com',
      'Your verification code',
      'Your verification code is: ' + Math.floor(100000 + Math.random() * 900000)
    );
    console.log('✓ Simple email sent successfully');
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

// Only run tests if this file is executed directly
if (require.main === module) {
  testEmailFunctions();
}

export { testEmailFunctions };