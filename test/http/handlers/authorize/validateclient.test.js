/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/handlers/authorize/validateclient');


describe('http/handlers/authorize/validateclient', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('validateClient', function() {
    var ds = {
      get: function(){}
    };
    
    describe('validating a valid authorization request', function() {
      var client, redirectURI;
    
      before(function() {
        sinon.stub(ds, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb'
          ]
        });
      });
    
      after(function() {
        ds.get.restore();
      });
    
      before(function(done) {
        var validateClient = factory(ds);
        validateClient('s6BhdRkqt3', 'https://client.example.com/cb', function(err, c, r) {
          if (err) { return done(err); }
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should get client from directory services', function() {
        expect(ds.get.args[0][0]).to.equal('s6BhdRkqt3');
        expect(ds.get.args[0][1]).to.equal('clients');
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
        sinon.stub(ds, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb'
          ]
        });
      });
    
      after(function() {
        ds.get.restore();
      });
    
      before(function(done) {
        var validateClient = factory(ds);
        validateClient('s6BhdRkqt3', undefined, function(err, c, r) {
          if (err) { return done(err); }
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should get client from directory services', function() {
        expect(ds.get.args[0][0]).to.equal('s6BhdRkqt3');
        expect(ds.get.args[0][1]).to.equal('clients');
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
        sinon.stub(ds, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb',
            'https://client.example.com/2/cb'
          ]
        });
      });
    
      after(function() {
        ds.get.restore();
      });
    
      before(function(done) {
        var validateClient = factory(ds);
        validateClient('s6BhdRkqt3', 'https://client.example.com/2/cb', function(err, c, r) {
          if (err) { return done(err); }
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should get client from directory services', function() {
        expect(ds.get.args[0][0]).to.equal('s6BhdRkqt3');
        expect(ds.get.args[0][1]).to.equal('clients');
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
      var error, client, redirectURI;
    
      before(function() {
        sinon.stub(ds, 'get').yields(null);
      });
      
      after(function() {
        ds.get.restore();
      });
      
      before(function(done) {
        var validateClient = factory(ds);
        validateClient('s6BhdRkqt3', 'https://client.example.com/cb', function(e, c, r) {
          error = e;
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should yield error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Unknown client');
        expect(error.code).to.equal('unauthorized_client');
        expect(error.status).to.equal(403);
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // validating an invalid authorization request caused by unknown client
    
    describe('validating an invalid authorization request caused by no registered redirect URIs', function() {
      var error, client, redirectURI;
    
      before(function() {
        sinon.stub(ds, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client'
        });
      });
    
      after(function() {
        ds.get.restore();
      });
      
      before(function(done) {
        var validateClient = factory(ds);
        validateClient('s6BhdRkqt3', 'https://client.example.com/cb', function(e, c, r) {
          error = e;
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should yield error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Client has no registered redirect URIs');
        expect(error.code).to.equal('unauthorized_client');
        expect(error.status).to.equal(403);
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // validating an invalid authorization request caused by no registered redirect URIs
    
    describe('validating an invalid authorization request caused by empty set of redirect URIs', function() {
      var error, client, redirectURI;
    
      before(function() {
        sinon.stub(ds, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: []
        });
      });
    
      after(function() {
        ds.get.restore();
      });
      
      before(function(done) {
        var validateClient = factory(ds);
        validateClient('s6BhdRkqt3', 'https://client.example.com/cb', function(e, c, r) {
          error = e;
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should yield error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Client has no registered redirect URIs');
        expect(error.code).to.equal('unauthorized_client');
        expect(error.status).to.equal(403);
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // validating an invalid authorization request caused by empty set of redirect URIs
    
    describe('validating an invalid authorization request caused by using unregistered redirect URI', function() {
      var error, client, redirectURI;
    
      before(function() {
        sinon.stub(ds, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb',
            'https://client.example.com/2/cb'
          ]
        });
      });
    
      after(function() {
        ds.get.restore();
      });
      
      before(function(done) {
        var validateClient = factory(ds);
        validateClient('s6BhdRkqt3', 'https://client.example.com/0/cb', function(e, c, r) {
          error = e;
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should yield error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Client not permitted to use redirect URI');
        expect(error.code).to.equal('unauthorized_client');
        expect(error.status).to.equal(403);
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // validating an invalid authorization request caused by using unregistered redirect URI
    
    describe('validating an invalid authorization request caused by not including a redirect URI when multiple redirect URIs are registered', function() {
      var error, client, redirectURI;
    
      before(function() {
        sinon.stub(ds, 'get').yields(null, {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [
            'https://client.example.com/cb',
            'https://client.example.com/2/cb'
          ]
        });
      });
    
      after(function() {
        ds.get.restore();
      });
    
      before(function(done) {
        var validateClient = factory(ds);
        validateClient('s6BhdRkqt3', undefined, function(e, c, r) {
          error = e;
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should yield error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Missing required parameter: redirect_uri');
        expect(error.code).to.equal('invalid_request');
        expect(error.status).to.equal(400);
      });
    
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
      
      it('should not yield redirectURI', function() {
        expect(redirectURI).to.be.undefined;
      });
    }); // validating an invalid client request caused by not including a redirect URI when multiple redirect URIs are registered
    
    describe('error encountered while accessing client data store', function() {
      var error, client, redirectURI;
    
      before(function() {
        sinon.stub(ds, 'get').yields(new Error('Directory services failure'));
      });
    
      after(function() {
        ds.get.restore();
      });
    
      before(function(done) {
        var validateClient = factory(ds);
        validateClient('s6BhdRkqt3', 'https://client.example.com/cb', function(e, c, r) {
          error = e;
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should attempt to get client from data store', function() {
        expect(ds.get).to.have.been.calledWith('s6BhdRkqt3');
      });
      
      it('should yield error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Directory services failure');
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
