/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import type { ChatMessage } from '../types';

/** Client talks to /api/chat — Gemini key stays on the server. */
export const sendMessageToGemini = async (
  message: string,
  history: ChatMessage[] = []
): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history
          .filter((m) => m.role === 'user' || m.role === 'model')
          .map((m) => ({ role: m.role, text: m.text })),
      }),
    });

    if (response.status === 503) {
      return 'Systems offline. Try again shortly.';
    }

    if (!response.ok) {
      return 'Signal lost. Try again later.';
    }

    const data = (await response.json()) as { text?: string };
    return data.text?.trim() || 'Transmission interrupted.';
  } catch (error) {
    console.error('Chat Error:', error);
    return 'Signal lost. Try again later.';
  }
};
