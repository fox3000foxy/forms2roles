import { sendEmail, sendSimpleEmail, sendHtmlEmail } from './utils/sendEmail';

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

    // // Test 2: HTML email with fallback text
    // console.log('Testing HTML email...');
    // await sendHtmlEmail(
    //   'recipient@example.com',
    //   'Test Email - HTML',
    //   '<h1>Hello from forms2roles!</h1><p>This is an <strong>HTML</strong> email.</p>',
    //   'Hello from forms2roles! This is a plain text fallback.'
    // );
    // console.log('✓ HTML email sent successfully');

    // // Test 3: Advanced email with multiple recipients and CC
    // console.log('Testing advanced email...');
    // await sendEmail({
    //   to: ['recipient1@example.com', 'recipient2@example.com'],
    //   cc: 'manager@example.com',
    //   subject: 'Test Email - Advanced',
    //   html: `
    //     <div style="font-family: Arial, sans-serif;">
    //       <h2>Advanced Email Test</h2>
    //       <p>This email demonstrates advanced features:</p>
    //       <ul>
    //         <li>Multiple recipients</li>
    //         <li>CC functionality</li>
    //         <li>HTML formatting</li>
    //       </ul>
    //       <p>Sent at: ${new Date().toISOString()}</p>
    //     </div>
    //   `,
    //   text: 'Advanced Email Test - This email demonstrates multiple recipients, CC functionality, and HTML formatting.'
    // });
    // console.log('✓ Advanced email sent successfully');

  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

// Only run tests if this file is executed directly
if (require.main === module) {
  testEmailFunctions();
}

export { testEmailFunctions };