from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://dev:senha123@localhost:27018/profile'
mongo = PyMongo(app)

@app.route('/profiles', methods=['POST'])
def create_profile():
    data = request.get_json()
    name = data.get('name', None)
    img = data.get('img', None)

    if name is None or img is None:
        return jsonify({ 'error': 'Missing data' }), 400
    
    profile = {'name': name, 'img': img}
    mongo.db.profiles.insert_one(profile)

    return jsonify({ 'message': 'Profile created sucessfully' }), 201

@app.route('/profiles', methods=['GET'])
def get_profiles():
    profiles = mongo.db.profiles.find()
    result = []

    for profile in profiles:
        result.append({ 'name': profile['name'], 'img': profile['img'] })

    return jsonify(result), 200

@app.route('/profiles/<string:profile_id>', methods=['GET'])
def get_profile(profile_id):
    profile = mongo.db.profiles.find_one({ '_id': ObjectId(profile_id) })
    if profile:
        return jsonify({
            '_id': str(profile['_id']),
            'name': profile['name'],
            'img': profile['img']
        }), 200
    else:
        return jsonify({ 'message': 'Profile not found' }), 404
    
@app.route('/profiles/<string:profile_id>', methods=['PUT'])
def update_profile(profile_id):
    data = request.get_json()
    name = data.get('name', None)
    img = data.get('img', None)

    if name is None or img is None:
        return jsonify({ 'message': 'Missing data' }), 400
    
    result = mongo.db.profiles.update_one(
        { '_id': ObjectId(profile_id) },
        { '$set': {
            'name': name,
            'img': img
        } })
    
    if result.modified_count > 0:
        return jsonify({ 'message': 'Profile updated sucessfully' }), 200
    else:
        return jsonify({ 'error': 'Profile not found' }), 404

if __name__ == '__main__':
    app.run(debug=True)