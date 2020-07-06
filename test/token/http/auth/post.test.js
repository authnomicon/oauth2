/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/token/http/auth/post');
var Strategy = require('passport-oauth2-client-password');


describe('password/http/scheme', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/auth/Scheme');
    expect(factory['@scheme']).to.equal('client_secret_post');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('verifying client identifier and secret', function() {
    var secrets = new Object();
    secrets.verify = sinon.stub().yieldsAsync(null, true);
    var clients = new Object();
    clients.find = sinon.stub().yieldsAsync(null, { id: 's6BhdRkqt3', displayName: 'My Example Client' });
    
    var StrategySpy = sinon.spy(Strategy);
    
    var factory = $require('../../../../app/token/http/auth/post',
      { 'passport-oauth2-client-password': { Strategy: StrategySpy } });
    var strategy = factory(secrets, clients);
    
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
        verify('s6BhdRkqt3', '7Fjfp0ZBr1KtDRbnfVdmIw', function(e, c, i) {
          if (e) { return done(e); }
          client = c;
          info = i;
          done();
        });
      });
      
      it('should verify credentials', function() {
        expect(secrets.verify).to.calledOnceWith('s6BhdRkqt3', '7Fjfp0ZBr1KtDRbnfVdmIw');
      });
      
      it('should query directory', function() {
        expect(clients.find).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should yield client', function() {
        expect(client).to.deep.equal({
          id: 's6BhdRkqt3',
          displayName: 'My Example Client'
        });
      });
      
      it('should yield info', function() {
        expect(info).to.deep.equal({
          methods: [ 'password' ]
        });
      });
    }); // verify
    
  }); // verifying client identifier and secret
  
  describe('verifying client identifier and secret using credential service with directory capability', function() {
    var secrets = new Object();
    secrets.verify = sinon.stub().yieldsAsync(null, { id: 's6BhdRkqt3', displayName: 'My Example Client' });
    var clients = new Object();
    clients.find = sinon.spy();
    
    var StrategySpy = sinon.spy(Strategy);
    
    var factory = $require('../../../../app/token/http/auth/post',
      { 'passport-oauth2-client-password': { Strategy: StrategySpy } });
    var strategy = factory(secrets, clients);
    
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
        verify('s6BhdRkqt3', '7Fjfp0ZBr1KtDRbnfVdmIw', function(e, c, i) {
          if (e) { return done(e); }
          client = c;
          info = i;
          done();
        });
      });
      
      it('should verify credentials', function() {
        expect(secrets.verify).to.calledOnceWith('s6BhdRkqt3', '7Fjfp0ZBr1KtDRbnfVdmIw');
      });
      
      it('should not query directory', function() {
        expect(clients.find).to.not.have.been.called;
      });
      
      it('should yield client', function() {
        expect(client).to.deep.equal({
          id: 's6BhdRkqt3',
          displayName: 'My Example Client'
        });
      });
      
      it('should yield info', function() {
        expect(info).to.deep.equal({
          methods: [ 'password' ]
        });
      });
    }); // verify
    
  }); // verifying client identifier and secret using credential service with directory capability
  
});
