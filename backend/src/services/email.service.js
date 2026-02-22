const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function userRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend-Ledger!";

  // Plain text version
  const text = `Hi ${name},

    Thank you for registering with our app! We're excited to have you on board.

    Best regards,
    Backend-Ledger Team`;

  // HTML version
  const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hi ${name},</h2>
        <p>Thank you for registering with our app! We're excited to have you on board.</p>
        <p>Best regards,<br>Backend-Ledger</p>
        </div>
    `;

  // Send the email
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail({
  userEmail,
  name,
  fromAccount,
  toAccount,
  amount,
  status, // COMPLETED | FAILED | PENDING | REVERSED
}) {
  let subject;
  let statusColor;
  let statusMessage;

  switch (status) {
    case "COMPLETED":
      subject = "Transaction Successful";
      statusColor = "green";
      statusMessage = "Your transaction was completed successfully.";
      break;

    case "FAILED":
      subject = "Transaction Failed";
      statusColor = "red";
      statusMessage = "Your transaction could not be processed.";
      break;

    case "PENDING":
      subject = "Transaction Pending";
      statusColor = "orange";
      statusMessage = "Your transaction is currently being processed.";
      break;

    case "REVERSED":
      subject = "Transaction Reversed";
      statusColor = "purple";
      statusMessage = "Your transaction has been reversed.";
      break;

    default:
      subject = "Transaction Update";
      statusColor = "black";
      statusMessage = "There is an update regarding your transaction.";
  }

  const text = `Hi ${name},

${statusMessage}

From Account: ${fromAccount}
To Account: ${toAccount}
Amount: ${amount}
Status: ${status}

Backend-Ledger Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color:${statusColor};">Transaction ${status}</h2>
      <p>Hi ${name},</p>
      <p>${statusMessage}</p>
      <ul>
        <li><strong>From Account:</strong> ${fromAccount}</li>
        <li><strong>To Account:</strong> ${toAccount}</li>
        <li><strong>Amount:</strong> ${amount}</li>
        <li><strong>Status:</strong> ${status}</li>
      </ul>
      <br/>
      <p>Thank you for using <strong>Backend-Ledger</strong>.</p>
    </div>
  `;

  return sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailedEmail({
  userEmail,
  name,
  fromAccount,
  toAccount,
  amount,
}) {
  const subject = "Transaction Failed";
  const text = `Hi ${name},

We regret to inform you that your recent transaction could not be processed.
From Account: ${fromAccount}
To Account: ${toAccount}
Amount: ${amount} 
Please check your account details and try again.
Best regards,
Backend-Ledger Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color:red;">Transaction Failed</h2>
      <p>Hi ${name},</p>
      <p>We regret to inform you that your recent transaction could not be processed.</p>
      <ul>
        <li><strong>From Account:</strong> ${fromAccount}</li>
        <li><strong>To Account:</strong> ${toAccount}</li>
        <li><strong>Amount:</strong> ${amount}</li>
      </ul>
      <p>Please check your account details and try again.</p>
      <br/>
      <p>Best regards,<br/><strong>Backend-Ledger Team</strong></p>
    </div>
  `;
  return sendEmail(userEmail, subject, text, html);
}

module.exports = {
  userRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailedEmail,
};
