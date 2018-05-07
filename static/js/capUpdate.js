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
        ajax: "/cap_data_edit",
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


});
