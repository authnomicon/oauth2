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
  
  describe('sts', function() {
    var sts = {
      issue: function(){}
    };
    
  
    describe('default behavior', function() {
      var token;
    
      before(function() {
        sinon.stub(sts, 'issue').yields(null, '2YotnFZFEjr1zCsicMWpAA');
      });
    
      after(function() {
        sts.issue.restore();
      });
    
      before(function(done) {
        var claims = {
          user: {
            id: '1',
            displayName: 'John Doe'
          },
          scope: [ 'beep', 'boop' ]
        };
        var presenter = {
          id: 's6BhdRkqt3',
          name: 'Example Client'
        };
        var audience = [
          { id: '112210f47de98100',
            identifier: 'https://api.example.com/',
            name: 'Example API' }
        ];
      
        var negotiate = factory(sts);
        negotiate(claims, audience, presenter, {}, function(err, t) {
          if (err) { return done(err); }
          token = t;
          done();
        });
      });
      
      it('should negotiate token type', function() {
        expect(sts.issue.callCount).to.equal(1);
        /*
        expect(sts.issue.args[0][0]).to.deep.equal({
          user: {
            id: '1',
            displayName: 'John Doe'
          },
          scope: [ 'beep', 'boop' ]
        });
        */
        expect(sts.issue.args[0][1]).to.deep.equal([
          { id: '112210f47de98100',
            identifier: 'https://api.example.com/',
            name: 'Example API' }
        ]);
        expect(sts.issue.args[0][2]).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client'
        });
      });
    
      it('should yield token', function() {
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
      });
    });
  
  }); // issue
  
});
