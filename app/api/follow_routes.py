from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Follow, User

follow_routes = Blueprint('follows', __name__)

# GET /api/follows - list all follows by the current user
@follow_routes.route('/', methods=['GET'])

def get_my_follows():
    follows = Follow.query.filter((Follow.follower_id == current_user.id) | (Follow.following_id == current_user.id)).all()
    return {'follows': [follow.to_dict() for follow in follows]}, 200
# fetches all follows where the current user is either the follower or the following
# returns a list of follows as dictionaries with 200 status code   


# POST /api/follows - create a new follow (must be for user not already followed)
@follow_routes.route('/', methods=['POST'])
@login_required
def create_follow():
    data = request.get_json()
    required = ['following_id', 'follow_tag']
    missing = [f for f in required if not data or f not in data or not data[f]]
    if missing:
        return {'error': f'Missing required fields: {", ".join(missing)}'}, 400

    if data['following_id'] == current_user.id:
        return {'error': 'Cannot follow yourself.'}, 400

    if Follow.query.filter_by(follower_id=current_user.id, following_id=data['following_id']).first():
        return {'error': 'Already following this user'}, 409

    user = User.query.get(data['following_id'])
    if not user:
        return {'error': 'User not found'}, 404
    
    follow = Follow(
        follower_id=current_user.id,
        following_id=data['following_id'],
        follow_tag=data.get('follow_tag'),
        follow_comment=data.get('follow_comment')
    )

    
    db.session.add(follow)
    db.session.commit()
    return {'follow': follow.to_dict()}, 201
# checks if the required fields are present in the request data
# checks if the user is trying to follow themselves or already follows the user
# checks if the user to be followed exists
# creates a new Follow instance and adds it to the session
# commits the session and returns the new follow as a dictionary with 201 status code


# GET /api/follows/<id> - get a follow record by id
@follow_routes.route('/<int:id>', methods=['GET'])

def get_follow(id):
    follow = Follow.query.get_or_404(id)
    if follow.follower_id != current_user.id and follow.following_id != current_user.id:
        return {'error': 'Follow not found'}, 403
    return {'follow': follow.to_dict()}, 200
# fetches a specific follow by id
# checks if the follow belongs to the current user, returning 403 if not
# returns the follow as a dictionary with 200 status code


#PUT / api/follows/<int:id> - update tag/follow by comment by id(only follower can update )
@follow_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_follow(id):
    follow = Follow.query.get_or_404(id)
    if follow.follower_id != current_user.id:
        return {'error': 'Follow not found'}, 403
    
    data = request.get_json()
    updated = False
    if 'follow_tag' in data and data['follow_tag'] != follow.follow_tag:
        follow.follow_tag = data['follow_tag']
        updated = True
    if 'follow_comment' in data and data['follow_comment'] != follow.follow_comment:
        follow.follow_comment = data['follow_comment']
        updated = True
    if not updated:
        return {'error': 'No changes made'}, 400
    
    db.session.commit()
    return {'follow': follow.to_dict()}, 200
# fetches a specific follow by id
# checks if the follow belongs to the current user, returning 403 if not
# updates the follow's tag and/or comment if provided in the request data
# commits the session and returns the updated follow as a dictionary with 200 status code



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

