'use strict';

var should = require('chai').should();
var bitcore = require('../../..');
var Transaction = bitcore.Transaction;
var PrivateKey = bitcore.PrivateKey;

describe('PublicKeyInput', function() {

  var utxo = {
    txid: 'fc9261b9c7fb93909f70358a334ea626c4f125ada65893186b6b192d5d7fa1e8',
    vout: 0,
    address: 'B4iiEedNqktxNkH77XseuG7Uw1Bqp3FBHL',
    scriptPubKey: '76a91402f4ced1e1d893ee3eb384ef9ec62f076343375688ac',
    amount: 651.51137473,
    confirmations: 104,
    spendable: true
  };
  var privateKey = PrivateKey.fromWIF('Ty4KmDFz3zMo6aciHj2iTR3urreFYqPmLSBHFjUSJ6dQpxsxWqWK');
  var address = privateKey.toAddress();
  utxo.address.should.equal(address.toString());

  var destKey = new PrivateKey();

  it('will correctly sign a publickey out transaction', function() {
    var tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    tx.sign(privateKey);
    tx.inputs[0].script.toBuffer().length.should.be.above(0);
  });

  it('count can count missing signatures', function() {
    var tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    var input = tx.inputs[0];
    input.isFullySigned().should.equal(false);
    tx.sign(privateKey);
    input.isFullySigned().should.equal(true);
  });

  it('it\'s size can be estimated', function() {
    var tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    var input = tx.inputs[0];
    input._estimateSize().should.equal(73);
  });

  it('it\'s signature can be removed', function() {
    var tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    var input = tx.inputs[0];
    tx.sign(privateKey);
    input.isFullySigned().should.equal(true);
    input.clearSignatures();
    input.isFullySigned().should.equal(false);
  });

  it('returns an empty array if private key mismatches', function() {
    var tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    var input = tx.inputs[0];
    var signatures = input.getSignatures(tx, new PrivateKey(), 0);
    signatures.length.should.equal(0);
  });

});
