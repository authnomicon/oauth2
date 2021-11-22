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
    
    describe('#load', function() {
      
      it('loading transaction', function(done) {
        var req = new Object();
        req.state = {
          responseType: 'code',
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          scope: undefined,
          state: 'xyz'
        };
        req.state.handle = 'XXXXXXXX';
        
        store.load(req, function(err, txn) {
          if (err) { return done(err); }
          
          expect(txn).to.deep.equal({
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            req: {
              type: 'code',
              scope: undefined,
              state: 'xyz'
            },
            locals: {
              issuer: undefined
            }
          });
          
          done();
        });
      }); // loading transaction
      
    }); // #load
    
    
    describe('#store', function() {
      
      it('storing transaction', function(done) {
        var req = new Object();
        req.headers = {};
        req.state = new Object();
        req.pushState = sinon.spy();
        
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
          
          expect(req.pushState).to.be.calledWith({
            issuer: 'undefined://undefined',
            responseType: 'code',
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            scope: undefined,
            state: 'xyz'
          });
          
          done();
        });
      }); // storing transaction
      
      it('storing transaction with web origin', function(done) {
        var req = new Object();
        req.headers = {};
        req.state = new Object();
        
        req.pushState = sinon.spy();
        
        var txn = {
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client',
            redirectURIs: [ 'https://client.example.com/cb' ]
          },
          redirectURI: 'https://client.example.com/cb',
          webOrigin: 'https://client.example.com',
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
          
          expect(req.pushState).to.be.calledWith({
            issuer: 'undefined://undefined',
            responseType: 'code',
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            webOrigin: 'https://client.example.com',
            scope: undefined,
            state: 'xyz'
          });
          
          done();
        });
      }); // storing transaction with web origin
      
    }); // #store
    
    describe('#update', function() {
      
      it('updating transaction', function(done) {
        var req = new Object();
        req.state = new Object();
        
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
        
        store.update(req, 'XXXXXXXX', txn, function(err) {
          if (err) { return done(err); }
          
          expect(req.state).to.deep.equal({
            responseType: 'code',
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            scope: undefined,
            state: 'xyz'
          });
          
          done();
        });
          
      }); // storing transaction
      
    }); // #update
    
  }); // TransactionStore
  
});
