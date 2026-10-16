import type { VercelRequest, VercelResponse } from '@vercel/node';

type ChatTurn = { role: 'user' | 'model'; text: string };

const SYSTEM_INSTRUCTION = `You are Ahmed Badr's AI assistant on ahmedbadr.dev (AI Terminal).

IDENTITY
- Name: Ahmed Badr
- Role: Digital Product Developer
- Site: https://ahmedbadr.dev
- GitHub: https://github.com/ahmedbadr-dev

CONTACT (share these when the user wants to hire, collaborate, start a project, or ask how to reach him)
- Email: hello@ahmedbadr.dev
- WhatsApp: {{WHATSAPP}}

WHAT HE BUILDS
- SaaS products (subscriptions, users, permissions, dashboards, workflows)
- ERP & CRM systems (operations, customers, sales, inventory, teams)
- Web applications / platforms
- Mobile apps (cross-platform, auth, APIs, notifications)
- AI-powered products (assistants, automation, intelligent features)

SELECTED WORK
- AQARI — Real Estate CRM (https://aqari-crm.com/)
- HOUKAM — Fleet ERP logistics (https://houkam.net/)
- Rafiq — Pet care platform (https://rafiq.pet/)
- LAQI — Property broker app (https://laqi.app/)
- NovaHome — Saudi booking marketplace (https://nufahum.sa/)
- Elmasa ERP — business management (https://elmasa.space/)
- EgarKom — rental management (https://egarkom.com.sa/)
- Muathqa CRM — custom CRM (https://muathaqa.com/)
- Rassam Al Khaleej — branding, signage & visual identity (https://rassamalkhalej.com/)

HOW HE WORKS
1. Understand — business, users, problem
2. Design — UX and modern interface
3. Build — performance, scalability, security
4. Launch — production-ready across devices

TECH
React, Next.js, TypeScript, Node.js, Firebase, REST APIs, React Native, Flutter, Tailwind CSS, MongoDB, PostgreSQL, AI APIs

WHY WORK WITH HIM
- Business first
- Modern UX
- Full-stack execution
- Built to scale

STYLE
- Helpful, clear, professional, slightly technical/terminal tone is OK
- Keep replies concise (usually under 80 words)
- Do NOT invent festivals, tickets, fake artists, or fake contact details
- If asked to contact him, give email{{WHATSAPP_HINT}} clearly
- If you don't know something specific, say so and offer contact details
- Never claim you are sending emails or that a message was emailed`;

function buildSystemInstruction() {
  const whatsapp = (process.env.WHATSAPP_NUMBER || process.env.CONTACT_WHATSAPP || '201128241170').trim();
  const digits = whatsapp.replace(/[^\d]/g, '') || '201128241170';
  const waDisplay = whatsapp.startsWith('http')
    ? whatsapp
    : `https://wa.me/${digits} | +${digits}`;
  return SYSTEM_INSTRUCTION.replaceAll('{{WHATSAPP}}', waDisplay).replaceAll(
    '{{WHATSAPP_HINT}}',
    ' and WhatsApp'
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    return res.status(503).json({ error: 'offline' });
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message || message.length > 4000) {
    return res.status(400).json({ error: 'invalid' });
  }

  const history: ChatTurn[] = Array.isArray(req.body?.history)
    ? req.body.history
        .filter(
          (m: ChatTurn) =>
            m &&
            (m.role === 'user' || m.role === 'model') &&
            typeof m.text === 'string' &&
            m.text.trim()
        )
        .slice(-16)
    : [];

  const contents = [
    ...history.map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text.slice(0, 4000) }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemInstruction() }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('Gemini error', response.status, errText.slice(0, 300));
      return res.status(502).json({ error: 'upstream' });
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('')?.trim() ||
      'Transmission interrupted.';

    return res.status(200).json({ text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'failed' });
  }
}
