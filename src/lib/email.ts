import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

interface SendContactEmailParams {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}

export async function sendContactEmail(params: SendContactEmailParams) {
  const { name, email, phone, message } = params;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Formulario Contacto <onboarding@resend.dev>', // Cambia esto cuando tengas dominio verificado
      to: import.meta.env.CONTACT_EMAIL_TO,
      subject: `Nueva solicitud de contacto de ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #111827;
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background-color: #f9fafb;
                padding: 30px 20px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: 600;
                color: #6b7280;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .value {
                color: #111827;
                font-size: 16px;
              }
              .message-box {
                background-color: white;
                padding: 15px;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
                white-space: pre-wrap;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">Nueva Solicitud de Contacto</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nombre</div>
                <div class="value">${name}</div>
              </div>

              <div class="field">
                <div class="label">Email</div>
                <div class="value">
                  <a href="mailto:${email}" style="color: #111827; text-decoration: none;">
                    ${email}
                  </a>
                </div>
              </div>

              ${phone ? `
                <div class="field">
                  <div class="label">Teléfono</div>
                  <div class="value">
                    <a href="tel:${phone}" style="color: #111827; text-decoration: none;">
                      ${phone}
                    </a>
                  </div>
                </div>
              ` : ''}

              <div class="field">
                <div class="label">Mensaje</div>
                <div class="message-box">${message}</div>
              </div>
            </div>

            <div class="footer">
              <p>
                Este email fue enviado desde el formulario de contacto de tu sitio web.<br>
                Puedes gestionar todas las solicitudes desde el
                <a href="${import.meta.env.SITE || 'http://localhost:4321'}/admin/contacts" style="color: #111827;">
                  panel de administración
                </a>.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
