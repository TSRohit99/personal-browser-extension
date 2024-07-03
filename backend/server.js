const express = require("express");
const app = express();
const cors = require("cors");
const run = require("./integrateGemini");
const { Web3 } = require("web3");
const BigNumber = require("bignumber.js");
require("dotenv").config();

const port = 3000;
app.use(cors());
// app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend of personal extention");
});

const RPC_URL = "https://arb1.arbitrum.io/rpc";

const web3 = new Web3(RPC_URL);

app.get("/generate", async (req, res) => {
  const topic = req.query.topic;

  try {
    const result = await run(topic);
    res.status(200).json(result); // Send JSON response
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Issues in query or backend" }); // Send JSON error response
  }
});

app.get("/token/:address", async (req, res) => {
  const tokenAddress = req.params.address;

  const url = `https://api.coingecko.com/api/v3/simple/token_price/arbitrum-one?contract_addresses=${tokenAddress}&vs_currencies=usd`;
  let price;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if(data[tokenAddress]){
      price = data[tokenAddress].usd
    }
    else {
      price = "Data not found";
    }

  } catch (error) {
    console.error('Error fetching token price:', error);
    }

  const ERC20_ABI = [
    // Some details about the token
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "MAX_SUPPLY",
      outputs: [{ name: "", type: "uint256" }],
      type: "function",
    },
  ];

 
  

  try {
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
    const name = await tokenContract.methods.name().call();
    const symbol = await tokenContract.methods.symbol().call();
    const decimals = await tokenContract.methods.decimals().call();
    const totalSupply = await tokenContract.methods.totalSupply().call();
    const MAX_SUPPLY = await tokenContract.methods.MAX_SUPPLY().call();

    const decimalsBN = new BigNumber(decimals);
    const divisor = new BigNumber(10).pow(decimalsBN);

    const totalSupplyDecimal = new BigNumber(totalSupply).div(divisor);
    const maxSupplyDecimal = new BigNumber(MAX_SUPPLY).div(divisor);
    let circSupplyDecimal;
    if(name==="WINR"){
      circSupplyDecimal = totalSupplyDecimal.minus(17530254);
    } else 
    circSupplyDecimal = "Not found";

    res.json({
      name,
      symbol,
      price,
      decimals: decimals.toString(),
      totalSupply: totalSupplyDecimal.toFixed(2),
      MAX_SUPPLY: maxSupplyDecimal.toFixed(2), // Trim to specified decimal places
      circ_supply: circSupplyDecimal.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch token data" });
  }
});

app.listen(port, async () => {
  console.log(`Running on port ${port}`);
});
