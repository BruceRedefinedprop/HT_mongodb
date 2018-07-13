describe("Test building list table", function() {

    beforeEach(function() {
        // build Datatable, create test fixture and call program to set up table
        setFixtures('<div class="table_container"><table id="bldg_list_test" class="display" style="width:70%"></table></div>');
        build_list_table ()  
        var data = get_bldg_list_data ()
        
    });

    describe("See if Table exists with 3 rows", function() {
        it("create a table", function() {
            var array = $('#bldg_list_test tbody tr').length
            expect(array).toBe(3);
        });
    });
    // Test is we retrieve the first item of the table, created in the previous test.  
    // The data is defined bldg_list_test.js and the order of list is preserved by DataTables.
    describe("See if data can retrieved from table", function() {
        it("get row data", function() {
            var data = get_bldg_list_data ();
            expect(data).toBe("Park Place");
        });
    });
});


describe("Test building Edit forms", function() {
    beforeEach(function() {
        // setFixtures('<div class="input-field col s12"><input id="bldg_name_test" name="bldg_name" type="text" value= ""><label>Property name</label></div>'); 
        loadFixtures('testfixture.html')
        test_bldg = {};   
        $("#bldg_name_test").val("railroad flats");        
    });
    
    
    describe("retrieve form data", function() {
        it("get building name", function() {
            var data = get_bldg_name();
            expect(data).toBe("railroad flats")
            });
    });
    
});



