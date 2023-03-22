var expect = require('chai').expect;
var sinon = require('sinon');
var TransactionStore = require('../../lib/transactionstore');

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
    
    it('should load transaction with web origin', function(done) {
      var req = new Object();
      req.state = {
        client: {
          id: 's6BhdRkqt3',
          name: 'My Example Client'
        },
        webOrigin: 'https://client.example.com',
        request: {
          type: 'token',
          responseMode: 'web_message',
          clientID: 's6BhdRkqt3',
          redirectURI: 'https://client.example.com',
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
          webOrigin: 'https://client.example.com',
          req: {
            type: 'token',
            responseMode: 'web_message',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com',
            state: 'xyz'
          }
        });
        done();
      });
    }); // should load transaction with web origin
    
    it('should load transaction with both redirect URI and web origin', function(done) {
      var req = new Object();
      req.state = {
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
      };
      
      store.load(req, function(err, txn) {
        if (err) { return done(err); }
        
        expect(txn).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          webOrigin: 'https://client.example.com',
          req: {
            type: 'token',
            responseMode: 'web_message',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com',
            state: 'xyz'
          }
        });
        done();
      });
    }); // should load transaction with both redirect URI and web origin
    
    it('should yield error when state middleware is not in use', function(done) {
      var req = new Object();
      
      store.load(req, function(err, txn) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('OAuth 2.0 requires state support. Did you forget to use `flowstate` middleware?');
        expect(txn).to.be.undefined;
        done();
      });
    }); // should yield error when state middleware is not in use
    
  }); // #load
  
  describe('#store', function() {
    
    it('should push state', function(done) {
      var req = new Object();
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
      req.pushState = sinon.spy();
      
      var txn = {
        client: {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          webOrigins: [ 'https://client.example.com' ]
        },
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
    
    it('should push state with redirect URI and web origin', function(done) {
      var req = new Object();
      req.pushState = sinon.spy();
      
      var txn = {
        client: {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          redirectURIs: [ 'https://client.example.com/cb' ],
          webOrigins: [ 'https://client.example.com' ]
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
    }); // should push state with redirect URI and web origin
    
  }); // #store
  
  describe('#update', function() {
    
    it('should continue state', function(done) {
      var req = new Object();
      req.state = new Object();
      Object.defineProperty(req.state, 'continue', {
        configurable: true,
        enumerable: false,
        value: sinon.spy(),
        writable: true
      });
      
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
        
        expect(req.state.continue).to.have.been.called;
        done();
      });
        
    }); // should continue state
    
  }); // #update
  
  describe('#remove', function() {
    
    it('should destroy state', function(done) {
      var req = new Object();
      req.state = new Object();
      Object.defineProperty(req.state, 'destroy', {
        configurable: true,
        enumerable: false,
        value: sinon.spy(function(cb) {
          process.nextTick(cb);
        }),
        writable: true
      });
      
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
      
      store.remove(req, undefined, function(err) {
        if (err) { return done(err); }
        
        expect(req.state.destroy).to.have.been.called;
        done();
      });
        
    }); // should destroy state
    
  }); // #remove
  
});
