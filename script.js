/**
 * EMAILJS BULLETPROOF LOADER
 * Carregamento dinâmico com link de backup e modo de falha segura.
 */
const EmailJSManager = {
    isLoaded: false,
    publicKey: "ik9ItcbFPwvdfWsPn",
    // Links oficiais e de backup
    links: [
        'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/emailjs.min.js',
        'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/emailjs.min.js'
    ],
    
    init: function() {
        return new Promise((resolve) => {
            if (window.emailjs) {
                this.isLoaded = true;
                window.emailjs.init(this.publicKey);
                resolve(true);
                return;
            }

            let attempt = 0;
            const loadScript = (url) => {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                script.async = true;

                script.onload = () => {
                    if (window.emailjs) {
                        window.emailjs.init(this.publicKey);
                        this.isLoaded = true;
                        console.log('EmailJS carregado com sucesso.');
                        resolve(true);
                    }
                };

                script.onerror = () => {
                    attempt++;
                    if (attempt < this.links.length) {
                        console.warn(`Falha no link ${attempt}, tentando backup...`);
                        loadScript(this.links[attempt]);
                    } else {
                        console.error('EmailJS falhou em todos os links. Entrando em modo de falha segura.');
                        resolve(false); // Resolve como falso para não travar o site
                    }
                };

                document.head.appendChild(script);
            };

            loadScript(this.links[0]);
        });
    }
};

// Inicializa silenciosamente
EmailJSManager.init();

// Cart state
let cart = [];
let currentPrice = 89.47;
let currentOldPrice = 135;
let currentVariant = 'P13';
let currentProductName = 'Botijão de Gás 13 Kilos - Cheio (P13)';
const PRODUCT_NAME_BASE = 'Botijão de Gás';
let shippingData = {
    cep: '', street: '', neighborhood: '', city: '', state: '',
    number: '', complement: '', deliveryType: '', deliveryDate: '',
    deliveryTime: '', customerName: '', customerPhone: ''
};

// Elements
const cartBtn = document.getElementById('cart-btn');
const cartBadge = document.getElementById('cart-badge');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartContent = document.getElementById('cart-items-list');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const cartSummary = document.querySelector('.cart-summary');
const summaryDeliveryRow = document.getElementById('summary-delivery-row');
const summaryDeliveryText = document.getElementById('summary-delivery-text');
const summaryDeliveryIcon = document.getElementById('summary-delivery-icon');
const schedulingSection = document.getElementById('scheduling-section');
const deliveryDateInput = document.getElementById('delivery-date');
const deliveryTimeSelect = document.getElementById('delivery-time');
const mainQtyNumber = document.getElementById('main-qty-number');
const mainQtyDecrease = document.getElementById('main-qty-decrease');
const mainQtyIncrease = document.getElementById('main-qty-increase');
let mainQuantity = 1;

// Product Images
const productImages = {
    'P13': [
        'https://i.postimg.cc/bNrFp7fR/1000310540_removebg_preview.png',
        'https://i.postimg.cc/vB8sG0zH/images_(1)_(22).jpg',
        'https://i.postimg.cc/CMPqTtNT/vale_gas_repartidor_ultragaz.png',
        'https://i.postimg.cc/8cjg6s9m/images_(1)_(23).jpg'
    ],
    'P45': [
        'https://i.postimg.cc/nLbCWgpG/botij_Ao_de_g_As_45kg_2021_12_28_18_10_15_0_138.png',
        'https://i.postimg.cc/76qbHzCw/images_(1)_(27).jpg',
        'https://i.postimg.cc/gJGrzhwN/40943ee1e1.jpg',
        'https://i.postimg.cc/8cjg6s9m/images_(1)_(23).jpg'
    ]
};

// Carousel
let currentSlideIndex = 0;
const carouselTrack = document.getElementById('carousel-track');
const carouselDots = document.getElementById('carousel-dots');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const carouselContainer = document.getElementById('product-carousel');

