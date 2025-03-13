require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const solanaWeb3 = require("@solana/web3.js");

const app = express();
app.use(cors());
app.use(express.json());

const EVM_CHAINS = {
    ethereum: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
};

async function getEVMChainBalance(chain, address) {
  if (!EVM_CHAINS[chain]) throw new Error(`Unsupported EVM chain: ${chain}`);

  try {
      const checksummedAddress = ethers.getAddress(address);

      const provider = new ethers.JsonRpcProvider(EVM_CHAINS[chain]);
      const balance = await provider.getBalance(checksummedAddress);

      return ethers.formatEther(balance);
  } catch (error) {
      throw new Error(`Failed to fetch balance from ${chain}: ${error.message}`);
  }
}

app.get("/balance/:chain/:address", async (req, res) => {
    const { chain, address } = req.params;
    try {
        let balance;
        if (chain === "solana") {
            balance = await getSolanaBalance(address);
        } else if (EVM_CHAINS[chain]) {
            balance = await getEVMChainBalance(chain, address);
        } else {
            throw new Error("Unsupported chain");
        }
        res.json({ chain, address, balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
