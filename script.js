"use strict";

// =========================================
// MERCEARIA GOMES — ELEMENTOS PRINCIPAIS
// =========================================

const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");
const pageButtons = document.querySelectorAll("[data-page]");

const pageName = document.getElementById("pageName");
const sidebar = document.getElementById("sidebar");
const mobileMenu = document.getElementById("mobileMenu");
const sidebarOverlay = document.getElementById("sidebarOverlay");

// =========================================
// NAVEGAÇÃO ENTRE TELAS
// =========================================

function openPage(pageId) {
    const targetPage = document.getElementById(pageId);

    if (!targetPage) {
        console.warn(`Página "${pageId}" não encontrada.`);
        return;
    }

    pages.forEach(page => {
        page.classList.remove("active");
    });

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    targetPage.classList.add("active");

    const activeNav = document.querySelector(
        `.nav-item[data-page="${pageId}"]`
    );

    if (activeNav) {
        activeNav.classList.add("active");

        const label = activeNav.querySelector("span:nth-child(2)");

        if (label && pageName) {
            pageName.textContent = label.textContent.trim();
        }
    }

    closeSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    animateVisibleElements(targetPage);
}

// Botões que abrem as páginas

pageButtons.forEach(button => {
    button.addEventListener("click", () => {
        const target = button.dataset.page;

        if (target) {
            openPage(target);
        }
    });
});

// =========================================
// MENU LATERAL — CELULAR
// =========================================

function openSidebar() {
    if (sidebar) {
        sidebar.classList.add("open");
    }

    if (sidebarOverlay) {
        sidebarOverlay.classList.add("active");
    }
}

function closeSidebar() {
    if (sidebar) {
        sidebar.classList.remove("open");
    }

    if (sidebarOverlay) {
        sidebarOverlay.classList.remove("active");
    }
}

if (mobileMenu) {
    mobileMenu.addEventListener("click", event => {
        event.stopPropagation();

        if (sidebar && sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
}

// =========================================
// DATA ATUAL
// =========================================

const currentDate = document.getElementById("currentDate");

if (currentDate) {
    const today = new Date();

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(today);

    currentDate.textContent = formattedDate;
}

// =========================================
// FILTRO VISUAL DO GRÁFICO
// =========================================

const periodButtons = document.querySelectorAll(".period");

periodButtons.forEach(button => {
    button.addEventListener("click", () => {
        periodButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
    });
});

// =========================================
// ANIMAÇÕES DOS ELEMENTOS
// =========================================

const revealElements = document.querySelectorAll(".reveal");

let revealObserver = null;

if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}

function animateVisibleElements(page) {
    if (!page) {
        return;
    }

    const elements = page.querySelectorAll(".reveal");

    elements.forEach((element, index) => {
        element.classList.remove("visible");

        setTimeout(() => {
            element.classList.add("visible");
        }, 60 + index * 60);
    });
}

// =========================================
// BUSCA GLOBAL
// =========================================

const globalSearch = document.getElementById("globalSearch");

document.addEventListener("keydown", event => {
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
});

// =========================================
// BUSCA NA TABELA DE VENDAS
// =========================================

const tableSearch = document.querySelector(".table-search");

if (tableSearch) {
    tableSearch.addEventListener("input", event => {
        const value = event.target.value
            .toLowerCase()
            .trim();

        const rows = document.querySelectorAll(".searchable-row");

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();

            row.classList.toggle(
                "search-hidden",
                !text.includes(value)
            );
        });
    });
}

// =========================================
// BUSCA DE PRODUTOS
// =========================================

const productSearch = document.querySelector(".product-search");

if (productSearch) {
    productSearch.addEventListener("input", event => {
        const value = event.target.value
            .toLowerCase()
            .trim();

        const products = document.querySelectorAll(
            ".searchable-product"
        );

        products.forEach(product => {
            const text = product.textContent.toLowerCase();

            product.classList.toggle(
                "search-hidden",
                !text.includes(value)
            );
        });
    });
}

// =========================================
// BUSCA DE CLIENTES
// =========================================

const clientSearch = document.querySelector(".client-search");

if (clientSearch) {
    clientSearch.addEventListener("input", event => {
        const value = event.target.value
            .toLowerCase()
            .trim();

        const clients = document.querySelectorAll(
            ".searchable-client"
        );

        clients.forEach(client => {
            const text = client.textContent.toLowerCase();

            client.classList.toggle(
                "search-hidden",
                !text.includes(value)
            );
        });
    });
}

// =========================================
// MODAL — NOVA VENDA
// =========================================

const saleModal = document.getElementById("saleModal");

const openSaleModalButton = document.getElementById(
    "openSaleModal"
);

const otherSaleButtons = document.querySelectorAll(
    ".open-sale-button"
);

const closeSaleModalButton = document.getElementById(
    "closeSaleModal"
);

const cancelSale = document.getElementById("cancelSale");

const saleForm = document.getElementById("saleForm");

function openSaleModal() {
    if (!saleModal) {
        return;
    }

    saleModal.classList.add("active");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
        const customerInput = document.getElementById(
            "saleCustomer"
        );

        if (customerInput) {
            customerInput.focus();
        }
    }, 200);
}

function closeSaleModal() {
    if (!saleModal) {
        return;
    }

    saleModal.classList.remove("active");
    document.body.style.overflow = "";
}

