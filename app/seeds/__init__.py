from flask.cli import AppGroup
from .users import seed_users, undo_users
from .designs import seed_designs, undo_designs
from .posts import seed_posts, undo_posts
from .comments import seed_comments, undo_comments
from .likes import seed_likes, undo_likes
from .follows import seed_follows, undo_follows
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_follows()
        undo_likes()
        undo_comments()
        undo_posts()
        undo_designs()
        undo_users()
        
        


    seed_users()     # Users need to exist first
    seed_designs()   # Designs belong to Users
    seed_posts()     # Posts belong to Users + Designs
    seed_comments()  # Comments belong to Users + Posts
    seed_likes()     # Likes belong to Users + Posts
    seed_follows()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_follows()
    undo_likes()
    undo_comments()
    undo_posts()
    undo_designs()
    undo_users()
    # Add other undo functions here
