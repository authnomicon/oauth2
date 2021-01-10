/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/token/auth/none');
var Strategy = require('passport-oauth2-client-public').Strategy;


describe('http/token/auth/none', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/auth/Scheme');
    expect(factory['@scheme']).to.equal('none');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('verifying public client identifier', function() {
    var clients = new Object();
    clients.find = sinon.stub().yieldsAsync(null, { id: 's6BhdRkqt3', displayName: 'My Example Client', tokenEndpointAuthMethod: 'none' });
    
    var StrategySpy = sinon.spy(Strategy);
    
    var factory = $require('../../../../app/http/token/auth/none',
      { 'passport-oauth2-client-public': { Strategy: StrategySpy } });
    var strategy = factory(clients);
    
    it('should construct strategy', function() {
      expect(StrategySpy).to.have.been.calledOnce;
    });
    
    it('should return strategy', function() {
      expect(strategy).to.be.an.instanceOf(Strategy);
    });
    
    describe('verify', function() {
      var client, info;
      
      before(function(done) {
        var verify = StrategySpy.args[0][0];
        verify('s6BhdRkqt3', function(e, c) {
          if (e) { return done(e); }
          client = c;
          done();
        });
      });
      
      it('should query directory', function() {
        expect(clients.find).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should yield client', function() {
        expect(client).to.deep.equal({
          id: 's6BhdRkqt3',
          displayName: 'My Example Client',
          tokenEndpointAuthMethod: 'none'
        });
      });
    }); // verify
    
  }); // verifying client identifier
  
  describe('not verifying confidential client identifier', function() {
    var clients = new Object();
    clients.find = sinon.stub().yieldsAsync(null, { id: 's6BhdRkqt3', displayName: 'My Example Client', tokenEndpointAuthMethod: 'client_secret_basic' });
    
    var StrategySpy = sinon.spy(Strategy);
    
    var factory = $require('../../../../app/http/token/auth/none',
      { 'passport-oauth2-client-public': { Strategy: StrategySpy } });
    var strategy = factory(clients);
    
    it('should construct strategy', function() {
      expect(StrategySpy).to.have.been.calledOnce;
    });
    
    it('should return strategy', function() {
      expect(strategy).to.be.an.instanceOf(Strategy);
    });
    
    describe('verify', function() {
      var client, info;
      
      before(function(done) {
        var verify = StrategySpy.args[0][0];
        verify('s6BhdRkqt3', function(e, c) {
          if (e) { return done(e); }
          client = c;
          done();
        });
      });
      
      it('should query directory', function() {
        expect(clients.find).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should not yield client', function() {
        expect(client).to.be.false;
      });
    }); // verify
    
  }); // not verifying confidential client identifier
  
  describe('not finding client identifier', function() {
    var clients = new Object();
    clients.find = sinon.stub().yieldsAsync(null);
    
    var StrategySpy = sinon.spy(Strategy);
    
    var factory = $require('../../../../app/http/token/auth/none',
      { 'passport-oauth2-client-public': { Strategy: StrategySpy } });
    var strategy = factory(clients);
    
    it('should construct strategy', function() {
      expect(StrategySpy).to.have.been.calledOnce;
    });
    
    it('should return strategy', function() {
      expect(strategy).to.be.an.instanceOf(Strategy);
    });
    
    describe('verify', function() {
      var client, info;
      
      before(function(done) {
        var verify = StrategySpy.args[0][0];
        verify('s6BhdRkqt3', function(e, c) {
          if (e) { return done(e); }
          client = c;
          done();
        });
      });
      
      it('should query directory', function() {
        expect(clients.find).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should not yield client', function() {
        expect(client).to.be.false;
      });
    }); // verify
    
  }); // not finding client identifier
  
  describe('encountering error while querying directory', function() {
    var clients = new Object();
    clients.find = sinon.stub().yieldsAsync(new Error('something went wrong'));
    
    var StrategySpy = sinon.spy(Strategy);
    
    var factory = $require('../../../../app/http/token/auth/none',
      { 'passport-oauth2-client-public': { Strategy: StrategySpy } });
    var strategy = factory(clients);
    
    it('should construct strategy', function() {
      expect(StrategySpy).to.have.been.calledOnce;
    });
    
    it('should return strategy', function() {
      expect(strategy).to.be.an.instanceOf(Strategy);
    });
    
    describe('verify', function() {
      var error, client, info;
      
      before(function(done) {
        var verify = StrategySpy.args[0][0];
        verify('s6BhdRkqt3', function(e, c) {
          error = e;
          client = c;
          done();
        });
      });
      
      it('should query directory', function() {
        expect(clients.find).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should yield error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });
      
      it('should not yield client', function() {
        expect(client).to.be.undefined;
      });
    }); // verify
    
  }); // encountering error while querying directory
  
});
