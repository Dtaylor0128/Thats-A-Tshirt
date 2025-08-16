from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Comment, Post, Like

like_routes = Blueprint('likes', __name__)

# POST /api/likes - create a new like for a post
@like_routes.route('/', methods=['POST'])
@login_required
def create_like():
    data = request.get_json()
    required = ['post_id']
    missing = [field for field in required if not data or field not in data or not data[field]]
    if missing:
        return {'error': f'Missing required fields: {", ".join(missing)}'}, 400

    # Check if the post exists
    post = Post.query.get(data['post_id'])
    if not post:
        return {'error': 'Post not found'}, 404

    # Check if the user has already liked this post
    existing_like = Like.query.filter_by(user_id=current_user.id, post_id=data['post_id']).first()
    if existing_like:
        return {'error': 'You have already liked this post'}, 400

    like = Like(
        user_id=current_user.id,
        post_id=data['post_id']
    )
    db.session.add(like)
    db.session.commit()
    return {'like': like.to_dict()}, 201
# auth required to create a like
# parse JSON data from request body
# validate required fields (post_id) returning error if missing 400
# check if the post exists, returning 404 if not found
# check if the user has already liked this post, returning 400 if so
# create a new Like object with user_id, post_id
# add the like to the session and commit
# return created like as a dictionary with 201 status code

# DELETE /api/likes/<int:id> - remove a like by id
@like_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_like(id):
    like = Like.query.get_or_404(id)
    if like.user_id != current_user.id:
        return {'error': 'Like not found'}, 403

    db.session.delete(like)
    db.session.commit()
    return {'message': 'Like removed successfully'}, 200
# fetches a specific like by id
# checks if the like belongs to the current user, returning 403 if not
# deletes the like from the session and commits
# returns a success message with 200 status code



# Note: The following route is commented out as it was not present in the api doc, by may be useful.
# # GET /api/likes - list all likes by the current user
# @like_routes.route('/', methods=['GET'])
# @login_required
# def get_my_likes():
#     """
#     Query for all likes by the current user
#     """
#     likes = Like.query.filter_by(user_id=current_user.id).all()
#     return {'likes': [like.to_dict() for like in likes]}, 200
# # fetches all likes created by the current user
# # logic: filter likes by user_id (current_user.id) and return them as a list
# # of dictionaries under a "likes" key in the response JSON
# # wraps response in a dictionary with a "likes" key {'likes': ...}
# # returns a list of likes as dictionaries with 200 status code
