/*jslint browser: true*/
/*global $*/


$(document).ready(function() {
  $.get('/data', function(data) {
    $('#clientside_table').DataTable({
      data: data.data,
      paging: true,
      dom: 'frtipB',
      columns: [
        { "data": "id", "title": "ID"},
        { "data": "st_date", "title": "Start Date" },
        { "data": "end_data", "title": "End Date" },
        { "data": "monthly_rent", "title": "Monthly Rent" },
      ],
      columnDefs:[
        { targets: [1,2,3], visible: true},
        { targets: [0], visible: false }
        
        ]
    });
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
