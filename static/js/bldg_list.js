
var editor;

$(document).ready(function() {

    editor = new $.fn.dataTable.Editor({
      "idSrc": "id",
      "table": "#bldg_list",
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

    $('#bldg_list').DataTable({
      ajax: "/bldg_list_data",
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


});
