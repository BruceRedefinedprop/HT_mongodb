
BLDGING = {
    'name': "",
    'street': "address" ,
    'town': "town",
    'st' : 'st',
    'zip': 'zip',
    'page': 0,
    'lot':  0,
    'block': 0,
    'gla' : 0,
    'type' : 'property type',
    'land' : 0,
    'contract_price' : 0,
    'asking_price' : 0,
    'noi' : 0,
    "term_cap" : 0,
    'bank' : 'bank',
    'loan_amount' : 0,
    'loan_term' : 0,
    'amort' : 0,
    'tenants' : [{ 'tenant_name' : '' , 'leased_space' : 0, 'rents' : [] }],
    'expense' : [ {'exp_cat' : "" , 'exp_amount' : 0, 'exp_growth' : 0}],
    'improvements' : [{'capex_cat': "", 'capex_amount': 0, 'capex_type': ""}]}

class TableBuilder(object):
    def collect_template_bldging(self):
        return BLDGING

   