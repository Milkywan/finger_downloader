// common-auth.js
import { auth, db } from './firebase-config.js'; // Perlu 'db' untuk mengambil username dari Firestore
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js'; // Untuk ambil data user dari Firestore

// --- Variabel Umum untuk Semua Halaman ---
let inactivityTimeout;
const LOGOUT_TIME_LIMIT = 10 * 60 * 1000; // 10 menit dalam milidetik

const EXPIRY_DATE = new Date("2025-12-31T00:00:00"); // Tanggal expired aplikasi

// --- Fungsi Umum yang Di-expose ke Window ---

// Fungsi Pemeriksaan Expired Date
window.checkExpiry = function() {
    if (new Date() >= EXPIRY_DATE) {
        alert("404 Error Networking!! XpDt");
        return true; // Mengembalikan true jika sudah expired
    }
    return false; // Mengembalikan false jika belum expired
};

// Fungsi Pemicu Logout Otomatis
function triggerLogout() {
    alert("Anda telah tidak aktif selama 10 menit. Anda akan di-logout otomatis.");
    window.logout(); // Panggil fungsi logout
}

// Fungsi Reset Timer Inaktivitas
window.resetInactivityTimer = function() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(triggerLogout, LOGOUT_TIME_LIMIT);
};

// Fungsi Navigasi Halaman
window.goPage = (url) => {
    window.location.href = url;
};

// Fungsi Logout
window.logout = async () => {
    try {
        if (!auth || typeof signOut !== 'function') {
            console.error("Firebase Auth atau fungsi signOut tidak diimpor atau diinisialisasi dengan benar.");
            alert("Terjadi kesalahan saat logout. Coba lagi.");
            return;
        }
        await signOut(auth);
        localStorage.removeItem("loginTime"); // Tetap hapus ini sebagai kebersihan
        clearTimeout(inactivityTimeout); // Hentikan timer inaktivitas
        window.location.href = "index.html"; // Redirect ke halaman login
    } catch (e) {
        alert("Logout gagal: " + (e.message || e));
        console.error("Logout error:", e);
    }
};

// Fungsi untuk menampilkan username (kita masukkan ke sini agar terpusat)
window.displayLoggedInUsername = async (user) => {
    const usernameDisplayElement = document.getElementById('loggedInUsername'); // ID untuk elemen di navbar
    if (!usernameDisplayElement) return; // Jika elemen tidak ada di halaman ini, abaikan

    if (user) {
        try {
            const userDocRef = doc(db, 'users', user.uid); // Ambil dokumen user dari Firestore
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                usernameDisplayElement.textContent = userData.username; // Gunakan username dari Firestore
            } else {
                usernameDisplayElement.textContent = user.email; // Fallback ke email
            }
        } catch (e) {
            console.error("Error fetching username from Firestore:", e);
            usernameDisplayElement.textContent = user.email; // Fallback ke email jika error
        }
    } else {
        usernameDisplayElement.textContent = ''; // Kosongkan jika tidak ada user
    }
};


// --- Inisialisasi Awal Saat DOM Siap ---
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.endsWith('/index.html') || currentPath === '/';

    // *** INI ADALAH PERUBAHAN KRUSIAL UNTUK AUTENTIKASI ***
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Pengguna sedang login.
            // Mulai timer inaktivitas
            document.addEventListener('mousemove', window.resetInactivityTimer);
            document.addEventListener('keydown', window.resetInactivityTimer);
            document.addEventListener('click', window.resetInactivityTimer);
            document.addEventListener('touchstart', window.resetInactivityTimer);
            window.resetInactivityTimer(); // Reset awal timer

            // Lakukan pemeriksaan expired date
            if (window.checkExpiry()) {
                window.logout(); // Jika expired, paksa logout
                return; // Hentikan pemrosesan lebih lanjut
            }

            // Tampilkan username (jika elemennya ada di HTML halaman tersebut)
            window.displayLoggedInUsername(user);

            // Pada titik ini, user sudah terautentikasi dan sesi valid.
            // Logika inisialisasi spesifik halaman bisa berjalan.

        } else {
            // Pengguna tidak login (atau sesinya telah berakhir).
            // Hentikan timer inaktivitas
            clearTimeout(inactivityTimeout);
            // Redirect ke halaman login jika bukan halaman login itu sendiri
            if (!isLoginPage) {
                window.location.href = "index.html";
            }
            // Kosongkan tampilan username
            window.displayLoggedInUsername(null);
        }
    });
});
