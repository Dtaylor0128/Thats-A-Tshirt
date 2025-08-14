from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_likes():
    like1 = Like(
        user_id=1,  # DemoUser
        post_id=2,  # marnie post
        created_at=datetime.utcnow()
    )
    
    like2 = Like(
        user_id=2,  # marnie
        post_id=1,  # DemoUser post
        created_at=datetime.utcnow()
    )

    like3 = Like(
        user_id=3,  # bobbie
        post_id=4,  # domthedev post
        created_at=datetime.utcnow()
    )
    
    like4 = Like(
        user_id=4,  # domthedev
        post_id=3,  # bobbie post
        created_at=datetime.utcnow()
    )
    like5 = Like(
        user_id=1,  # DemoUser
        post_id=3,  # bobbie post
        created_at=datetime.utcnow()
    )
    
    db.session.add_all([like1, like2, like3, like4,like5])
    db.session.commit()


def undo_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM likes"))
        
    db.session.commit()
