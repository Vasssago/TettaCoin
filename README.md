# Блокчейн на JavaScript: Простая Реализация

**Этот блокчейн представляет собой базовую реализацию технологии блокчейн на языке JavaScript. Он включает в себя классы для блоков, транзакций и цепочки блоков, а также функции для создания, майнинга и проверки транзакций. Ниже приведена краткая документация по каждой части этой реализации.**

## Класс Block
##### Этот класс представляет блок в цепочке блоков и включает в себя следующие свойства и методы:

	constructor(timestamp, transactions, previousHash = '') 
Конструктор, который инициализирует свойства блока, такие как предыдущий хэш, временная метка, массив транзакций, nonce и хэш блока.

	calculatorHash() 
Метод для вычисления хэша блока на основе его свойств и nonce.

	mineBlock(difficulty) 
Метод для "добычи" блока с заданной сложностью, используя Proof of Work.

	hasValidTransactions() 
Метод для проверки валидности всех транзакций в блоке.

## Класс Transaction 
##### Этот класс представляет транзакцию между адресами и включает в себя следующие свойства и методы:

	constructor(fromAddress, toAddress, amount) 
Конструктор для создания объекта транзакции с адресом отправителя, адресом получателя и суммой.

	calculateHash() 
Метод для вычисления хэша транзакции на основе свойств.

	signTransaction(signingKey) 
Метод для подписи транзакции с использованием закрытого ключа.

	isValid() 
Метод для проверки валидности подписи транзакции и корректности данных.

## Класс Blockchain 
##### Этот класс представляет цепочку блоков и включает в себя следующие свойства и методы:

	constructor() 
Конструктор, который инициализирует начальный генезис-блок и другие параметры.

	createGenesisBlock() 
Метод для создания генезис-блока.

	getLatestBlock() 
Метод для получения последнего блока в цепочке.

	minePendingTransactions(miningRewardAddress)
Метод для майнинга нового блока с ожидающими транзакциями.

	addTransaction(transaction) 
Метод для добавления новой транзакции в список ожидающих.

	getBalanceOfAddress(address) 
Метод для расчета баланса адреса в цепочке блоков.

	isChainValid() 
Метод для проверки валидности цепочки блоков с учетом транзакций и хэшей. 

#
>Примечание: Эта реализация блокчейна предоставляет только базовую структуру и функциональность, не включая, например, механизмы сетевой связи или долгосрочное сохранение данных. Она предоставляет понимание основных концепций блокчейна, таких как блоки, транзакции, хэши и Proof of Work.
