/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/grant/token/grant');


describe('http/grant/token/grant', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/http/oauth2/Grant');
    expect(factory['@type']).to.equal('token');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('creating grant', function() {
    var container = {
      components: function(){},
      create: function(){}
    }
    var issue = function(){};
    
    
    describe('without additional response modes', function() {
      before(function() {
        sinon.stub(container, 'components').returns([]);
      });
      
      after(function() {
        container.components.restore();
      });
      
      var tokenSpy = sinon.stub();
      
      var grant;
      before(function(done) {
        var factory = $require('../../../../app/http/grant/token/grant',
          { 'oauth2orize': { grant: { token: tokenSpy } } });
        
        var promise = factory(container, issue);
        promise.then(function(g) {
          grant = g;
          done();
        });
      });
      
      it('should create grant', function() {
        expect(tokenSpy.callCount).to.equal(1);
        expect(tokenSpy.args[0][0]).to.deep.equal({ modes: {} });
        expect(tokenSpy.args[0][1]).to.equal(issue);
      });
    }); // without additional response modes
    
  }); // creating grant
  
});
