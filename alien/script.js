const walker = document.getElementById("walker");
const walkerWrapper = document.getElementById("walkerWrapper");

const leftArm = document.querySelector(".left-arm");
const rightArm = document.querySelector(".right-arm");
const leftLeg = document.querySelector(".left-leg");
const rightLeg = document.querySelector(".right-leg");

const platforms = document.querySelectorAll(".platform");
const groundLevel = 0;
const containerHeight = document.body.offsetHeight;
let isJumping = false;
let jumpState = "ground"; // "ground", "up", "peak", "down"
const platformsData = [...platforms].map(p => ({
    x: p.offsetLeft,
    y: containerHeight - (p.offsetTop + p.offsetHeight), // ✅ calcolo bottom-based
    width: p.offsetWidth,
    height: p.offsetHeight
}));
// Movimento
let position = 50;
let moving = false;
let direction = 1;
let flipped = false;

// Animazione camminata
let angle = 0;
let legSwingSpeed = 0.15;
let walkSpeed = 3;

// Fisica verticale (NUOVO SISTEMA)
let posY = 0;
let velocityY = 0;
const gravity = 0.5;
let onGround = false;
let onPlatformX = false;

let currentPlatform = null;

// Controlli
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        moving = true;
        direction = 1;
        flipped = false;
    }

    if (e.key === "ArrowLeft") {
        moving = true;
        direction = -1;
        flipped = true;
    }

    // Salto SOLO se a terra
    if (e.key === "ArrowUp" && onGround) {
        velocityY = -12;
        onGround = false;

        isJumping = true;
        jumpStatus = "up";
    }
});

// Altezza massima del salto
const maxJumpHeight = 200; // px sopra il suolo

// Controlli
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        moving = true;
        direction = 1;
        flipped = false;
    }
    if (e.key === "ArrowLeft") {
        moving = true;
        direction = -1;
        flipped = true;
    }
    if (e.key === "ArrowUp" && onGround) {
        velocityY = -12; // impulso salto
        onGround = false;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        moving = false;
    }
});

function animate() {

    // Movimento orizzontale
    if (moving) {
        position += walkSpeed * direction;

        const swing = 45;
        leftArm.style.transform = `rotate(${-Math.sin(angle) * swing}deg)`;
        rightArm.style.transform = `rotate(${Math.sin(angle) * swing}deg)`;
        leftLeg.style.transform = `rotate(${Math.sin(angle) * swing}deg)`;
        rightLeg.style.transform = `rotate(${-Math.sin(angle) * swing}deg)`;

        angle += legSwingSpeed;
    }

    // Gravità
    velocityY += gravity;
    posY += velocityY;

    // Forza fine salto: blocca l'altezza massima
    if (posY < -maxJumpHeight) {
        posY = -maxJumpHeight;
        velocityY = 0;
    }

    const walkerHeight = walker.offsetHeight;
    const walkerFeet = posY + walkerHeight;

    // Assume in aria
    onGround = false;

    // Collisione con piattaforma o terra
    let landed = false;
    if (currentPlatform) {
        const platformTop = currentPlatform.y;
        if (walkerFeet >= platformTop && velocityY >= 0) {
            posY = platformTop - walkerHeight;
            velocityY = 0;
            onGround = true;
            landed = true;
        }
    }

    // Atterraggio a terra
    if (!landed && walkerFeet >= groundLevel) {
        posY = groundLevel - walkerHeight;
        velocityY = 0;
        onGround = true;
        landed = true;
    }

    // Aggiornamento jumpState
    if (onGround) {
        jumpState = "ground";
    } else if (velocityY < 0) {
        jumpState = "up";
    } else if (velocityY > 0 && !onGround) {
        jumpState = "down";
    }

    // Rilevare picco del salto
    if (velocityY === 0 && !onGround) {
        jumpState = "peak";
    }

    // Trasformazioni
    walker.style.transform = `translateX(${position}px) translateY(${posY}px)`;
    walkerWrapper.style.transform = `scaleX(${flipped ? '-1' : '1'})`;

    const walkerWidth = walker.offsetWidth;

    platformsData.forEach(p => {
        const x1 = p.x;
        const x2 = p.x + p.width;

        const walkerLeft = position;
        const walkerRight = position + walkerWidth;

        if (walkerRight > x1 && walkerLeft < x2) {
            currentPlatform = p;
        }
    });

    if (currentPlatform) {
        const platformY = currentPlatform.y;

        // Stampo jumpState e valori
        console.log(`jumpState: ${jumpState}, walkerFeet Y: ${walkerFeet.toFixed(2) * -1}, platformY: ${platformY}`);

        // Creo costante che dice se walkerFeet > platformY
        const isAbovePlatform = (walkerFeet * -1) > platformY;
        console.log("walkerFeet > platformY ?", isAbovePlatform);

        // Interrompo il salto se sopra piattaforma
        if (isAbovePlatform && velocityY < 0) {
            velocityY = 0;          // fermo il movimento verso l’alto
            jumpState = "peak";     // lo stato diventa picco
            console.log("Salto interrotto sopra piattaforma!");
        }
    }

    requestAnimationFrame(animate);
}


animate();