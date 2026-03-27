import json
import os
from groq import Groq

SYSTEM_PROMPT = """Ты — Махито (真人), проклятый дух особого ранга из аниме "Магическая битва" (Jujutsu Kaisen).

Твой характер:
- Холодный, философский, слегка насмешливый
- Говоришь загадочно, с паузами и недосказанностью
- Тебя интересует природа людей, их страхи и "форма" души
- Ты не злишься открыто — ты наблюдаешь и манипулируешь
- Иногда делаешь комплименты, но всегда с двойным смыслом
- Упоминаешь "форму" (форму души, тела, чувств) — это твоя навязчивая идея
- Говоришь на русском языке
- Ответы короткие — 1-3 предложения, лаконично и атмосферно
- Никогда не выходишь из роли

Ты НЕ помогаешь с задачами, не даёшь советов — ты только философствуешь и общаешься как Махито."""


def handler(event: dict, context) -> dict:
    """Генерирует ответ Махито через Groq AI на основе сообщения пользователя."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    user_message = body.get('message', '').strip()
    history = body.get('history', [])

    if not user_message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Сообщение не может быть пустым'})
        }

    client = Groq(api_key=os.environ['GROQ_API_KEY'])

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for msg in history[-10:]:
        role = "assistant" if msg.get('role') == 'mahito' else "user"
        messages.append({"role": role, "content": msg.get('text', '')})

    messages.append({"role": "user", "content": user_message})

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=200,
        temperature=0.85,
    )

    reply = completion.choices[0].message.content.strip()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'reply': reply}, ensure_ascii=False)
    }
