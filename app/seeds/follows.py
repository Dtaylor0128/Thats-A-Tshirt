from app.models import db, Follow, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_follows():
    follow1 = Follow(
        follower_id=1,  # DemoUser
        following_id=2,  # marnie
        follow_tag='Friend',
        follow_comment='Love your designs!',
        created_at=datetime.utcnow()
    )
    
    follow2 = Follow(
        follower_id=2,  # marnie
        following_id=3,  # bobbie
        follow_tag='Inspiration',
        follow_comment='Your art is amazing!',
        created_at=datetime.utcnow()
    )

    follow3 = Follow(
        follower_id=3,  # bobbie
        following_id=4,  # domthedev
        follow_tag='Collaborator',
        follow_comment='I admire your coding skills!',
        created_at=datetime.utcnow()
    )
    follow4 = Follow(
        follower_id=4,  # domthedev
        following_id=1,  # DemoUser
        follow_tag='Supporter',
        follow_comment='Keep up the great work!',
        created_at=datetime.utcnow()
    )
    
    db.session.add_all([follow1, follow2, follow3, follow4])
    db.session.commit()

def undo_follows():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.follows RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM follows"))
        
    db.session.commit()
