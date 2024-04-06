import unittest
from unittest.mock import Mock, patch
from app import app
from bson import ObjectId

class TestApp(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()

    @patch('app.mongo')
    def test_create_profile(self, mock_mongo):
        profiles_collection = mock_mongo.db.profiles
        profiles_collection.insert_one.return_value.inserted_id = '661079248a8350bc129d423a'

        data = {'name': 'John', 'img': 'john.jpg'}

        response = self.app.post('/profiles', json=data)

        profiles_collection.insert_one.assert_called_once_with({'name': 'John', 'img': 'john.jpg'})

        self.assertEqual(response.status_code, 201)

    @patch('app.mongo')
    def test_get_all_profiles(self, mock_mongo):
        profiles_collection = mock_mongo.db.profiles
        profiles_collection.find.return_value = [
            {'_id': '661079248a8350bc129d423a', 'name': 'John', 'img': 'john.jpg'},
            {'_id': '661079248a8350bc129d423e', 'name': 'Jane', 'img': 'jane.jpg'}
        ]

        response = self.app.get('/profiles')

        profiles_collection.find.assert_called_once_with()

        self.assertEqual(response.status_code, 200)

    @patch('app.mongo')
    def test_get_profile_by_id(self, mock_mongo):
        profiles_collection = mock_mongo.db.profiles
        profiles_collection.find_one.return_value = {'_id': '1', 'name': 'John', 'img': 'john.jpg'}

        response = self.app.get('/profiles/661079248a8350bc129d423a')

        profiles_collection.find_one.assert_called_once_with({'_id': ObjectId('661079248a8350bc129d423a')})

        self.assertEqual(response.status_code, 200)

    @patch('app.mongo')
    def test_update_profile(self, mock_mongo):
        profiles_collection = mock_mongo.db.profiles
        profiles_collection.update_one.return_value.modified_count = 1

        data = {'name': 'John Doe', 'img': 'john_doe.jpg'}

        response = self.app.put('/profiles/661079248a8350bc129d423a', json=data)

        profiles_collection.update_one.assert_called_once_with({'_id': ObjectId('661079248a8350bc129d423a')}, {'$set': {'name': 'John Doe', 'img': 'john_doe.jpg'}})
        
        self.assertEqual(response.status_code, 200)
    
if __name__ == '__main__':
    unittest.main()