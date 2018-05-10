# The Harry Tools Building Database 

The Harry Tools (HT) Building database is milestone project for  Data Centric Development module. 
The application is envisioned as a front-end to a financial modeling application.  

## Start the Program

To start the project use python3 main.py.

## Environment

The requirements.txt file includes python3 dependencies.

Other technologies include:

* DataTables and Editor (https://datatables.net/), a jquery plug-in for creating editables, sortable, searchable,
pre-formated tables.  This plug-in also enables, though not used in this application, the capability
to print, export to excel or pdf as well as other formats.

* MongoDB hosted on Mlabs.com is used as the database.

* Python flask and flask-pymongo.

* Materialize for the CSS framework

## Program Operation and Work Flow

Home page is a list a list of buidings projects by name or city.  

The add button opens of tabbed form for adding informaton about the buildings, 
it's pruchase terms, financing, tenants and their rents', operating expenses and
planned capital.

The edit button, enables editing of the selected  property and all the 
aforementioned information.

the edit pages, like add pages are divided into four five tables:

* info
* Aquisition
* Tenants
* Expenses
* Capital

After editing each page, you need to save data and use tabs to switch differnt page. 
Save & Exit button save data and exits back to home page, the building list.

### Tenants Page

The tenants page has a table that allows you to add, edit or delete basic information.
You must save tenant information before moving on.

For each tenant, you can also add rents to it.  To add rent, you need to select a 
tenant (highlight a line), click the rent the button.   After the rent is edited, press save.  
To go back to tenants, press exit.  Remember, tenants must be
saved before moving on to the next page or editing additional rents.

# MongoDd structure
The building object is divided into the following sections:

* building name and address
    * full address and deed location (Page, Lot and Block)
* building details 
    * building type - settings collections maintains an allowable entries
    * GLA gross leasable area or size in square feet (SF)
    * Amount of land in arces

* property purchase information
    * contract price for the property
    * purchasing NOI or net operating income at the time of the purchase
    * asking price for the property or price before negoiations.

* financing / loan information
    * name of bank, loan value, loan term and amortization period. 

* tenants and rents
    * tenants list includes tenant name and how much space they are renting.
      A tenant list will contain a tenant object / python dictionary.    Each tenant dictionary
      will have a list of rent objects / python dictionaries.  Such that a tenant object contains
      tenant name, space being rented and list of rent objects.  A rent object contains
      start and end date for the payment periods and monthly rent.  Rent is nested in tenant portion
of the document

* expense provides a list operating expenses, their annual amounts and annual growth rates    

* capital improves provides a capital costs that must the spent to improve the property to new owners requirements.
   also tracks the capital expediture type, which is defined in settings.

An example of mongodb document is:

```python
{
'name': 'home',
'street': '28 Quail Run',
'town': 'Randolph',
'st' : 'NJ',
'zip': '07869',
'page': 21
'lot': 1401,
'block': 4,
'gla' : 4000,
'type' : 'residential',
'land' : 1,
'contract_price' : 800000,
'asking_price' : 850000,
'noi' : 0,
"term_cap" : 10,
'bank' : 'Goldman',
'loan_amount' : 500000,
'loan_term' : 10,
'amort' : 30,
'tenants' : [{ 
            'tenant_name' : '' , 
            'leased_space' : 0,
            'rents' :
                [{'base' : [ {'start_date' :  ,'end_date' : ,'monthly_rent': }, {'ext': ....} ]
            }],

'expense' : [ {'exp_cat' : "" , 'exp_amount' : 0, 'exp_growth' : 0}, {...}],
'improvements' : [{'capex_cat': "", 'capex_amount': 0, 'capex_type': ""}, {...}]
}
```

# Key files and programs

The key python programs are:

* main.py is the main program loop and view functions. Since most the CRUD functionality
is straight-forward and did not require separate business logic, no additional custom python scripts
were required to separate CRUD / view logic from business logic.

* helper.py holds dictionary and tableBuilder function to a blank template document
used to create a new building document.  In the future setting defautls will be
loaded into this helper.py template dictionary.

The key javascript programs are:

* bldg_list.js which is used to build DataTable for the home page, showing a list
of properties and their city.

* bldgEdit.js is to help create DataTables for Add function, control the saving 
of data and show and hide portions of the bldg_edit_form.html while the user
switches between tabs.

* cap_update.js provides a similar function for Edit a building document.

* init.js and materialize.js are port of the Materialize framework.

* DataTables diretory contains both css and javascript for DataTable plug-in

## Workflow.

1. Home page - bldg_list.html.
2. to Add a record, launches bldg_edit_form.html
3. To Edit a record launches a set of pages, starting with:
    * bldg_update.html for editing building info
    * act_update.html for building purchase and loan data
    * tenant_update.html for tenant and rent info
    * exp_update.html for table of expenses.
    * cap_update.html for table of capital expenditures

To delete a document use the delete button on the home page.
To delete, add or edit rent is done on using the Tenant's tab using Datatable functionality.   The Tenant page and
cap_update.js creates a new tenant record including the update nested rent data and
updates the whole tenant sub-document to MongoDb collection. 
To save rent, you must save tenant record before anything else, because on the rent page,
the save button save rent to memory, on the tenant page, tenant save button associates
that rent with that tenant's entry in the mongodb document.   This part of the workflow
is an opportunity for streamlining and improvement.

The base.html is used as general hmtl flask template.