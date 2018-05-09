var jsBldgData = {};
var rentDataTable;
var tenantnamedata;

function makeTenantArray(targetID) {
  // build template object
  // get Table rows
  var table = $(targetID).DataTable();
  var rowsdata = table.rows().data();
  // DataTable is a list that has lots of extra stuff appended to list, that confuses to JSON.
  // target object starts index 0, remove extra stuff list.
  var array = [];
  for (var i = 0; i < rowsdata.length; i++) { array[i] = rowsdata[i]; };
  return array;
};

$(document).ready(function() {

    $('#tenants_update').show();
    $('#rent_update').hide();

    var capEditor;
    capEditor = new $.fn.dataTable.Editor({
        "idSrc": "id",
        "table": "#cap_update_list",
        "fields": [{
                "label": "type",
                "name": "capex_type"
            },
            {
                "label": "Category",
                "name": "capex_cat"
            },
            {
                "label": "Amount",
                "name": "capex_amount"
            }


        ]
    });

    $('#cap_update_list').DataTable({
        ajax: "/cap_data_edit",
        // paging: false,
        dom: 'Bfrtip',
        columns: [
            { "data": "capex_cat", "title": "Category" },
            { "data": "capex_type", "title": "Type" },
            { "data": "capex_amount", "title": "Amount" }
        ],
        select: true,
        buttons: [
            { extend: "create", editor: capEditor },
            { extend: "edit", editor: capEditor },
            { extend: "remove", editor: capEditor }
        ]
    });

    var expEditor;
    expEditor = new $.fn.dataTable.Editor({
        "idSrc": "id",
        "table": "#exp_update_list",
        "fields": [{
                "label": "Category",
                "name": "exp_cat"
            },
            {
                "label": "Amount",
                "name": "exp_amount"
            },
            {
                "label": "Annual Growth",
                "name": "exp_growth"
            }



        ]

    });

    $('#exp_update_list').DataTable({
        ajax: "/exp_data_edit",
        // paging: false,
        dom: 'Bfrtip',
        columns: [
            { "data": "exp_cat", "title": "Category" },
            { "data": "exp_amount", "title": "Amount" },
            { "data": "exp_growth", "title": "Annual Growth" }
        ],

        select: true,
        buttons: [
            { extend: "create", editor: expEditor },
            { extend: "edit", editor: expEditor },
            { extend: "remove", editor: expEditor }
        ]
    });

    var tenantsEditor;
    tenantsEditor = new $.fn.dataTable.Editor({
        "idSrc": "id",
        "table": "#tenants_udpate_list",
        "fields": [{
                "label": "Nane",
                "name": "tenant_name"
            },
            {
                "label": "GLA",
                "name": "leased_space"
            }

        ]
    });

    $('#tenants_udpate_list').DataTable({
        ajax: "/tenants_data_edit",
        // paging: false,
        dom: 'Bfrtip',
        columns: [
            { "data": "tenant_name", "title": "Name" },
            { "data": "leased_space", "title": "GLA" },
        ],

        select: true,
        buttons: [
            { extend: "create", editor: tenantsEditor },
            { extend: "edit", editor: tenantsEditor },
            { extend: "remove", editor: tenantsEditor }
        ]
    });
    


    $("#rent_tnt_btn").on('click', function()  {
        jsBldgData['tenants'] = makeTenantArray('#tenants_udpate_list');
        console.log("tenant btn pressed");
        var tenentsdata = {};
        var table = $('#tenants_udpate_list').DataTable();
        tenantnamedata = table.row({ selected: true }).data();
        var rowsdata = table.rows().data();
        var tenantarray = [];
        for (var i = 0; i < rowsdata.length; i++) {
            tenantarray[i] = rowsdata[i];
        };
        console.log("tenant array");
        console.log(tenantarray)
        console.log(String(tenantnamedata.tenant_name));
        $('#rent_update h5').html("Tenant: " + String(tenantnamedata.tenant_name));

     
        $('#tenants_update').hide();
        $('#rent_update').show();
        $('#editform_bottom_btns').hide();

        

        // build rent table


        var rentsEditor;
        rentsEditor = new $.fn.dataTable.Editor({
            "idSrc": "id",
            "table": "#rent_list",
            "fields": [{
                    "label": "Start date",
                    "name": "start_date",
                    "type": 'datetime',
                    "def": function() { return new Date(); }
                },
                {
                    "label": "End date",
                    "name": "end_date",
                    "type": 'datetime',
                    "def": function() { return new Date(); }
                },
                {
                    "label": "monthly rent",
                    "name": "monthly_rent"
                }

            ]
        });

        rentDataTable = $('#rent_list').DataTable({
            // ajax: "/tenants_data",
            data: tenantnamedata['rents'] ,
            paging: false,
            dom: 'Bfrtip',
            columns: [
                { "data": "start_date", "title": "Start Date" },
                { "data": "end_date", "title": "End Date" },
                { "data": "monthly_rent", "title": "Monthly Rent" },
            ],
            "destroy": true,
            select: true,
            buttons: [
                { extend: "create", editor: rentsEditor },
                { extend: "edit", editor: rentsEditor },
                { extend: "remove", editor: rentsEditor }
            ]
        });
    });

    $('#rentexit').on('click', function() {
       console.log("hit rent exit button");
        $('#tenants_update').show();
        $('#rent_update').hide();
        $('#bldg_edit_tabs').show();
        $('#editform_bottom_btns').show();
        rentDataTable.clear().draw();


    });

    $('#rentsave').on('click', function() {
        var rowsdata = rentDataTable.rows().data();
        console.log(rowsdata);
        var tenantName = tenantnamedata.tenant_name;
        console.log("1. tenant is " + tenantName);
        if (jsBldgData['tenants'] != []) {
            console.log("there are tenants");
            for (i = 0; i < jsBldgData['tenants'].length; i++) {
                console.log(i);
                if (jsBldgData['tenants'][i]['tenant_name'] === tenantnamedata.tenant_name) {
                    console.log("2. tenant is " + tenantName);
                    var rentrow = [];
                    // Strip circular references
                    for (j = 0; j < rowsdata.length; j++) {
                        console.log("striping data");
                        rentrow[j] = rowsdata[j]
                    };
                    console.log("rows data");
                    console.log(JSON.stringify(rentrow));
                    jsBldgData['tenants'][i]['rents'] = rentrow;
                };
            }
            console.log("updated tenant");
            console.log(JSON.stringify(jsBldgData));
        }
        else {
            jsBldgData['tenants'][0]['tenant_name'] = tenantName;
            // need a loop, clear out garbage/
            var rentrow = [];
            for (i = 0; i < rowsdata.length; i++) {
                rentrow[i] = rowsdata[i];
            };
            jsBldgData['tenants'][0]['rents'] = rentrow;
            console.log("new tenant");
            console.log(JSON.stringify(jsBldgData));
            rentDataTable.draw();
        };
        console.log("updating buttons...");
        $('#tenants').show();
        $('#rent').hide();
        $('#bldg_edit_tabs').show();
        $('#editform_bottom_btns').show();
        rentDataTable.draw();
    });
    
    

  $("#exp_formsave").on('click', function() {
   
    jsBldgData['expense'] = makeTenantArray('#exp_update_list');
    console.log("save exp btn");
    console.log(JSON.stringify(jsBldgData));
    $.ajax({
      url: "/exp_update/data",
      data: JSON.stringify(jsBldgData),
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      success: function() {
        console.log("success");
      }
    });
  })

  $("#exp_formsave_exit").on('click', function() {
   
    jsBldgData['expense'] = makeTenantArray('#exp_update_list');
    console.log("save exp exit btn");
    console.log(JSON.stringify(jsBldgData));
    $.ajax({
      url: "/exp_update/data",
      data: JSON.stringify(jsBldgData),
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      success: function() {
        window.location.href = "/";
      }
    });
   
  })
  

  $("#cap_formsave").on('click', function() {
   
    jsBldgData['improvements'] = makeTenantArray('#cap_update_list');
    console.log("save cap btn");
    console.log(JSON.stringify(jsBldgData));
    $.ajax({
      url: "/cap_update/data",
      data: JSON.stringify(jsBldgData),
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      success: function() {
        console.log("success");
      }
    });
  })

  $("#cap_formsave_exit").on('click', function() {
   
    jsBldgData['improvements'] = makeTenantArray('#cap_update_list');
    console.log("save cap exit  btn");
    console.log(JSON.stringify(jsBldgData));
    $.ajax({
      url: "/cap_update/data",
      data: JSON.stringify(jsBldgData),
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      success: function() {
        window.location.href = "/";
      }
    });
   
  })
  
   $("#tenants_formsave").on('click', function() {
   
    jsBldgData['tenants'] = makeTenantArray('#tenants_udpate_list');
    console.log("save tenants btn");
    console.log(JSON.stringify(jsBldgData));
    $.ajax({
      url: "/tenants_update/data",
      data: JSON.stringify(jsBldgData),
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      success: function() {
        console.log("success");
      }
    });
  })
  
   $("#tenants_formsave_exit").on('click', function() {
   
    jsBldgData['tenants'] = makeTenantArray('#tenants_udpate_list');
    console.log("save tenants btn");
    console.log(JSON.stringify(jsBldgData));
    $.ajax({
      url: "/tenants_update/data",
      data: JSON.stringify(jsBldgData),
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      success: function() {
        window.location.href = "/";
      }
    });
   
  })
  
  
    // $("#rent_tnt_btn").on('click', function()  {
    //     jsBldgData['tenants'] = makeTenantArray('#tenants_list');
    //     console.log("tenant btn pressed");
    //     var tenentsdata = {};
    //     var table = $('#tenants_list').DataTable();
    //     tenantnamedata = table.row({ selected: true }).data();
    //     var rowsdata = table.rows().data();
    //     var tenantarray = [];
    //     for (var i = 0; i < rowsdata.length; i++) {
    //         tenantarray[i] = rowsdata[i];
    //     };
    //     console.log(tenantarray);
    //     console.log(String(tenantnamedata.tenant_name));
    //     $('#rent_update h5').html("Tenant: " + String(tenantnamedata.tenant_name));

     
    //     $('#tenants_update').hide();
    //     $('#rent_update').show();
    //     $('#editform_bottom_btns').hide();

        

    //     // build rent table


    //     var rentsEditor;
    //     rentsEditor = new $.fn.dataTable.Editor({
    //         "idSrc": "id",
    //         "table": "#rent_list",
    //         "fields": [{
    //                 "label": "Start date",
    //                 "name": "start_date",
    //                 "type": 'datetime',
    //                 "def": function() { return new Date(); }
    //             },
    //             {
    //                 "label": "End date",
    //                 "name": "end_date",
    //                 "type": 'datetime',
    //                 "def": function() { return new Date(); }
    //             },
    //             {
    //                 "label": "monthly rent",
    //                 "name": "monthly_rent"
    //             }

    //         ]
    //     });

    //     rentDataTable = $('#rent_list').DataTable({
    //         // ajax: "/tenants_data",
    //         data: tenantnamedata['rents'] ,
    //         paging: false,
    //         dom: 'Bfrtip',
    //         columns: [
    //             { "data": "start_date", "title": "Start Date" },
    //             { "data": "end_date", "title": "End Date" },
    //             { "data": "monthly_rent", "title": "Monthly Rent" },
    //         ],
    //         "destroy": true,
    //         select: true,
    //         buttons: [
    //             { extend: "create", editor: rentsEditor },
    //             { extend: "edit", editor: rentsEditor },
    //             { extend: "remove", editor: rentsEditor }
    //         ]
    //     });
    // });

    // $('#rentexit').on('click', function() {
    //   console.log("hit rent exit button");
    //     $('#tenants_update').show();
    //     $('#rent_update').hide();
    //     $('#bldg_edit_tabs').show();
    //     $('#editform_bottom_btns').show();
    //     rentDataTable.clear().draw();


    // });

    // $('#rentsave').on('click', function() {
    //     var rowsdata = rentDataTable.rows().data();
    //     console.log(rowsdata);
    //     var tenantName = tenantnamedata.tenant_name;
    //     console.log("1. tenant is " + tenantName);
    //     if (jsBldgData['tenants'] != []) {
    //         console.log("there are tenants");
    //         for (i = 0; i < jsBldgData['tenants'].length; i++) {
    //             console.log(i);
    //             if (jsBldgData['tenants'][i]['tenant_name'] === tenantnamedata.tenant_name) {
    //                 console.log("2. tenant is " + tenantName);
    //                 var rentrow = [];
    //                 // Strip circular references
    //                 for (j = 0; j < rowsdata.length; j++) {
    //                     console.log("striping data");
    //                     rentrow[j] = rowsdata[j]
    //                 };
    //                 console.log("rows data");
    //                 console.log(JSON.stringify(rentrow));
    //                 jsBldgData['tenants'][i]['rents'] = rentrow;
    //             };
    //         }
    //         console.log("updated tenant");
    //         console.log(JSON.stringify(jsBldgData));
    //     }
    //     else {
    //         jsBldgData['tenants'][0]['tenant_name'] = tenantName;
    //         // need a loop, clear out garbage/
    //         var rentrow = [];
    //         for (i = 0; i < rowsdata.length; i++) {
    //             rentrow[i] = rowsdata[i];
    //         };
    //         jsBldgData['tenants'][0]['rents'] = rentrow;
    //         console.log("new tenant");
    //         console.log(JSON.stringify(jsBldgData));
    //         rentDataTable.draw();
    //     };
    //     console.log("updating buttons...");
    //     $('#tenants').show();
    //     $('#rent').hide();
    //     $('#bldg_edit_tabs').show();
    //     $('#editform_bottom_btns').show();
    //     rentDataTable.draw();
    // });
    

});
