// The blgd_list.js is used by bldg_list.html to build a list 
// buildings.


// Create DataTable for building list
// Ajax is used to retrieve the building list

var editor;

$(document).ready(function() {

    editor = new $.fn.dataTable.Editor({
      "idSrc": "_id",
      "table": "#bldg_list",
      "fields": [{
        "label": "Name",
        "name": "name"
      }]
    });

    $('#bldg_list').DataTable({
      ajax: "/bldg_list_data",
      paging: true,
      dom: 'Bfrtip',
      columns: [
        // { "data": "_id", "title": "ID" },
        { "data": "name", "title": "Name" },
        {"data": "town", "title": "City" }
      ],
      select: true,
     buttons: [],
    });

// When a row is selected, the building id for the selected
// record is stored in hidden <input> html tag.  
// Note, that first click is processed by DataTable, the JQuery
// picks up the second click.  Alternatively, I could have  used
// DataTable event listener, that probably only would have requried one click
// on table item.

    $('#bldg_list').on( 'click',    function() {
    
      var table = $('#bldg_list').DataTable();
      var row = table.row({ selected: true }).data();
      var data = row["_id"]['$oid'];
      // alert(JSON.stringify(data));
      $("#bldg_id").val(data) ;
       
   });
   
});
