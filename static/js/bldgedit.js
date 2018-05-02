var editor;
var rentDataTable;
var tenantnamedata;
var jsBldgData = {};

// jsBldgData['tenants'] = [];
// jsBldgData['tenants'][0] = { 'tenant_name' : 'Stan' , 'leased_space' : '', 'rents' : [] };
// jsBldgData['tenants'][0] = { 'tenant_name' : 'Auto' , 'leased_space' : '', 'rents' : [] };
// jsBldgData['tenants'][0] = {};
// jsBldgData['tenants'][0]['rents'] = [];

// function makeTenantArray() {
//     // build template object
//     // get Table rows
//     var table = $('#tenants_list').DataTable();
//     var rowsdata = table.rows().data();
//     // DataTable is a list that has lots of extra stuff appended to list, that confuses to JSON.
//     // target object starts index 0, remove extra stuff list.
//     var array = [];
//     for (var i = 0; i < rowsdata.length; i++) {array[i] = rowsdata[i];};
//     return array; 
//   };
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

function info_data() {
  jsBldgData['name'] = $('#bldg_name').val();
  jsBldgData['street'] = $('#bldg_street').val();
  jsBldgData['town'] = $('#bldg_town').val();
  jsBldgData['st'] = $('#bldg_st').val();
  jsBldgData['zip'] = $('#bldg_zip').val();
  jsBldgData['page'] = $('#bldg_page').val();
  jsBldgData['lot'] = $('#bldg_lot').val();
  jsBldgData['block'] = $('#bldg_block').val();
  jsBldgData['gla'] = $('#bldg_gla').val();
  jsBldgData['type'] = $('#bldg_type option:selected').text();

  jsBldgData['land'] = $('#bldg_land').val();
};

function acquisition_data() {
  jsBldgData['contract_price'] = $('#bldg_price').val();
  jsBldgData['noi'] = $('#bldg_noi').val();
  jsBldgData['cap'] = $('#bldg_cap').val();
  jsBldgData['bank'] = $('#bldg_bank').val();
  jsBldgData['ltv'] = $('#bldg_ltv').val();
  jsBldgData['loan_amount'] = $('#bldg_loan_amt').val();
  jsBldgData['loan_term'] = $('#bank_loan_term').val();
  jsBldgData['amort'] = $('#bank_loan_amort').val();
};

function save_data() {
  jsBldgData['tenants'] = makeTenantArray('#tenants_list');
  jsBldgData['expense'] = makeTenantArray('#expense_list');
  jsBldgData['improvements'] = makeTenantArray('#cap_list');
  info_data(); // load building info to jsBldgData
  acquisition_data();
  console.log("make array");
  console.log(JSON.stringify(jsBldgData));

};

