from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Comment, Post

comment_routes = Blueprint('comments', __name__)

# GET /api/comments - list all comments by the current user
@comment_routes.route('/', methods=['GET'])
@login_required
def get_my_comments():
    """
    Query for all comments by the current user
    """
    comments = Comment.query.filter_by(user_id=current_user.id).all()
    return {'comments': [comment.to_dict() for comment in comments]}, 200
# fetches all comments created by the current user
# logic: filter comments by user_id (current_user.id) and return them as a list of dictionaries
# under a "comments" key in the response JSON       


# POST /api/comments - create a new comment (must be for post owned by the user)
@comment_routes.route('/', methods=['POST'])
@login_required
def create_comment():   
    data = request.get_json()
    required = ['post_id', 'content']
    missing = [field for field in required if not data or field not in data or not data[field]]
    if missing:
        return {'error': f'Missing required fields: {", ".join(missing)}'}, 400

    # Check if the post belongs to the current user
    post = Post.query.get(data['post_id'])
    if not post or post.user_id != current_user.id:
        return {'error': 'Post not found or not owned by user'}, 403

    comment = Comment(
        user_id=current_user.id,
        post_id=data['post_id'],
        content=data['content']
    )
    db.session.add(comment)
    db.session.commit()
    return {'comment': comment.to_dict()}, 201
# auth required to create a comment
# parse JSON data from request body
# validate required fields (post_id, content) returning error if missing 400
# check if the post belongs to the current user, returning 403 if not
# create a new Comment object with user_id, post_id, content
# add the comment to the session and commit
# return created comment as a dictionary with 201 status code

# GET /api/comments/<int:id> - get a specific comment by id
@comment_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_comment(id):
    comment = Comment.query.get_or_404(id)
    if comment.user_id != current_user.id:
        return {'error': 'Comment not found'}, 403
    return {'comment': comment.to_dict()}, 200
# fetches a specific comment by id
# uses get_or_404 to return 404 if not found
# checks if the comment belongs to the current user, returning 403 if not
# logic: query for comment by id, check user ownership, return comment as a dictionary with 200 status code
# wraps response in a dictionary with a "comment" key {'comment': ...}  


# PUT /api/comments/<int:id> - update an existing comment
@comment_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_comment(id):
    """
    Update an existing comment by id must belong to the current user
    """
    comment = Comment.query.get_or_404(id)
    if comment.user_id != current_user.id:
        return {'error': 'Comment not found'}, 403
    
    data = request.get_json()
    if 'content' in data and data['content'] is not None:
        comment.content = data['content']
    
    db.session.commit()
    return {'comment': comment.to_dict()}, 200
# updates an existing comment by id
# checks if the comment belongs to the current user, returning 403 if not
# parses JSON data from request body
# updates content if provided in the request body
# logic: query for comment by id, check user ownership, update content, commit changes,
# return updated comment as a dictionary with 200 status code


# DELETE /api/comments/<int:id> - delete a comment
@comment_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_comment(id):     
    """
    Delete a comment by id must belong to the current user
    """
    comment = Comment.query.get_or_404(id)
    if comment.user_id != current_user.id:
        return {'error': 'Comment not found'}, 403
    
    db.session.delete(comment)
    db.session.commit()
    return {'message': 'Comment deleted successfully'}, 200
# deletes a comment by id
# checks if the comment belongs to the current user, returning 403 if not
# uses get_or_404 to return 404 if not found
# logic: query for comment by id, check user ownership, delete comment, commit changes,
# return success message with 200 status code
# wraps response in a dictionary with a "message" key {'message': ...}

