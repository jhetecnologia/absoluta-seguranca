
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================
       MENU MOBILE
    ========================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".header nav");

    function fecharMenu() {
        if (!menuToggle || !nav) return;

        nav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", function () {
            const aberto = nav.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(aberto));
            menuToggle.setAttribute(
                "aria-label",
                aberto ? "Fechar menu" : "Abrir menu"
            );
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", fecharMenu);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                fecharMenu();
                menuToggle.focus();
            }
        });

        document.addEventListener("click", function (event) {
            if (
                nav.classList.contains("active") &&
                !nav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                fecharMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                fecharMenu();
            }
        });
    }

    /* =========================
       CARROSSEL CRIANÇAS E PETS
    ========================== */

    const carousel = document.querySelector(".familia-carrossel");

    if (carousel) {
        const slides = Array.from(
            carousel.querySelectorAll(".familia-slide")
        );

        const slidesContainer = carousel.querySelector(".familia-slides");
        const anterior = carousel.querySelector(".carrossel-btn.anterior");
        const proximo = carousel.querySelector(".carrossel-btn.proximo");
        const indicadores = Array.from(
            carousel.querySelectorAll(".indicador")
        );

        let slideAtual = 0;
        let inicioX = 0;
        let inicioY = 0;
        let arrastando = false;

        const movimentoReduzido = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        if (slidesContainer && slides.length > 0) {
            function mostrarSlide(index) {
                slideAtual = (index + slides.length) % slides.length;

                slidesContainer.style.transform =
                    "translateX(-" + slideAtual * 100 + "%)";

                slidesContainer.style.transition = movimentoReduzido.matches
                    ? "none"
                    : "";

                slides.forEach(function (slide, i) {
                    const ativo = i === slideAtual;

                    slide.classList.toggle("ativo", ativo);
                    slide.setAttribute("aria-hidden", String(!ativo));

                    slide.querySelectorAll("a, button").forEach(function (item) {
                        item.tabIndex = ativo ? 0 : -1;
                    });
                });

                indicadores.forEach(function (indicador, i) {
                    const ativo = i === slideAtual;

                    indicador.classList.toggle("ativo", ativo);
                    indicador.setAttribute(
                        "aria-current",
                        ativo ? "true" : "false"
                    );
                });
            }

            if (anterior) {
                anterior.addEventListener("click", function () {
                    mostrarSlide(slideAtual - 1);
                });
            }

            if (proximo) {
                proximo.addEventListener("click", function () {
                    mostrarSlide(slideAtual + 1);
                });
            }

            indicadores.forEach(function (indicador, i) {
                indicador.addEventListener("click", function () {
                    mostrarSlide(i);
                });
            });

            /* Navegação por teclado quando o carrossel está em foco */
            carousel.addEventListener("keydown", function (event) {
                if (event.key === "ArrowLeft") {
                    mostrarSlide(slideAtual - 1);
                } else if (event.key === "ArrowRight") {
                    mostrarSlide(slideAtual + 1);
                }
            });

            /* Gesto de arrastar com mouse ou toque */
            carousel.addEventListener("pointerdown", function (event) {
                if (event.pointerType === "mouse" && event.button !== 0) {
                    return;
                }

                inicioX = event.clientX;
                inicioY = event.clientY;
                arrastando = true;
            });

            carousel.addEventListener("pointerup", function (event) {
                if (!arrastando) return;

                arrastando = false;

                const distanciaX = event.clientX - inicioX;
                const distanciaY = event.clientY - inicioY;

                /* Ignora gestos predominantemente verticais */
                if (
                    Math.abs(distanciaX) < 50 ||
                    Math.abs(distanciaX) < Math.abs(distanciaY)
                ) {
                    return;
                }

                mostrarSlide(
                    distanciaX < 0 ? slideAtual + 1 : slideAtual - 1
                );
            });

            carousel.addEventListener("pointercancel", function () {
                arrastando = false;
            });

            mostrarSlide(0);
        }
    }

    /* =========================
       RASTREAMENTO DE WHATSAPP
       GOOGLE ANALYTICS 4
    ========================== */

    document.querySelectorAll(".js-whatsapp").forEach(function (link) {
        link.addEventListener("click", function () {
            if (typeof window.gtag === "function") {
                window.gtag("event", "clique_whatsapp", {
                    event_category: "contato",
                    event_label: link.href,
                    transport_type: "beacon"
                });
            }
        });
    });
});