$(document).ready(function() {

  var bldgData = $('#editbldgdata').val();
  console.log("building data loaded")
  console.log(bldgData)

  $('#infoTab').on('click', function() {
    $('#info').css('display', 'block');
    $('#purchase').css('display', 'none');
    $('#tenants').css('display', 'none');
    $('#rent').css('display', 'none');
    $('#expenses').css('display', 'none');
    $('#capital').css('display', 'none');
  })

  $('#purchaseTab').on('click', function() {
    $('#info').hide();
    $('#purchase').show();
    $('#tenants').css('display', 'none');

    $('#rent').css('display', 'none');
    $('#expenses').css('display', 'none');
    $('#capital').css('display', 'none');
  })

  $('#tenantsTab').on('click', function() {
    $('#info').hide();
    $('#purchase').hide();
    $('#tenants').show();

    $('#rent').hide()
    $('#expenses').css('display', 'none');
    $('#capital').css('display', 'none');
  })

  $('#expenseTab').on('click', function() {
    $('#info').hide();
    $('#purchase').hide();
    $('#tenants').hide();

    $('#rent').css('display', 'none');
    $('#expenses').show();
    $('#capital').css('display', 'none');
  })

  $('#capitalTab').on('click', function() {
    $('#info').hide();
    $('#purchase').hide();
    $('#tenants').hide();

    $('#rent').css('display', 'none');
    $('#expenses').hide();
    $('#capital').show();
  })


  var capEditor;
  capEditor = new $.fn.dataTable.Editor({
    "idSrc": "id",
    "table": "#cap_list",
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

  $('#cap_list').DataTable({
    ajax: "/cap_data",
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


  var tenantsEditor;
  tenantsEditor = new $.fn.dataTable.Editor({
    "idSrc": "id",
    "table": "#tenants_list",
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

  $('#tenants_list').DataTable({
    ajax: "/tenants_data",
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



  var expenseEditor;
  expenseEditor = new $.fn.dataTable.Editor({
    "idSrc": "id",
    "table": "#expense_list",
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

  $('#expense_list').DataTable({
    ajax: "/expense_data",
    // paging: false,
    dom: 'Bfrtip',
    columns: [
      { "data": "exp_cat", "title": "Category" },
      { "data": "exp_amount", "title": "Amount" },
      { "data": "exp_growth", "title": "Annual Growth" }

    ],
    select: true,
    buttons: [
      { extend: "create", editor: expenseEditor },
      { extend: "edit", editor: expenseEditor },
      { extend: "remove", editor: expenseEditor }
    ]
  });

  $('#rent_tnt_btn').on('click', function() {
    var tenentsdata = {};
    var table = $('#tenants_list').DataTable();
    tenantnamedata = table.row({ selected: true }).data();
    var rowsdata = table.rows().data();
    var tenantarray = [];
    for (var i = 0; i < rowsdata.length; i++) {
      tenantarray[i] = rowsdata[i];
    };
    console.log(tenantarray);
    console.log(String(tenantnamedata.tenant_name));

    $('#info').hide();
    $('#purchase').hide();
    $('#tenants').hide();
    $('#rent').show()
    $('#expenses').css('display', 'none');
    $('#capital').css('display', 'none');
    $('#bldg_edit_tabs').hide()
    $('#editform_bottom_btns').hide()



    $('#rent h5').html("Tenant: " + String(tenantnamedata.tenant_name))

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
      // paging: false,
      // data: jsBldgData['tenants'][0]['rents'] ,
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
    $('#info').hide();
    $('#purchase').hide();
    $('#tenants').show();
    $('#rent').hide();
    $('#expenses').css('display', 'none');
    $('#capital').css('display', 'none');
    $('#bldg_edit_tabs').show();
    $('#editform_bottom_btns').show();
    rentDataTable.clear().draw()


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
      console.log(JSON.stringify(jsBldgData))
    }
    else {
      // jsBldgData['tenants'] = [];
      // jsBldgData['tenants'][0] = {};
      jsBldgData['tenants'][0]['tenant_name'] = tenantName;
      // jsBldgData['tenants'][0]['rents'] = [];
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

    $('#info').hide();
    $('#purchase').hide();
    $('#tenants').show();
    $('#rent').hide();
    $('#expenses').css('display', 'none');
    $('#capital').css('display', 'none');
    $('#bldg_edit_tabs').show();
    $('#editform_bottom_btns').show();
    rentDataTable.clear().draw()
  });


  $("#newbldgSaveBtn").on('click', function() {
    save_data();

    // jsBldgData['tenants']  = makeTenantArray('#tenants_list');
    // jsBldgData['expense']  = makeTenantArray('#expense_list');
    // jsBldgData['improvements']  = makeTenantArray('#cap_list');
    // info_data();  // load building info to jsBldgData
    // acquisition_data();
    // console.log("make array");
    // console.log(JSON.stringify(jsBldgData));

  });

  $("#newbldgSaveExitBtn").on('click', function() {
    save_data();
    console.log("exit btn");
    console.log(JSON.stringify(jsBldgData));
    $.ajax({
      url: "/bldg_new/data",
      data: JSON.stringify(jsBldgData),
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      success: function() {
        window.location.href = "/";
      }
    });
  })





});
