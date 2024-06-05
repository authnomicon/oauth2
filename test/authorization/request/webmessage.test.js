/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/authorization/request/webmessage');


describe('authorize/http/request/webmessage', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:oauth2orize.RequestParametersProcessor');
  });
  
  it('should create processor', function() {
    var extensionsSpy = sinon.stub();
    var factory = $require('../../../com/authorization/request/webmessage', {
      'oauth2orize-wmrm': { extensions: extensionsSpy }
    });
    
    var extensions = factory();
    expect(extensionsSpy).to.have.been.calledOnce;
  }); // should create processor
  
});
