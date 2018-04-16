/*jslint browser: true*/  
/*global $*/


var editor;

$(document).ready(function() {

    editor = new $.fn.dataTable.Editor({
      "idSrc": "id",
      "table": "#clientside_table",
      "fields": [{
        "label": "Start Date",
        "name": "st_date"
      }, {
        "label": "End Date",
        "name": "end_data"
      }, {
        "label": "Monthly Rent",
        "name": "monthly_rent"
      }]
    });

    $('#clientside_table').DataTable({
      ajax: "/data",
      // data: data.data,
      paging: true,
      dom: 'Bfrtip',
      columns: [
        { "data": "id", "title": "ID" },
        { "data": "st_date", "title": "Start Date" },
        { "data": "end_data", "title": "End Date" },
        { "data": "monthly_rent", "title": "Monthly Rent" },
      ],
      columnDefs: [
        { targets: [1, 2, 3], visible: true },
        { targets: [0], visible: false }
      ],
      select: true,
      buttons: [
        { extend: "create", editor: editor },
        { extend: "edit", editor: editor },
        { extend: "remove", editor: editor }
      ]

    });

  $('#recv_data').click(function() {
    var table = $('#clientside_table').DataTable();
    var data = table.data().toArray();
    console.log("got data from table")
    // alert(JSON.stringify(data))
    $.ajax({
      url: '/changed_data',
      data: JSON.stringify(data),
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      success: function() {
        window.location.href = "/show_data";
      }
    });
  });
});
