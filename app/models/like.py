from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Like(db.Model):
    __tablename__ = 'likes'

    if environment == "production":
        __table_args__ = (
            db.UniqueConstraint('user_id', 'post_id', name='unique_user_post_like'),   
            # Ensures a user can only like a post once
            {'schema': SCHEMA}  # Use schema if in production
        )   
    else:
        __table_args__ = (
            db.UniqueConstraint('user_id', 'post_id', name='unique_user_post_like')
            # Ensures a user can only like a post once

        )
        
    # Columns

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('posts.id')), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='likes')
    post = db.relationship('Post', back_populates='likes')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'created_at': self.created_at.isoformat(),
        }
# The Like model represents a user's like on a post.
# It includes fields for user ID, post ID, and a timestamp for when the like was created.
# The model ensures that a user can only like a post once by using a unique constraint
# on the combination of user_id and post_id.
# The model has relationships with the User and Post models, allowing easy access to the user who liked the post and the post that was liked.
# The to_dict method formats the like data for API responses.
