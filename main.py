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
"""
Home route.  grabs all records in building collection.  
If collection is empty, redirect to creating a new record.
bldg_list_html creates of building to choose from.

"""
@app.route('/')
def propertyhome():
    print("index page")
    bldg = mongo.db.building.find()
    print(bldg.count())
    print(dumps(bldg))
    if bldg.count() == 0:
        print("no data in db")
        return redirect(url_for("bldg_new"))
    return render_template("bldg_list.html")

# bgdg_list.html is lauched above.  bldg_list.html, when launched, 
# loads static/js/bldg_list.js, which builds the datatable for property list 
# when Add button is pressed, goes to url /bldg_new 

#/bldg_new retrieves a blank template record helper.py
#that template is sent to bldg_edit_form.html.
# not sure it's necessary.

@app.route('/bldg_new')
def bldg_new():
    table_builder = TableBuilder()
    data = table_builder.collect_template_bldging()
    session["record_status"] = "new"
    session['newdata'] = data
    print("new building ....")
    # # print(request.form['bldg_name'])
    # building = mongo.db.building
    # building_doc = {'name': request.form['bldg_name']}
    # building.insert_one(building_doc)
    return render_template("bldg_edit_form.html", bldgData=data, status="new")
    


@app.route('/bldg_list_data')
def bldg_list_data():
    session['status'] = "idle"
    # session['bldgData'] = ""
    # session['bldgEdit'] = ""
    bldg = mongo.db.building.find()
    print('bldg list')
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
    return render_template("bldg_edit_form")


@app.route('/cap_data')
def cap_data():  
    data = session['newdata']
    capdata = data['improvements']
    temp = list(capdata)
    for x in range(len(temp)):
        temp[x]['id'] = x
    table = {'data': temp}
    print(table)
    return dumps(table)

@app.route('/tenants_data')
def tenants_data():  
    data = session['newdata']
    tenantsdata = data['tenants']
    temp = list(tenantsdata)
    for x in range(len(temp)): #DataTables Editor requires id 
        temp[x]['id'] = x
    table = {'data': temp}
    print(table)
    return dumps(table)

@app.route('/expense_data')
def expense_data():  
    data = session['newdata']
    expensedata = data['expense']
    temp = list(expensedata)
    for x in range(len(temp)): #DataTables Editor requires id 
        temp[x]['id'] = x
    table = {'data': temp}
    print(table)
    return dumps(table)

      
   
    

if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
        port=int(os.environ.get('PORT')),
        debug=True)
