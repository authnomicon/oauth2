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
    var resources = {
      infer: function(){}
    }
    var aaa = {
      request: function(){}
    }
    var ds = {
      get: function(){}
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
        
        sinon.stub(resources, 'infer').yields(null, '112210f47de98100');
        sinon.stub(aaa, 'request').returns(dreq).yields(dec);
        sinon.stub(ds, 'get').yields(null, { id: '112210f47de98100', identifier: 'https://api.example.com/', name: 'Example API' });
      });
      
      after(function() {
        ds.get.restore();
        aaa.request.restore();
        resources.infer.restore();
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
      
        var processTransaction = factory(resources, aaa, ds);
        processTransaction(client, undefined, areq.scope, areq.type, areq, undefined, function(err, a, i) {
          if (err) { return done(err); }
          allow = a;
          info = i;
          done();
        });
      });
      
      it('should infer resource', function() {
        expect(resources.infer.callCount).to.equal(1);
        expect(resources.infer.args[0][0]).to.equal(undefined);
        expect(resources.infer.args[0][1]).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb'
          ]
        });
      });
      
      it('should request authorization', function() {
        expect(aaa.request.callCount).to.equal(1);
        expect(aaa.request.args[0][0]).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client',
            redirectURIs: [
              'https://client.example.com/cb'
            ]
          },
          user: undefined,
          resource: {
            id: '112210f47de98100',
            identifier: 'https://api.example.com/',
            name: 'Example API'
          }
        });
      });
      
      it('should not allow', function() {
        expect(allow).to.equal(false);
      });
      
      it('should prompt', function() {
        expect(info).to.deep.equal({ prompt: 'login' });
      });
    }); // that requires login
    
    describe('that permits access', function() {
      var allow, info;
      
      before(function() {
        var dreq = new EventEmitter();
        var dec = new EventEmitter();
        dreq.send = function() {
          process.nextTick(function() {
            dec.emit('decision', true, [ 'read:foo', 'write:foo', 'write:bar' ]);
            dec.emit('end');
          });
        };
        
        sinon.stub(resources, 'infer').yields(null, 'https://api.example.com/');
        sinon.stub(aaa, 'request').returns(dreq).yields(dec);
        sinon.stub(ds, 'get').yields(null, { id: '112210f47de98100', identifier: 'https://api.example.com/', name: 'Example API' });
      });
      
      after(function() {
        ds.get.restore();
        aaa.request.restore();
        resources.infer.restore();
      });
      
      before(function(done) {
        var client = {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb'
          ]
        };
        var user = {
          id: '1',
          displayName: 'John Doe'
        };
        var areq = {
          type: 'code',
          clientID: 's6BhdRkqt3',
          scope: [ 'read:foo', 'write:foo', 'write:bar' ]
        };
      
        var processTransaction = factory(resources, aaa, ds);
        processTransaction(client, user, areq.scope, areq.type, areq, undefined, function(err, a, i) {
          if (err) { return done(err); }
          allow = a;
          info = i;
          done();
        });
      });
      
      it('should infer resource', function() {
        expect(resources.infer.callCount).to.equal(1);
        expect(resources.infer.args[0][0]).to.deep.equal([ 'read:foo', 'write:foo', 'write:bar' ]);
        expect(resources.infer.args[0][1]).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb'
          ]
        });
      });
      
      it('should request authorization', function() {
        expect(aaa.request.callCount).to.equal(1);
        expect(aaa.request.args[0][0]).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client',
            redirectURIs: [
              'https://client.example.com/cb'
            ]
          },
          user: {
            id: '1',
            displayName: 'John Doe'
          },
          resource: {
            id: '112210f47de98100',
            identifier: 'https://api.example.com/',
            name: 'Example API'
          }
        });
      });
      
      it('should allow', function() {
        expect(allow).to.equal(true);
      });
      
      it('should supply result', function() {
        expect(info).to.deep.equal({
          permissions: [ {
            resource: {
              id: '112210f47de98100',
              identifier: 'https://api.example.com/',
              name: 'Example API'
            },
            scope: [ 'read:foo', 'write:foo', 'write:bar' ]
          } ]
        });
      });
    }); // that permits access
    
  }); // processTransaction
  
});
