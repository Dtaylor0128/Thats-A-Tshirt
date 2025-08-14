from app.models import db, Post, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_posts():
    post1 = Post(
        user_id=1,  # DemoUser
        design_id=1,  
        caption='Check out my new design inspired by Summer Sunsets!',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    post2 = Post(
        user_id=2,  # marnie
        design_id=2,  # BUZZ Design
        caption='Are Bees the new Buzz? Loving this design!',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    post3 = Post(
        user_id=3,  # bobbie
        design_id=3,  # Bobbie's Art
        caption='Here is my unique take on abstract art. What do you think?',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    post4 = Post(
        user_id=4,  # domthedev
        design_id=4,  # Code and Coffee
        caption='A design for developers by a developer. Hello World!',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.session.add_all([post1, post2, post3, post4])
    db.session.commit()

def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))
        
    db.session.commit()