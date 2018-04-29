

var editor;


$(document).ready(function() {
    
    $('#infoTab').on( 'click',    function()  {
        $('#info').css('display', 'block');
        $('#purchase').css('display', 'none');
        $('#tenants').css('display', 'none');
        $('#rent').css('display', 'none');
        $('#expenses').css('display', 'none');
        $('#capital').css('display', 'none');
})

    $('#purchaseTab').on('click',    function() {
            $('#info').hide();
            $('#purchase').show();
            $('#tenants').css('display', 'none');
            
            $('#rent').css('display', 'none');
            $('#expenses').css('display', 'none');
            $('#capital').css('display', 'none');
        })
        
    $('#tenantsTab').on('click',    function() {
            $('#info').hide();
            $('#purchase').hide();
            $('#tenants').show();
            
            $('#rent').show()
            $('#expenses').css('display', 'none');
            $('#capital').css('display', 'none');
        })
        
    $('#expenseTab').on('click',    function() {
            $('#info').hide();
            $('#purchase').hide();
            $('#tenants').hide();
            
            $('#rent').css('display', 'none');
            $('#expenses').show();
            $('#capital').css('display', 'none');
        })
        
    $('#capitalTab').on('click',    function() {
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
        {
            "targets": -1,
            "data": null,
            "defaultContent": "<button>Rent</button>"
        }
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


    
});
