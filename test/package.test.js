/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');


describe('@authnomicon/oauth2', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('org.authnomicon/oauth2');
      
      expect(json.assembly.components).to.have.length(16);
      expect(json.assembly.components).to.include('authorize/http/service');
      expect(json.assembly.components).to.include('token/http/service');
    });
  });
  
});

afterEach(function() {
  sinon.restore();
});
