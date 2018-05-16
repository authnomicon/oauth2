/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/handlers/authorize/processtransaction');
var EventEmitter = require('events').EventEmitter;


describe('http/handlers/authorize/processtransaction', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/oauth2/http/authorize/processTransactionFunc');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('processTransaction', function() {
    var aaa = {
      request: function(){}
    }
    
    
    describe('that requires login', function() {
      var allow, info;
      
      before(function() {
        var dreq = new EventEmitter();
        var dec = new EventEmitter();
        dreq.send = function() {
          process.nextTick(function() {
            dec.emit('prompt', 'login');
            dec.emit('end');
          });
        };
        
        sinon.stub(aaa, 'request').returns(dreq).yields(dec);
      });
      
      after(function() {
        aaa.request.restore();
      });
      
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
      
        var processTransaction = factory(aaa);
        processTransaction(client, undefined, areq.scope, areq.type, areq, undefined, function(err, a, i) {
          if (err) { return done(err); }
          allow = a;
          info = i;
          done();
        });
      });
      
      it('should not allow', function() {
        expect(allow).to.equal(false);
      });
      
      it('should prompt', function() {
        expect(info).to.deep.equal({ prompt: 'login' });
      });
    }); // that requires login
    
  }); // processTransaction
  
});
