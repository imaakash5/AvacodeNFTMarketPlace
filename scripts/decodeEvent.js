var Web3 = require('web3');

// const web3 = new Web3(new Web3.providers.WebsocketProvider(`https://data-seed-prebsc-1-s1.binance.org:8545/`));
// const web3 = new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
const web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/")); // your web3 provider

async function decodeEvent(data,topics){
    const logs=await web3.eth.abi.decodeLog([
            {"indexed":true,"internalType":"address","name":"owner","type":"uint256"},
            {"indexed":true,"internalType":"address","name":"owner","type":"address"},
            {"indexed":true,"internalType":"address","name":"nft","type":"address"},
            {"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},
            {"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},
            {"indexed":false,"internalType":"address","name":"payToken","type":"address"},
            {"indexed":false,"internalType":"uint256","name":"pricePerItem","type":"uint256"},
            {"indexed":false,"internalType":"uint256","name":"startingTime","type":"uint256"}
        ],
        data,
        topics
    );
    return logs
}

async function decodeUpdateListing(data, topics){
    const logs=await web3.eth.abi.decodeLog([
        {"indexed":true,"internalType":"address","name":"owner","type":"uint256"},
        {"indexed":true,"internalType":"address","name":"owner","type":"address"},
        {"indexed":true,"internalType":"address","name":"nft","type":"address"},
        {"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},
        {"indexed":false,"internalType":"address","name":"payToken","type":"address"},
        {"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}
    ],
    data,
    topics
    );

    return logs
}

async function decodeCollectionCreation(data, topics){
    const logs=await web3.eth.abi.decodeLog([
        {"indexed":false,"internalType":"address","name":"creator","type":"address"},
        {"indexed":false,"internalType":"address","name":"nft","type":"address"}
    ],
    data,
    topics
    );

    return logs
}

async function decodeMint(data, topics){
    const logs=await web3.eth.abi.decodeLog([
        {"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},
        {"indexed":true,"internalType":"address","name":"from","type":"address"},
        {"indexed":true,"internalType":"address","name":"to","type":"address"},
        {"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}
    ],
    data,
    topics
    );

    return logs
}

const main = async (txHash = "0xf4cf5b1b875905cdde26b30cd76954478840caf286e8c5f1c48b5d7009a95477") => {
    console.log({txHash})
    const logs = await web3.eth.getTransactionReceipt(txHash);
    console.log({
        logs,
        data: logs.logs[0]
    })
    // const eventData = await decodeEvent(logs.logs[1].data, logs.logs[1].topics)
    // console.log({
    //     eventData
    // })
    const eventData = await decodeMint(logs.logs[0].data, logs.logs[0].topics)
    console.log({
        eventData
    })
}

main().then(
    text => {
        // console.log(text);
    },
    err => {
        console.log(err)
        // Deal with the fact the chain failed
    }
);

