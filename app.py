import os
from flask import Flask, render_template, redirect, request, url_for, jsonify, session
from table import TableBuilder

app = Flask(__name__)


@app.route('/')
def home():
    return render_template("clientside_table.html")
    
@app.route('/data')
def dbtest():
    table_builder = TableBuilder()
    data = table_builder.collect_data_clientside()
    return jsonify(data)
    
@app.route('/changed_data', methods=['POST', 'GET'])
def recv_data():
    data = request.get_json()
    session['result'] = data
    print("ready to show data")
    print(data)
    return redirect(url_for("show_data"))
    # return redirect("show_data", data = data)
    

@app.route('/show_data') 
def show_data():
    data = session['data']
    return  render_template("rcv_data.html", data=data)
    

    
if __name__ == '__main__':

    app.run(host=os.environ.get('IP'),
        port=int(os.environ.get('PORT')),
        debug=True)

        