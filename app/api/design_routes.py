import logging
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Design, db

design_routes = Blueprint('designs', __name__)

# GET /api/designs - list all current user's designs
@design_routes.route('/', methods=['GET'])

def get_my_designs():
    """
    Query for all designs by the current user
    """
    designs = Design.query.filter_by(user_id=current_user.id).all()
    return {'designs': [design.to_dict() for design in designs]}, 200   
 
# fetches all designs created by the current user
# logic: filter designs by user_id (current_user.id) and return them as a list of dictionaries
# under a "designs" key in the response JSON


# POST /api/designs - create a new design
@design_routes.route('/', methods=['POST'])
@login_required
def create_design():
    """ Create a new design for the current user
    """
    data = request.get_json()
    required = ['title', 'svg_data']
    missing = [field for field in required if not data or field not in data or not data[field]]
    if missing:
        return {'error': f'Missing required fields: {", ".join(missing)}'}, 400

    design = Design(
        user_id=current_user.id,
        title=data['title'],
        svg_data=data['svg_data'],
        shirt_color=data.get('shirt_color'),
        description=data.get('description')
    )
    db.session.add(design)
    db.session.commit()
    return {'design':design.to_dict()}, 201
# auth required to create a design
# parse JSON data from request body
# validate required fields (title, svg_data) returning error if missing 400
# return created design as a dictionary with 201 status code


# GET /api/designs/<id> - get a specific design by id
@design_routes.route('/<int:id>', methods=['GET'])

def get_design(id):
    """
    Query for a design by id must belong to the current user
    """
    design = Design.query.get_or_404(id)
    if design.user_id != current_user.id:
        return {'error': 'forbidden'}, 403
    return {'design':design.to_dict()}, 200 
# fetches a specific design by id
# uses get_or_404 to return 404 if not found
# checks if the design belongs to the current user, returning 403 if not
# logic: query for design by id, check user ownership, return design as a dictionary with 200 status code
# wraps response in a dictionary with a "design" key {'design': ...}


# PUT /api/designs/<int:id> - update an existing design
@design_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_design(id):

    design = Design.query.get_or_404(id)
    if design.user_id != current_user.id:
        return {'error': 'Not your design'}, 403
    
    data = request.get_json()
    for field in ['title', 'svg_data', 'shirt_color', 'description']:
        if field in data and data[field] is not None:
            setattr(design, field, data[field])
    
    db.session.commit()
    return {'design':design.to_dict()}, 200 
# updates an existing design by id
# checks if the design belongs to the current user, returning 403 if not
# parses JSON data from request body
# updates fields if provided in the request body
# logic: query for design by id, check user ownership, update fields, commit changes,
# return updated design as a dictionary with 200 status code


# DELETE /api/designs/<int:id> - delete a design
@design_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_design(id):
    """
    Delete a design by id must belong to the current user
    """
    design = Design.query.get_or_404(id)
    if design.user_id != current_user.id:
        return {'error': 'Not your design'}, 403
    
    db.session.delete(design)
    db.session.commit()
    return {'message': 'Design deleted successfully'}, 200
