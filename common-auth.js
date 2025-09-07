// common-auth.js
import { auth } from './firebase-config.js'; 
import { signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

// --- FITUR LOGOUT OTOMATIS KARENA TIDAK AKTIF ---
let inactivityTimeout;
const LOGOUT_TIME_LIMIT = 10 * 60 * 1000; // 10 menit

function triggerLogout() {
    alert("Anda telah tidak aktif selama 10 menit. Anda akan di-logout otomatis.");
    window.logout(); 
}

window.resetInactivityTimer = function() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(triggerLogout, LOGOUT_TIME_LIMIT);
};

document.addEventListener('mousemove', window.resetInactivityTimer);
document.addEventListener('keydown', window.resetInactivityTimer);
document.addEventListener('click', window.resetInactivityTimer);
document.addEventListener('touchstart', window.resetInactivityTimer); 

window.resetInactivityTimer();
// --- AKHIR FITUR LOGOUT OTOMATIS ---

// Cek kalau belum login, balik ke login
// Ini akan dijalankan setiap kali common-auth.js dimuat
if (!localStorage.getItem("loginTime")) {
  // Hanya redirect jika bukan halaman login (untuk menghindari loop)
  if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
    window.location.href = "index.html";
  }
}

window.goPage = (url) => {
  window.location.href = url;
};

window.logout = async () => {
  try {
    if (!auth || typeof signOut !== 'function') {
        console.error("Firebase Auth atau fungsi signOut tidak diimpor atau diinisialisasi dengan benar.");
        alert("Terjadi kesalahan saat logout. Coba lagi.");
        return;
    }
    await signOut(auth); 
    localStorage.removeItem("loginTime"); 
    clearTimeout(inactivityTimeout); // Clear timer on manual logout
    window.location.href = "index.html"; 
  } catch (e) {
    alert("Logout gagal: " + (e.message || e));
    console.error("Logout error:", e); 
  }
};
