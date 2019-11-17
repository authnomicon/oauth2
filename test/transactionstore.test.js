var expect = require('chai').expect;
var factory = require('../app/transactionstore');
var TransactionStore = require('../lib/transactionstore');


describe('transactionstore', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('factory', function() {
  
    it('should construct TransactionStore', function() {
      var store = factory(function serializeClient(){}, function deserializeClient(){});
      expect(store).to.be.an.instanceOf(TransactionStore);
    });
    
  }); // factory
  
  describe('TransactionStore', function() {
    
    describe('#store', function() {
      var store = factory(function serializeClient(){}, function deserializeClient(){});
      
      it('should do something', function(done) {
        var req = new Object();
        req.state = new Object();
        req.state.complete = function(){};
        req.state.touch = function(){};
        
        store.store(req, null, function(err) {
          console.log('SAVED!');
          console.log(err);
          
          console.log(req.state);
          
          done();
          
          //if (err) done(err);
          //else done();
        });
      });
    }); // #store
    
  }); // TransactionStore
  
});