function initCarousel(variant) {
    if (!carouselTrack || !carouselDots) return;
    const images = productImages[variant] || [];
    carouselTrack.innerHTML = '';
    carouselDots.innerHTML = '';
    currentSlideIndex = 0;
    images.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${variant} - Imagem ${index + 1}`;
        if (index === 0) img.id = 'main-image';
        slide.appendChild(img);
        carouselTrack.appendChild(slide);
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });
    updateCarousel();
}

function updateCarousel() {
    if (!carouselTrack || !carouselDots) return;
    const offset = -currentSlideIndex * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;
    const dots = carouselDots.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => { dot.classList.toggle('active', index === currentSlideIndex); });
}

function goToSlide(index) {
    const images = productImages[currentVariant] || [];
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentSlideIndex = index;
    updateCarousel();
}

if (carouselPrev) carouselPrev.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
if (carouselNext) carouselNext.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

initCarousel('P13');

// Variants
const variantPills = document.querySelectorAll('.variant-pill');
const productNameEl = document.querySelector('.product-name');
const productSkuEl = document.querySelector('.product-sku');
const oldPriceEl = document.querySelector('.old-price');
const currentPriceEl = document.querySelector('.current-price');
const unitPriceInfoEl = document.querySelector('.unit-price-info');
const stickyPriceEl = document.getElementById('sticky-price');

variantPills.forEach(pill => {
    pill.addEventListener('click', () => {
        variantPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const variant = pill.getAttribute('data-variant');
        const price = parseFloat(pill.getAttribute('data-price'));
        const oldPrice = parseFloat(pill.getAttribute('data-old-price'));
        currentPrice = price; currentOldPrice = oldPrice; currentVariant = variant;
        currentProductName = `${PRODUCT_NAME_BASE} ${variant === 'P13' ? '13 Kilos' : '45 Kilos'} - Cheio (${variant})`;
        initCarousel(variant);
        if (productNameEl) productNameEl.textContent = currentProductName;
        if (productSkuEl) productSkuEl.textContent = `SKU: ${variant}-ULTRAGAZ-2026`;
        const formattedPrice = price.toFixed(2).replace('.', ',');
        const formattedOldPrice = oldPrice.toFixed(2).replace('.', ',');
        const savings = (oldPrice - price).toFixed(2).replace('.', ',');
        if (oldPriceEl) oldPriceEl.innerHTML = `R$&nbsp;${formattedOldPrice}`;
        if (currentPriceEl) currentPriceEl.innerHTML = `R$&nbsp;${formattedPrice}`;
        if (stickyPriceEl) stickyPriceEl.textContent = `R$ ${formattedPrice}`;
        if (unitPriceInfoEl) unitPriceInfoEl.innerHTML = `<strong>R$&nbsp;${formattedPrice}</strong> por unidade • Economize R$ ${savings}`;
    });
});

if (mainQtyDecrease) mainQtyDecrease.addEventListener('click', () => { if (mainQuantity > 1) { mainQuantity--; mainQtyNumber.textContent = mainQuantity; } });
if (mainQtyIncrease) mainQtyIncrease.addEventListener('click', () => { mainQuantity++; mainQtyNumber.textContent = mainQuantity; });

// Cart Functions
function openCart() { if (cartOverlay) cartOverlay.classList.add('active'); if (cartSidebar) cartSidebar.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeCart() { if (cartOverlay) cartOverlay.classList.remove('active'); if (cartSidebar) cartSidebar.classList.remove('active'); document.body.style.overflow = ''; }
if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

const addToCartBtn = document.getElementById('add-to-cart-btn');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        cart = [{ id: currentVariant, name: currentProductName, price: currentPrice, quantity: mainQuantity, image: productImages[currentVariant][0] }];
        updateCartBadge(); updateCartDisplay(); openCart();
        mainQuantity = 1; if (mainQtyNumber) mainQtyNumber.textContent = mainQuantity;
    });
}

function updateCartBadge() {
    if (!cartBadge) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.classList.toggle('active', totalItems > 0);
}

function updateCartDisplay() {
    if (!cartContent) return;
    cartContent.innerHTML = '';
    let subtotal = 0;
    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                <div class="cart-item-qty-row">
                    <div class="cart-item-qty-selector">
                        <button class="cart-item-qty-btn" data-index="${index}" data-action="decrease">-</button>
                        <span class="cart-item-qty-val">${item.quantity}</span>
                        <button class="cart-item-qty-btn" data-index="${index}" data-action="increase">+</button>
                    </div>
                    <button class="cart-item-remove-btn" data-index="${index}"><i class="fas fa-trash-alt"></i> Remover</button>
                </div>
            </div>`;
        cartContent.appendChild(itemEl);
    });
    const formattedSubtotal = subtotal.toFixed(2).replace('.', ',');
    if (subtotalEl) subtotalEl.textContent = `R$ ${formattedSubtotal}`;
    if (totalEl) totalEl.textContent = `R$ ${formattedSubtotal}`;
    document.querySelectorAll('.cart-item-qty-btn').forEach(btn => btn.addEventListener('click', (e) => updateQuantity(parseInt(e.target.dataset.index), e.target.dataset.action)));
    document.querySelectorAll('.cart-item-remove-btn').forEach(btn => btn.addEventListener('click', (e) => removeFromCart(parseInt(e.currentTarget.dataset.index))));
    updateStickyHeader();
}

