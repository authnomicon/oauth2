/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../com/authorize/http/response/code');


describe('authorize/http/response/code', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/ResponseType');
    expect(factory['@type']).to.equal('code');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  
  var logger = {
    emergency: function(){},
    alert: function(){},
    critical: function(){},
    error: function(){},
    warning: function(){},
    notice: function(){},
    info: function(){},
    debug: function(){}
  };
  
  it('should create response type without response modes', function(done) {
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
    
    var codeSpy = sinon.stub();
    var factory = $require('../../../../com/authorize/http/response/code', {
      'oauth2orize': {
        grant: { code: codeSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(codeSpy).to.be.calledOnce;
        expect(codeSpy).to.be.calledWith({ modes: {} });
        done();
      })
      .catch(done);
  }); // should create response type without response modes
  
  it('should create response type with response modes', function(done) {
    var mode1 = function(){};
    var mode1Component = new Object();
    mode1Component.create = sinon.stub().resolves(mode1);
    mode1Component.a = { '@mode': 'query' };
    
    var mode2 = function(){};
    var mode2Component = new Object();
    mode2Component.create = sinon.stub().resolves(mode2);
    mode2Component.a = { '@mode': 'form_post' };
    
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([
      mode1Component,
      mode2Component
    ]);
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
    
    var codeSpy = sinon.stub();
    var factory = $require('../../../../com/authorize/http/response/code', {
      'oauth2orize': {
        grant: { code: codeSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(codeSpy).to.be.calledOnce;
        expect(codeSpy).to.be.calledWith({
          modes: {
            query: mode1,
            form_post: mode2
          }
        });
        done();
      })
      .catch(done);
  }); // should create response type with response modes
  
  describe('issue', function() {
    var container = new Object();
    container.components = sinon.stub()
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
    var acs = new Object();
    
    var codeSpy = sinon.stub();
    var factory = $require('../../../../com/authorize/http/response/code', {
      'oauth2orize': {
        grant: { code: codeSpy }
      }
    });
    
    var issue;
    
    beforeEach(function(done) {
      acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
      
      factory(acs, logger, container)
        .then(function(type) {
          issue = codeSpy.getCall(0).args[1];
          done();
        })
        .catch(done);
    });
    
    it('should issue authorization code', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example Client'
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true
      }
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.com/cb',
        state: 'xyz'
      }
      
      issue(client, 'https://client.example.com/cb', user, ares, areq, {}, function(err, code) {
        if (err) { return done(err); }
        
        expect(acs.issue.callCount).to.equal(1);
        expect(acs.issue.getCall(0).args[0]).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          }
        });
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        done();
      });
    }); // should issue authorization code
    
    it('should issue authorization code with scope', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example'
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true,
        scope: [ 'openid', 'profile', 'email' ]
      }
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.org/cb',
        state: 'af0ifjsldkj'
      }
      
      issue(client, 'https://client.example.org/cb', user, ares, areq, {}, function(err, code) {
        if (err) { return done(err); }
        
        expect(acs.issue.callCount).to.equal(1);
        expect(acs.issue.getCall(0).args[0]).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example'
          },
          redirectURI: 'https://client.example.org/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          scope: [ 'openid', 'profile', 'email' ]
        });
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        done();
      });
    }); // should issue authorization code with scope
    
    it('should issue authorization code with issuer', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example'
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true,
        issuer: 'https://server.example.com',
        scope: [ 'openid', 'profile', 'email' ]
      }
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.org/cb',
        state: 'af0ifjsldkj'
      }
      
      issue(client, 'https://client.example.org/cb', user, ares, areq, {}, function(err, code) {
        if (err) { return done(err); }
        
        expect(acs.issue.callCount).to.equal(1);
        expect(acs.issue.getCall(0).args[0]).to.deep.equal({
          issuer: 'https://server.example.com',
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example'
          },
          redirectURI: 'https://client.example.org/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          scope: [ 'openid', 'profile', 'email' ]
        });
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        done();
      });
    }); // should issue authorization code with issuer
    
    it('should issue authorization code with authentication context', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example'
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true,
        scope: [ 'openid', 'profile', 'email' ],
        authContext: {
          sessionID: 'YU7uoYRVAxF34TuoAodVfw-1eA13rhqW',
          methods: [
            { method: 'password', timestamp: new Date('2011-07-21T20:42:49.000Z') }
          ]
        }
      }
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.org/cb',
        state: 'af0ifjsldkj'
      }
      
      issue(client, 'https://client.example.org/cb', user, ares, areq, {}, function(err, code) {
        if (err) { return done(err); }
        
        expect(acs.issue.callCount).to.equal(1);
        expect(acs.issue.getCall(0).args[0]).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example'
          },
          redirectURI: 'https://client.example.org/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          scope: [ 'openid', 'profile', 'email' ],
          authContext: {
            sessionID: 'YU7uoYRVAxF34TuoAodVfw-1eA13rhqW',
            methods: [
              { method: 'password', timestamp: new Date('2011-07-21T20:42:49.000Z') }
            ]
          }
        });
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        done();
      });
    }); // should issue authorization code with authentication context
    
    it('should error when encountering an error issuing authorization code', function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
      var acs = new Object();
      acs.issue = sinon.stub().yieldsAsync(new Error('something went wrong'));
    
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/authorize/http/response/code', {
        'oauth2orize': {
          grant: { code: codeSpy }
        }
      });
    
      factory(acs, logger, container)
        .then(function(type) {
          issue = codeSpy.getCall(0).args[1];
          var client = {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          };
          var user = {
            id: '248289761001',
            displayName: 'Jane Doe'
          };
          var ares = {
            allow: true
          }
          var areq = {
            type: 'code',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com/cb',
            state: 'xyz'
          }
          
          issue(client, 'https://client.example.com/cb', user, ares, areq, {}, function(err, code) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.equal('something went wrong');
            expect(code).to.be.undefined;
            done();
          });
        })
        .catch(done);
    }); // should error when encountering an error issuing authorization code
    
  }); // issue
  
  describe('extend', function() {
    
    it('should not extend with no extensions', function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
      var acs = new Object();
      acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
    
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/authorize/http/response/code', {
        'oauth2orize': {
          grant: { code: codeSpy }
        }
      });
    
      factory(acs, logger, container)
        .then(function(type) {
          var extend = codeSpy.getCall(0).args[2];
          var txn = {
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            req: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
              state: 'xyz'
            },
            user: {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            res: {
              allow: true
            }
          };
          
          extend(txn, function(err, params) {
            if (err) { return done(err); }
            expect(params).to.deep.equal({});
            done();
          });
        })
        .catch(done);
    }); // should not extend with no extensions
    
    it('should extend with one extension', function(done) {
      var ext1 = function(txn, cb) {
        expect(txn).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          req: {
            type: 'code',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com/cb',
            state: 'xyz'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          res: {
            allow: true
          }
        });
        
        return cb(null, { session_state: 'c2a7f7f4842520527248dc8cfcfa2a70d786b47b1dc26f29dc1fa7f4069736f3.knrj4ZDIWFQpWAu-pLTTKg' });
      };
      var ext1Component = new Object();
      ext1Component.create = sinon.stub().resolves(ext1);
      
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([
        ext1Component
      ]);
      var acs = new Object();
      acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
    
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/authorize/http/response/code', {
        'oauth2orize': {
          grant: { code: codeSpy }
        }
      });
    
      factory(acs, logger, container)
        .then(function(type) {
          var extend = codeSpy.getCall(0).args[2];
          var txn = {
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            req: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
              state: 'xyz'
            },
            user: {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            res: {
              allow: true
            }
          };
          
          extend(txn, function(err, params) {
            if (err) { return done(err); }
            expect(params).to.deep.equal({
              session_state: 'c2a7f7f4842520527248dc8cfcfa2a70d786b47b1dc26f29dc1fa7f4069736f3.knrj4ZDIWFQpWAu-pLTTKg'
            });
            done();
          });
        })
        .catch(done);
    }); // should extend with one extension
    
    it('should extend with two extensions', function(done) {
      var ext1 = function(txn, cb) {
        expect(txn).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          req: {
            type: 'code',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com/cb',
            state: 'xyz'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          res: {
            allow: true
          }
        });
        
        return cb(null, { cow: 'moo' });
      };
      var ext1Component = new Object();
      ext1Component.create = sinon.stub().resolves(ext1);
      
      var ext2 = function(txn, cb) {
        expect(txn).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          req: {
            type: 'code',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com/cb',
            state: 'xyz'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          res: {
            allow: true
          }
        });
        
        return cb(null, { pig: 'oink' });
      };
      var ext2Component = new Object();
      ext2Component.create = sinon.stub().resolves(ext2);
      
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([
        ext1Component,
        ext2Component
      ]);
      var acs = new Object();
      acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
    
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/authorize/http/response/code', {
        'oauth2orize': {
          grant: { code: codeSpy }
        }
      });
    
      factory(acs, logger, container)
        .then(function(type) {
          var extend = codeSpy.getCall(0).args[2];
          var txn = {
            client: {
              id: 's6BhdRkqt3',
              name: 'My Example Client'
            },
            redirectURI: 'https://client.example.com/cb',
            req: {
              type: 'code',
              clientID: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
              state: 'xyz'
            },
            user: {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            res: {
              allow: true
            }
          };
          
          extend(txn, function(err, params) {
            if (err) { return done(err); }
            expect(params).to.deep.equal({
              cow: 'moo',
              pig: 'oink'
            });
            done();
          });
        })
        .catch(done);
    }); // should extend with two extensions
    
  }); // extend
  
});
