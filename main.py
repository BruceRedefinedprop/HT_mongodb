"""
main.py is the main program loop. 

It holds python flask view functions and mongoDb CRUD logic

"""




import os
import json
from flask import Flask, render_template, redirect, request, url_for, jsonify, session
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from bson.json_util import dumps, loads
from helper import TableBuilder

# sets up flask and Mongodb connection
app = Flask(__name__)
app.config["MONGO_DBNAME"] = 'ht_property'
app.config["MONGO_URI"] = 'mongodb://bruce:quailrun@ds251799.mlab.com:51799/ht_property'
app.config['SECRET_KEY'] = 'well-secret-password'

mongo = PyMongo(app)


# helper function used to clean up datatable results before submitted to MongoDb
def getTableData(data):
    temp = list(data)
    for x in range(len(temp)): #DataTables Editor requires id 
        temp[x]['id'] = x
    table = {'data': temp}
    print(table)
    return table
 
"""
Home route.  grabs all records in building collection.  
If collection is empty, redirect to creating a new record.
bldg_list_html creates of building to choose from.

"""

@app.route('/')
def propertyhome():
    # clears session variables
    session["record_status"] = "home"
    session['newdata'] = ""
    session['bldgEditID'] = ""
    session['editdata'] = ""
    print("index page")
    # retrieves all building records.  Database is small.
    # for a larger databases, I would create a filtered find that just gets ids, names and cities
    bldg = mongo.db.building.find()
    print(bldg.count())
    # print(dumps(bldg))
    #  database is empty go to Add a record page
    if bldg.count() == 0:
        print("no data in db")
        return redirect(url_for("bldg_new"))
    # show building list 
    return render_template("bldg_list.html")
    
# used by bldg_list.js to retrieve building list via AJAX 
@app.route('/bldg_list_data')
def bldg_list_data():
    session['status'] = "idle"
    bldg = mongo.db.building.find()
    print('bldg list')
    temp = list(bldg)
    table = {'data': temp}
    print(table)
    return dumps(table)
    

# bldg_list.html is lauched above.  bldg_list.html, when launched, 
# loads static/js/bldg_list.js, which builds the datatable for property list 
# when Add button is pressed, goes to url /bldg_new 
# When bldg_list.html, it launches bldg_list.js which builds Datatable of building names
# Datatable uses a AJAX get from /bldg_list_data to pull Mongo DB.   Datatable filters the list
# the JS file.


# /bldg_new is reached when user on home page, building list press the Add button.
# Add button creates new blank record.
#/bldg_new retrieves a blank template record helper.py
#that template is sent to bldg_edit_form.html.  

@app.route('/bldg_new' , methods=['POST', 'GET'])
def bldg_new():
    table_builder = TableBuilder()
    data = table_builder.collect_template_bldging()
    session["record_status"] = "new"
    session['newdata'] = data
    print("new building ....")
    return render_template("bldg_edit_form.html", bldgData=data, status="new")
    
# when the save & exit on  bldg_form_html is pressed, an JSON file new record's collected data, the jsBldgData array
# is sent to /bldg_new/data via AJAX     

@app.route("/bldg_new/data" , methods=['POST', 'GET'])    
def bldg_new_result():
    data = request.get_json()
    print("ajax data recieved...")
    print(dumps(data))
    building = mongo.db.building
    building.insert_one(data)
    print("data inserted...")
    return render_template("bldg_list.html")
    
# In the bldg_edit_form, to populate the various datatable, we need to pull data
# from the various data records.   The session{'data'] variable is set in bldg_new() view function
# when the data record is created.  The view functions below used below to pass via
# ajax, data back to client side to populate the tables.  Due to particulars of DataTable
# data needs to be reformated with id required by DataTables' Editor and put into proper 
# dictionary format.


# used by add a new document, bldgedit.js to send JSON data to bldg_edit_form.html.
# session['newdata'] is used as a temporary store a  blank document template dictionary.
# the template document is created because a future feature will be to load default values
# into the tempalte dictionary.  The default values will come from settings and helper.py.

@app.route('/cap_data')
def cap_data():  
    data = session['newdata']
    capdata = data['improvements']
    temp = list(capdata)
    table = getTableData(temp)
    return dumps(table)

# similar function as above.  Used by the edit a document feature to send JSON 
# data to populate the capital table on cap_update.html.    session['editdata']
# is used pass document being editted between view functions. 
@app.route('/cap_data_edit' )
def cap_data_edit(): 
    capdata = session['editdata']
    print('recieved capdata...')
    print(capdata)
    # no data to edit, go to home page.
    if session['editdata'] == "":
        return redirect(url_for("propertyhome"))
    temp = list(capdata)
    table = {'data': capdata}
    # table = getTableData(capdata)
    print(table)
    return dumps(table)

