"use client";

import { useEffect, useRef, useState } from "react";
import { ITicket } from "@/types/ticket";
import { ethers } from "ethers";
import { Contract } from "ethers";
import ManagerContract from "../artifacts/contracts/Manager.sol/Manager.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [name, setName] = useState("");
  const [account, setAccount] = useState<string | undefined>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const getTickets = async () => {
    const res = await contract?.getTickets();
    const ticketValues = res.map((ticket: ITicket, i: number) => ({
      id: i + 1,
      name: ticket.name,
      status: Number(ticket.status),
    }));
    setTickets(ticketValues);

    console.log(tickets);
  };

  const createTicket = async (_name: string) => {
    const res = await contract?.createTicket(_name);
    await res.wait();
    getTickets();
    setName("");
  };

  const initConnection = async () => {
    if (typeof window.ethereum != undefined) {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      let provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setAccount(() => {
        return account[0];
      });

      setContract(() => {
        return new ethers.Contract(
          "0xBbe89f115E9eE10CbD8fa1d0b4C40815b51AB629", // Replace your contract address
          ManagerContract.abi,
          signer
        );
      });

      if(contract){
        getTickets();
      }
    } else {
      console.log("Please install metamask"); // You can use react-hot-toast
      return;
    }
  };

  useEffect(() => {
    initConnection();
  }, []);

  return (
    <main className="flex justify-center text-center items-center  flex-col">
      <header className="w-full">
        <nav className="py-3 max-md:flex-col gap-2 flex container justify-between items-center ">
          <div>
            <h1 className="font-bold text-xl">Task Manager</h1>
          </div>
          <div>
            {account ? (
              <Button variant="outline">
                Wallet : {account.substring(0, 20)}...
              </Button>
            ) : (
              <Button variant="outline" onClick={() => initConnection()}>
                Connect Wallet
              </Button>
            )}
          </div>
        </nav>
      </header>

      <div className="flex mt-3 max-md:flex-col gap-3 justify-between items-center container w-full">
        <div className="flex gap-3">
          <Input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <Button onClick={() => createTicket(name)}>Create Ticket</Button>
        </div>

        <Button onClick={() => getTickets()}>Refreach</Button>
      </div>

      <div className="grid max-md:grid-cols-1 grid-cols-3  mt-5 container w-full gap-5">
        <div>
          <div className="py-4 px-4 border-dashed border rounded mt-3 border-gray-400 bg-gray-400/10 text-start">
            <h1 className="text-center font-bold">Pending :</h1>
            <div className="flex flex-col gap-4 mt-4">
              {tickets
                .filter((ticket) => ticket.status == 0)
                .map((ticket, index) => {
                  return (
                    <div key={index}>
                      <h1 className="text-base mb-2">
                        #{ticket.id} - {ticket.name}
                      </h1>
                      <div className="flex gap-3 flex-wrap">
                        <Button
                          size={"sm"}
                          onClick={async () => {
                            const tx = await contract?.updateTicketStatus(
                              ticket.id - 1,
                              1
                            );
                            await tx.wait();
                            getTickets();
                          }}
                          className="bg-amber-300 hover:bg-amber-300/90"
                        >
                          In Progress
                        </Button>
                        <Button
                          size={"sm"}
                          onClick={async () => {
                            const tx = await contract?.updateTicketStatus(
                              ticket.id - 1,
                              2
                            );
                            await tx.wait();
                            getTickets();
                          }}
                          className="bg-green-400 hover:bg-green-400/90"
                        >
                          Finished
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size={"sm"}>Rename</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Rename Ticket</DialogTitle>
                              <DialogDescription>
                                Write The new name of ticket
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  defaultValue={ticket.name}
                                  ref={renameInputRef}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={async () => {
                                  if(!renameInputRef.current?.value) return;

                                  const tx = await contract?.updateTicket(
                                    ticket.id - 1,
                                    renameInputRef.current?.value
                                  );
                                  await tx.wait();
                                  getTickets();
                                }}
                              >
                                Save changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div>
          <div className="py-4 px-4 border-dashed border rounded mt-3 border-amber-300 bg-amber-300/10 text-start">
            <h1 className="text-center font-bold">In Progress :</h1>
            <div className="flex flex-col gap-4 mt-4">
              {tickets
                .filter((ticket) => ticket.status == 1)
                .map((ticket, index) => {
                  return (
                    <div key={index}>
                      <h1 className="text-base mb-2">
                        #{ticket.id} - {ticket.name}
                      </h1>
                      <div className="flex gap-3 flex-wrap">
                        <Button
                          size={"sm"}
                          onClick={async () => {
                            const tx = await contract?.updateTicketStatus(
                              ticket.id - 1,
                              2
                            );
                            await tx.wait();
                            getTickets();
                          }}
                          className="bg-green-400 hover:bg-green-400/90"
                        >
                          Finished
                        </Button>
                        <Button
                          size={"sm"}
                          onClick={async () => {
                            const tx = await contract?.updateTicketStatus(
                              ticket.id - 1,
                              0
                            );
                            await tx.wait();
                            getTickets();
                          }}
                          className="bg-gray-300 hover:bg-gray-300/90"
                        >
                          Pending
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size={"sm"}>Rename</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Rename Ticket</DialogTitle>
                              <DialogDescription>
                                Write The new name of ticket
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  defaultValue={ticket.name}
                                  ref={renameInputRef}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={async () => {
                                  if(!renameInputRef.current?.value) return;

                                  const tx = await contract?.updateTicket(
                                    ticket.id - 1,
                                    renameInputRef.current?.value
                                  );
                                  await tx.wait();
                                  getTickets();
                                }}
                              >
                                Save changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div>
          <div className="py-4 px-4 border-dashed border  rounded mt-3 border-green-400 bg-green-400/10 text-start">
            <h1 className="text-center font-bold">Finished :</h1>
            <div className="flex flex-col gap-4 mt-4">
              {tickets
                .filter((ticket) => ticket.status == 2)
                .map((ticket, index) => {
                  return (
                    <div key={index}>
                      <h1 className="text-base mb-2">
                        #{ticket.id} - {ticket.name}
                      </h1>
                      <div className="flex gap-3 flex-wrap  ">
                        <Button
                          size={"sm"}
                          onClick={async () => {
                            const tx = await contract?.updateTicketStatus(
                              ticket.id - 1,
                              1
                            );
                            await tx.wait();
                            getTickets();
                          }}
                          className="bg-amber-300 hover:bg-amber-300/90"
                        >
                          In Progress
                        </Button>
                        <Button
                          size={"sm"}
                          onClick={async () => {
                            const tx = await contract?.updateTicketStatus(
                              ticket.id - 1,
                              0
                            );
                            await tx.wait();
                            getTickets();
                          }}
                          className="bg-gray-300 hover:bg-gray-300/90"
                        >
                          Pending
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size={"sm"}>Rename</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Rename Ticket</DialogTitle>
                              <DialogDescription>
                                Write The new name of ticket
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  defaultValue={ticket.name}
                                  ref={renameInputRef}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={async () => {
                                  if(!renameInputRef.current?.value) return;

                                  const tx = await contract?.updateTicket(
                                    ticket.id - 1,
                                    renameInputRef.current?.value
                                  );
                                  await tx.wait();
                                  getTickets();
                                }}
                              >
                                Save changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
