import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();

  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Ти консультант з 3D-друку. Відповідай українською коротко і по суті.' },
            { role: 'user', content: message },
          ],
          max_tokens: 150,
        }),
      });
      const data = await response.json();
      return NextResponse.json({ reply: data.choices[0].message.content.trim() });
    } catch (error) {
      return NextResponse.json({ reply: 'Помилка API, спробуйте пізніше.' });
    }
  } else {
    return NextResponse.json({ reply: 'API ключ не налаштовано, використовується локальний словник.' });
  }
}