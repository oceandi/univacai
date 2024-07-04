from flask import Flask, render_template, request, jsonify, redirect, url_for, session, make_response
import requests
import os
import openai
from dotenv import load_dotenv
import json
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
from datetime import timedelta
from flask_session import Session

client = openai.OpenAI()

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = os.getenv("APP_SECRET_KEY")

app.config['SESSION_COOKIE_SECURE'] = True
app.permanent_session_lifetime = timedelta(days=365)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

@app.before_request
def before_request():
    server_name = 'www.univacai.com'
    if request.host != server_name and 'univacai.com' in request.host:
        url = request.url.replace(request.host, server_name, 1)
        code = 301  # Kalıcı yönlendirme için HTTP durum kodu
        return redirect(url, code=code)

oauth = OAuth(app)
oauth.register(
    "auth0",
    client_id=os.getenv("AUTH0_CLIENT_ID"),
    client_secret=os.getenv("AUTH0_CLIENT_SECRET"),
    client_kwargs={"scope": "openid profile email"},
    server_metadata_url=f'https://dev-r7aunaebn4u68kqq.us.auth0.com/.well-known/openid-configuration',
    api_base_url=f'https://dev-r7aunaebn4u68kqq.us.auth0.com',
    access_token_url=f'https://dev-r7aunaebn4u68kqq.us.auth0.com/oauth/token',
    authorize_url=f'https://dev-r7aunaebn4u68kqq.us.auth0.com/authorize',
)

# OpenAI API'yi kullanarak sohbet tamamlama işlevi
def get_chat_response(message):
    api_key = os.getenv("OPENAI_API_KEY")

    client = openai.OpenAI(api_key=api_key)

    chat_history = session.get('chat_history', [])
    chat_history.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="gpt-4",
        messages=chat_history,
    )
    answer = response.choices[0].message.content
    chat_history.append({"role": "assistant", "content": answer})
    session['chat_history'] = chat_history
    return answer

@app.route("/login")
def login_page():
    session.permanent = True
    return render_template('login.html')

@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    session['access_token'] = token['access_token']
    session.permanent = True
    response = make_response(redirect("/"))
    response.set_cookie('access_token', token['access_token'], httponly=True)
    return response

@app.route("/logout")
def logout():
    session.clear()
    return_to_url = "https://www.univacai.com"  # Auth0 ile uyumlu olması için HTTP veya HTTPS kullanmalısınız
    logout_url = f'https://{os.getenv("AUTH0_DOMAIN")}/v2/logout?client_id={os.getenv("AUTH0_CLIENT_ID")}&returnTo={quote_plus(return_to_url)}'
    return redirect(logout_url)

@app.route("/")
def index():
    # Kullanıcı giriş yapmışsa, onları anasayfaya yönlendir
    if 'user' in session:
        return render_template('index.html', session=session.get('user'), pretty=json.dumps(session.get('user'), indent=4))
    else:
        return redirect(url_for('login_page'))

@app.route("/auth0-login")
def auth0_login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.getenv("PORT", 3000))
