DATA_SAMPLE = [
    {'A': 'Hello!', 'B': 'How is it going?', 'C': 3, 'D': 4},
    {'A': 'These are sample texts', 'B': 0, 'C': 5, 'D': 6},
    {'A': 'Mmmm', 'B': 'I do not know what to say', 'C': 7, 'D': 16},
    {'A': 'Is it enough?', 'B': 'Okay', 'C': 8, 'D': 9},
    {'A': 'Just one more', 'B': '...', 'C': 10, 'D': 11},
    {'A': 'Thanks!', 'B': 'Goodbye.', 'C': 12, 'D': 13}
]



DATA_SAMPLE_RENT = [
    {'st_date' :'1/1/2017', 'end_data' : '12/31/2017', 'monthly_rent': 10000 }, 
    {'st_date' :'1/1/2018', 'end_data' : '12/31/2018', 'monthly_rent': 11000 },
    {'st_date' :'1/1/2019', 'end_data' : '12/31/2019', 'monthly_rent': 12000 },
    {'st_date' :'1/1/2020', 'end_data' : '12/31/2020', 'monthly_rent': 13000 },
    {'st_date' :'1/1/2021', 'end_data' : '12/31/2021', 'monthly_rent': 14000 }
    ]





class TableBuilder(object):

    def collect_data_clientside(self):
        return {'data': DATA_SAMPLE_RENT}

   