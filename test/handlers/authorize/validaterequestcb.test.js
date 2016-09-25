/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../xom/handlers/authorize/validaterequestcb');


describe('handlers/authorize/validaterequestcb', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('factory', function() {
    var directory = new Object();
    var func = factory(directory);
    
    it('should return function', function() {
      expect(func).to.be.a('function');
    });
  });
  
  describe('validateRequestCb', function() {
    var directory = {
      get: function(){}
    };
    
    describe('validating a valid client request', function() {
      var client, redirectURI, locals;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: '1',
          name: 'Example Client',
          redirectURIs: [
            'http://localhost:3000/return'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', 'https://www.example.com/return', function(e, c, r, l) {
          if (e) { return done(err); }
          client = c;
          redirectURI = r;
          locals = l;
          done()
        });
      });
      
      it('should call Directory#get', function() {
        expect(directory.get).to.have.been.calledWith('1');
      });
    
      it('should yield client', function() {
        expect(client).to.deep.equal({
          id: '1',
          name: 'Example Client',
          redirectURIs: [
            'http://localhost:3000/return'
          ]
        });
      });
      
      it('should yield redirectURI', function() {
        expect(redirectURI).to.equal('https://www.example.com/return');
      });
      
      it('should yield locals', function() {
        expect(locals).to.deep.equal({});
      });
    }); // validating a valid client request
    
    describe('validating an invalid client request caused by no registered redirect URIs', function() {
      var err, client, redirectURI, locals;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: '1',
          name: 'Example Client'
        });
      });
    
      after(function() {
        directory.get.restore();
      });
      
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', 'https://www.example.com/return', function(e, c, r, l) {
          err = e;
          client = c;
          redirectURI = r;
          locals = l;
          done()
        });
      });
      
      it('should call Directory#get', function() {
        expect(directory.get).to.have.been.calledWith('1');
      });
      
      it('should yield error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Client has no registered redirect URIs');
        expect(err.code).to.equal('unauthorized_client');
        expect(err.status).to.equal(403);
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // validating an invalid client request caused by no registered redirect URIs
    
    describe('error encountered during directory lookup', function() {
      var err, client, redirectURI, locals;
    
      before(function() {
        sinon.stub(directory, 'get').yields(new Error('Directory lookup failed'));
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', 'https://www.example.com/return', function(e, c, r, l) {
          err = e;
          client = c;
          redirectURI = r;
          locals = l;
          done()
        });
      });
      
      it('should call Directory#get', function() {
        expect(directory.get).to.have.been.calledWith('1');
      });
      
      it('should yield error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Directory lookup failed');
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // error encountered during directory lookup
    
  }); // validateRequestCb
  
});
