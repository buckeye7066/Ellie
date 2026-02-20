const MOCK_MODE = false;

async function callRealLLM(messages) {
  const res = await fetch('/llm/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(`LLM request failed: ${res.status}`);
  const data = await res.json();
  return { response: data.message?.content || data.message || '' };
}

export async function chat(systemPrompt, userMessage) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];
  if (MOCK_MODE) {
    return { response: '[mock] ' + userMessage };
  }
  return callRealLLM(messages);
}