var expect = require('chai').expect;
var sinon = require('sinon');
var TransactionStore = require('../../lib/transactionstore');

describe('TransactionStore', function() {
  var store = new TransactionStore();
  
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
  
});
