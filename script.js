"use strict";


// =========================================
// ELEMENTOS PRINCIPAIS
// =========================================

const pages =
    document.querySelectorAll(".page");

const navItems =
    document.querySelectorAll(".nav-item");

const pageButtons =
    document.querySelectorAll("[data-page]");

const pageName =
    document.getElementById("pageName");

const sidebar =
    document.getElementById("sidebar");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


// =========================================
// NAVEGAÇÃO ENTRE TELAS
// =========================================

function openPage(pageId) {

    const targetPage =
        document.getElementById(pageId);

    if (!targetPage) {
        console.warn(
            `Página "${pageId}" não encontrada.`
        );

        return;
    }


    // Remove página ativa

    pages.forEach(page => {

        page.classList.remove("active");

    });


    // Remove menu ativo

    navItems.forEach(item => {

        item.classList.remove("active");

    });


    // Ativa página

    targetPage.classList.add("active");


    // Procura item correspondente

    const activeNav =
        document.querySelector(
            `.nav-item[data-page="${pageId}"]`
        );


    if (activeNav) {

        activeNav.classList.add("active");

        const label =
            activeNav.querySelector(
                "span:nth-child(2)"
            );

        if (label && pageName) {

            pageName.textContent =
                label.textContent.trim();

        }

    }


    // Fecha menu mobile

    closeSidebar();


    // Volta para cima

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    // Executa animação dos elementos
    // da nova página

    animateVisibleElements(targetPage);
}


// Botões com data-page

pageButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const target =
                button.dataset.page;

            if (target) {

                openPage(target);

            }

        }
    );

});


// =========================================
// SIDEBAR MOBILE
// =========================================

function openSidebar() {

    sidebar.classList.add("open");

    sidebarOverlay.classList.add(
        "active"
    );

}


function closeSidebar() {

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove(
        "active"
    );

}


if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            if (
                sidebar.classList.contains(
                    "open"
                )
            ) {

                closeSidebar();

            } else {

                openSidebar();

            }

        }
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


// =========================================
// DATA ATUAL
// =========================================

const currentDate =
    document.getElementById(
        "currentDate"
    );


if (currentDate) {

    const today =
        new Date();


    const formattedDate =
        new Intl.DateTimeFormat(
            "pt-BR",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        ).format(today);


    currentDate.textContent =
        formattedDate;

}


// =========================================
// FILTRO DO GRÁFICO
// =========================================

const periodButtons =
    document.querySelectorAll(
        ".period"
    );


periodButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            periodButtons.forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );

        }
    );

});


// =========================================
// ANIMAÇÃO DE ENTRADA
// =========================================

const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.08
        }

    );


document
    .querySelectorAll(".reveal")
    .forEach(element => {

        revealObserver.observe(
            element
        );

    });


function animateVisibleElements(page) {

    const elements =
        page.querySelectorAll(
            ".reveal"
        );


    elements.forEach(
        (element, index) => {

            element.classList.remove(
                "visible"
            );


            setTimeout(
                () => {

                    element.classList.add(
                        "visible"
                    );

                },

                60 + index * 60

            );

        }
    );

}


// =========================================
// BUSCA GLOBAL
// =========================================

const globalSearch =
    document.getElementById(
        "globalSearch"
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();


            if (globalSearch) {

                globalSearch.focus();

            }

        }


        if (event.key === "Escape") {

            closeSaleModal();
            closeSidebar();

        }

    }
);


// =========================================
// BUSCA DE VENDAS
// =========================================

const tableSearch =
    document.querySelector(
        ".table-search"
    );


if (tableSearch) {

    tableSearch.addEventListener(
        "input",
        event => {

            const value =
                event.target.value
                    .toLowerCase()
                    .trim();


            const rows =
                document.querySelectorAll(
                    ".searchable-row"
                );


            rows.forEach(row => {

                const text =
                    row.textContent
                        .toLowerCase();


                row.classList.toggle(
                    "search-hidden",
                    !text.includes(value)
                );

            });

        }
    );

}


// =========================================
// BUSCA DE PRODUTOS
// =========================================

const productSearch =
    document.querySelector(
        ".product-search"
    );


