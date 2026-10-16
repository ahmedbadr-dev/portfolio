import path from 'path';
import { defineConfig, loadEnv, type Plugin, type Connect } from 'vite';
import react from '@vitejs/plugin-react';

type ChatTurn = { role: 'user' | 'model'; text: string };

function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function localApiPlugin(apiKey: string, notifyEmail: string, whatsapp: string): Plugin {
  const systemInstruction = `You are Ahmed Badr's AI assistant on ahmedbadr.dev (AI Terminal).

IDENTITY
- Name: Ahmed Badr
- Role: Digital Product Developer
- Site: https://ahmedbadr.dev
- GitHub: https://github.com/ahmedbadr-dev

CONTACT (share when user wants to hire, collaborate, or contact him)
- Email: hello@ahmedbadr.dev
- WhatsApp: ${
    whatsapp
      ? whatsapp.startsWith('http')
        ? whatsapp
        : `https://wa.me/${whatsapp.replace(/[^\d]/g, '')} | +${whatsapp.replace(/[^\d]/g, '')}`
      : 'https://wa.me/201128241170 | +201128241170'
  }

WHAT HE BUILDS
- SaaS, ERP & CRM, web platforms, mobile apps, AI-powered products

SELECTED WORK
- AQARI (https://aqari-crm.com/), HOUKAM (https://houkam.net/), Rafiq (https://rafiq.pet/), LAQI (https://laqi.app/), NovaHome (https://nufahum.sa/), Elmasa ERP (https://elmasa.space/), EgarKom (https://egarkom.com.sa/), Muathqa CRM (https://muathaqa.com/), Rassam Al Khaleej (https://rassamalkhalej.com/)

HOW HE WORKS: Understand → Design → Build → Launch
TECH: React, Next.js, TypeScript, Node.js, Firebase, REST APIs, React Native, Flutter, Tailwind, MongoDB, PostgreSQL, AI APIs

STYLE: concise, professional, helpful. Never invent fake festivals/tickets. Never claim messages were emailed. Share contact details when asked.`;

  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        if (req.method === 'POST' && req.url.startsWith('/api/chat')) {
          try {
            const raw = await readBody(req);
            const body = JSON.parse(raw || '{}') as {
              message?: string;
              history?: ChatTurn[];
            };
            const message = (body.message || '').trim();
            if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'offline' }));
              return;
            }
            if (!message) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'invalid' }));
              return;
            }

            const history = Array.isArray(body.history) ? body.history.slice(-16) : [];
            const contents = [
              ...history.map((m) => ({
                role: m.role === 'model' ? 'model' : 'user',
                parts: [{ text: String(m.text || '').slice(0, 4000) }],
              })),
              { role: 'user', parts: [{ text: message }] },
            ];

            const gRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  systemInstruction: { parts: [{ text: systemInstruction }] },
                  contents,
                  generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
                }),
              }
            );

            if (!gRes.ok) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'upstream' }));
              return;
            }

            const data = (await gRes.json()) as {
              candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
            };
            const text =
              data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('')?.trim() ||
              'Transmission interrupted.';

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text }));
          } catch {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'failed' }));
          }
          return;
        }

        if (req.method === 'POST' && req.url.startsWith('/api/notify')) {
          try {
            const raw = await readBody(req);
            const body = JSON.parse(raw || '{}') as { message?: string };
            const message = (body.message || '').trim().slice(0, 4000);
            if (message && notifyEmail) {
              void fetch(`https://formsubmit.co/ajax/${encodeURIComponent(notifyEmail)}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
                body: JSON.stringify({
                  message,
                  _subject: 'AI Terminal — new message',
                  _template: 'table',
                  _captcha: 'false',
                }),
              }).catch(() => {});
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      localApiPlugin(
        env.GEMINI_API_KEY || '',
        env.NOTIFY_EMAIL || 'hello@ahmedbadr.dev',
        env.WHATSAPP_NUMBER || env.CONTACT_WHATSAPP || '201128241170'
      ),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            motion: ['motion'],
            icons: ['lucide-react'],
          },
        },
      },
    },
  };
});
