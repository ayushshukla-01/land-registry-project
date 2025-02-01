import React, { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "YOUR_SMART_CONTRACT_ADDRESS";
const abi = [ /* Paste ABI here from compiled Solidity contract */ ];

function App() {
    const [walletAddress, setWalletAddress] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address);
            console.log("Connected Wallet:", address);
        } else {
            alert("MetaMask not detected!");
        }
    };

    const registerLand = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const tx = await contract.registerLand(location, ethers.utils.parseEther(price));
            await tx.wait();
            console.log("Land Registered Successfully");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="App">
            <h1>Land Registry</h1>
            {walletAddress ? (
                <div>
                    <p>Connected Wallet: {walletAddress}</p>
                    <div>
                        <h2>Register Land</h2>
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Price in ETH"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <button onClick={registerLand}>Register Land</button>
                    </div>
                </div>
            ) : (
                <button onClick={connectWallet}>Connect MetaMask</button>
            )}
        </div>
    );
}

export default App;
