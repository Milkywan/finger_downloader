// common-auth.js
import { auth } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

// --- Variabel Umum untuk Semua Halaman ---
let inactivityTimeout;
const LOGOUT_TIME_LIMIT = 10 * 60 * 1000; // 10 menit dalam milidetik

// DEFINISIKAN EXPIRY_DATE DI SINI
const EXPIRY_DATE = new Date("2025-12-31T00:00:00"); // Sesuaikan tanggal ini sesuai kebutuhan

// --- Fungsi Umum yang Di-expose ke Window ---

// Fungsi Pemeriksaan Expired Date
window.checkExpiry = function() {
    if (new Date() >= EXPIRY_DATE) {
        alert("404 Error Networking!! XpDt");
        // Opsi: bisa tambahkan redirect ke halaman tertentu atau nonaktifkan fitur
        // window.location.href = "index.html"; // Contoh: redirect ke login
    }
};

// Fungsi Pemicu Logout Otomatis
function triggerLogout() {
    alert("Anda telah tidak aktif selama 10 menit. Anda akan di-logout otomatis.");
    window.logout(); // Panggil fungsi logout yang sudah di-expose
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
        localStorage.removeItem("loginTime");
        clearTimeout(inactivityTimeout); // Hentikan timer inaktivitas saat logout manual
        window.location.href = "index.html"; // Redirect ke halaman login
    } catch (e) {
        alert("Logout gagal: " + (e.message || e));
        console.error("Logout error:", e);
    }
};

// --- Inisialisasi Awal Saat DOM Siap ---
// Ini akan dijalankan setelah seluruh struktur HTML dimuat
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mulai timer inaktivitas
    window.resetInactivityTimer();
    // Daftarkan event listener untuk memantau aktivitas pengguna di seluruh dokumen
    document.addEventListener('mousemove', window.resetInactivityTimer);
    document.addEventListener('keydown', window.resetInactivityTimer);
    document.addEventListener('click', window.resetInactivityTimer);
    document.addEventListener('touchstart', window.resetInactivityTimer);

    // 2. Lakukan pemeriksaan status login
    const currentPath = window.location.pathname;
    // Sesuaikan dengan path halaman login Anda, bisa juga 'window.location.href.includes("index.html")'
    const isLoginPage = currentPath.endsWith('/index.html') || currentPath === '/';

    if (!localStorage.getItem("loginTime")) {
        if (!isLoginPage) { // Hanya redirect jika bukan di halaman login
            window.location.href = "index.html";
        }
    } else {
        // Jika sudah login, lakukan pemeriksaan expired date juga
        window.checkExpiry();
        // CATATAN: Jika ada fungsi spesifik halaman (misalnya loadMachinesDefault)
        // yang bergantung pada login atau perlu dijalankan saat DOM siap,
        // panggil di sini atau di <script type="module"> halaman tersebut.
    }
});
