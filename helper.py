
BLDGING = {
    'name': "test",
    'street': "" ,
    'town': "",
    'st' : '',
    'zip': '',
    'page': "",
    'lot': "",
    'block': "",
    'gla' :"",
    'type' : '',
    'land' : "",
    'type': "",
    'contract_price' : "",
    'asking_price' : "",
    'noi' : "",
    "cap" : "",
    'bank' : '',
    'ltv': "",
    'loan_amount' : "",
    'loan_term' : "",
    'amort' : "",
    'tenants' : [{ 'tenant_name' : 'Stan' , 'leased_space' : '', 'rents' : [] }],
    'expense' : [ {'exp_cat' : "utlities" , 'exp_amount' : '', 'exp_growth' : ''}],
    'improvements' : [{'capex_cat': "Repairs", 'capex_amount': '', 'capex_type': ""}]}

class TableBuilder(object):
    def collect_template_bldging(self):
        return BLDGING

   