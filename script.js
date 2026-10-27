
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================
       MENU MOBILE
    ========================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".header nav");

    function fecharMenu(devolverFoco = false) {
        if (!menuToggle || !nav) return;

        nav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");

        if (devolverFoco) {
            menuToggle.focus();
        }
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", function () {
            const aberto = !nav.classList.contains("active");

            nav.classList.toggle("active", aberto);
            menuToggle.setAttribute("aria-expanded", String(aberto));
            menuToggle.setAttribute(
                "aria-label",
                aberto ? "Fechar menu" : "Abrir menu"
            );
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                fecharMenu();
            });
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && nav.classList.contains("active")) {
                fecharMenu(true);
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

    /* =========================================
       CARROSSEL — CRIANÇAS E PETS
    ========================================= */

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

        const movimentoReduzido = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        let slideAtual = 0;
        let inicioX = 0;
        let inicioY = 0;
        let arrastando = false;

        function atualizarTransicao() {
            if (!slidesContainer) return;

            slidesContainer.style.transition = movimentoReduzido.matches
                ? "none"
                : "";
        }

        function mostrarSlide(index) {
            if (!slidesContainer || slides.length === 0) return;

            slideAtual = (index + slides.length) % slides.length;

            atualizarTransicao();

            slidesContainer.style.transform =
                "translateX(-" + slideAtual * 100 + "%)";

            slides.forEach(function (slide, i) {
                const ativo = i === slideAtual;

                slide.classList.toggle("ativo", ativo);
                slide.setAttribute("aria-hidden", String(!ativo));

                /* Impede foco em conteúdo de slides inativos */
                slide.inert = !ativo;

                slide.querySelectorAll(
                    "a, button, input, select, textarea, [tabindex]"
                ).forEach(function (elemento) {
                    if (!ativo) {
                        if (!elemento.hasAttribute("data-tabindex-original")) {
                            elemento.setAttribute(
                                "data-tabindex-original",
                                elemento.getAttribute("tabindex") ?? ""
                            );
                        }

                        elemento.setAttribute("tabindex", "-1");
                    } else if (elemento.hasAttribute("data-tabindex-original")) {
                        const valorOriginal = elemento.getAttribute(
                            "data-tabindex-original"
                        );

                        if (valorOriginal === "") {
                            elemento.removeAttribute("tabindex");
                        } else {
                            elemento.setAttribute("tabindex", valorOriginal);
                        }

                        elemento.removeAttribute("data-tabindex-original");
                    }
                });
            });

            indicadores.forEach(function (indicador, i) {
                const ativo = i === slideAtual;

                indicador.classList.toggle("ativo", ativo);

                if (ativo) {
                    indicador.setAttribute("aria-current", "true");
                } else {
                    indicador.removeAttribute("aria-current");
                }
            });
        }

        if (slidesContainer && slides.length > 0) {
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

            indicadores.forEach(function (indicador, index) {
                indicador.addEventListener("click", function () {
                    mostrarSlide(index);
                });
            });

            /* Navegação por teclado */
            carousel.addEventListener("keydown", function (event) {
                if (event.altKey || event.ctrlKey || event.metaKey) return;

                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    mostrarSlide(slideAtual - 1);
                } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    mostrarSlide(slideAtual + 1);
                }
            });

            /* Arrastar com mouse ou toque */
            carousel.addEventListener("pointerdown", function (event) {
                if (event.pointerType === "mouse" && event.button !== 0) {
                    return;
                }

                /* Não inicia arraste sobre controles ou links */
                if (
                    event.target.closest(
                        "button, a, input, select, textarea, label"
                    )
                ) {
                    arrastando = false;
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

                /* Ignora movimentos curtos ou predominantemente verticais */
                if (
                    Math.abs(distanciaX) < 50 ||
                    Math.abs(distanciaX) <= Math.abs(distanciaY)
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

            carousel.addEventListener("lostpointercapture", function () {
                arrastando = false;
            });

            /* Atualiza a preferência se mudar durante a navegação */
            if (typeof movimentoReduzido.addEventListener === "function") {
                movimentoReduzido.addEventListener(
                    "change",
                    atualizarTransicao
                );
            }

            mostrarSlide(0);
        }
    }

    /* =========================================
       RASTREAMENTO DE CLIQUES NO WHATSAPP
       GOOGLE ANALYTICS 4
    ========================================= */

    document.querySelectorAll(".js-whatsapp").forEach(function (link) {
        link.addEventListener("click", function () {
            const dadosEvento = {
                link_url: link.href,
                link_text: link.textContent.trim(),
                transport_type: "beacon"
            };

            if (typeof window.gtag === "function") {
                window.gtag("event", "clique_whatsapp", dadosEvento);
            } else if (Array.isArray(window.dataLayer)) {
                /* Mantém o evento na fila caso gtag ainda não esteja disponível */
                window.dataLayer.push([
                    "event",
                    "clique_whatsapp",
                    dadosEvento
                ]);
            }
        });
    });
});