function updateQuantity(index, action) {
    if (action === 'increase') cart[index].quantity++;
    else if (action === 'decrease' && cart[index].quantity > 1) cart[index].quantity--;
    updateCartDisplay(); updateCartBadge();
}

function removeFromCart(index) { cart.splice(index, 1); updateCartDisplay(); updateCartBadge(); }

// CEP & Shipping
const cepInput = document.getElementById('cep-input');
const cepError = document.getElementById('cep-error');
const addressBlock = document.getElementById('address-block');
const addressStreet = document.getElementById('address-street');
const addressNeighborhood = document.getElementById('address-neighborhood');
const addressCity = document.getElementById('address-city');
const addressState = document.getElementById('address-state');
const numberInput = document.getElementById('number-input');
const complementInput = document.getElementById('complement-input');
const deliveryOptions = document.querySelectorAll('.delivery-option-card');
const customerDataSection = document.getElementById('customer-data-section');

if (cepInput) {
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5, 8);
        e.target.value = value;
        if (value.replace(/\D/g, '').length === 8) fetchAddressFromViaCEP(value.replace(/\D/g, ''));
        else { if (addressBlock) addressBlock.classList.remove('active'); hideAddressElements(); }
    });
}

async function fetchAddressFromViaCEP(cep) {
    try {
        cepInput.classList.add('loading');
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) { showCepError('CEP não encontrado'); return; }
        shippingData = { ...shippingData, cep, street: data.logradouro || '-', neighborhood: data.bairro || '-', city: data.localidade || '-', state: data.uf || '-' };
        addressStreet.textContent = shippingData.street; addressNeighborhood.textContent = shippingData.neighborhood;
        addressCity.textContent = shippingData.city; addressState.textContent = shippingData.state;
        addressBlock.classList.add('active'); showAddressElements(); cepInput.classList.remove('loading');
    } catch (error) { showCepError('Erro ao buscar CEP.'); }
}

function showAddressElements() { const dg = document.querySelector('.delivery-options-group'); if (dg) dg.classList.add('visible'); }
function hideAddressElements() { const dg = document.querySelector('.delivery-options-group'); if (dg) dg.classList.remove('visible'); }
function showCepError(m) { if (cepError) { cepError.textContent = m; cepError.classList.add('active'); } hideAddressElements(); cepInput.classList.remove('loading'); }

if (numberInput) numberInput.addEventListener('change', e => shippingData.number = e.target.value);
if (complementInput) complementInput.addEventListener('change', e => shippingData.complement = e.target.value);

if (deliveryDateInput) {
    const today = new Date().toISOString().split('T')[0];
    deliveryDateInput.setAttribute('min', today); deliveryDateInput.value = today; shippingData.deliveryDate = today;
    deliveryDateInput.addEventListener('change', e => { shippingData.deliveryDate = e.target.value; updateAvailableTimes(); });
}

function updateAvailableTimes() {
    if (!deliveryTimeSelect || !deliveryDateInput) return;
    const selectedDate = deliveryDateInput.value; const now = new Date(); const todayStr = now.toISOString().split('T')[0];
    deliveryTimeSelect.innerHTML = '<option value="">Selecione...</option>';
    let startIndex = 0;
    if (selectedDate === todayStr) {
        const h = now.getHours(); const m = now.getMinutes();
        startIndex = (m >= 30) ? (h + 1) * 2 + 1 : (h + 1) * 2;
    }
    for (let i = startIndex; i < 48; i++) {
        const h = Math.floor(i/2); const m = (i%2 === 0) ? '00' : '30';
        const t = `${String(h).padStart(2, '0')}:${m}`;
        const opt = document.createElement('option'); opt.value = t; opt.textContent = t; deliveryTimeSelect.appendChild(opt);
    }
}
updateAvailableTimes();

deliveryOptions.forEach(option => {
    option.addEventListener('click', () => {
        deliveryOptions.forEach(opt => opt.classList.remove('selected')); option.classList.add('selected');
        shippingData.deliveryType = option.dataset.delivery;
        if (summaryDeliveryRow) {
            summaryDeliveryRow.style.display = 'flex';
            if (shippingData.deliveryType === 'express') { summaryDeliveryText.textContent = 'Receba em 20 Minutos'; summaryDeliveryIcon.className = 'fas fa-bolt'; if (schedulingSection) schedulingSection.classList.remove('active'); }
            else { summaryDeliveryText.textContent = 'Agendada'; summaryDeliveryIcon.className = 'fas fa-calendar-alt'; if (schedulingSection) schedulingSection.classList.add('active'); }
        }
        if (customerDataSection) customerDataSection.classList.add('active');
        if (cartSummary) { cartSummary.style.display = 'block'; setTimeout(() => cartSummary.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100); }
    });
});

