/* global jasmine 
   global beforeAll
   global loadFixtures
   global expect
   global map
   global $
   global createMarker
*/
describe('Google Map', function(){
    describe('Loading', function(){
        
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 11000;

        beforeAll(function(done){
            loadFixtures('main-fixture.html');
            setTimeout(function() {   
                done();
            }, 5000);
        });

        
        it('should be able to load google map', function(){
            // we expect map variable not to be null
            expect(map).not.toBeNull();
            // we expect map variable to have at least one children
            expect($('#map').children.length).toBeGreaterThanOrEqual(1);
        });
        describe('Create marker', function(){
        it('should be able to create marker', function(){
            // loadFixtures('text-search-fixture.html');
            let marker = createMarker({
                geometry: {
                    lat: 103,
                    lng: 43
                }
            })
            expect(marker).toBeDefined();
            expect(marker).not.toBeNull();
            
        });
        
        }) 
        
    });
})