

function build_list_table () {
    data = [
      ['titos buritos','S Orange'], 
    ['Park Place', 'Morristown'],
    ['Workshop', 'Chicgo']
    ];
    
    editor = new $.fn.dataTable.Editor({
      "idSrc": "_id",
      "table": "#bldg_list_test",
      "fields": [{
        "label": "Name",
        "name": "name"
      }]
    });

    $('#bldg_list_test').DataTable({
      data: data,
      paging: true,
      dom: 'Bfrtip',
      columns: [
        // { "data" "_id", "title": "ID" },
        {"title": "Name" },
        {"title": "City" }
      ],
      select: true,
     buttons: [],
    });            
};


function get_bldg_list_data () {
  var table = $('#bldg_list_test').DataTable();
  console.log(table.row().data())
  var row = table.row().data()[0];
  return row;
  
};


function get_bldg_name () {
  var jsBldgDataTest = {};  
  jsBldgDataTest['name'] = $('#bldg_name_test').val();
  return jsBldgDataTest['name']  
};
    
   




