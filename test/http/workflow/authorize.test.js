/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../../app/http/workflow/authorize');


describe('http/workflow/authorize', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/flows/Task');
    expect(factory['@name']).to.equal('oauth2-authorize');
  });
  
});
