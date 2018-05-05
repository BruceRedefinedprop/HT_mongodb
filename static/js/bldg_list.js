
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
        { "data": "name", "title": "Name" }
      ],
      select: true,
      

    });

    $('#bldg_list').on( 'click',    function() {
      var table = $('#bldg_list').DataTable();
      var row = table.row({ selected: true }).data();
      var data = row["_id"]['$oid'];
      alert(JSON.stringify(data));
      $("#bldg_id").val(data) ;
       
   });
   
});
