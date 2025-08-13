from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='DemoUser', 
        email='demo@aa.io', 
        password='password',
        avatar_url='https://example.com/demo-avatar.png',
        bio='This is a demo user profile. Welcome to the app!'
        )
    marnie = User(
        username='marnie', 
        email='marnie@aa.io', 
        password='password',
        avatar_url='https://example.com/marnie-avatar.png',
        bio='Marnie is a great user who loves to explore new designs!'
        )
    
    bobbie = User(
        username='bobbie',
        email='bobbie@aa.io', 
        password='password',
        avatar_url='https://example.com/bobbie-avatar.png',
        bio='Bobbie enjoys creating and sharing unique t-shirt designs!'
        )
    domthedev = User(
        username='domthedev',   
        email='domthedev@io.com',
        password='password',
        avatar_url='https://example.com/domthedev-avatar.png',
        bio='Dom is a developer who loves building cool applications and designs!'
        )
    

    # db.session.add(marnie)
    # db.session.add(bobbie)
    # db.session.add(domthedev)
    db.session.add_all([demo, marnie, bobbie, domthedev])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
