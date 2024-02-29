// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketBooking {
    address public owner;
    uint256 public totalTickets;

    uint256 public PRICE = 0.001 ether;
    uint256 public travelDuration;

    struct Ticket {
        address userAddress;
        string name;
        uint256 age;
        string gender;
        string country;
        uint256 salesPrice;
        uint256 travelDate;
        uint256 travelDuration;
        uint256 seatNumber;
        uint256 spaceshipNumber;
    }

    mapping(uint256 => Ticket) private tickets;

    event TicketBooked(
        uint256 indexed ticketNumber,
        address indexed userAddress,
        string name,
        string email
    );
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event SeatNumberAssigned(uint256 indexed ticketNumber, uint256 seatNumber);
    event SpaceshipNumberAssigned(
        uint256 indexed ticketNumber,
        uint256 spaceshipNumber
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyExistTicket(uint256 _ticketId) {
        require(tickets[_ticketId].userAddress != address(0), "Invalid ticket number");
        _;
    }

    constructor() {
        owner = msg.sender;
        travelDuration = 20;
    }

    function bookTicket(
        string memory _name,
        uint256 _age,
        string memory _gender,
        string memory _country,
        uint256 _travelDate
    ) external payable  {
        require(msg.value == PRICE, "Invalid price send");
        totalTickets++;
        tickets[totalTickets] = Ticket(
            msg.sender,
            _name,
            _age,
            _gender,
            _country,
            PRICE,
            _travelDate,
            travelDuration,
            0,
            0
        );
        payable(owner).transfer(msg.value);
        emit TicketBooked(totalTickets, msg.sender, _name, _country);
    }

    function getTicketDetails(uint256 _ticketNumber)
        external
        onlyExistTicket(_ticketNumber)
        view
        returns (
            address,
            string memory,
            uint256,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        Ticket storage ticket = tickets[_ticketNumber];
        require(
            msg.sender == ticket.userAddress || msg.sender == owner,
            "Unauthorized access"
        );

        return (
            ticket.userAddress,
            ticket.name,
            ticket.age,
            ticket.gender,
            ticket.country,
            ticket.salesPrice,
            ticket.travelDate,
            ticket.travelDuration,
            ticket.seatNumber,
            ticket.spaceshipNumber
        );
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function assignSeatNumber(uint256 _ticketNumber, uint256 _seatNumber)
        external
        onlyOwner
        onlyExistTicket(_ticketNumber)
    {
        tickets[_ticketNumber].seatNumber = _seatNumber;
        emit SeatNumberAssigned(_ticketNumber, _seatNumber);
    }

    function assignSpaceshipNumber(
        uint256 _ticketNumber,
        uint256 _spaceshipNumber
    ) external onlyOwner onlyExistTicket(_ticketNumber) {
        tickets[_ticketNumber].spaceshipNumber = _spaceshipNumber;
        emit SpaceshipNumberAssigned(_ticketNumber, _spaceshipNumber);
    }
}
