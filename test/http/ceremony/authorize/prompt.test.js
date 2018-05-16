/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/ceremony/authorize/prompt');


describe('http/ceremony/authorize/prompt', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    describe('login prompt', function() {
      var request, response, prompt, options;
      
      before(function(done) {
        var handler = factory();
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.oauth2 = {};
            req.oauth2.req = {
              type: 'code',
              clientID: 's6BhdRkqt3'
            };
            req.oauth2.info = { prompt: 'login' };
          })
          .res(function(res) {
            response = res;
            
            res.prompt = function(p, o) {
              prompt = p;
              options = o;
              this.end();
            }
          })
          .end(function() {
            done();
          })
          .dispatch();
      });
      
      it('should prompt', function() {
        expect(prompt).to.equal('login');
        expect(options).to.deep.equal({});
      });
    }); // login prompt
    
    describe('consent prompt', function() {
      var request, response, prompt, options;
      
      before(function(done) {
        var handler = factory();
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.oauth2 = {};
            req.oauth2.client = {
              id: 's6BhdRkqt3',
              name: 'Example Client',
              redirectURIs: [
                'https://client.example.com/cb'
              ]
            };
            req.oauth2.req = {
              type: 'code',
              clientID: 's6BhdRkqt3'
            };
            req.oauth2.info = { prompt: 'consent' };
          })
          .res(function(res) {
            response = res;
            
            res.prompt = function(p, o) {
              prompt = p;
              options = o;
              this.end();
            }
          })
          .end(function() {
            done();
          })
          .dispatch();
      });
      
      it('should prompt', function() {
        expect(prompt).to.equal('consent');
        expect(options).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client',
            redirectURIs: [
              'https://client.example.com/cb'
            ]
          }
        });
      });
    }); // consent prompt
    
  }); // handler
  
});
