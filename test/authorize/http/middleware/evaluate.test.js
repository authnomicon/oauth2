/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/authorize/http/middleware/evaluate');
var Request = require('../../../../lib/request');
var Response = require('../../../../lib/response');


describe('authorize/http/middleware/evaluate', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  
  var server = {
    _respond: function(txn, res, cb) {
      res.end();
    }
  };
  
  describe('handler', function() {
    
    it('should permit without scope', function(done) {
      var service = sinon.spy(function(req, res) {
        expect(req).to.be.an.instanceOf(Request);
        expect(req.client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client'
        });
        expect(req.prompt).to.deep.equal([]);
        expect(req.user).to.deep.equal({
          id: '248289761001',
          displayName: 'Jane Doe'
        });
        expect(res).to.be.an.instanceOf(Response);
        
        res.permit();
      });
      
      sinon.spy(server, '_respond');
      var handler = factory(null, service, server);
      
      chai.express.use([ handler ])
        .request(function(req, res) {
          req.state = new Object();
          req.state.complete = sinon.spy();
          req.oauth2 = {
            client: {
              id: 's6BhdRkqt3',
              name: 'Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            req: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb'
            },
            user: {
              id: '248289761001',
              displayName: 'Jane Doe'
            }
          };
        })
        .finish(function() {
          expect(service).to.have.been.calledOnce;
          expect(this.req.state.complete).to.have.been.calledOnce;
          expect(server._respond).to.have.been.calledOnce;
          expect(server._respond).to.have.been.calledWith({
            client: {
              id: 's6BhdRkqt3',
              name: 'Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            req: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb'
            },
            user: {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            res: {
              allow: true,
              issuer: 'undefined://undefined',
              authContext: { sessionID: undefined }
            }
          }, this);
          done();
        })
        .listen();
    }); // should permit without scope
    
    it('should permit with scope', function(done) {
      var service = sinon.spy(function(req, res) {
        expect(req).to.be.an.instanceOf(Request);
        expect(req.client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client'
        });
        expect(req.prompt).to.deep.equal([]);
        expect(req.user).to.deep.equal({
          id: '248289761001',
          displayName: 'Jane Doe'
        });
        expect(res).to.be.an.instanceOf(Response);
        
        res.permit([ 'profile', 'email' ]);
      });
      
      sinon.spy(server, '_respond');
      var handler = factory(null, service, server);
      
      chai.express.use([ handler ])
        .request(function(req, res) {
          req.state = new Object();
          req.state.complete = sinon.spy();
          req.oauth2 = {
            client: {
              id: 's6BhdRkqt3',
              name: 'Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            req: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
              scope: [ 'profile', 'email' ]
            },
            user: {
              id: '248289761001',
              displayName: 'Jane Doe'
            }
          };
        })
        .finish(function() {
          expect(service).to.have.been.calledOnce;
          expect(this.req.state.complete).to.have.been.calledOnce;
          expect(server._respond).to.have.been.calledOnce;
          expect(server._respond).to.have.been.calledWith({
            client: {
              id: 's6BhdRkqt3',
              name: 'Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            req: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
              scope: [ 'profile', 'email' ]
            },
            user: {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            res: {
              allow: true,
              scope: [ 'profile', 'email' ],
              issuer: 'undefined://undefined',
              authContext: { sessionID: undefined }
            }
          }, this);
          done();
        })
        .listen();
    }); // should permit with scope
    
    it('should prompt', function(done) {
      var service = sinon.spy(function(req, res) {
        expect(req).to.be.an.instanceOf(Request);
        expect(req.client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client'
        });
        expect(req.prompt).to.deep.equal([]);
        expect(req.user).to.be.undefined;
        expect(res).to.be.an.instanceOf(Response);
        
        res.prompt('login');
      });
      
      var prompts = new Object();
      prompts.dispatch = sinon.spy(function(name, req, res, next) {
        expect(name).to.equal('login');
        
        res.redirect('/login');
      });
      
      sinon.spy(server, '_respond');
      var handler = factory(prompts, service, server);
      
      chai.express.use([ handler ])
        .request(function(req, res) {
          req.state = new Object();
          req.state.complete = sinon.spy();
          req.oauth2 = {
            client: {
              id: 's6BhdRkqt3',
              name: 'Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            req: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
            }
          };
        })
        .finish(function() {
          expect(this.req.state.complete).to.not.have.been.called;
          expect(server._respond).to.not.have.been.called;
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('/login');
          done();
        })
        .listen();
    }); // should prompt
    
  }); // handler
  
});
