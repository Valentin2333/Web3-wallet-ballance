import React, { useState } from "react";
import axios from "axios";

function App() {
    const chain = "ethereum";
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState("");

    const fetchBalance = async () => {
        try {
            setError("");
            setBalance(null);
            const response = await axios.get(`http://localhost:5000/balance/${chain}/${address}`);
            setBalance(response.data.balance);
        } catch (err) {
            setError("Invalid address or network error.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Ethereum Wallet Balance Tracker</h1>

            <p>{chain.toUpperCase()}</p>

            <input
                type="text"
                placeholder="Enter Wallet Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ padding: "10px", width: "300px", marginLeft: "10px" }}
            />

            <button onClick={fetchBalance} style={{ marginLeft: "10px", padding: "10px" }}>
                Get Balance
            </button>

            {balance !== null && <h2>Balance: {balance} ETH</h2>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default App;
