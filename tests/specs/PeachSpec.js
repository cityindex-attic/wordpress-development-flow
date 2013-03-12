describe('test migration', function () {
    
    describe('test char int (domain character difference)', function () {
        it('should equal 45', function () {
            var peach = PEACH.migrate('the haystack does not matter now', 'http://test.com', 'http://test12345.com', null);
            peach._set_char_diff();
            expect(peach._new_char_int('40')).toEqual(45);
        });
        it('should equal 40', function () {
            var peach = PEACH.migrate('the haystack does not matter now', 'http://test.com', 'http://test.com', null);
            peach._set_char_diff();
            expect(peach._new_char_int('40')).toEqual(40);
        });
    });
});
