import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Test Functions of Manager.sol", function () {
  let manager;

  async function deployManagerFixture() {
    const amount = hre.ethers.parseEther("1");

    const manager = await hre.ethers.deployContract("Manager", {
      value: amount
    });

    return { manager };
  }

  it("Should return empty array", async function () {
    const { manager } = await loadFixture(deployManagerFixture);

    expect(await manager.getTickets()).to.deep.equal([]);
  });

  it("Should create a new ticket", async function () {
    const { manager } = await loadFixture(deployManagerFixture);
    await manager.createTicket("mokatildev")
    const tickets = await manager.getTickets();

    expect(tickets[0].name).to.equal("mokatildev");
  });

  it("Should update the ticket name", async function () {
    const { manager } = await loadFixture(deployManagerFixture);
    await manager.updateTicket(0, "Mokatil Dev");
    const tickets = await manager.getTickets();

    expect(tickets[0].name).to.equal("Mokatil Dev");
  })

  it("Should update the ticket status", async function () {
    const { manager } = await loadFixture(deployManagerFixture);
    await manager.updateTicketStatus(0, 2);
    const tickets = await manager.getTickets();

    expect(tickets[0].status).to.equal(1);
  })
});