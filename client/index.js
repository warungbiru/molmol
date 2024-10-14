import Web3 from 'web3';
import configuration from '../build/contracts/Tickets.json';
import 'bootstrap/dist/css/bootstrap.css';

// Mendapatkan elemen DOM tempat akun dan tiket akan ditampilkan
const accountEl = document.getElementById('account');
const ticketsEl = document.getElementById('tickets');

const TOTAL_TICKETS = 10;

const refreshTickets = async () => {
    ticketsEl.innerHTML = '';
    for (let i = 0; i < TOTAL_TICKETS; i++) {
      const ticket = await contract.methods.tickets(i).call();
      ticket.id = i;
      if (ticket.owner === EMPTY_ADDRESS) {
        const ticketEl = createElementFromString(
          `<div class="ticket card" style="width: 18rem;">
            <img src="${ticketImage}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">Ticket</h5>
              <p class="card-text">${
                ticket.price / 1e18
              } Eth</p>
              <button class="btn btn-primary">Buy Ticket</button>
            </div>
          </div>`
        );
        ticketEl.onclick = buyTicket.bind(null, ticket);
        ticketsEl.appendChild(ticketEl);
      }
    }
  };

const CONTRACT_ADDRESS =
  configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

// Inisialisasi web3 dengan provider MetaMask atau Ganache
const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

// Inisialisasi kontrak
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

let account;

// Fungsi utama untuk mengakses akun MetaMask dan memperbarui tampilan
const main = async () => {
    // Pengecekan apakah MetaMask terdeteksi
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask terdeteksi!');

        try {
            // Meminta MetaMask untuk membuka dialog koneksi
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Permintaan akun berhasil dikirim ke MetaMask');

            // Mendapatkan akun yang terhubung
            const accounts = await web3.eth.getAccounts();
            handleAccountChange(accounts);

            // Menambahkan event listener untuk perubahan akun
            window.ethereum.on('accountsChanged', handleAccountChange);
        } catch (error) {
            console.error('Error saat menghubungkan ke MetaMask:', error);
            accountEl.innerText = 'Gagal terhubung ke MetaMask';
        }
    } else {
        console.log('MetaMask tidak terdeteksi.');
        accountEl.innerText = 'MetaMask tidak terpasang';
    }
};

// Fungsi untuk menangani perubahan akun
const handleAccountChange = async (accounts) => {
    if (accounts.length === 0) {
        console.error('Tidak ada akun yang ditemukan di MetaMask');
        accountEl.innerText = 'Tidak ada akun yang ditemukan di MetaMask';
    } else {
        account = accounts[0];
        accountEl.innerText = `${account}`;
        await refreshTickets(); // Memperbarui tiket setelah akun diubah
    }
};

// Memanggil fungsi utama setelah DOM siap
window.addEventListener('DOMContentLoaded', (event) => {
    main();
});
