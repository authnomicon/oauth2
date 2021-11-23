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
      
      it('should load transaction', function(done) {
        var req = new Object();
        req.state = {
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          request: {
            type: 'code',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com/cb',
            state: 'xyz'
          }
        };
        
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
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
              state: 'xyz'
            }
          });
          done();
        });
      }); // should load transaction
      
      it('should error when state middleware is not in use', function(done) {
        var req = new Object();
        
        store.load(req, function(err, txn) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('OAuth 2.0 requires state support. Did you forget to use `flowstate` middleware?');
          expect(txn).to.be.undefined;
          done();
        });
      }); // should error when state middleware is not in use
      
    }); // #load
    
    
    describe('#store', function() {
      
      it('should push state', function(done) {
        var req = new Object();
        req.headers = {};
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
            state: 'xyz'
          },
        };
        
        store.store(req, txn, function(err) {
          if (err) { return done(err); }
          
          expect(req.pushState).to.be.calledWithExactly({
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            request: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
              state: 'xyz'
            }
          }, '/oauth2/authorize/continue');
          done();
        });
      }); // should push state
      
      it('should push state with web origin', function(done) {
        var req = new Object();
        req.headers = {};
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
            type: 'token',
            responseMode: 'web_message',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com',
            state: 'xyz'
          },
        };
        
        store.store(req, txn, function(err) {
          if (err) { return done(err); }
          
          expect(req.pushState).to.be.calledWithExactly({
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            webOrigin: 'https://client.example.com',
            request: {
              type: 'token',
              responseMode: 'web_message',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com',
              state: 'xyz'
            }
          }, '/oauth2/authorize/continue');
          done();
        });
      }); // should push state with web origin
      
    }); // #store
    
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
        
        store.update(req, 'XXXXXXXX', txn, function(err) {
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
          
      }); // storing transaction
      
    }); // #update
    
  }); // TransactionStore
  
});