if (openSaleModalButton) {
    openSaleModalButton.addEventListener(
        "click",
        openSaleModal
    );
}

otherSaleButtons.forEach(button => {
    button.addEventListener("click", openSaleModal);
});

if (closeSaleModalButton) {
    closeSaleModalButton.addEventListener(
        "click",
        closeSaleModal
    );
}

if (cancelSale) {
    cancelSale.addEventListener("click", closeSaleModal);
}

if (saleModal) {
    saleModal.addEventListener("click", event => {
        if (event.target === saleModal) {
            closeSaleModal();
        }
    });
}

// =========================================
// FINALIZAR VENDA — COMPORTAMENTO ATUAL
// =========================================

if (saleForm) {
    saleForm.addEventListener("submit", event => {
        event.preventDefault();

        closeSaleModal();

        showToast(
            "Venda registrada",
            "Operação realizada com sucesso."
        );

        saleForm.reset();
    });
}

// =========================================
// NOTIFICAÇÕES — TOAST
// =========================================

const toast = document.getElementById("toast");

let toastTimer;

function showToast(title, message) {
    if (!toast) {
        return;
    }

    const titleElement = toast.querySelector("strong");
    const messageElement = toast.querySelector("span");

    if (titleElement) {
        titleElement.textContent = title;
    }

    if (messageElement) {
        messageElement.textContent = message;
    }

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

// =========================================
// BUSCA GLOBAL POR NOME DA TELA
// =========================================

if (globalSearch) {
    globalSearch.addEventListener("keydown", event => {
        if (event.key !== "Enter") {
            return;
        }

        const search = globalSearch.value
            .toLowerCase()
            .trim();

        if (!search) {
            return;
        }

        if (search.includes("venda")) {
            openPage("vendas");
        } else if (
            search.includes("produto") ||
            search.includes("estoque")
        ) {
            openPage("produtos");
        } else if (search.includes("cliente")) {
            openPage("clientes");
        } else if (
            search.includes("finance") ||
            search.includes("conta")
        ) {
            openPage("financeiro");
        } else {
            showToast(
                "Busca",
                `Nenhum resultado para "${globalSearch.value}".`
            );
        }

        globalSearch.value = "";
    });
}

// =========================================
// PRODUTOS — INTEGRAÇÃO COM O BACKEND FLASK
// =========================================

async function carregarProdutosDoBanco() {
    try {
        // Busca os produtos cadastrados no PostgreSQL
        // por meio da API do backend Flask.

        const resposta = await fetch(
            "http://127.0.0.1:5000/api/produtos"
        );

        if (!resposta.ok) {
            throw new Error(
                `Não foi possível buscar os produtos. HTTP ${resposta.status}`
            );
        }

        const produtos = await resposta.json();

        console.log(
            "Produtos cadastrados no banco:",
            produtos
        );

        // Confere se o backend retornou uma lista.

        if (!Array.isArray(produtos)) {
            throw new Error(
                "A API não retornou uma lista de produtos."
            );
        }

        // Local onde os cartões serão exibidos no HTML.

        const listaProdutos = document.getElementById(
            "lista-produtos"
        );

        if (!listaProdutos) {
            console.warn(
                'Elemento com id="lista-produtos" não encontrado no HTML.'
            );

            return;
        }

        // Remove os cartões de exemplo para mostrar
        // os produtos reais vindos do banco.

        listaProdutos.innerHTML = "";

        // Mensagem caso ainda não haja produtos cadastrados.

        if (produtos.length === 0) {
            const mensagem = document.createElement("p");

            mensagem.textContent =
                "Nenhum produto cadastrado no banco de dados.";

            listaProdutos.appendChild(mensagem);

            return;
        }

        // Cria um cartão para cada produto retornado pela API.

        produtos.forEach(produto => {
            const card = document.createElement("article");

            card.className =
                "product-card searchable-product";

            // Ícone do produto

            const imagem = document.createElement("div");

            imagem.className = "product-image";
            imagem.textContent = "🛒";

            // Categoria visual

            const categoria = document.createElement("span");

            categoria.className = "product-category";
            categoria.textContent = "PRODUTO";

            // Nome

            const nome = document.createElement("h3");

            nome.textContent = produto.nome ?? "Sem nome";

            // Preço

            const preco = document.createElement("strong");

            preco.textContent = Number(
                produto.preco
            ).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

            // Quantidade em estoque

            const estoque = document.createElement("span");

            estoque.className = "product-status";

            const quantidade = Number(
                produto.quantidade_estoque
            );

            estoque.textContent = `${quantidade} unidades`;

            if (quantidade <= 5) {
                estoque.classList.add("danger-product");
            }

            // Monta o cartão completo.

            card.append(
                imagem,
                categoria,
                nome,
                preco,
                estoque
            );

            listaProdutos.appendChild(card);
        });

        console.log(
            `${produtos.length} produto(s) exibido(s) na tela.`
        );

    } catch (erro) {
        // Uma falha no backend não deve impedir
        // a navegação pelas outras telas.

        console.error(
            "Erro ao carregar produtos:",
            erro
        );
    }
}

// =========================================
// INICIALIZAÇÃO DO SISTEMA
// =========================================

function iniciarSistema() {
    openPage("dashboard");

    // Carrega os produtos sem bloquear a navegação.
    carregarProdutosDoBanco();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarSistema
    );
} else {
    iniciarSistema();
}