// =====================================================
// VIDEO YOUTUBE + AVVISO COOKIE
// =====================================================

function placeOverlay(video, overlay) {
    overlay.style.top    = video.offsetTop + "px";
    overlay.style.left   = video.offsetLeft + "px";
    overlay.style.width  = video.offsetWidth + "px";
    overlay.style.height = video.offsetHeight + "px";
}

function updateYouTube() {

    const accepted =
        localStorage.getItem("cookieChoice") === "accepted";

    document.querySelectorAll(
        "iframe[data-youtube]"
    ).forEach(function (video) {

        let overlay = video._cookieOverlay;

        // ---- COOKIE ACCETTATI: video attivo, avviso nascosto
        if (accepted) {

            if (video.getAttribute("src") !== video.dataset.youtube) {
                video.src = video.dataset.youtube;
            }

            if (overlay) overlay.style.display = "none";

            return;
        }

        // ---- NON ACCETTATI: video bloccato, avviso visibile
        video.src = "about:blank";

        if (!overlay) {

            const parent = video.parentElement;

            if (getComputedStyle(parent).position === "static") {
                parent.style.position = "relative";
            }

            overlay = document.createElement("div");
            overlay.className = "video-cookie-overlay";
            overlay.innerHTML =
                "<p>Per visualizzare i video accettare i cookies.</p>" +
                "<button type='button'>GESTISCI COOKIE</button>";

            overlay.querySelector("button")
                .addEventListener("click", function () {
                    const banner =
                        document.getElementById("cookie-banner");
                    if (banner) banner.classList.remove("hidden");
                });

            parent.appendChild(overlay);
            video._cookieOverlay = overlay;

            if (window.ResizeObserver) {
                new ResizeObserver(function () {
                    placeOverlay(video, overlay);
                }).observe(video);
            }

            window.addEventListener("resize", function () {
                placeOverlay(video, overlay);
            });
        }

        overlay.style.display = "flex";
        placeOverlay(video, overlay);

    });

}

// Appena la pagina è pronta (non aspetta il loader)
document.addEventListener("DOMContentLoaded", updateYouTube);
window.addEventListener("load", updateYouTube);





// =====================================================
// COOKIE BANNER
//
// REGOLE:
// - Prima apertura del sito in questa sessione:
//     nessuna scelta / rifiutato -> banner mostrato
//     accettato                  -> banner nascosto
// - Navigazione interna nella stessa sessione:
//     il banner NON compare mai da solo, qualunque
//     sia la scelta precedente. Compare solo premendo
//     il bottone 🍪 (che funziona sempre)
// =====================================================

function initCookieBanner(isFreshVisit) {

    const banner =
        document.getElementById("cookie-banner");

    const acceptButton =
        document.getElementById("cookie-accept");

    const rejectButton =
        document.getElementById("cookie-reject");

    const reopenButton =
        document.getElementById("cookie-reopen");

    if (!banner || !acceptButton || !rejectButton) return;


    const cookieChoice =
        localStorage.getItem("cookieChoice");


    // ==========================================
    // MOSTRA O NASCONDE IL BANNER ALL'AVVIO
    // ==========================================

    if (isFreshVisit) {

        // Prima apertura del sito in questa sessione

        if (cookieChoice === "accepted") {

            banner.classList.add("hidden");

            updateYouTube();

        } else {

            // Nessuna scelta oppure rifiutato:
            // il banner si mostra
            banner.classList.remove("hidden");

        }

    } else {

        // Navigazione interna: mai automatico,
        // solo tramite il bottone 🍪
        banner.classList.add("hidden");

        if (cookieChoice === "accepted") {

            updateYouTube();

        }

    }


    // ==========================================
    // RIAPRI IL BANNER (bottone cookie fisso)
    // Funziona sempre, su ogni pagina/visita
    // ==========================================

    if (reopenButton) {

        reopenButton.addEventListener("click", function () {

            banner.classList.remove("hidden");

        });

    }


    // ==========================================
    // ACCETTA (funziona sempre)
    // ==========================================

    acceptButton.addEventListener("click", function () {

        localStorage.setItem(
            "cookieChoice",
            "accepted"
        );

        banner.classList.add("hidden");

        updateYouTube();

    });


    // ==========================================
    // RIFIUTA (funziona sempre)
    // ==========================================

    rejectButton.addEventListener("click", function () {

        localStorage.setItem(
            "cookieChoice",
            "rejected"
        );

        banner.classList.add("hidden");

        updateYouTube();

    });

}



