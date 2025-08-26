import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    FLASK_RUN_PORT = os.environ.get('FLASK_RUN_PORT')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLAlchemy 1.4 no longer supports url strings that start with 'postgres'
    # (only 'postgresql') but heroku's postgres add-on automatically sets the
    # url in the hidden config vars to start with postgres.
    # so the connection uri must be updated here (for production)
    # SQLALCHEMY_DATABASE_URI = os.environ.get(
    #     'DATABASE_URL').replace('postgres://', 'postgresql://')
    database_url = os.environ.get('DATABASE_URL', 'sqlite:///dev.db')
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://')
    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_ENGINE_OPTIONS = {
    "connect_args": {
        "options": "-csearch_path=tshirt_schema,public"
    }
}
    # SQLALCHEMY_ENGINE_OPTIONS = {
    #     "connect_args": {
    #         "options": f"-csearch_path={os.environ.get('SCHEMA', 'public')}"
    #     }
    # } #setting search path to tshirt-schema

    SQLALCHEMY_ECHO = False
