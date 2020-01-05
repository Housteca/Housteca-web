import Loan from "../contracts/Loan";
import Housteca from "../contracts/Housteca";
import ERC20 from "../contracts/ERC20";
import { getWeb3 } from "./web3";

const getContract = async (contract, address) => {
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = contract.networks[networkId];
    return new web3.eth.Contract(
        contract.abi,
        address || (deployedNetwork && deployedNetwork.address),
    );
};

export const getHoustecaContract = async () => await getContract(Housteca);
export const getLoanContract = async address => await getContract(Loan, address);
export const getERC20Contract = async address => await getContract(ERC20, address);
export const parseDatetime = datetime => {
    if (!datetime || datetime === '0') {
        return '-';
    }
    return new Date(datetime * 1000).toISOString().split('T')[0];
};
export const parseStatus = status => {
    switch(parseInt(status)) {
        case 0:  // AWAITING_STAKE
            return 'Esperando stake inicial';
        case 1:  // FUNDING
            return 'Abierto a inversión';
        case 2:  // AWAITING_SIGNATURES
            return 'Esperando firmas';
        case 3:  // ACTIVE
            return 'Activo';
        case 4:  // FINISHED
            return 'Terminado';
        case 5:  // UNCOMPLETED
            return 'Incompleto';
        case 6:  // DEFAULT
            return 'Default';
        case 7:  // BANKRUPT
            return 'Bancarrota';
        default:
            return 'Desconocido';
    }
};
