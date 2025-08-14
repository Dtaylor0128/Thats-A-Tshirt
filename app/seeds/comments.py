from app. models import db, Design, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_comments():
    comment1 = Comment(
        user_id=3,  # bobbie
        post_id=4,  # Code and Coffee
        content='This design is amazing! Love the colors!',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    comment2 = Comment(
        user_id=2,  # marnie
        post_id=1,  # Demo Design
        content='Are Bees the new Buzz? This design is so cute!',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    comment3 = Comment(
        user_id=1,  # DemoUser
        post_id=2,  # BUZZ Design
        content='Bobbie\'s Art is always unique and inspiring!',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    comment4 = Comment(
        user_id=4,  # domthedev
        post_id=3,  # bobbie's Art
        content='Code and Coffee is the perfect combo for developers!',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.session.add_all([comment1, comment2, comment3, comment4])
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
        
    db.session.commit()