# Used by the edit a document to send JSON used to populate expense table.
# targe exp_update.html
@app.route('/exp_data_edit' )
def exp_data_edit(): 
    expdata = session['editdata']
    print('recieved expdata...exp_data_edit')
    print(expdata)
    if session['editdata'] == "":
        return redirect(url_for("propertyhome"))
    temp = list(expdata)
    table = {'data': expdata}
    print(table)
    return dumps(table)

# used by edit function to send JSON to populate capital table.
@app.route('/tenants_data_edit' )
def tenants_data_edit(): 
    tenantsdata = session['editdata']
    print('recieved tenants data... tenants_data_edit')
    print(tenantsdata)
    if session['editdata'] == "":
        return redirect(url_for("propertyhome"))
    temp = list(tenantsdata)
    table = {'data': tenantsdata}
    print(table)
    return dumps(table)


# Used by Add a document and bldgedit.js to send JSON used to populate tenants table 
@app.route('/tenants_data')
def tenants_data():  
    data = session['newdata']
    tenantsdata = data['tenants']
    temp = list(tenantsdata)
    table = getTableData(temp)
    # for x in range(len(temp)): #DataTables Editor requires id 
    #     temp[x]['id'] = x
    # table = {'data': temp}
    # print(table)
    return dumps(table)
    

# Used by Add a document to send JSON to populate expense table.
@app.route('/expense_data')
def expense_data():  
    data = session['newdata']
    expensedata = data['expense']
    temp = list(expensedata)
    # for x in range(len(temp)): #DataTables Editor requires id 
    #     temp[x]['id'] = x
    # table = {'data': temp}
    # print(table)
    table = getTableData(temp)
    return dumps(table)
    
# bldg_edit() controls the buttons building list page bldg_list.html.
# 
@app.route('/bldg_edit', methods = ["GET", "POST"] )
def bldg_edit():
    print('data received from list page ...')
    # retrieves mongodb id for the selected record
    # session variable is used by other view functions to edit record
    data = request.form['bldg_id']
    session['bldg_id'] = data
    print(data)
    # no data retrieved to back to home page.
    if data == "":
        return redirect(url_for("propertyhome"))
    # IF the edit button on building list page is clicked
    # retrieve the selected record. data is building's mongodb document id.
    if 'submit_save' in request.form:
        dbData = mongo.db.building.find_one({"_id": ObjectId(data)})
        bldgEdit = dbData
        print('returns mongo record')
        print(bldgEdit)
        return render_template("/bldg_update.html", data= bldgEdit)
    # if delete is pressed delete document from Mongodb 
    elif 'submit_delete' in request.form:
        print("hit submit delete btn")
        dbData = mongo.db.building.remove({"_id": ObjectId(data)})
        return redirect(url_for("propertyhome"))
    else:
        print("request button not found")
        return
 
# on edit info tab bldg_update.html, when any save button is clicked
@app.route('/info_update', methods = ["POST"])
def info_update():
    # retreive bldg id from page
    print('data received for info page ...')
    bldg_id = request.form['bldg_id']
    session['bldg_id'] = bldg_id
    print(bldg_id)
    print(request.form['bldg_name'])
    # save changed data, update mongodb document
    mongo.db.building.update({'_id': ObjectId(bldg_id)}, {"$set": 
        {
        "name": request.form['bldg_name'],
        "street": request.form['bldg_street'],
        "town": request.form['bldg_town'],
        "st": request.form['bldg_st'],
        "zip": request.form['bldg_zip'],
        "page": request.form['bldg_page'],
        "lot": request.form['bldg_lot'],
        "block": request.form['bldg_block'],
        "gla": request.form['bldg_gla'],
        "land": request.form['bldg_land'],
        # "type": request.form['bldg_type']
        }})
    # reload updated data to info tab 
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    print(bldgEdit)
    # if save button click render info tab, save and exit click to home page.
    if 'info_formsave' in request.form: 
        return render_template("/bldg_update.html", data = bldgEdit)
    else: 
        return render_template("bldg_list.html")

# for edit pages, build info tab from bldg_update.html
@app.route('/info_update_tab')
def info_update_tab():
    print('data received for info tab page ...')
    bldg_id = session['bldg_id']
    print(bldg_id)
   
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    print(bldgEdit)
    return render_template("/bldg_update.html", data = bldgEdit)

