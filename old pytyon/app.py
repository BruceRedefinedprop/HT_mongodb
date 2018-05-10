import os
from flask import Flask, render_template, redirect, request, url_for, jsonify, session
from table import TableBuilder



app = Flask(__name__)
app.config['SECRET_KEY'] = 'well-secret-password'
# app.config['DEBUG'] = True



@app.route('/')
def home():
    session['result'] = []
    return render_template("clientside_table.html")
    
@app.route('/data')
def dbtest():
    table_builder = TableBuilder()
    data = table_builder.collect_data_clientside()
    print(data)
    return jsonify(data)
    
@app.route('/changed_data', methods=['POST', 'GET'])
def recv_data():
    data = request.get_json()
    session['result'] = data
    print("ready to show data")
    print(data)
    return redirect(url_for("show_data"))
    

@app.route('/show_data') 
def show_data():
    data = session['result']
    return  render_template("rcv_data.html", data=data)
    

    
if __name__ == '__main__':

    app.run(host=os.environ.get('IP'),
        port=int(os.environ.get('PORT')),
        debug=True)

        