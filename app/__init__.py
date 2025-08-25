
import os
import logging
from flask import Flask, render_template, request, session, redirect, jsonify, g
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager

from .models import db, User, Design, Post, Comment, Like, Follow
from functools import wraps
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.design_routes import design_routes
from .api.post_routes import post_routes
from .api.comment_routes import comment_routes
from .api.like_routes import like_routes
from .api.follow_routes import follow_routes
from .seeds import seed_commands
from .config import Config


app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')
if app.config['ENV'] =='development':
    logging.basicConfig(level=logging.DEBUG)

# logging.basicConfig(level=logging.DEBUG) # debbuger remember to remove in production
# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(design_routes, url_prefix='/api/designs')
app.register_blueprint(post_routes, url_prefix='/api/posts')
app.register_blueprint(comment_routes, url_prefix='/api/comments')  
app.register_blueprint(like_routes, url_prefix='/api/likes')
app.register_blueprint(follow_routes, url_prefix='/api/follows')


db.init_app(app)
Migrate(app, db)

# def create_app():
#     app = Flask(__name)
#     logging.basicConfig()
#     logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
#     return app

      # Debugging level logging
# Application Security
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)


# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'Thats-a-t-shirt-logo.jpg':
        return app.send_from_directory('public', 'Thats-a-t-shirt-logo.jpg')
    return app.send_static_file('index.html')


# @app.errorhandler(404)
# def not_found(e):
#     return app.send_static_file('index.html')
@app.errorhandler(404)
def not_found(e):
    if not request.path.startswith('/api') and not request.path.startswith('/static'):
        return app.send_static_file('index.html')
    return jsonify(error="Resource not found"), 404
#handle 404 errors globally

# handles authentication globally

def auth_required(f):
    """
    Decorator to require authentication for a route.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        if token is None or not validate_token(token):
            return jsonify({'error': 'Unauthorized'}), 401
        g.user = get_user_from_token(token)
        return f(*args, **kwargs)
    return decorated_function
# @wraps keeps orginal functions metadata
# fet value of header from incoming http request
# checks if request has a token
# if not, returns 401 Unauthorized
# if token is present, validates it and retrieves user info
# if token is valid, stores user info in g.user
# and calls the original function with its arguments