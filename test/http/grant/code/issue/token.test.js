/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../../app/http/grant/code/issue/token');


describe('http/grant/code/issue/token', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('issue', function() {
    var ds = {
      get: function(){}
    };
    var tokens = {
      decode: function(){}
    };
    var sts = {
      issue: function(){}
    };
    
    var client = {
      id: 's6BhdRkqt3',
      name: 'Example Client'
    };
    
    
    describe('issuing an access token', function() {
      var token;
      
      before(function() {
        sinon.stub(ds, 'get').yields(null, { id: '112210f47de98100', identifier: 'https://api.example.com/', name: 'Example API' });
        sinon.stub(tokens, 'decode').yields(null, {
          user: {
            id: '1',
            displayName: 'John Doe'
          },
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client'
          },
          permissions: [ {
            resource: {
              id: '112210f47de98100',
              identifier: 'https://api.example.com/',
              name: 'Example API'
            },
            scope: [ 'read:foo', 'write:foo', 'read:bar' ]
          } ],
          redirectURI: 'https://client.example.com/cb'
        });
        sinon.stub(sts, 'issue').yields(null, '2YotnFZFEjr1zCsicMWpAA');
      });
      
      after(function() {
        sts.issue.restore();
        tokens.decode.restore();
        ds.get.restore();
      });
      
      before(function(done) {
        var issue = factory(sts, null, null, tokens, null, null, ds);
        issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.com/cb', {}, {}, function(err, t) {
          if (err) { return done(err); }
          token = t;
          done();
        });
      });
      
      it('should decode authorization code', function() {
        expect(tokens.decode.callCount).to.equal(1);
        expect(tokens.decode.args[0][0]).to.equal('urn:ietf:params:oauth:token-type:authorization_code');
        expect(tokens.decode.args[0][1]).to.equal('SplxlOBeZQQYbYS6WxSbIA');
      });
      
      it('should get resource from directory services', function() {
        expect(ds.get.callCount).to.equal(1);
        expect(ds.get.args[0][0]).to.equal('112210f47de98100');
        expect(ds.get.args[0][1]).to.equal('resources');
      });
      
      it('should issue access', function() {
        expect(sts.issue.callCount).to.equal(1);
        expect(sts.issue.args[0][0]).to.deep.equal({
          user: {
            id: '1',
            displayName: 'John Doe'
          },
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client'
          },
          permissions: [ {
            resource: {
              id: '112210f47de98100',
              identifier: 'https://api.example.com/',
              name: 'Example API'
            },
            scope: [ 'read:foo', 'write:foo', 'read:bar' ]
          } ],
          audience: [ {
            id: 'http://localhost/userinfo'
          } ]
        });
      });
      
      it('should yield access token', function() {
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
      });
    }); // issuing an access token
    
  });
  
});