if (productSearch) {

    productSearch.addEventListener(
        "input",
        event => {

            const value =
                event.target.value
                    .toLowerCase()
                    .trim();


            const products =
                document.querySelectorAll(
                    ".searchable-product"
                );


            products.forEach(product => {

                const text =
                    product.textContent
                        .toLowerCase();


                product.classList.toggle(
                    "search-hidden",
                    !text.includes(value)
                );

            });

        }
    );

}


// =========================================
// BUSCA DE CLIENTES
// =========================================

const clientSearch =
    document.querySelector(
        ".client-search"
    );


if (clientSearch) {

    clientSearch.addEventListener(
        "input",
        event => {

            const value =
                event.target.value
                    .toLowerCase()
                    .trim();


            const clients =
                document.querySelectorAll(
                    ".searchable-client"
                );


            clients.forEach(client => {

                const text =
                    client.textContent
                        .toLowerCase();


                client.classList.toggle(
                    "search-hidden",
                    !text.includes(value)
                );

            });

        }
    );

}


// =========================================
// MODAL NOVA VENDA
// =========================================

const saleModal =
    document.getElementById(
        "saleModal"
    );

const openSaleModalButton =
    document.getElementById(
        "openSaleModal"
    );

const otherSaleButtons =
    document.querySelectorAll(
        ".open-sale-button"
    );

const closeSaleModalButton =
    document.getElementById(
        "closeSaleModal"
    );

const cancelSale =
    document.getElementById(
        "cancelSale"
    );

const saleForm =
    document.getElementById(
        "saleForm"
    );


function openSaleModal() {

    if (!saleModal) {
        return;
    }


    saleModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        () => {

            const customerInput =
                document.getElementById(
                    "saleCustomer"
                );


            if (customerInput) {

                customerInput.focus();

            }

        },

        200

    );

}


function closeSaleModal() {

    if (!saleModal) {
        return;
    }


    saleModal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


if (openSaleModalButton) {

    openSaleModalButton.addEventListener(
        "click",
        openSaleModal
    );

}


otherSaleButtons.forEach(button => {

    button.addEventListener(
        "click",
        openSaleModal
    );

});


if (closeSaleModalButton) {

    closeSaleModalButton.addEventListener(
        "click",
        closeSaleModal
    );

}


if (cancelSale) {

    cancelSale.addEventListener(
        "click",
        closeSaleModal
    );

}


if (saleModal) {

    saleModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                saleModal
            ) {

                closeSaleModal();

            }

        }
    );

}


// =========================================
// FINALIZAR VENDA
// =========================================

if (saleForm) {

    saleForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            closeSaleModal();


            showToast(
                "Venda registrada",
                "Operação realizada com sucesso."
            );


            saleForm.reset();

        }
    );

}


// =========================================
// TOAST
// =========================================

const toast =
    document.getElementById(
        "toast"
    );


let toastTimer;


function showToast(
    title,
    message
) {

    if (!toast) {
        return;
    }


    const titleElement =
        toast.querySelector(
            "strong"
        );

    const messageElement =
        toast.querySelector(
            "span"
        );


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },

            3200

        );

}


// =========================================
// BUSCA GLOBAL SIMPLES
// =========================================

if (globalSearch) {

    globalSearch.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
            ) {
                return;
            }


            const search =
                globalSearch.value
                    .toLowerCase()
                    .trim();


            if (!search) {
                return;
            }


            if (
                search.includes(
                    "venda"
                )
            ) {

                openPage("vendas");

            }

            else if (
                search.includes(
                    "produto"
                ) ||
                search.includes(
                    "estoque"
                )
            ) {

                openPage("produtos");

            }

            else if (
                search.includes(
                    "cliente"
                )
            ) {

                openPage("clientes");

            }

            else if (
                search.includes(
                    "finance"
                ) ||
                search.includes(
                    "conta"
                )
            ) {

                openPage(
                    "financeiro"
                );

            }

            else {

                showToast(
                    "Busca",
                    `Nenhum resultado para "${globalSearch.value}".`
                );

            }


            globalSearch.value =
                "";

        }
    );

}


// =========================================
// INICIALIZAÇÃO
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        openPage(
            "dashboard"
        );

    }
);