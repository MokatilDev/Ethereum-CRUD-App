import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import hre from "hardhat";

// const amount = hre.ethers.parseEther("1");

const ManagerModule = buildModule("ManagerModule", (m) => {
  // const Amount = m.getParameter("amount", amount);

  const manager = m.contract("Manager");

  return { manager };
});

export default ManagerModule;