function updateStickyHeader() {
    const stickyHeader = document.getElementById('product-sticky-header');
    if (cart.length > 0) {
        const item = cart[0]; const tp = (item.price * item.quantity).toFixed(2).replace('.', ',');
        const st = document.getElementById('sticky-title'); const sqv = document.getElementById('sticky-qty-value'); const sp = document.getElementById('sticky-price');
        if (st) st.textContent = item.name; if (sqv) sqv.textContent = item.quantity; if (sp) sp.textContent = `R$ ${tp}`;
        if (stickyHeader) stickyHeader.style.display = 'block';
    } else if (stickyHeader) stickyHeader.style.display = 'none';
}

// Order Finalization
async function sendOrderEmail() {
    // Se o EmailJS não carregou, ignora silenciosamente para não travar o fluxo do usuário
    if (!window.emailjs) {
        console.warn('EmailJS não carregado. Pulando envio de e-mail (Fail-safe).');
        return;
    }
    const item = cart[0]; const totalFormatted = (item.price * item.quantity).toFixed(2).replace('.', ',');
    const templateParams = {
        customer_name: document.getElementById('customer-name')?.value || 'Não informado',
        customer_phone: document.getElementById('customer-phone')?.value || 'Não informado',
        product_name: item.name, product_quantity: item.quantity, product_price: item.price.toFixed(2).replace('.', ','),
        total_price: totalFormatted, delivery_type: shippingData.deliveryType === 'express' ? 'Entrega Rápida' : 'Entrega Agendada',
        delivery_date: shippingData.deliveryDate || 'N/A', delivery_time: shippingData.deliveryTime || 'N/A',
        address_street: shippingData.street, address_number: shippingData.number, address_complement: shippingData.complement,
        address_neighborhood: shippingData.neighborhood, address_city: shippingData.city, address_state: shippingData.state, address_cep: shippingData.cep
    };
    try { await emailjs.send('service_0euy74r', 'template_57ynkas', templateParams); } catch (e) { console.error('Erro EmailJS:', e); }
}

const proceedBtn = document.querySelector('.proceed-btn');
if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        if (!shippingData.deliveryType) { alert('Selecione a entrega.'); return; }
        if (!shippingData.number) { alert('Informe o número.'); document.getElementById('number-input')?.focus(); return; }
        sendOrderEmail(); renderReviewBlock();
    });
}

function renderReviewBlock() {
    const item = cart[0]; const totalFormatted = (item.price * item.quantity).toFixed(2).replace('.', ',');
    const dt = shippingData.deliveryType === 'express' ? 'Rápida - Grátis (20 min)' : `Agendada - Grátis (${shippingData.deliveryDate} às ${shippingData.deliveryTime})`;
    const address = `${shippingData.street}, ${shippingData.number} ${shippingData.complement ? '- ' + shippingData.complement : ''}<br>${shippingData.neighborhood} - ${shippingData.city}/${shippingData.state}<br>CEP: ${shippingData.cep}`;
    const reviewHTML = `
        <div class="review-block">
            <div class="review-header-bar"><button class="review-back-btn" onclick="location.reload()"><i class="fas fa-arrow-left"></i></button><div class="review-header-title">Revisão do Pedido</div></div>
            <div class="review-content">
                <div class="review-section"><div class="review-section-title">Produto</div><div class="review-item-detail"><img src="${item.image}" class="review-item-img"><div class="review-item-info">${item.name}<br>${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')} = <strong>R$ ${totalFormatted}</strong></div></div></div>
                <div class="review-section"><div class="review-section-title">Endereço</div><div class="review-text">${address}</div></div>
                <div class="review-section"><div class="review-section-title">Entrega</div><div class="review-text">${dt}</div></div>
                <button class="finish-now-btn" id="finish-now-btn"><i class="fas fa-check-circle"></i> Finalizar Agora</button>
            </div>
        </div>`;
    const cartWrapper = document.getElementById('cart-content-wrapper');
    if (cartWrapper) { cartWrapper.innerHTML = reviewHTML; cartWrapper.scrollTop = 0; }
    document.addEventListener('click', e => { if (e.target.closest('#finish-now-btn')) window.location.href = `https://seulinkaqui.com/?subtotal=${(item.price * item.quantity).toFixed(2)}`; });
}
