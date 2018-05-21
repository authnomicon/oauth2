/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/sts/issue');


describe('sts/issue', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/aaa/oauth2/util/issueToken');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('issue', function() {
    var tokens = {
      encode: function(){}
    };
    
  
    describe('default behavior', function() {
      var token;
    
      var negotiateContentStub = sinon.stub().yields(null, 'jwt')
        , negotiateTypeStub = sinon.stub().yields(null, 'bearer');
    
      before(function() {
        sinon.stub(tokens, 'encode').yields(null, '2YotnFZFEjr1zCsicMWpAA');
      });
    
      after(function() {
        tokens.encode.restore();
      });
    
      before(function(done) {
        var client = {
          id: 's6BhdRkqt3'
        }
        var resource = {
          id: '112210f47de98100'
        }
      
        var negotiate = factory(negotiateContentStub, negotiateTypeStub, tokens);
        negotiate(resource, client, {}, function(err, t) {
          if (err) { return done(err); }
          token = t;
          done();
        });
      });
    
      it('should yield token', function() {
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
      });
    });
  
  }); // issue
  
});
