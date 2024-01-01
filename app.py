from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import requests
import os
import openai
from dotenv import load_dotenv
import json

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
    response = requests.post("https://api.openai.com/v1/chat/completions", json=data, headers=headers)
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        return "Üzgünüm, bir yanıt alamadım."

@app.route("/")
def index():
    if 'user' in session:
        return render_template('index.html', session=session.get('user'), pretty=json.dumps(session.get('user'), indent=4))
    else:
        return redirect(url_for('login_page'))
    
@app.route("/login")
def login_page():
    return render_template('login.html')

@app.route("/api", methods=["POST"])
def api():
    data = request.json
    message = data.get("message")
    response = get_chat_response(message)
    return jsonify({'answer': response})

@app.route('/auth-response')
def auth_response():
    # OAuth sağlayıcısından gelen kodu burada alabilirsiniz
    code = request.args.get('code')

    # Bu kod ile bir token almak için OAuth sağlayıcısına bir istek gönderin
    # Token alma işlemi burada gerçekleştirilir

    # Token başarılı bir şekilde alındıysa, kullanıcıyı başka bir sayfaya yönlendirebilirsiniz
    # Örneğin kullanıcının profil sayfasına veya ana sayfaya
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)