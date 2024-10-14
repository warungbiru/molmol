// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21 <0.9.0;

contract Tickets {
    // Jumlah total tiket
    uint256 public constant TOTAL_TICKETS = 10;

    // Pemilik kontrak
    address public owner;

    // Struktur data untuk tiket
    struct Ticket {
        uint256 price;  // Harga tiket dalam Wei
        address owner;  // Pemilik tiket
    }

    // Array tiket
    Ticket[TOTAL_TICKETS] public tickets;

    // Constructor untuk menginisialisasi tiket
    constructor() {
        owner = msg.sender; // Set pemilik kontrak ke alamat pengirim
        for (uint256 i = 0; i < TOTAL_TICKETS; i++) {
            tickets[i].price = 1e17; // 0.1 ETH (dalam Wei)
            tickets[i].owner = address(0); // Alamat kosong
        }
    }

    // Fungsi untuk membeli tiket
    function buyTicket(uint256 _index) external payable {
        require(_index < TOTAL_TICKETS, "Index out of bounds");
        require(tickets[_index].owner == address(0), "Ticket already sold");
        require(msg.value >= tickets[_index].price, "Insufficient payment");

        // Transfer tiket ke pembeli
        tickets[_index].owner = msg.sender;
    }

    // Fungsi untuk mendapatkan detail tiket
    function getTicket(uint256 _index) external view returns (Ticket memory) {
        require(_index < TOTAL_TICKETS, "Index out of bounds");
        return tickets[_index];
    }
}
