from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import requests
import os
import openai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__, static_folder='static', template_folder='templates')

# OpenAI API'yi kullanarak sohbet tamamlama işlevi
def get_chat_response(message):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    data = {
        "model": "gpt-3.5-turbo-1106",
        "messages": [{"role": "user", "content": message}]
    }

    try:
        response = requests.post("https://api.openai.com/v1/chat/completions", json=data, headers=headers)
        response.raise_for_status()  # Bu satır HTTP hata kodlarını yakalar.
        return response.json()['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Hata oluştu: {e}")  # Hataları günlüğe kaydetmek için
        return "Üzgünüm, bir yanıt alamadım."

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api", methods=["POST"])
def api():
    data = request.json
    message = data.get("message")
    response = get_chat_response(message)
    return jsonify({'answer': response})

if __name__ == '__main__':
    app.run(debug=True)