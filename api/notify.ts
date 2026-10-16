import type { VercelRequest, VercelResponse } from '@vercel/node';

const TO_EMAIL = process.env.NOTIFY_EMAIL || 'hello@ahmedbadr.dev';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const raw = typeof req.body?.message === 'string' ? req.body.message : '';
  const message = raw.trim().slice(0, 4000);
  if (!message) {
    return res.status(400).json({ ok: false });
  }

  const when = new Date().toISOString();
  const subject = 'AI Terminal — new message';
  const text = `New message from ahmedbadr.dev AI Terminal\n\nTime: ${when}\n\n${message}`;

  try {
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const from = process.env.NOTIFY_FROM || 'Ahmed Badr <onboarding@resend.dev>';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [TO_EMAIL],
          subject,
          text,
        }),
      });

      if (!response.ok) {
        return res.status(502).json({ ok: false });
      }
    } else {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(TO_EMAIL)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            message: text,
            _subject: subject,
            _template: 'table',
            _captcha: 'false',
          }),
        }
      );

      if (!response.ok) {
        return res.status(502).json({ ok: false });
      }
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false });
  }
}