// =====================================================
// CONTROLLO LOADER
// =====================================================

// Calcolato PRIMA di scrivere il flag, così sappiamo
// se questa è la prima pagina della sessione o una
// navigazione interna
const isFreshVisit =
    !sessionStorage.getItem("loaderShown");


if (!isFreshVisit) {

    const loader = document.getElementById("loader");

    if (loader) {
        loader.style.display = "none";
    }

    gsap.set("#home", {
        opacity: 1,
        pointerEvents: "auto"
    });

    gsap.set(".hero-image", {
        opacity: 1,
        scale: 1
    });

    gsap.set(".titlename", {
        opacity: 1,
        y: 0
    });

    // Navigazione interna: il banner NON deve
    // comparire da solo
    initCookieBanner(false);

} else {

    sessionStorage.setItem("loaderShown", "true");

    const tl = gsap.timeline();


    // =================================================
    // RESET
    // =================================================

    tl.set(".card", {
        y: 60,
        opacity: 0,
        scale: 0.8
    });


    // =================================================
    // CARTE IN ENTRATA
    // =================================================

    tl.to(".ace1", {
        y: 0,
        opacity: 1,
        duration: 0.5
    })

    .to(".ace2", {
        y: 0,
        opacity: 1,
        duration: 0.5
    }, "-=0.25")

    .to(".ace3", {
        y: 0,
        opacity: 1,
        duration: 0.5
    }, "-=0.25")

    .to(".ace4", {
        y: 0,
        opacity: 1,
        duration: 0.5
    }, "-=0.25");


    // =================================================
    // LOADING BAR
    // =================================================

    tl.to(".loading-bar", {
        width: "100%",
        duration: 2.5
    });


    // =================================================
    // APERTURA A VENTAGLIO
    // =================================================

    tl.to(".ace1", {
        x: -120,
        rotation: -20,
        duration: 0.7
    }, "+=0.2")

    .to(".ace2", {
        x: -40,
        rotation: -5,
        duration: 0.7
    }, "-=0.5")

    .to(".ace3", {
        x: 40,
        rotation: 5,
        duration: 0.7
    }, "-=0.5")

    .to(".ace4", {
        x: 120,
        rotation: 20,
        duration: 0.7
    }, "-=0.5");


    // =================================================
    // CHIUSURA LOADER
    // =================================================

    tl.to("#loader", {

        opacity: 0,

        duration: 0.6,

        ease: "power2.out",

        onStart: () => {

            gsap.to("#home", {

                opacity: 1,

                duration: 0.6,

                ease: "power2.out",

                pointerEvents: "auto"

            });

            // Prima apertura del sito in questa sessione:
            // il banner si comporta secondo le regole
            initCookieBanner(true);

        },

        onComplete: () => {

            const loader =
                document.getElementById("loader");

            if (loader) {
                loader.style.display = "none";
            }

            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";

        }

    });


    // =================================================
    // ANIMAZIONE IMMAGINE HOME
    // =================================================

    tl.to(".hero-image", {

        opacity: 1,

        scale: 1,

        duration: 1,

        ease: "power3.out"

    });


    // =================================================
    // ANIMAZIONE TITOLO
    // =================================================

    tl.to(".titlename", {

        opacity: 1,

        y: 0,

        duration: 0.9,

        ease: "power3.out"

    }, "-=0.3");

}



