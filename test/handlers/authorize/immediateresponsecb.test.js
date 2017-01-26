/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../lib/handlers/authorize/immediateresponsecb');


describe('handlers/authorize/immediateresponsecb', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('factory', function() {
    var func = factory();
    
    it('should return function', function() {
      expect(func).to.be.a('function');
    });
  });
  
  describe('immediateResponseCb', function() {
    var client = {
      id: '1',
      name: 'Example Client'
    }
    
    describe('when user is not logged in', function() {
      var allow, info, locals;
      
      before(function(done) {
        var immediateResponseCb = factory();
        immediateResponseCb(client, undefined, [ 'read', 'write' ], 'code', {}, undefined, function(e, a, i, l) {
          if (e) { return done(e); }
          allow = a;
          info = i;
          locals = l;
          done()
        });
      });
      
      it('should not authorize request', function() {
        expect(allow).to.equal(false);
      });
      
      it('should yield info', function() {
        expect(info).to.deep.equal({
          prompt: 'login',
          maxAttempts: 3
        });
      });
      
      it('should not yield locals', function() {
        expect(locals).to.be.undefined;
      });
    }); // when user is not logged in
    
  }); // immediateResponseCb
  
});
