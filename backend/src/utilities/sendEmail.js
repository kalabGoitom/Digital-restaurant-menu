import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, code) => {
  const { data, error } = await resend.emails.send({
    from: "NOVA Restaurant <onboarding@resend.dev>",
    to: [email],
    subject: "Verify your NOVA admin account",
    html: `
      <div>
        <h2>Verify your email</h2>

        <p>
          Thank you for creating the NOVA restaurant admin account.
        </p>

        <p>Your verification code is:</p>

        <h1>${code}</h1>

        <p>
          This code will expire in 10 minutes.
        </p>

        <p>
          If you did not request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export { sendVerificationEmail };
