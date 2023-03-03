/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../../../../com/authorize/http/response/modes/webmessage');


describe('authorize/http/response/modes/webmessage', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:oauth2orize.Responder');
    expect(factory['@mode']).to.equal('web_message');
  });
  
  it('should create responder', function() {
    var mode = factory();
    expect(mode).to.be.a('function');
  }); // should create response mode
  
});
