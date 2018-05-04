/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/ceremony/authorize/resume');
var oauth2orize = require('oauth2orize');


describe('http/ceremony/authorize/resume', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    describe('completing transaction', function() {
      var request, response, error;
      
      var processTransaction = function(client, user, scope, type, areq, locals, cb){
        return cb(null, true, { scope: scope });
      };
      var completeTransaction = function(req, txn, cb){
        return cb(null);
      };
      
      
      before(function(done) {
        var server = oauth2orize.createServer();
        server.deserializeClient(function(id, cb) {
          return cb(null, { id: id });
        })
        server.grant('code', 'response', function(txn, res, complete, next) {
          complete(function(err) {
            if (err) { return next(err); }
            res.redirect('/callback?code=SplxlOBeZQQYbYS6WxSbIA');
          });
        })
        
        var handler = factory(processTransaction, completeTransaction, server);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            request.body = { transaction_id: 't1' };
            request.session = {};
            request.session.authorize = {};
            request.session.authorize['t1'] = {
              client: 's6BhdRkqt3',
              req: {
                clientID: 's6BhdRkqt3',
                redirectURI: 'https://client.example.com/cb',
                type: 'code',
                scope: [ 'openid', 'profile', 'email' ]
              }
            };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
      
      it('should respond', function() {
        expect(response.getHeader('Location')).to.equal('/callback?code=SplxlOBeZQQYbYS6WxSbIA');
      });
    }); // completing transaction
    
    describe('prompting', function() {
      var request, response, error;
      
      var processTransaction = function(client, user, scope, type, areq, locals, cb){
        return cb(null, false, { prompt: 'consent' });
      };
      var completeTransaction = function(req, txn, cb){
        return cb(null);
      };
      
      
      before(function(done) {
        var server = oauth2orize.createServer();
        server.deserializeClient(function(id, cb) {
          return cb(null, { id: id });
        });
        server.serializeClient(function(client, cb) {
          return cb(null, client.id);
        });
        
        var handler = factory(processTransaction, completeTransaction, server);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            request.body = { transaction_id: 't1' };
            request.session = {};
            request.session.authorize = {};
            request.session.authorize['t1'] = {
              client: 's6BhdRkqt3',
              req: {
                clientID: 's6BhdRkqt3',
                redirectURI: 'https://client.example.com/cb',
                type: 'code',
                scope: [ 'openid', 'profile', 'email' ]
              }
            };
          })
          .res(function(res) {
            res.prompt = function() {
              this.redirect('/consent');
            }
            
            response = res;
          })
          .end(function(res) {
            response = res;
            done();
          })
          .dispatch();
      });
      
      it('should respond', function() {
        expect(response.getHeader('Location')).to.equal('/consent');
      });
    }); // prompting
    
  });
  
});
