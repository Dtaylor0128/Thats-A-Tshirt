FROM python:3.9.18-alpine3.18
#install build tools and postgress client
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev postgresql-client

# RUN apk add build-base

# RUN apk add postgresql-dev gcc python3-dev musl-dev

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY


ENV SCHEMA=$SCHEMA # set schema!!

WORKDIR /var/www

COPY requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY . .


RUN psql "$DATABASE_URL" -c "CREATE SCHEMA IF NOT EXISTS tshirt_schema;"
RUN flask db upgrade
RUN flask seed all

CMD gunicorn app:app