var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/http/transactionstore');
var TransactionStore = require('../../lib/transactionstore');


describe('transactionstore', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('should construct TransactionStore', function() {
    var TransactionStoreSpy = sinon.spy(TransactionStore);
    var factory = $require('../../com/http/transactionstore', {
      '../../lib/transactionstore': TransactionStoreSpy
    });
    
    var store = factory();
  
    expect(TransactionStoreSpy).to.have.been.calledOnce;
    expect(TransactionStoreSpy).to.have.been.calledWithNew;
    expect(store).to.be.an.instanceOf(TransactionStore);
  }); // creating with defaults
  
  
  describe('TransactionStore', function() {
    var store = new TransactionStore();
    
  }); // TransactionStore
  
});
