import * as React from 'react';

interface RecoverPasswordEmailTemplateProps {
  firstName: string;
  resetLink: string;
  expiresAt: Date;
}

export const RecoverPasswordEmailTemplate: React.FC<
  Readonly<RecoverPasswordEmailTemplateProps>
> = ({ firstName, resetLink, expiresAt }) => (
  <div>
    <h1>Password Reset Request</h1>
    <p>Hello {firstName},</p>
    <p>
      We received a request to reset your password. To reset your password,
      please click the link below:
    </p>
    <p>
      <a href={resetLink}>Reset Password</a>
    </p>
    <p>This link will expire on {expiresAt.toLocaleString()}.</p>
    <p>
      If you did not request a password reset, please ignore this email or
      contact support if you have any concerns.
    </p>
    <p>Thank you,</p>
    <p>Music Atlas Team</p>
  </div>
);
