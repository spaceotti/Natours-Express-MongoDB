import { displayMap } from './mapbox.js';
import { login } from './login.js';

console.log('Hello from bundle!');

const mapEl = document.getElementById('map');

if (mapEl) {
  const locations = JSON.parse(mapEl.dataset.locations);
  const token = mapEl.dataset.mapboxToken;

  displayMap(locations, token);
}

const loginForm = document.querySelector('.form');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
