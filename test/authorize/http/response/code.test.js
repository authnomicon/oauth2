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
    
    var container = new Object();
    container.components = sinon.stub()
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorize/http/ResponseMode').returns([]);
    var sts = new Object();
    sts.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
    
    
    var codeSpy = sinon.stub();
    
    var grant;
    before(function(done) {
      var factory = $require('../../../../app/authorize/http/response/code',
        { 'oauth2orize': { grant: { code: codeSpy } } });
      
      var promise = factory(container, sts);
      promise.then(function(g) {
        grant = g;
        done();
      });
    });
    
    it('should create grant', function() {
      expect(codeSpy.callCount).to.equal(1);
      expect(codeSpy.args[0][0]).to.deep.equal({ modes: {} });
      expect(codeSpy.args[0][1]).to.be.a('function');
    });
    
  }); // creating grant
  
  // TODO: createing grant with response modes
  
});
