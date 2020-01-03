/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/authorize/http/response/code');


describe('authorize/http/response/code', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/http/Response');
    expect(factory['@type']).to.equal('code');
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
      
      var codeSpy = sinon.stub();
      
      var grant;
      before(function(done) {
        var factory = $require('../../../../app/authorize/http/response/code',
          { 'oauth2orize': { grant: { code: codeSpy } } });
        
        var promise = factory(container, issue);
        promise.then(function(g) {
          grant = g;
          done();
        });
      });
      
      it('should create grant', function() {
        expect(codeSpy.callCount).to.equal(1);
        expect(codeSpy.args[0][0]).to.deep.equal({ modes: {} });
        expect(codeSpy.args[0][1]).to.equal(issue);
      });
    }); // without additional response modes
    
  }); // creating grant
  
});
