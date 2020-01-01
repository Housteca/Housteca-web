import Web3 from "web3";

let cachedWeb3 = null;

export const getWeb3 = () =>
    new Promise((resolve, reject) => {
        if (cachedWeb3) {
            resolve(cachedWeb3);
        }
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener("load", async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                    // Accounts now exposed
                    cachedWeb3 = web3;
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                // Use Mist/MetaMask's provider.
                const web3 = window.web3;
                console.log("Injected web3 detected.");
                cachedWeb3 = web3;
                resolve(web3);
            }
            // Fallback to localhost; use dev console port by default...
            else {
                const provider = new Web3.providers.HttpProvider(
                    "http://localhost:7545/"
                );
                const web3 = new Web3(provider);
                console.log("No web3 instance injected, using Local web3.");
                cachedWeb3 = web3;
                resolve(web3);
            }
        });
    });


export const getDefaultAccount = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
};

export const toAmount = s => (s * 1e18).toLocaleString('fullwide', {useGrouping:false});
export const fromAmount = s => (parseFloat(s) / 1e18).toFixed(2);
export const toRatio = s => (s * 1e16).toLocaleString('fullwide', {useGrouping:false});
export const fromRatio = s => (parseFloat(s) / 1e16).toFixed(2);
