const SHA256 = require('crypto-js/sha256'); // Используем библиотеку для вычисления хэшей SHA256
const EC = require('elliptic').ec; // Используем библиотеку для работы с эллиптическими кривыми
const ec = new EC('secp256k1'); // Создаем экземпляр с параметрами кривой secp256k1

class Transaction {
    
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress; // Адрес отправителя
        this.toAddress = toAddress; // Адрес получателя
        this.amount = amount; // Сумма транзакции
    }

    // Метод для вычисления хэша транзакции
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    // Метод для подписи транзакции с помощью закрытого ключа
    signTransaction(signingKey) {
        if(signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('Вы не можете совершить транзакции на другие кошельки!');
        }

        const hashTx = this.calculateHash(); // Вычисляем хэш транзакции
        const sig = signingKey.sign(hashTx, 'base64'); // Подписываем хэш с использованием закрытого ключа
        this.signature = sig.toDER('hex'); // Преобразуем подпись в формат DER и сохраняем
    }

    // Метод для проверки валидности подписи транзакции
    isValid() {
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0) {
            throw new Error('Нет подписи на данной транзакции');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex'); // Получаем публичный ключ из адреса отправителя
        return publicKey.verify(this.calculateHash(), this.signature); // Проверяем подпись с использованием публичного ключа
    }
}


class Block {
    // Конструктор блока
    constructor(timestamp, transactions, previousHash = ''){
        this.previousHash = previousHash; // Хэш предыдущего блока
        this.timestamp = timestamp; // Временная метка создания блока
        this.transactions = transactions; // Массив транзакций в блоке
        this.nonce = 0; // Используется для доказательства работы (Proof of Work)
        this.hash = this.calculatorHash(); // Хэш текущего блока
    }

    // Метод для вычисления хэша блока
    calculatorHash(){
        return SHA256(this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    // Метод для "добычи" блока с заданной сложностью
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculatorHash();
        }

        console.log("Блок смайнен: " + this.hash);
    }

    // Метод для проверки валидности транзакций в блоке
    hasValidTransactions() {
        for(const tx of this.transactions) {
            if(!tx.isValid()) {
                return false; // Если хотя бы одна транзакция невалидна, возвращается false
            }
        }

        return true; // Все транзакции в блоке валидны
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()]; // Массив цепочки блоков, начинается с генезис-блока
        this.difficulty = 3; // Сложность доказательства работы (PoW)
        this.pendingTransactions = []; // Массив ожидающих транзакций
        this.miningReward = 50; // Награда за майнинг
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2023", "Genesis Block", "0"); // Создание генезис-блока
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]; // Получение последнего блока в цепочке
    }

    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Блок успешно смайнен!");
        this.chain.push(block); // Добавление смайненного блока в цепочку

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Транзакция должна включать from и to адреса');
        }

        if(!transaction.isValid()) {
            throw new Error('Нельзя добавить некорректную транзакцию в цепь(chain)');
        }

        this.pendingTransactions.push(transaction); // Добавление транзакции в ожидающие
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance; // Получение баланса адреса
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()) {
                return false; // Проверка валидности транзакций в текущем блоке
            }

            if (currentBlock.hash !== currentBlock.calculatorHash()){
                return false; // Проверка правильности хэша текущего блока
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false; // Проверка связности блоков по хэшам
            }
        }

        return true; // Если все проверки пройдены, цепочка считается валидной
    }
}


module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;