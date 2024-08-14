// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Manager {
    struct Ticket {
        string name;
        uint8 status;
    }

    Ticket[] public tickets;

    constructor() payable {}

    function createTicket(string memory _name) external {
        tickets.push(Ticket(_name, 0));
    }

    function updateTicket(uint _index, string memory _name) external {
        tickets[_index].name = _name;
    }

    function updateTicketStatus(uint _index, uint8 _status) external {
        tickets[_index].status = _status;
    }

    function getTickets() external view returns (Ticket[] memory) {
        return tickets;
    }
}
