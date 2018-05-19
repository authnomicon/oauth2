/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../app/sts/issue');


describe('sts/issue', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/aaa/oauth2/util/issueToken');
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
