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
    var store = new TransactionStore();
    
    
    describe('#store', function() {
      
      describe('storing transaction', function(done) {
        var req = new Object();
        req.state = new Object();
        
        before(function(done) {
          var txn = {
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              redirectURIs: [ 'https://client.example.com/cb' ]
            },
            redirectURI: 'https://client.example.com/cb',
            req: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
              scope: undefined,
              state: 'xyz'
            },
          };
          
          store.store(req, txn, function(err) {
            if (err) { return done(err); }
            done();
          });
        });
        
        it('should set state', function() {
          expect(req.state).to.deep.equal({
            responseType: 'code',
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            scope: undefined,
            state: 'xyz'
          })
        });
        
      }); // storing transaction
      
    }); // #store
    
  }); // TransactionStore
  
});
