import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337, 
    },
  },
  paths: {
    artifacts: "./client/artifacts"
  },
  typechain: {
    outDir: "./types",
  }
};

export default config;
