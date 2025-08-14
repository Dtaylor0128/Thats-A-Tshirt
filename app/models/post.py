from db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Post(db.Model):
    __tablename__ = 'posts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    design_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('designs.id')), nullable=False)
    caption = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='posts')
    design = db.relationship('Design', back_populates='posts')
    comments = db.relationship('Comment', back_populates='post', cascade='all, delete-orphan')
    likes = db.relationship('Like', back_populates='post', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'design_id': self.design_id,
            'caption': self.caption,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
    



# The Post model represents a user's post that can include a design, caption, and timestamps.
# It has relationships with User, Design, Comment, and Like models.
# The to_dict method formats the post data for API responses.
# The model includes fields for user ID, design ID, caption, and timestamps for creation and updates.
# The design_id field links the post to a specific design, allowing users to share their designs as posts.
# The model supports cascading deletes, meaning if a user or design is deleted,
# all associated posts, comments, and likes will also be deleted.
# This ensures data integrity and prevents orphaned records in the database.
# The created_at and updated_at fields are automatically set to the current time when a post is created or updated.
# The model is designed to work with both production and development environments, using the SCHEMA variable to manage table names in production.
# The model uses SQLAlchemy for ORM functionality,
# allowing for easy interaction with the database through Python objects.

# Example usage: tips for future self-reference
# 
# my_post = Post.query.get(1)
# print(my_post.user.username)   # Goes from Post  to User
# print(my_post.design.title)    # Goes from Post  to Design
# user.posts  # All posts by the user
# design.posts  # All posts using that design
#
# ORM traversal example:
# post.user.username  # Get the username of the user who created the post
# post.design.title   # Get the title of the design used in the post
# post.comments       # Get all comments on the post
# post.likes          # Get all likes on the post
# user.posts          # Get all posts created by the user
# design.posts        # Get all posts that use the design        
# post.caption        # Get the caption of the post
# post.likes          # list of Like objects
# user.likes          # list of Like objects
# like.user           # the User who liked
# like.post           # the Post that was liked
# user.following   # list of Follow objects where user is the follower
# user.followers   # list of Follow objects where user is being followed
