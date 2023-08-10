const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('855593c4ca7b3a651beeddc4168cc3cd7792fee693a959df1977a73fbc724f2c');
const myWalletAddress = myKey.getPublic('hex');

let tettaCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'someone else', 10);
tx1.signTransaction(myKey);
tettaCoin.addTransaction(tx1);

console.log('\nStarting the miner...');
tettaCoin.minePendingTransactions(myWalletAddress);

console.log('\nБаланс пользователя Vassago: ', tettaCoin.getBalanceOfAddress(myWalletAddress));

tx1.sentVisible();


const myKey2 = ec.keyFromPrivate('707f499ea0ef8d8f4c9a670d566891347b4bcec1b625433a7a3919fdaca73a04');
const myWalletAddress2 = myKey2.getPublic('hex');

const tx2 = new Transaction(myWalletAddress2, myWalletAddress, 15);
tx2.signTransaction(myKey2);
tettaCoin.addTransaction(tx2);

console.log('\nStarting the miner again...');
tettaCoin.minePendingTransactions(myWalletAddress2);

console.log('\nБаланс пользователя New_Member: ', tettaCoin.getBalanceOfAddress(myWalletAddress2));

tx2.sentVisible();

console.log('\nБаланс пользователя Vassago: ', tettaCoin.getBalanceOfAddress(myWalletAddress));

//First commit