# for edit a document  updates acquisition info a selected document
@app.route('/acq_update', methods = ["POST"])
def acq_update():
    print('data received for acq page ...')
    bldg_id = request.form['bldg_id']
    session['bldg_id'] = bldg_id
    print(bldg_id)
    mongo.db.building.update({'_id': ObjectId(bldg_id)},
        {"$set": {
        "contract_price": request.form['bldg_price'],
        "noi": request.form['bldg_noi'],
        "cap": request.form['bldg_cap'],
        "bank": request.form['bldg_bank'],
        "loan_amount": request.form['bldg_loan_amt'],
        "ltv": request.form['bldg_ltv'],
        "loan_term": request.form['bldg_loan_term'],
        "amort": request.form['bldg_loan_amort']
        }})
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    print(bldgEdit)
    if 'acq_formsave' in request.form: 
        return render_template("/acq_update.html", data = bldgEdit)
    else: 
        return render_template("bldg_list.html")

# for edit pages builds acquisition tab
@app.route('/acq_update_tab')
def acq_update_tab():
    print('data received for acq tab page ...')
    bldg_id = session['bldg_id']
    print(bldg_id)
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    print(bldgEdit)
    return render_template("/acq_update.html", data = bldgEdit)
      
# for edit pages builds expense page for selected document   
@app.route('/exp_update_tab', methods=['POST', 'GET'])
def exp_update_tab():
    print('data received for exp tab page ...')
    bldg_id = session['bldg_id']
    print(bldg_id)
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    if "expense" in bldgEdit:
        session['editdata'] = bldgEdit['expense']
    else:
        session['editdata'] = []
    print(bldgEdit)
    return render_template("/exp_update.html", data = bldgEdit)

# for edit pages, updates expense data for selected mongodb document
@app.route("/exp_update/data" , methods=['POST', 'GET'])    
def exp_update_result():
    bldg_id = session['bldg_id']
    # get json sent to it when save button clicked.  uses cap_update.js.
    data = request.get_json()
    print("ajax data recieved...")
    print(dumps(data))
    # updates expense portion document a single list of dicts
    building = mongo.db.building
    building.update({'_id': ObjectId(bldg_id)},
        {"$set": {
        "expense": data['expense'],
        }})
    print("data inserted...")
    # retrieve updated document so that update page is reloaded
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    if "expense" in bldgEdit:
        session['editdata'] = bldgEdit['expense']
    else:
        session['editdata'] = []
    print(bldgEdit)
    # reloads current page
    return render_template("/exp_update.html", data = bldgEdit)

# for edit function, capital page is built for selected document
@app.route('/cap_update_tab', methods=['POST', 'GET'])
def cap_update_tab():
    print('data received for cap tab page ...')
    bldg_id = session['bldg_id']
    print(bldg_id)
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    if "improvements" in bldgEdit:
        session['editdata'] = bldgEdit['improvements']
    else:
        session['editdata'] = []
    print(bldgEdit)
    return render_template("/cap_update.html", data = bldgEdit)

#  for edit pages, updated capital tab's data is saved and Mongodb updated
@app.route("/cap_update/data" , methods=['POST', 'GET'])    
def cap_update_result():
    bldg_id = session['bldg_id']
    data = request.get_json()
    print("ajax cap data recieved...")
    print(dumps(data))
    building = mongo.db.building
    building.update({'_id': ObjectId(bldg_id)},
        {"$set": {
        "improvements": data["improvements"],
        }})
    print("data inserted...")
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    if "improvements" in bldgEdit:
        session['editdata'] = bldgEdit['improvements']
    else:
        session['editdata'] = []
    print(bldgEdit)
    return render_template("/cap_update.html", data = bldgEdit)

# for edit pages, tenant tab is built for selected document
@app.route('/tenants_update_tab', methods=['POST', 'GET'])
def tenants_update_tab():
    print('data received for tenants tab page ...')
    bldg_id = session['bldg_id']
    print(bldg_id)
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    if "tenants" in bldgEdit:
        session['editdata'] = bldgEdit['tenants']
    else:
        session['editdata'] = []
    print(bldgEdit)
    return render_template("/tenants_update.html", data = bldgEdit)

# similar to above, for edit pages the tenants tab mongodb is updated for selected record
@app.route("/tenants_update/data" , methods=['POST', 'GET'])    
def tenants_update_result():
    bldg_id = session['bldg_id']
    data = request.get_json()
    print("ajax tenants data recieved.../tenants_update/data ")
    print(dumps(data))
    # updated rent lists are  nested in tenants list
    building = mongo.db.building
    building.update({'_id': ObjectId(bldg_id)},
        {"$set": {
        "tenants": data["tenants"],
        }})
    print("data inserted...")
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    if "improvements" in bldgEdit:
        session['editdata'] = bldgEdit['tenants']
    else:
        session['editdata'] = []
    print(bldgEdit)
    return render_template("/tenants_update.html", data = bldgEdit)

if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
        port=int(os.environ.get('PORT')),
        debug=False)
