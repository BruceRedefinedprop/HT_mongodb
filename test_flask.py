from main import app
import unittest 
from flask_testing import TestCase
from flask import Flask, session, redirect, url_for, jsonify

import os
import tempfile

# class TablebuilderTest(TestCase):
    

class FlaskMainTests(TestCase):
    def create_app(self):
        # app = Flask(__name__)
        app.config['TESTING'] = True
        return app

    def test_property_home(self):
        # sends HTTP GET request to the application
        # on the specified path
        render_templates = False
        result = self.client.get("/")
        self.assert200(result, "didn't find page")
        self.assert_template_used('bldg_list.html')  
        
    def test_new_bldg(self):
        # sends HTTP GET request to the application
        # on the specified path
        render_templates = False
        result = self.client.get("/bldg_new")
        self.assert200(result, "didn't find page")
        self.assert_template_used('bldg_edit_form.html')  
   
        
if __name__ == '__main__':
    unittest.main()        
        
