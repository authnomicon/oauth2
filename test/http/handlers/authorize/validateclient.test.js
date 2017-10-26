/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/handlers/authorize/validateclient');


describe('http/handlers/authorize/validateclient', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('factory', function() {
    var func = factory();
    
    it('should return function', function() {
      expect(func).to.be.a('function');
    });
  });
  
  describe('validateClient', function() {
    var directory = {
      get: function(){}
    };
    
    describe('validating a valid authorization request', function() {
      var client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateClient = factory(directory);
        validateClient('s6BhdRkqt3', 'https://client.example.com/cb', function(e, c, r) {
          if (e) { return done(e); }
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should get client from data store', function() {
        expect(directory.get).to.have.been.calledWith('s6BhdRkqt3');
      });
    
      it('should yield client', function() {
        expect(client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb'
          ]
        });
      });
      
      it('should yield redirectURI', function() {
        expect(redirectURI).to.equal('https://client.example.com/cb');
      });
    }); // validating a valid authorization request
    
    describe('validating a valid authorization request when one redirect URI is registered but omitted from request', function() {
      var client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateClient = factory(directory);
        validateClient('s6BhdRkqt3', undefined, function(e, c, r) {
          if (e) { return done(e); }
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should get client from data store', function() {
        expect(directory.get).to.have.been.calledWith('s6BhdRkqt3');
      });
    
      it('should yield client', function() {
        expect(client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb'
          ]
        });
      });
      
      it('should yield redirectURI', function() {
        expect(redirectURI).to.equal('https://client.example.com/cb');
      });
    }); // validating a valid authorization request when one URI is registered but omitted from request
    
    describe('validating a valid authorization request when multiple URIs are registered', function() {
      var client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb',
            'https://client.example.com/2/cb'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateClient = factory(directory);
        validateClient('s6BhdRkqt3', 'https://client.example.com/2/cb', function(e, c, r) {
          if (e) { return done(e); }
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should get client from data store', function() {
        expect(directory.get).to.have.been.calledWith('s6BhdRkqt3');
      });
    
      it('should yield client', function() {
        expect(client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb',
            'https://client.example.com/2/cb'
          ]
        });
      });
      
      it('should yield redirectURI', function() {
        expect(redirectURI).to.equal('https://client.example.com/2/cb');
      });
    }); // validating a valid authorization request when multiple URIs are registered
    
    describe('validating an invalid authorization request caused by unknown client', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null);
      });
      
      after(function() {
        directory.get.restore();
      });
      
      before(function(done) {
        var validateClient = factory(directory);
        validateClient('s6BhdRkqt3', 'https://client.example.com/cb', function(e, c, r) {
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
    }); // validating an invalid authorization request caused by unknown client
    
    describe('validating an invalid authorization request caused by no registered redirect URIs', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client'
        });
      });
    
      after(function() {
        directory.get.restore();
      });
      
      before(function(done) {
        var validateClient = factory(directory);
        validateClient('s6BhdRkqt3', 'https://client.example.com/cb', function(e, c, r) {
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
    }); // validating an invalid authorization request caused by no registered redirect URIs
    
    describe('validating an invalid authorization request caused by empty set of redirect URIs', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: []
        });
      });
    
      after(function() {
        directory.get.restore();
      });
      
      before(function(done) {
        var validateClient = factory(directory);
        validateClient('s6BhdRkqt3', 'https://client.example.com/cb', function(e, c, r) {
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
    }); // validating an invalid authorization request caused by empty set of redirect URIs
    
    describe('validating an invalid authorization request caused by using unregistered redirect URI', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb',
            'https://client.example.com/2/cb'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
      
      before(function(done) {
        var validateClient = factory(directory);
        validateClient('s6BhdRkqt3', 'https://client.example.com/0/cb', function(e, c, r) {
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
    }); // validating an invalid authorization request caused by using unregistered redirect URI
    
    describe('validating an invalid authorization request caused by not including a redirect URI when multiple redirect URIs are registered', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb',
            'https://client.example.com/2/cb'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateClient = factory(directory);
        validateClient('s6BhdRkqt3', undefined, function(e, c, r) {
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
    
    describe('error encountered while accessing client data store', function() {
      var err, client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(new Error('Data access failed'));
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateClient = factory(directory);
        validateClient('s6BhdRkqt3', 'https://client.example.com/cb', function(e, c, r) {
          err = e;
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should attempt to get client from data store', function() {
        expect(directory.get).to.have.been.calledWith('s6BhdRkqt3');
      });
      
      it('should yield error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Data access failed');
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // error encountered while accessing client data store
    
  }); // validateClient
  
});
