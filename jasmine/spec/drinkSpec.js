describe("drink", function() {
    describe("less than 0", function() {
        it("Sorry. I can’t tell what drink because that age is incorrect!", function() {
            expect(drink(0)).toBe("Sorry. I can’t tell what drink because that age is incorrect!");
        });
    });
    
    describe("50 year old", function() {
        it("drink whisky!", function() {
            expect(drink(50)).toBe("Drink Whisky");
        });
    });
});
    