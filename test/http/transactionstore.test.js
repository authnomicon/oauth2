var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/http/transactionstore');
var TransactionStore = require('../../lib/transactionstore');


describe('transactionstore', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('creating with defaults', function() {
    var TransactionStoreSpy = sinon.spy(TransactionStore);
    var factory = $require('../../app/http/transactionstore',
      { '../../lib/transactionstore': TransactionStoreSpy });
  
    var store = factory();
  
    it('should construct store', function() {
      expect(TransactionStoreSpy).to.have.been.calledOnce;
      expect(TransactionStoreSpy).to.have.been.calledWithNew;
    });
  
    it('should return store', function() {
      expect(store).to.be.an.instanceOf(TransactionStore);
    });
  }); // creating with defaults
  
  describe('TransactionStore', function() {
    function serializeClient(client, cb){
      return cb(null, client.id);
    }
    
    
    describe('#store', function() {
      var store = factory(serializeClient, function deserializeClient(){});
      
      it('should do something', function(done) {
        var req = new Object();
        req.state = {};
        //req.state = new Object();
        //req.state.complete = function(){};
        //req.state.touch = function(){};
        
        var txn = {
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client',
            redirectURIs: [ 'https://client.example.org/callback' ]
          },
          redirectURI: 'https://client.example.org/callback',
        };
        
        
        store.store(req, txn, function(err) {
          console.log('SAVED!');
          console.log(err);
          
          console.log(req.state);
          
          expect(req.state).to.deep.equal({
            client: {
              id: 's6BhdRkqt3'
            },
            redirectURI: 'https://client.example.org/callback',
            req: undefined
          })
          
          done();
          
          //if (err) done(err);
          //else done();
        });
      });
    }); // #store
    
  }); // TransactionStore
  
});
