console.log("Hello from main.js! Typewriter effect tuned – links now reveal after typing, because why rush the grand finale?");

// Typewriter effect function
function typeWriter(element, text, baseSpeed = 100, callback) {
    element.classList.remove('hidden'); // Reveal the element
    let i = 0;
    element.innerHTML = ''; // Ensure it's clear
    element.style.borderRight = '2px solid #ddd'; // Blinking cursor

    function type() {
        if (i < text.length) {
            const currentChar = text.charAt(i);
            element.innerHTML = text.substring(0, i + 1) + '<span class="cursor"></span>';
            i++;

            let delay = baseSpeed;
            if (currentChar === '.') {
                delay = 500; // Pause after period
            } else if (currentChar === ',') {
                delay = 200; // Pause after comma
            } else if (currentChar === '-') {
                delay = 300; // Pause after dash
            }

            setTimeout(type, delay);
        } else {
            element.style.borderRight = 'none'; // Remove cursor
            if (callback) callback();
        }
    }
    type();
}

// Get elements
const h1 = document.getElementById('typewriter-h1');
const p1 = document.getElementById('typewriter-p1');
const p2 = document.getElementById('typewriter-p2');
const p3 = document.getElementById('typewriter-p3');
const links = document.getElementById('links');

// Define texts here
const h1Text = `Hello. This is Ryan.`;
const p1Text = 'Catholic. Husband to beautiful wife. At Wiom, I build the internet architecture needed to bring unlimited internet to 500 million people in India. By designing, developing, and deploying advanced AI and Machine Learning models.';
const p2Text = 'Long story, short - I put my head down to do GOD\'s work, and crazy GOOD things happen. Glory to GOD and JESUS, who is Lord.';
const p3Text = 'Amen!';

// Chain the typing effects
typeWriter(h1, h1Text, 50, () => {
    typeWriter(p1, p1Text, 20, () => {
        typeWriter(p2, p2Text, 20, () => {
            typeWriter(p3, p3Text, 20, () => {
                links.classList.remove('hidden'); // Reveal links after all typing
            });
        });
    });
});
