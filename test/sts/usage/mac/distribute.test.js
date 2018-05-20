/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/sts/usage/mac/distribute');


describe('sts/usage/mac/distribute', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('negotiate', function() {
    var rsg = {
      generate: function(){}
    };
    
    
    describe('default behavior', function() {
      var type;
      
      before(function() {
        sinon.stub(rsg, 'generate').returns('adijq39jdlaska9asud');
      });
      
      after(function() {
        rsg.generate.restore();
      });
      
      before(function(done) {
        var client = {
          id: 's6BhdRkqt3'
        }
        var resource = {
          id: '112210f47de98100'
        }
        
        var negotiate = factory(rsg);
        negotiate(resource, client, function(err, t) {
          if (err) { return done(err); }
          type = t;
          done();
        });
      });
      
      it('should generate key', function() {
        expect(rsg.generate.callCount).to.equal(1);
        expect(rsg.generate.args[0][0]).to.equal(32);
      });
      
      it('should yield key', function() {
        expect(type).to.deep.equal({ secret: 'adijq39jdlaska9asud' });
      });
    });
    
  });
  
});
