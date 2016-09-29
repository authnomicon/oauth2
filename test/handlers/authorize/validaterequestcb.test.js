/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../xom/handlers/authorize/validaterequestcb');


describe('handlers/authorize/validaterequestcb', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('factory', function() {
    var func = factory();
    
    it('should return function', function() {
      expect(func).to.be.a('function');
    });
  });
  
  describe('validateRequestCb', function() {
    var directory = {
      get: function(){}
    };
    
    describe('validating a valid client request', function() {
      var client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: '1',
          name: 'Example Client',
          redirectURIs: [
            'https://www.example.com/login/return'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', 'https://www.example.com/login/return', function(e, c, r) {
          if (e) { return done(e); }
          client = c;
          redirectURI = r;
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
            'https://www.example.com/login/return'
          ]
        });
      });
      
      it('should yield redirectURI', function() {
        expect(redirectURI).to.equal('https://www.example.com/login/return');
      });
    }); // validating a valid client request
    
    describe('validating a valid client request when one URI is registered but omitted from request', function() {
      var client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: '1',
          name: 'Example Client',
          redirectURIs: [
            'https://www.example.com/login/return'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', undefined, function(e, c, r) {
          if (e) { return done(e); }
          client = c;
          redirectURI = r;
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
            'https://www.example.com/login/return'
          ]
        });
      });
      
      it('should yield redirectURI', function() {
        expect(redirectURI).to.equal('https://www.example.com/login/return');
      });
    }); // validating a valid client request when one URI is registered but omitted from request
    
    describe('validating a valid client request when multiple URIs are registered', function() {
      var client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: '1',
          name: 'Example Client',
          redirectURIs: [
            'https://www.example.com/login/return',
            'https://www.example.com/oauth2/return'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', 'https://www.example.com/oauth2/return', function(e, c, r) {
          if (e) { return done(e); }
          client = c;
          redirectURI = r;
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
            'https://www.example.com/login/return',
            'https://www.example.com/oauth2/return'
          ]
        });
      });
      
      it('should yield redirectURI', function() {
        expect(redirectURI).to.equal('https://www.example.com/oauth2/return');
      });
    }); // validating a valid client request when multiple URIs are registered
    
    describe('validating an invalid client request caused by unknown client', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null);
      });
      
      after(function() {
        directory.get.restore();
      });
      
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', 'https://www.example.com/return', function(e, c, r) {
          err = e;
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should yield error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Unknown client');
        expect(err.code).to.equal('unauthorized_client');
        expect(err.status).to.equal(403);
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // validating an invalid client request caused by unknown client
    
    describe('validating an invalid client request caused by no registered redirect URIs', function() {
      var err, client, redirectURI;
    
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
        validateFuncCb('1', 'https://www.example.com/return', function(e, c, r) {
          err = e;
          client = c;
          redirectURI = r;
          done()
        });
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
    
    describe('validating an invalid client request caused by empty set of redirect URIs', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: '1',
          name: 'Example Client',
          redirectURIs: []
        });
      });
    
      after(function() {
        directory.get.restore();
      });
      
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', 'https://www.example.com/return', function(e, c, r) {
          err = e;
          client = c;
          redirectURI = r;
          done()
        });
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
    }); // validating an invalid client request caused by empty set of redirect URIs
    
    describe('validating an invalid client request caused by using unregistered redirect URI', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: '1',
          name: 'Example Client',
          redirectURIs: [
            'https://www.example.com/login/return',
            'https://www.example.com/oauth2/return'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
      
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', 'https://www.example.test/return', function(e, c, r) {
          err = e;
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should yield error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Client not permitted to use redirect URI');
        expect(err.code).to.equal('unauthorized_client');
        expect(err.status).to.equal(403);
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // validating an invalid client request caused by using unregistered redirect URI
    
    describe('validating an invalid client request caused by not including a redirect URI when multiple redirect URIs are registered', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: '1',
          name: 'Example Client',
          redirectURIs: [
            'https://www.example.com/login/return',
            'https://www.example.com/oauth2/return'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', undefined, function(e, c, r) {
          err = e;
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should yield error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Missing required parameter: redirect_uri');
        expect(err.code).to.equal('invalid_request');
        expect(err.status).to.equal(400);
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // validating an invalid client request caused by not including a redirect URI when multiple redirect URIs are registered
    
    describe('error encountered during directory lookup', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(new Error('Directory lookup failed'));
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', 'https://www.example.com/return', function(e, c, r) {
          err = e;
          client = c;
          redirectURI = r;
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