// =====================================================
// EFFETTO MAGICO
// CARTA → RETRO CON LOGO → SCOMPARE → FRASE → BIO
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const card =
            document.getElementById("magicCard");

        const message =
            document.getElementById("magicMessage");

        const bio =
            document.getElementById("magicBio");

        const magicSection =
            document.querySelector(".magic-reveal");


        // =================================================
        // CONTROLLO ELEMENTI
        // =================================================

        if (!card || !magicSection) {
            return;
        }


        // =================================================
        // STATO INIZIALE CARTA
        // =================================================

        gsap.set(card, {

            opacity: 0,

            y: 120,

            rotation: -12,

            rotationY: 0,

            scale: 0.7

        });


        // =================================================
        // STATO INIZIALE MESSAGGIO
        // =================================================

        gsap.set(message, {

            opacity: 0

        });


        // =================================================
        // STATO INIZIALE LINEE
        // =================================================

        gsap.set(
            ".magic-line",
            {
                width: 0
            }
        );


        // =================================================
        // STATO INIZIALE BIO
        // =================================================

        gsap.set(bio, {

            opacity: 0,

            y: 30

        });


        // =================================================
        // TIMELINE
        // =================================================

        const magicTimeline =
            gsap.timeline({
                paused: true
            });


        // =================================================
        // 1 — CARTA ENTRA
        // =================================================

        magicTimeline.to(card, {

            opacity: 1,

            y: 0,

            scale: 1,

            rotation: 0,

            rotationY: 0,

            duration: 0.6,

            ease: "power3.out"

        });


        // =================================================
        // 2 — CARTA SI SOLLEVA
        // =================================================

        magicTimeline.to(card, {

            y: -30,

            rotation: 8,

            duration: 0.30,

            ease: "power2.inOut"

        });


        // =================================================
        // 3 — ROTAZIONE 3D
        // =================================================

        magicTimeline.to(card, {

            rotationY: 180,

            duration: 0.9,

            ease: "power2.inOut"

        });


        // =================================================
        // 4 — PAUSA SUL RETRO
        // =================================================

        magicTimeline.to(card, {

            duration: 0.30

        });


        // =================================================
        // 5 — PICCOLO MOVIMENTO
        // =================================================

        magicTimeline.to(card, {

            duration: 0.3,

            scale: 1.02,

            rotationY: 180,

            rotation: 8,

            ease: "power2.out"

        });


        // =================================================
        // 6 — NASCONDE IL FRONTE
        //
        // Evita che l'asso ricompaia.
        // =================================================

        magicTimeline.set(
            ".magic-card-front",
            {
                opacity: 0
            }
        );


        // =================================================
        // 7 — SVANISCE IL RETRO
        // =================================================

        magicTimeline.to(
            ".magic-card-back",
            {

                opacity: 0,

                duration: 1,

                ease: "power1.inOut"

            }
        );


        // =================================================
        // 8 — SCOMPARE COMPLETAMENTE LA CARTA
        // =================================================

        magicTimeline.to(card, {

            scale: 0.92,

            y: -15,

            opacity: 0,

            duration: 0.4,

            ease: "power2.inOut"

        });


        // =================================================
        // 9 — LINEE ORO
        // =================================================

        magicTimeline.to(
            ".magic-line",
            {

                width: 180,

                duration: 0.4,

                ease: "power3.out",

                stagger: 0.08

            },
            "-=0.15"
        );


        // =================================================
        // 10 — COMPARE MESSAGGIO
        // =================================================

        magicTimeline.to(
            message,
            {

                opacity: 1,

                duration: 0.4,

                ease: "power2.out"

            },
            "-=0.45"
        );


        // =================================================
        // 11 — FRASE ENTRA
        // =================================================

        magicTimeline.from(
            ".magic-quote",
            {

                y: 20,

                opacity: 0,

                duration: 0.4,

                ease: "power3.out"

            },
            "-=0.65"
        );


        // =================================================
        // 12 — BIOGRAFIA
        // =================================================

        magicTimeline.to(
            bio,
            {

                opacity: 1,

                y: 0,

                duration: 1,

                ease: "power3.out"

            },
            "+=0.4"
        );


        // =================================================
        // ATTIVAZIONE CON SCROLL
        // =================================================

        const observer =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                magicTimeline.play();

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },

                {
                    threshold: 0.35
                }

            );


        observer.observe(magicSection);

    }
);



// =====================================================
// ANIMAZIONI DELLE SEZIONI
// ESCAPOLOGIA / CARTOMAGIA / ARTE DELLA MAGIA
// =====================================================

const revealElements =
    document.querySelectorAll(".reveal");


function revealOnScroll(){

    for (
        let i = 0;
        i < revealElements.length;
        i++
    ){

        const windowHeight =
            window.innerHeight;

        const elementTop =
            revealElements[i]
            .getBoundingClientRect()
            .top;

        const elementVisible = 150;


        if (
            elementTop <
            windowHeight - elementVisible
        ){

            revealElements[i]
                .classList
                .add("active");

        }

    }

}


window.addEventListener(
    "scroll",
    revealOnScroll
);