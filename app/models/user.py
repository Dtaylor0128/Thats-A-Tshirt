from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    avatar_url = db.Column(db.String(500), nullable=True, default='https://example.com/default-avatar.png')
    bio = db.Column(db.Text, nullable=True, default='This user has not set up their bio yet.')
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)


    # Relationships
    # Add any relationships here, e.g., posts, comments, etc.
    designs = db.relationship('Design', back_populates='user', cascade='all, delete-orphan')
    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    likes = db.relationship('Like', back_populates='user', cascade='all, delete-orphan')

    # follows as "follower" and "following"
    followers = db.relationship('Follow', foreign_keys='[Follow.following_id]', back_populates='following', cascade='all, delete-orphan')
    following = db.relationship('Follow', foreign_keys='[Follow.follower_id]', back_populates='follower', cascade='all, delete-orphan')


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'avatar_url': self.avatar_url,
            'bio': self.bio,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
# Match schema exactly → keeps migrations, seeds, and API payloads consistent.
# Timestamps  useful for ordering & displaying “member since” info.
# Avatar/Bio fields support profile customization from your user stories.
# Relationships makes ORM queries cleaner (user.posts instead of joining manually).
# add_prefix_for_prod required for Alembic multi-schema on Render Postgres.