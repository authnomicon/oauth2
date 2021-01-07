/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');

/*
afterEach(function() {
  sinon.restore();
});
*/

describe('@authnomicon/oauth2', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('org.authnomicon/oauth2');
      
      expect(json.assembly.components).to.have.length(22);
      expect(json.assembly.components).to.include('http/authorize/service');
      expect(json.assembly.components).to.include('token/http/service');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});
