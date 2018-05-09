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
    session["record_status"] = "home"
    session['newdata'] = ""
    session['bldgEditID'] = ""
    session['editdata'] = ""
    print("index page")
    bldg = mongo.db.building.find()
    print(bldg.count())
    # print(dumps(bldg))
    if bldg.count() == 0:
        print("no data in db")
        return redirect(url_for("bldg_new"))
    return render_template("bldg_list.html")
    
    
@app.route('/bldg_list_data')
def bldg_list_data():
    session['status'] = "idle"
    bldg = mongo.db.building.find()
    print('bldg list')
    temp = list(bldg)
    table = {'data': temp}
    # print(table)
    return dumps(table)
    

# bldg_list.html is lauched above.  bldg_list.html, when launched, 
# loads static/js/bldg_list.js, which builds the datatable for property list 
# when Add button is pressed, goes to url /bldg_new 
# When bldg_list.html, it launches bldg_list.js which builds Datatable of building names
# Datatable uses a AJAX get from /bldg_list_data to pull Mongo DB.   Datatable filters the list
# the JS file.


#/bldg_new retrieves a blank template record helper.py
#that template is sent to bldg_edit_form.html.
# not sure it's necessary.

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
# ajax, data back to clientside to populate the tables.  Due to particulars of DataTable
# data needs to be reformated with id required by DataTables' Editor and put into proper 
# dictionary format.

@app.route('/cap_data')
def cap_data():  
    data = session['newdata']
    capdata = data['improvements']
    temp = list(capdata)
    # for x in range(len(temp)):
    #     temp[x]['id'] = x
    # table = {'data': temp}
    # print(table)
    table = getTableData(temp)
    return dumps(table)

@app.route('/cap_data_edit' )
def cap_data_edit(): 
    capdata = session['editdata']
    print('recieved capdata...')
    print(capdata)
    if session['editdata'] == "":
        return redirect(url_for("propertyhome"))
    temp = list(capdata)
    table = {'data': capdata}
    # table = getTableData(capdata)
    print(table)
    return dumps(table)

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
    
def getTableData(data):
    temp = list(data)
    for x in range(len(temp)): #DataTables Editor requires id 
        temp[x]['id'] = x
    table = {'data': temp}
    print(table)
    return table

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
    
# Retrieve and Edit database info.  The first page will look at the info page.
# grads the bldg_id, database key, from the building list page.  If no, id
# user is redirected back to building request page.
@app.route('/bldg_edit', methods = ["GET", "POST"] )
def bldg_edit():
    print('data received from list page ...')
    data = request.form['bldg_id']
    session['bldg_id'] = data
    print(data)
    if data == "":
        return redirect(url_for("propertyhome"))
    if 'submit_save' in request.form:
        dbData = mongo.db.building.find_one({"_id": ObjectId(data)})
        bldgEdit = dbData
        print('returns mongo record')
        print(bldgEdit)
        return render_template("/bldg_update.html", data= bldgEdit)
    elif 'submit_delete' in request.form:
        print("hit submit delete btn")
        dbData = mongo.db.building.remove({"_id": ObjectId(data)})
        return redirect(url_for("propertyhome"))
    else:
        print("request button not found")
        return

@app.route('/next_update', methods = ["GET", "POST"] )
def next_update():
    print('data received for acquisition page ...')
    data = request.form['bldg_id']
    print(data)
    if data == "":
        return redirect(url_for("propertyhome"))
    dbData = mongo.db.building.find_one({"_id": ObjectId(data)})
    bldgEdit = dbData
    print('returns mongo record')
    print(bldgEdit)
    if 'info_formsave' in request.form:  #test code
        print("found acqusition submit save button")
        print(request.form['name'])
        
        
        return render_template("/acq_update.html", data=bldgEdit)
    elif 'acq_formsave' in request.form:
        print("found capital submit save button")
        if "improvements" in bldgEdit:
            session['editdata'] = bldgEdit['improvements']
        else:
            session['editdata'] = []
        return render_template("/cap_update.html", data= bldgEdit)
    elif 'cap_formsave' in request.form:
        print("found expense submit save button")
        if "expense" in bldgEdit:
            session['editdata'] = bldgEdit['expense']
        else:
            session['editdata'] = []
        return render_template("/exp_update.html", data= bldgEdit)
    elif 'exp_formsave' in request.form:
        print("found expense submit save button")
        if "tenants" in bldgEdit:
            session['editdata'] = bldgEdit['tenants']
        else:
            session['editdata'] = []
        return render_template("/tenants_update.html", data= bldgEdit)    
    else:    
        print("wrong sumbit button")
        return render_template("/bldg_list.html")
    return    

# @app.route('/info_update/<id>')        
@app.route('/info_update', methods = ["POST"])
def info_update():
    
    print('data received for info page ...')
    bldg_id = request.form['bldg_id']
    session['bldg_id'] = bldg_id
    print(bldg_id)
    print(request.form['bldg_name'])
    
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
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    print(bldgEdit)
    if 'info_formsave' in request.form: 
        return render_template("/bldg_update.html", data = bldgEdit)
    else: 
        return render_template("bldg_list.html")

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

@app.route("/exp_update/data" , methods=['POST', 'GET'])    
def exp_update_result():
    bldg_id = session['bldg_id']
    data = request.get_json()
    print("ajax data recieved...")
    print(dumps(data))
    building = mongo.db.building
    building.update({'_id': ObjectId(bldg_id)},
        {"$set": {
        "expense": data['expense'],
        }})
    print("data inserted...")
    dbData = mongo.db.building.find_one({"_id": ObjectId(bldg_id)})
    bldgEdit = dbData
    print("return mongo data")
    if "expense" in bldgEdit:
        session['editdata'] = bldgEdit['expense']
    else:
        session['editdata'] = []
    print(bldgEdit)
    return render_template("/exp_update.html", data = bldgEdit)

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

@app.route("/tenants_update/data" , methods=['POST', 'GET'])    
def tenants_update_result():
    bldg_id = session['bldg_id']
    data = request.get_json()
    print("ajax tenants data recieved.../tenants_update/data ")
    print(dumps(data))
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
        debug=True)
