from app.models import db, Design, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_designs():
    design1 = Design(
        user_id=1,  # DemoUser
        title='Demo Design',
        svg_data='<svg>...sunset design</svg>',  
        shirt_color='blue',
        description='inspired by Summer Sunsets.',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    design2 = Design(
        user_id=2,  # marnie
        title='BUZZ Design',
        svg_data='<svg>...bee design...</svg>',  
        shirt_color='yellow',
        description='Are Bees the new Buzz?',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    design3 = Design(
        user_id=3,  # bobbie
        title='Bobbie\'s Art',
        svg_data='<svg>...abstract art design...</svg>',  
        shirt_color='green',
        description='Bobbie\'s unique take on abstract art.',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    design4 = Design(
        user_id=4,  # domthedev
        title='Code and Coffee',
        svg_data='<svg>...code and coffee icon...</svg>', 
        shirt_color='black',
        description='A design for developers by a developer, Hello World!',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    
    db.session.add_all([design1, design2, design3, design4])
    db.session.commit()


def undo_designs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.designs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM designs"))
        
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the designs table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.