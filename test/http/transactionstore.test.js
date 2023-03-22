var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/http/transactionstore');
var TransactionStore = require('../../lib/transactionstore');


describe('transactionstore', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('should construct TransactionStore', function() {
    var TransactionStoreSpy = sinon.spy(TransactionStore);
    var factory = $require('../../com/http/transactionstore', {
      '../../lib/transactionstore': TransactionStoreSpy
    });
    
    var store = factory();
  
    expect(TransactionStoreSpy).to.have.been.calledOnce;
    expect(TransactionStoreSpy).to.have.been.calledWithNew;
    expect(store).to.be.an.instanceOf(TransactionStore);
  }); // creating with defaults
  
  
  describe('TransactionStore', function() {
    var store = new TransactionStore();
    
    describe('#update', function() {
      
      it('updating transaction', function(done) {
        var req = new Object();
        req.state = new Object();
        
        var txn = {
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          req: {
            type: 'code',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.org/cb',
            state: 'af0ifjsldkj'
          }
        };
        
        store.update(req, undefined, txn, function(err) {
          if (err) { return done(err); }
          
          expect(req.state).to.deep.equal({
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            request: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.org/cb',
              state: 'af0ifjsldkj'
            }
          });
          done();
        });
          
      }); // updating transaction
      
    }); // #update
    
  }); // TransactionStore
  
});
