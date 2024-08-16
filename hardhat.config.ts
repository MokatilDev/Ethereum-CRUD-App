import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    sepolia: {
      url: "", // Replace your sepolia.infura.io url
      accounts: [""] // Replace your wallet privect key
    },
    hardhat: {
      chainId: 1337
    }
  },
  paths: {
    artifacts: "./client/artifacts"
  },
  typechain: {
    outDir: "./types",
  },
  etherscan: {
    apiKey: "", // Replace you etherscan api key 
  },
};

export default config;
