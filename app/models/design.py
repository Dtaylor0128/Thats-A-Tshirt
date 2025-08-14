from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Design(db.Model):
    __tablename__ = 'designs'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    svg_data = db.Column(db.Text, nullable=False)  # Assuming SVG data is stored as text
    shirt_color = db.Column(db.String(20), nullable=True, default='white')
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='designs')
    posts = db.relationship('Post', back_populates='design', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'svg_data': self.svg_data,
            'shirt_color': self.shirt_color,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }