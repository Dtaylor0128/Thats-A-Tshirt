from flask import  request, Blueprint
from flask_login import current_user, login_required
from app.models import db, Post, Design

post_routes = Blueprint('posts', __name__)

# # GET /api/posts - list all posts by the current user
# @post_routes.route('/', methods=['GET'])
# @login_required
# def get_my_posts():
#     """
#     Query for all posts by the current user
#     """
#     posts = Post.query.filter_by(user_id=current_user.id).all()
#     return {'posts': [post.to_dict() for post in posts]}, 200
# # fetches all posts created by the current user
# # logic: filter posts by user_id (current_user.id) and return them as a list of dictionaries
# # under a "posts" key in the response JSON


#GET - api/posts - list all posts by the current user with filter
@post_routes.route('/', methods=['GET'])
@login_required
def get_posts():
    user_id = request.args.get('user_id', type=int)
    if user_id is not None:
        posts = Post.query.filter_by(user_id=user_id).all()
    else:
        posts = Post.query.all()
    
    return {'posts': [post.to_dict() for post in posts]}, 200
# fetches all posts created by the current user or a specific user if user_id is provided
# logic: if user_id is provided, filter posts by user_id, otherwise return all posts
# returns a list of posts as dictionaries under a "posts" key in the response JSON  



# POST /api/posts - create a new post (must be for deisgn owned by the user)
@post_routes.route('/', methods=['POST'])
@login_required
def create_post():
    data = request.get_json()
    required = ['design_id', 'caption']
    missing = [field for field in required if not data or field not in data or not data[field]]
    if missing:
        return {'error': f'Missing required fields: {", ".join(missing)}'}, 400

# Check if the design belongs to the current user
    design = Design.query.get(data['design_id'])
    if not design or design.user_id != current_user.id:
        return {'error': 'Design not found or not owned by user'}, 403

    post = Post(
        user_id=current_user.id,
        design_id=data['design_id'],
        caption=data['caption']
    )
    db.session.add(post)
    db.session.commit()
    return {'post': post.to_dict()}, 201
# auth required to create a post
# parse JSON data from request body
# validate required fields (design_id, caption) returning error if missing 400
# check if the design belongs to the current user, returning 403 if not
# create a new Post object with user_id, design_id, caption
# add the post to the session and commit
# return created post as a dictionary with 201 status code


# GET /api/posts/<int:id> - get a specific post by id
@post_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_post(id):
    post = Post.query.get_or_404(id)
    if post.user_id != current_user.id:
        return {'error': 'Post not found'}, 403
    return {'post': post.to_dict()}, 200
# fetches a specific post by id
# uses get_or_404 to return 404 if not found
# checks if the post belongs to the current user, returning 403 if not
# logic: query for post by id, check user ownership, return post as a dictionary with
# 200 status code



# PUT /api/posts/<int:id> - update an existing post (must belong to the current user)
@post_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_post(id):
    post = Post.query.get_or_404(id)
    if post.user_id != current_user.id:
        return {'error': 'Post not found'}, 403

    data = request.get_json()
    if 'caption' in data and data['caption'] is not None:
        post.caption = data['caption']

    db.session.commit()
    return {'post': post.to_dict()}, 200
# updates an existing post by id
# checks if the post belongs to the current user, returning 403 if not
# parses JSON data from request body
# updates caption if provided in the request body
# logic: query for post by id, check user ownership, update caption, commit changes,
# return updated post as a dictionary with 200 status code



# DELETE /api/posts/<int:id> - delete a post by id (must belong to the current user)
@post_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_post(id):
    post = Post.query.get_or_404(id)
    if post.user_id != current_user.id:
        return {'error': 'Post not found'}, 403

    db.session.delete(post)
    db.session.commit()
    return {'message': 'Post deleted successfully'}, 200
# deletes a post by id
# checks if the post belongs to the current user, returning 403 if not
# uses get_or_404 to return 404 if not found
# logic: query for post by id, check user ownership, delete post, commit changes,
# return success message with 200 status code






########BONUS ROUTES SEARCH AND FILTER POSTS##########

# GET /api/posts/user_id=<int:user_id> - list all posts by a specific user
# @post_routes.route('/', methods=['GET'])
# @login_required
# def get_posts_by_user():
#     user_id = request.args.get('user_id', type=int)
#     if not user_id:
#         return {'error': 'User ID is required'}, 400

#     posts = Post.query.filter_by(user_id=user_id).all()
#     return {'posts': [post.to_dict() for post in posts]}, 200
# # fetches all posts created by a specific user
# # logic: filter posts by user_id (from query parameter) and return them as a list
# # of dictionaries under a "posts" key in the response JSON
# # wraps response in a dictionary with a "posts" key {'posts': ...}
# # returns a list of posts as dictionaries with 200 status code

# GET /api/posts/search?query=<string:query> - search posts by keyword in caption
@post_routes.route('/search', methods=['GET'])
@login_required
def search_posts():
    query = request.args.get('q', '')
    if not query:
        return {'error': 'Search query is required'}, 400

    posts = Post.query.filter(Post.caption.ilike(f'%{query}%')).all()
    return {'posts': [post.to_dict() for post in posts]}, 200
# searches posts by keyword in caption
# logic: filter posts by caption using ilike for case-insensitive search
# returns a list of posts as dictionaries under a "posts" key in the response JSON
# wraps response in a dictionary with a "posts" key {'posts': ...}