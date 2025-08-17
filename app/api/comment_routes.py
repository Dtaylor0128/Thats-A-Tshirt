from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Comment, Post

comment_routes = Blueprint('comments', __name__)

# GET /api/posts/<post_id>/comments - list all comments 
@comment_routes.route('/posts/<int:post_id>/comments', methods=['GET'])
@login_required
def get_post_comments(post_id):
    post = Post.query.get_or_404(post_id)
    comments = Comment.query.filter_by(post_id=post_id).all()
    return {'comments': [comment.to_dict() for comment in comments]}, 200
# fetches all comments for a specific post
# logic: filter comments by post_id and return them as a list of dictionaries
# under a "comments" key in the response JSON
# uses get_or_404 to return 404 if post not found    
# no restrictions, anyone can see comments on a post



# POST /api/posts/<int:post_id>comments - create a new comment 
@comment_routes.route('/posts/<int:post_id>/comments', methods=['POST'])
@login_required
def create_comment(post_id):   
    post= Post.query.get_or_404(post_id)
    data = request.get_json()
    if not data or 'content' not in data or not data['content'].strip():
        return {'error': 'Content is required'}, 400
    
    comment = Comment(
        user_id=current_user.id,
        post_id=post_id,
        content=data['content'].strip()  # Ensure content has no leading/trailing whitespace
    )
    db.session.add(comment)
    db.session.commit()
    return {'comment': comment.to_dict()}, 201
# auth required to create a comment
# parse JSON data from request body
# validate required fields (content) returning error if missing 400
# check if the post exists, returning 404 if not found
# create a new Comment object with user_id, post_id, content
# comment has no whitespace
# add the comment to the session and commit
# return created comment as a dictionary with 201 status code



# GET /api/comments/<int:id> - get a specific comment by id
@comment_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_comment(id):
    comment = Comment.query.get_or_404(id)
    post = comment.post
    if comment.user_id != current_user.id and post.user.id != current_user.id:
        return {'error': 'Forbibben'}, 403
    return {'comment': comment.to_dict()}, 200
# fetches a specific comment by id
# uses get_or_404 to return 404 if not found
# checks if the comment belongs to the current user or post owner, returning 403 if not
# logic: query for comment by id, check user ownership, return comment as a dictionary with 200 status code
# wraps response in a dictionary with a "comment" key {'comment': ...}  


# PUT /api/comments/<int:id> - update an existing comment owner only
@comment_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_comment(id):
    comment = Comment.query.get_or_404(id)
    post = comment.post
    if comment.user_id != current_user.id and post.user.id != current_user.id:
        return {'error': 'Forbidden'}, 403
    
    data = request.get_json()
    if 'content' in data and data['content'].strip() is not None:
        comment.content = data['content'].strip()
    db.session.commit()
    return {'comment': comment.to_dict()}, 200
# updates an existing comment by id
# checks if the comment belongs to the current user, returning 403 if not
# parses JSON data from request body
# updates content if provided in the request body
# logic: query for comment by id, check user/post ownership, update content, commit changes,
# return updated comment as a dictionary with 200 status code



# DELETE /api/comments/<int:id> - delete a comment
@comment_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_comment(id):     
    comment = Comment.query.get_or_404(id)
    post = comment.post
    if comment.user_id != current_user.id and post.user.id != current_user.id:
        return {'error': 'Forbidden'}, 403
    
    db.session.delete(comment)
    db.session.commit()
    return {'message': 'Comment deleted successfully'}, 200
# deletes a comment by id
# checks if the comment belongs to the current user, returning 403 if not
# uses get_or_404 to return 404 if not found
# logic: query for comment by id, check user ownership, delete comment, commit changes,
# return success message with 200 status code
# wraps response in a dictionary with a "message" key {'message': ...}

