const ipfsImageURI = 'ipfs://QmU1ft4LZuxa5DprZX3wxrN1YACtuY2NZe74YaEtbGVanP';

const basePath = process.cwd();
const fs = require("fs");

let data = JSON.parse(fs.readFileSync(`/Users/gurkaransahni/Downloads/avocado/json/_metadata.json`));
for (let i = 0; i < data.length; i++) {
    data[i].image = `ipfs://QmU1ft4LZuxa5DprZX3wxrN1YACtuY2NZe74YaEtbGVanP/${data[i].edition}.png`;
    fs.writeFileSync(`/Users/gurkaransahni/Downloads/avocado/json/${data[i].edition}.json`, JSON.stringify(data[i], null, 2));
}

// for (let i = 1; i < 12002; i++) {
//     let data = JSON.parse(fs.readFileSync(`${basePath}/ipfs/dummy/${i}.json`));
//     data.image = ipfsImageURI + `/${i}.png`;
//     console.log({
//         data
//     })
//     fs.writeFileSync(`${basePath}/ipfs/dummy/${i}.json`, JSON.stringify(data, null, 2));
// }

console.log("url updated")