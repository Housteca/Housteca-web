import Loan from "../contracts/Loan";
import Housteca from "../contracts/Housteca";
import { getWeb3 } from "./web3";

const cache = {};

const getContract = async contract => {
    const contractName = contract.contractName;
    try {
        if (cache[contractName]) {
            return cache[contractName];
        }
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = contract.networks[networkId];
        const instance = new web3.eth.Contract(
            contract.abi,
            deployedNetwork && deployedNetwork.address,
        );
        cache[contractName] = instance;
        return instance;
    } catch (e) {
        console.error(e);
    }
};

export const getHoustecaContract = async () => await getContract(Housteca);
export const getLoanContract = async () => await getContract(Loan);
