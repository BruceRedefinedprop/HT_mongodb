// blddgedit.js is used with bldg_edit_form.html to create a new doucment.
// builds datatables, formats dato for MongodB, uses ajax save data.


// GLOBALVARIABLES
// used to create editable DataTable
var editor;  
var rentDataTable;
var tenantnamedata;
// jsBldgData is used to build a MongDb building document.
var jsBldgData = {};  



// Function to retrieves and reformat DataTable output to compatible 
// MongoDb.  Each DataTable record includes extra dictionary elements
// above and beyond data we need to collect.   Extra elements causes JSON to fail.
 
function makeTenantArray(targetID) {
  // build template object
  // get Table rows
  var table = $(targetID).DataTable();
  var rowsdata = table.rows().data();
  var array = [];
  for (var i = 0; i < rowsdata.length; i++) { array[i] = rowsdata[i]; };
  return array;
};

// used by the save_data(). Collects data from info page.
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

// used by the save_data(). Collects data from acquisition page.

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

// saves all the data to jsBlddgData object. 
// jsBldgData is sent to main.py via AJAX to add to the building Collection.
// makeTenantArray retrieves data from the designated Datatable and reformats it
// for MongoDb.
function save_data() {
  jsBldgData['tenants'] = makeTenantArray('#tenants_list');
  jsBldgData['expense'] = makeTenantArray('#expense_list');
  jsBldgData['improvements'] = makeTenantArray('#cap_list');
  info_data();  
  acquisition_data();
  console.log("make array");
  console.log(JSON.stringify(jsBldgData));

};

$(document).ready(function() {

// puts bldgData record into hidden html input tag.
  var bldgData = $('#editbldgdata').val();
  console.log("building data loaded")
  console.log(bldgData)
// display info tab info only.
  $('#infoTab').on('click', function() {
    $('#info').css('display', 'block');
    $('#purchase').css('display', 'none');
    $('#tenants').css('display', 'none');
    $('#rent').css('display', 'none');
    $('#expenses').css('display', 'none');
    $('#capital').css('display', 'none');
  })
// display acqusition tab data only
  $('#purchaseTab').on('click', function() {
    $('#info').hide();
    $('#purchase').show();
    $('#tenants').css('display', 'none');

    $('#rent').css('display', 'none');
    $('#expenses').css('display', 'none');
    $('#capital').css('display', 'none');
  })
// displays tenants tab only.  Also, hidding rent data.
  $('#tenantsTab').on('click', function() {
    $('#info').hide();
    $('#purchase').hide();
    $('#tenants').show();

    $('#rent').hide()
    $('#expenses').css('display', 'none');
    $('#capital').css('display', 'none');
  })
// displays expense tab data only.
  $('#expenseTab').on('click', function() {
    $('#info').hide();
    $('#purchase').hide();
    $('#tenants').hide();

    $('#rent').css('display', 'none');
    $('#expenses').show();
    $('#capital').css('display', 'none');
  })
// display capital tab data only.
  $('#capitalTab').on('click', function() {
    $('#info').hide();
    $('#purchase').hide();
    $('#tenants').hide();

    $('#rent').css('display', 'none');
    $('#expenses').hide();
    $('#capital').show();
  })

// builds capital DataTables and Editor
// data is retrieved from main.py via AJAX
// See DataTable documentation for configuration data.
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

// builds tenants DataTable
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


// builds expense DataTable
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

// when edit rent button pressed on the the tenants tab.
// tenant form is hiddened and rent Datatable is built.
// user has the option to save rent data or return to tenants table.

  $('#rent_tnt_btn').on('click', function() {
    // retrieve selected tenant data
    var tenentsdata = {};
    var table = $('#tenants_list').DataTable();
    tenantnamedata = table.row({ selected: true }).data();
    // store whole tenant table data so it can be rebuilt.
    var rowsdata = table.rows().data();
    // remove extra DataTable info, keep needed data
    var tenantarray = [];
    for (var i = 0; i < rowsdata.length; i++) {
      tenantarray[i] = rowsdata[i];
    };
    console.log(tenantarray);
    console.log(String(tenantnamedata.tenant_name));
// reformat web page to show only rent table
    $('#info').hide();
    $('#purchase').hide();
    $('#tenants').hide();
    $('#rent').show()
    $('#expenses').css('display', 'none');
    $('#capital').css('display', 'none');
    $('#bldg_edit_tabs').hide()
    $('#editform_bottom_btns').hide()


// displays selected tenant's name on rent tab.
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
// creates blank rent table.
    rentDataTable = $('#rent_list').DataTable({
      // ajax:,
      // paging: false,
      // data:  ,
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

// When Rent Exit button is pressed, rent table is cleared and hidden
// tenant tab is presented.
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

// When Rent Save button is pressed, Rent data is saved to
// JsBldgData's tenants list. the tenant list keeps rents objects.
// 
  $('#rentsave').on('click', function() {
    // saves the contents of rent DataTable.
    var rowsdata = rentDataTable.rows().data();
    // test code to verify that rent data for specific tenant collected.
    console.log(rowsdata);
    var tenantName = tenantnamedata.tenant_name;
    console.log("1. tenant is " + tenantName);
    
    if (jsBldgData['tenants'] != []) {
      // Stores rent data into previously selected tenant
      console.log("there are tenants");
      for (i = 0; i < jsBldgData['tenants'].length; i++) {
        console.log(i);
        // searches for matching tenant and stores new rent into array
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
          // stores rent into selected table
          jsBldgData['tenants'][i]['rents'] = rentrow;
        };
      }
      // test code
      console.log("updated tenant");
      console.log(JSON.stringify(jsBldgData))
    }
    else {
      // inserts blank rent into first tenants tenant position
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
    // restores tenant page, draws empty rent table for future use.
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

// Save button controls.  Saves data to jsBldgData object
  $("#newbldgSaveBtn").on('click', function() {
    save_data();
    
// Old test code
    // jsBldgData['tenants']  = makeTenantArray('#tenants_list');
    // jsBldgData['expense']  = makeTenantArray('#expense_list');
    // jsBldgData['improvements']  = makeTenantArray('#cap_list');
    // info_data();  // load building info to jsBldgData
    // acquisition_data();
    // console.log("make array");
    // console.log(JSON.stringify(jsBldgData));

  });
// Saves Data and uses AJAX to main.py.
// main.py stores inserts new record into MongoDb's building collection.
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
