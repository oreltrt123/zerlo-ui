import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    // Create a test SMTP service account from Ethereal
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "zerlocontactus@gmail.com",
      subject: subject || "New Contact Form Submission",
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || "N/A"}
        Subject: ${subject}
        Message: ${message}
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({
      message: "Message sent successfully!",
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
