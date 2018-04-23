

Objects:

The Mongo database will be comprised of two collections - building and settings.

The building collection  is shown below:

```
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
      tenant name, space being reented and list of rent objects.  A rent object contains
      start and end date for the payment periods and monthly rent.

* expense provides a list operating expenses, their annual amounts and annual growth rates    

* capital improves provides a capital costs that must the spent to improve the property to new owners requirements.
   also tracks the capital expediture type, which is defined in settings.

The settings collection is shown below:

```
{
    'building_types' : ['industrial', 'residential', 'mixed use'],

    'exp_cat': [{'cat_name': 'landscaping', 'grw_rate': 2}, {'cat_name': 'maintenance', 'grw_rate': 2}, {...}],

    'capex_cat': ['construction', 'architect'],
    'capex_metatype': ['hard cost', 'soft cost']

    'loan_amort' : 25,
    'loan_ltv' : 65,
    'loan_rate': 5,

    'model' : 10
}

```
The settings object is divided into the following sections: 

* building types will provides a list of standard property types such as commerical industrial or residential
* Expense categories defines the type of expenses such as ultilites, landscaping etc..  the cost assocated with running a property
* Capital Expendure / CapEx  includes lists for CapEx categories and meta description for the categorary
  such as hard cost or soft cost
* loan section includes typical assumptions for amortazation schedule, loan to value (ltv) and anticipated 
  loan interest rate.
* model refers the duration of model 

