// Elements
const authContainer = document.getElementById('authContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const authForm = document.getElementById('authForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const toggleLink = document.getElementById('toggleLink');
const toggleText = document.getElementById('toggleText');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');

let isLogin = false;

// Load users from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Toggle form
toggleLink.addEventListener('click', () => {
    isLogin = !isLogin;
    updateFormUI();
});

function updateFormUI() {
    if(isLogin){
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        toggleText.innerHTML = `Don't have an account? <span id="toggleLink">Sign Up</span>`;
    } else {
        formTitle.textContent = 'Sign Up';
        submitBtn.textContent = 'Sign Up';
        toggleText.innerHTML = `Already have an account? <span id="toggleLink">Login</span>`;
    }
    // Reattach listener
    document.getElementById('toggleLink').addEventListener('click', () => {
        isLogin = !isLogin;
        updateFormUI();
    });
}

// Handle form submission
authForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if(isLogin){
        const user = users.find(u => u.username === username && u.password === password);
        if(user){
            showDashboard(username);
        } else {
            alert('Invalid username or password!');
        }
    } else {
        if(users.find(u => u.username === username)){
            alert('Username already exists! Please login.');
            isLogin = true;
            updateFormUI();
            return;
        }
        users.push({username, password});
        localStorage.setItem('users', JSON.stringify(users));
        showDashboard(username);
    }

    authForm.reset();
});

function showDashboard(username){
    authContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    userDisplay.textContent = username;
}

// Logout
logoutBtn.addEventListener('click', () => {
    dashboardContainer.style.display = 'none';
    authContainer.style.display = 'flex';
});

// ===== CANVAS ANIMATION =====
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
    constructor(x, y, size, color, velocityX, velocityY){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        if(this.x < 0 || this.x > canvas.width) this.velocityX *= -1;
        if(this.y < 0 || this.y > canvas.height) this.velocityY *= -1;
        this.draw();
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

// Create particles
function initParticles(){
    particlesArray = [];
    for(let i=0; i<100; i++){
        let size = Math.random() * 3 + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let velocityX = (Math.random() - 0.5) * 1.5;
        let velocityY = (Math.random() - 0.5) * 1.5;
        let color = 'rgba(255,255,255,0.7)';
        particlesArray.push(new Particle(x,y,size,color,velocityX,velocityY));
    }
}

// Animate particles
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particlesArray.forEach(p => p.update());
    requestAnimationFrame(animate);
}

initParticles();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});