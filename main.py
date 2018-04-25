import os
import json
from flask import Flask, render_template, redirect, request, url_for, jsonify, session
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from bson.json_util import dumps, loads
from helper import TableBuilder


app = Flask(__name__)
app.config["MONGO_DBNAME"] = 'ht_property'
app.config["MONGO_URI"] = 'mongodb://bruce:quailrun@ds251799.mlab.com:51799/ht_property'
app.config['SECRET_KEY'] = 'well-secret-password'

mongo = PyMongo(app)


# if building db is empty, display a name input, else build a table of names
@app.route('/')
def propertyhome():
    print("index page")
    bldg = mongo.db.building.find()
    print(bldg.count())
    print(dumps(bldg))
    if bldg.count() == 0:
        print("no data in db")
        return render_template("bldgnew.html")
    return render_template("bldg_list.html")


# construct building list
@app.route('/bldg_list_data')
def bldg_list_data():
    session['status'] = "idle"
    session['bldgData'] = ""
    session['bldgEdit'] = ""
    bldg = mongo.db.building.find()
    print('bldg list')
    print(bldg.count())
    temp = list(bldg)
    table = {'data': temp}
    print(table)
    return dumps(table)


@app.route('/bldg_edit', methods=['POST', 'GET'])
def recv_data():
    data = request.get_json() 
    # print("received ajax data")
    # print(data)
    # print(type(data))
    bldgEdit = mongo.db.building.find_one({"_id": ObjectId(data['_id']["$oid"])})
    # print('retrieved record')
    # print(bldgEdit)
    name = bldgEdit['name']
    # print(name)
    # print("city" in bldgEdit)
    table_builder = TableBuilder()
    bldgData = table_builder.collect_template_bldging()
    session['bldgData'] = bldgData
    del bldgEdit['_id']
    session['bldgEdit'] = bldgEdit
    session['status'] = "editing"
    return redirect(url_for("bldg_edit_form"))

@app.route('/bldg_edit_form', methods=['POST', 'GET'])
def bldg_edit_form():
    return render_template("bldg_edit_form.html")
    
    

    
@app.route('/bldg_new', methods=["POST"])
def bldg_new():
    print(request.form['bldg_name'])
    building = mongo.db.building
    building_doc = {'name': request.form['bldg_name']}
    building.insert_one(building_doc)
    return render_template("bldg_list.html")
    
    
    

if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
        port=int(os.environ.get('PORT')),
        debug=True)
