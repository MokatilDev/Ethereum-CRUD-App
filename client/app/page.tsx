"use client";

import { useEffect, useState } from "react";
import { ITicket } from "@/types/ticket";
import { ethers } from "ethers";
import { Contract } from "ethers";
import ManagerContract from "../artifacts/contracts/Manager.sol/Manager.json";

interface IManager {
  getTickets: () => any[];
  
}

export default function Home() {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState<Contract | null>();
  const [tickets, setTickets] = useState<ITicket[]>([]);

  const getTickets = async () => {
    const res = await contract?.getTickets();
    console.log(res);
    setTickets(tickets);
  };

  const createTicket = async (_name: string) => {
    const res = await contract?.createTicket();
  };

  const initConnection = async () => {
    let provider;

    if (typeof window.ethereum != undefined) {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setAccount(() => {
        return account[0];
      });

      setContract(() => {
        return new ethers.Contract(
          "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
          ManagerContract.abi,
          signer
        );
      });
    } else {
      console.log("Please install metamask");
      return;
    }
  };

  useEffect(() => {
    initConnection();
  }, []);

  console.log(contract);

  return (
    <main>
      <button onClick={() => initConnection()}>Connect Wallet</button>
      <p>{account}</p>
      <button onClick={() => getTickets()}>Get Tickets</button>
    </main>
  );
}
