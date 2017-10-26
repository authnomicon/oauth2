/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/handlers/authorize/processtransaction');


describe('http/handlers/authorize/processtransaction', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('processTransaction', function() {
    
    describe('that requires login', function() {
      function service(txn) {
        txn.prompt('login');
      }
      serviceSpy = sinon.spy(service);
    
      var allow, info;
      before(function(done) {
        var txn = {
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client',
            redirectURIs: [
              'https://client.example.com/cb'
            ]
          },
          redirectURI: 'https://client.example.com/cb',
          req: {
            type: 'code',
            clientID: 's6BhdRkqt3'
          }
        }
      
        var processTransaction = factory(serviceSpy);
        processTransaction(txn, function(e, a, i) {
          if (e) { return done(e); }
          allow = a;
          info = i;
          done();
        });
      });
      
      it('should now allow authorization', function() {
        expect(allow).to.equal(false);
      });
      
      it('should prompt', function() {
        expect(info).to.deep.equal({ prompt: 'login' });
      });
    });
  });
  
});
