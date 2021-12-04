/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../../../../com/authorize/http/response/modes/formpost');


describe('authorize/http/response/modes/formpost', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode');
    expect(factory['@mode']).to.equal('form_post');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should create response mode', function() {
    var mode = factory();
    expect(mode).to.be.a('function');
  }); // should create response mode
  
});
