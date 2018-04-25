
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
      // dom: 'Bfrtip',
      columns: [
        // { "data": "_id", "title": "ID" },
        { "data": "name", "title": "Name" }
      ],
      select: true,
      

    });

    $('#bldg_edit_btn').on( 'click',    function() {
      var table = $('#bldg_list').DataTable();
      var data = table.row({ selected: true }).data()
      // console.log(JSON.stringify(data))
      alert(JSON.stringify(data))
      $.ajax({
          url: '/bldg_edit',
          data: JSON.stringify(data),
          type: 'POST',
          contentType: "application/json; charset=utf-8",
          success: function() {
            window.location.href = "/bldg_edit_form";
          }
      });
   });

});
