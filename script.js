// === GESTION DU PRELOADER ===
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

// === RÉORGANISATION MOBILE ULTRA SIMPLE ===
let imagesMoved = false;
let originalPositions = [];

function saveOriginalPositions() {
    // Sauvegarder la position originale de chaque image
    document.querySelectorAll('section').forEach((section, index) => {
        const image = section.querySelector('.section-image');
        if (image) {
            originalPositions[index] = {
                parent: image.parentNode,
                nextSibling: image.nextSibling
            };
        }
    });
}

function moveImagesOnMobile() {
    // Seulement sur mobile
    if (window.innerWidth <= 768) {
        if (!imagesMoved) {
            // Sauvegarder les positions originales avant de déplacer
            if (originalPositions.length === 0) {
                saveOriginalPositions();
            }
            
            // Pour chaque section
            document.querySelectorAll('section').forEach(section => {
                const image = section.querySelector('.section-image');
                const content = section.querySelector('.section-content');
                const titlesDiv = content ? content.querySelector('div:first-child') : null;
                
                // Si on a bien tous les éléments
                if (image && titlesDiv) {
                    // Déplacer l'image juste après le div des titres
                    titlesDiv.parentNode.insertBefore(image, titlesDiv.nextSibling);
                }
            });
            imagesMoved = true;
        }
    } else {
        // Sur desktop, remettre les images à leur position originale
        if (imagesMoved) {
            document.querySelectorAll('section').forEach((section, index) => {
                const image = section.querySelector('.section-image');
                if (image && originalPositions[index]) {
                    const original = originalPositions[index];
                    if (original.nextSibling) {
                        original.parent.insertBefore(image, original.nextSibling);
                    } else {
                        original.parent.appendChild(image);
                    }
                }
            });
            imagesMoved = false;
        }
    }
}

// Exécuter quand tout est chargé
document.addEventListener('DOMContentLoaded', moveImagesOnMobile);
window.addEventListener('load', moveImagesOnMobile);

// Surveiller le redimensionnement
window.addEventListener('resize', moveImagesOnMobile);

// === INDICATEUR DE SCROLL ===
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercentage + '%';
}

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);

// === GESTION DU MENU BURGER (MOBILE) ===
document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burger-menu');
    const nav = document.getElementById('main-nav');
    const navLinks = nav.querySelectorAll('a');

    // Toggle du menu burger
    if (burgerMenu) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !burgerMenu.contains(e.target)) {
            burgerMenu.classList.remove('active');
            nav.classList.remove('active');
        }
    });
});

// === DÉFINITIONS SVG (Haut-parleur simple et barré) ===
const ICON_MUSIC_ON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
const ICON_MUSIC_OFF = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';

function tryAutoplay() {
    const audio = document.getElementById('background-audio');
    if (audio) {
        audio.volume = 0.3; 
        
        audio.play().catch(error => {
            console.log("Lecture automatique de l'audio bloquée. Affichage initial en mode Mute.");
        });
    }
}

function toggleAudio() {
    const audio = document.getElementById('background-audio');
    const audioButton = document.getElementById('toggle-audio');
    
    if (audio.paused) {
        audio.play().catch(error => {
            console.log("Tentative de reprise du son après l'interaction.");
        });
        audioButton.innerHTML = ICON_MUSIC_ON; 
    } else {
        audio.pause();
        audioButton.innerHTML = ICON_MUSIC_OFF; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const audioButton = document.getElementById('toggle-audio');
    const audio = document.getElementById('background-audio');
    
    if (audioButton) {
        audioButton.addEventListener('click', (event) => {
            event.preventDefault();
            toggleAudio();
        });
        
        if (audio) {
            audio.onplaying = () => { audioButton.innerHTML = ICON_MUSIC_ON; };
            audio.onpause = () => { audioButton.innerHTML = ICON_MUSIC_OFF; };
            
            const placeholder = audioButton.querySelector('.audio-icon');
            if (placeholder) placeholder.remove();
            
            if (audio.paused) {
                audioButton.innerHTML = ICON_MUSIC_OFF;
            } else {
                audioButton.innerHTML = ICON_MUSIC_ON;
            }
        }
    }
    tryAutoplay();
});

// === GESTION AMÉLIORÉE DU FORMULAIRE (BILINGUE) ===
const form = document.getElementById('contact-form');
const status = document.getElementById('contact-status');

if (form) {
    const submitBtn = form.querySelector('.btn-submit');
    const isEnglish = document.documentElement.lang === 'en';

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const endpoint = "https://formspree.io/f/xrbyooed"; 
        const data = new FormData(form);

        const originalBtnText = submitBtn.textContent;
        submitBtn.classList.add('sending');
        submitBtn.textContent = isEnglish ? 'Sending...' : 'Envoi en cours...';
        submitBtn.disabled = true;

        status.classList.remove('show', 'success', 'error');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.classList.add('success', 'show');
                status.innerHTML = isEnglish ? "✅ Thank you! Your message has been sent." : "✅ Merci ! Votre message a bien été envoyé.";
                form.reset();
                
                setTimeout(() => {
                    status.classList.remove('show');
                }, 5000);
            } else {
                const responseData = await response.json();
                if (responseData.errors) {
                    status.innerHTML = "❌ " + responseData.errors.map(error => error.message).join(", ");
                } else {
                    status.innerHTML = isEnglish ? "❌ Oops! An error occurred. (Status: " + response.status + ")" : "❌ Oups ! Une erreur s'est produite. (Statut: " + response.status + ")";
                }
                status.classList.add('error', 'show');
            }
        } catch (error) {
            status.classList.add('error', 'show');
            status.innerHTML = isEnglish ? "❌ A network error occurred." : "❌ Une erreur de connexion s'est produite.";
            console.error('Submission error:', error);
        }

        submitBtn.classList.remove('sending');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    });
}

// === SCROLL ANIMATION (RÉIMPLÉMENTATION) ===
const sections = document.querySelectorAll('section');
const firstSection = document.getElementById('section1');

sections.forEach(section => {
    if (section !== firstSection) {
        section.querySelectorAll(
            '.section-content > *, .project-tabs-container, .skills-grid .skill-category, .contact-form .form-group, .contact-form .btn-submit'
        ).forEach(element => {
            element.classList.add('animate-on-scroll');
        });
    }
});

const observerOptions = {
    root: null, 
    rootMargin: '0px 0px -30% 0px', 
    threshold: 0
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const section = entry.target;
            
            section.querySelectorAll('.animate-on-scroll').forEach(element => {
                element.classList.add('animated');
                element.classList.remove('animate-on-scroll');
            });
            
            observer.unobserve(section);
        }
    });
}, observerOptions);

sections.forEach(section => {
    if (section !== firstSection) {
        observer.observe(section);
    }
});

// === LOGIQUE DES ONGLETS PROJETS ===
const tabButtons = document.querySelectorAll('.project-tab-button');
const tabContents = document.querySelectorAll('.project-tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTabId = button.getAttribute('data-tab');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(targetTabId).classList.add('active');
    });
});

// === CURSEUR CUSTOM ===
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('touchstart', () => {
        cursor.style.display = 'none';
    });
    
    document.addEventListener('touchend', () => {
        cursor.style.display = 'none';
    });
});