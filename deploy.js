const ethers = require("ethers")
// const solc = require("solc")
const fs = require("fs-extra")
require("dotenv").config();

async function main() {
    let provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545")
    const wallet = new ethers.Wallet("0x67655b4d825a4c7b929b251a94c3bd36d23d3f9a704c52e467d1699893d74d62", provider);

    const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf-8');
    const bin = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.bin', 'utf-8');

    const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
    // console.log('Contract is deploying');
    const contract = await contractFactory.deploy();
    await contract.deploymentTransaction().wait(1);
    // console.log(await contract.getAddress());

    // tx = {
    //   nonce: await wallet.getNonce(),
    //   gasPrice: 100000000000,
    //   gasLimit: 1000000,
    //   to: null,
    //   value: 0,
    //   data: `0x${bin}`,
    //   chainId: 1337,
    
    // }

    // console.log(await wallet.sendTransaction(tx));

    const favoriteNumber = await contract.retrieve();
    console.log(`current favorite number is ${favoriteNumber.toString()}`);
    await contract.store("1907");
    const newFavorite = await contract.retrieve();
    console.log(`new favorite number is ${newFavorite.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })