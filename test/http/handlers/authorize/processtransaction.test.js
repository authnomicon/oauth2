/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/handlers/authorize/processtransaction');


describe('http/handlers/authorize/processtransaction', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/oauth2/http/authorize/processTransactionFunc');
  });
  
  describe('processTransaction', function() {
    
    describe.skip('that requires login', function() {
      function service(req, txn) {
        txn.prompt('login');
      }
      serviceSpy = sinon.spy(service);
    
      var allow, info;
      before(function(done) {
        var client = {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb'
          ]
        };
        var areq = {
          type: 'code',
          clientID: 's6BhdRkqt3'
        };
      
        var processTransaction = factory(serviceSpy);
        processTransaction(client, undefined, areq.scope, areq.type, areq, undefined, function(e, a, i) {
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
