from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Follow, Post

follow_routes = Blueprint('follows', __name__)

# GET /api/follows - list all follows by the current user
@follow_routes.route('/', methods=['GET'])
@login_required
def get_my_follows():
    """
    Query for all follows by the current user
    """
    follows = Follow.query.filter_by(follower_id=current_user.id).all()
    return {'follows': [follow.to_dict() for follow in follows]}, 200
# fetches all follows created by the current user
# logic: filter follows by follower_id (current_user.id) and return them as a list of dictionaries
# under a "follows" key in the response JSON    


# POST /api/follows - create a new follow (must be for user not already followed)
@follow_routes.route('/', methods=['POST'])
@login_required
def create_follow():    
    data = request.get_json()
    required = ['followed_id']
    missing = [field for field in required if not data or field not in data or not data[field]]
    if missing:
        return {'error': f'Missing required fields: {", ".join(missing)}'}, 400

    # Check if the user is already followed
    existing_follow = Follow.query.filter_by(follower_id=current_user.id, followed_id=data['followed_id']).first()
    if existing_follow:
        return {'error': 'Already following this user'}, 400

    follow = Follow(
        follower_id=current_user.id,
        followed_id=data['followed_id']
    )
    db.session.add(follow)
    db.session.commit()
    return {'follow': follow.to_dict()}, 201
# auth required to create a follow
# parse JSON data from request body
# validate required fields (followed_id) returning error if missing 400
# check if the user is already followed, returning 400 if so
# create a new Follow object with follower_id, followed_id
# add the follow to the session and commit
# return created follow as a dictionary with 201 status code


# DELETE /api/follows/<int:id> - unfollow a user by id
@follow_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_follow(id):  
    follow = Follow.query.get_or_404(id)
    if follow.follower_id != current_user.id:
        return {'error': 'Follow not found'}, 403

    db.session.delete(follow)
    db.session.commit()
    return {'message': 'Unfollowed successfully'}, 200
# fetches a specific follow by id
# checks if the follow belongs to the current user, returning 403 if not
# deletes the follow from the session and commits
# returns a success message with 200 status code    

