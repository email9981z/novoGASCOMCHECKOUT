// EmailJS Configuration
emailjs.init('ik9ItcbFPwvdfWsPn');

// Global State
let cart = [];
let shippingData = {
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    deliveryType: '', // 'express' or 'scheduled'
    deliveryDate: '',
    deliveryTime: '',
    customerName: '',
    customerPhone: ''
};

// DOM Elements
const addToCartBtn = document.getElementById('add-to-cart');
const cartBadge = document.getElementById('cart-badge');
const qtyNumber = document.getElementById('qty-number');
const qtyDecrease = document.getElementById('qty-decrease');
const qtyIncrease = document.getElementById('qty-increase');
const cartContent = document.getElementById('cart-content-wrapper');
const cepInput = document.getElementById('cep-input');
const cepError = document.getElementById('cep-error');
const addressBlock = document.getElementById('address-block');
const addressStreet = document.getElementById('address-street');
const addressNeighborhood = document.getElementById('address-neighborhood');
const addressCity = document.getElementById('address-city');
const addressState = document.getElementById('address-state');
const numberInput = document.getElementById('number-input');
const complementInput = document.getElementById('complement-input');
const extraFieldsRow = document.getElementById('extra-fields-row');
const deliveryOptions = document.querySelectorAll('.delivery-option-card');
const schedulingSection = document.getElementById('scheduling-section');
const deliveryDateInput = document.getElementById('delivery-date');
const deliveryTimeSelect = document.getElementById('delivery-time');
const customerDataSection = document.getElementById('customer-data-section');
const cartSummary = document.getElementById('cart-summary');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const summaryDeliveryRow = document.getElementById('summary-delivery-row');
const summaryDeliveryText = document.getElementById('summary-delivery-text');
const summaryDeliveryIcon = document.getElementById('summary-delivery-icon');

// Carousel Logic
const track = document.querySelector('.carousel-track');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function updateCarousel() {
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

// Swipe support for carousel
let touchStartX = 0;
let touchEndX = 0;

if (track) {
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
}

function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
        // Swipe left
        if (currentSlide < dots.length - 1) {
            currentSlide++;
            updateCarousel();
        }
    } else if (touchEndX - touchStartX > 50) {
        // Swipe right
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
}

// Quantity Selector Logic
let quantity = 1;

if (qtyDecrease) {
    qtyDecrease.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            qtyNumber.textContent = quantity;
        }
    });
}

if (qtyIncrease) {
    qtyIncrease.addEventListener('click', () => {
        if (quantity < 10) {
            quantity++;
            qtyNumber.textContent = quantity;
        }
    });
}

// Cart Logic
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const product = {
            id: 1,
            name: 'Botijão de Gás 13kg (Vazio)',
            price: 135.90,
            quantity: quantity,
            image: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/oficinadosgases/media/cache/37/6b/376b3252069273673552077978255850.jpg'
        };

        // For this demo, we replace the cart with the new selection
        cart = [product];
        updateCartBadge();
        renderCart();
        
        // Scroll to address section
        const addressSection = document.getElementById('address-section');
        if (addressSection) {
            addressSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function updateCartBadge() {
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (totalQty > 0) {
        cartBadge.textContent = totalQty;
        cartBadge.classList.add('active');
    } else {
        cartBadge.classList.remove('active');
    }
}

function renderCart() {
    if (!cartContent) return;

    let cartHTML = '<div class="cart-list">';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    <div class="quantity-selector" style="margin-top: 10px; transform: scale(0.8); transform-origin: left center;">
                        <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
                        <div class="qty-number">${item.quantity}</div>
                        <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
                    </div>
                </div>
                <div class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></div>
            </div>
        `;
    });

    cartHTML += '</div>';
    
    // Append the address section
    const addressSectionHTML = document.getElementById('address-section-template').innerHTML;
    cartHTML += addressSectionHTML;

    cartContent.innerHTML = cartHTML;
    
    // Re-attach event listeners for cart items
    attachCartListeners();
    updateCartDisplay();
    updateStickyHeader();
}

function attachCartListeners() {
    const removeButtons = document.querySelectorAll('.remove-item');
    const qtyButtons = document.querySelectorAll('.quantity-selector .qty-btn');
    const cepInputNew = document.getElementById('cep-input');
    const deliveryOptionsNew = document.querySelectorAll('.delivery-option-card');
    const numberInputNew = document.getElementById('number-input');
    const complementInputNew = document.getElementById('complement-input');
    const deliveryDateInputNew = document.getElementById('delivery-date');
    const deliveryTimeSelectNew = document.getElementById('delivery-time');
    const customerNameInputNew = document.getElementById('customer-name');
    const customerPhoneInputNew = document.getElementById('customer-phone');

    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            removeFromCart(index);
        });
    });

    qtyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            const action = e.currentTarget.dataset.action;
            updateQuantity(index, action);
        });
    });

    if (cepInputNew) {
        cepInputNew.addEventListener('input', handleCepInput);
    }

    deliveryOptionsNew.forEach(option => {
        option.addEventListener('click', () => {
            deliveryOptionsNew.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            shippingData.deliveryType = option.dataset.deliveryType;
            
            if (shippingData.deliveryType === 'express') {
                if (schedulingSection) schedulingSection.style.display = 'none';
                if (summaryDeliveryRow) summaryDeliveryRow.style.display = 'flex';
                if (summaryDeliveryText) summaryDeliveryText.textContent = 'Entrega Rápida - Em até 20 minutos';
                if (summaryDeliveryIcon) summaryDeliveryIcon.className = 'fas fa-bolt';
            } else {
                if (schedulingSection) schedulingSection.style.display = 'block';
                if (summaryDeliveryRow) summaryDeliveryRow.style.display = 'flex';
                if (summaryDeliveryText) summaryDeliveryText.textContent = 'Entrega Agendada';
                if (summaryDeliveryIcon) summaryDeliveryIcon.className = 'fas fa-calendar';
            }
            
            if (customerDataSection) customerDataSection.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'flex';
        });
    });

    if (numberInputNew) {
        numberInputNew.addEventListener('input', (e) => {
            shippingData.number = e.target.value;
        });
    }

    if (complementInputNew) {
        complementInputNew.addEventListener('input', (e) => {
            shippingData.complement = e.target.value;
        });
    }

    if (deliveryDateInputNew) {
        deliveryDateInputNew.addEventListener('change', (e) => {
            shippingData.deliveryDate = e.target.value;
            updateAvailableTimes();
        });
    }

    if (deliveryTimeSelectNew) {
        deliveryTimeSelectNew.addEventListener('change', (e) => {
            shippingData.deliveryTime = e.target.value;
        });
    }

    if (customerPhoneInputNew) {
        customerPhoneInputNew.addEventListener('input', handlePhoneInput);
    }

    if (customerNameInputNew) {
        customerNameInputNew.addEventListener('blur', (e) => {
            shippingData.customerName = e.target.value;
        });
    }

    const newProceedBtn = document.querySelector('.proceed-btn');
    if (newProceedBtn) {
        newProceedBtn.addEventListener('click', handleProceed);
    }
}

function handleCepInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5, 8);
    }
    e.target.value = value;
    
    const cepError = document.getElementById('cep-error');
    if (cepError) {
        cepError.classList.remove('active');
        cepError.textContent = '';
    }

    if (value.replace(/\D/g, '').length === 8) {
        const cartSummary = document.getElementById('cart-summary');
        if (cartSummary) cartSummary.style.display = 'none';
        fetchAddressFromViaCEP(value.replace(/\D/g, ''));
        setTimeout(() => { e.target.blur(); }, 300);
    } else {
        const addressBlock = document.getElementById('address-block');
        if (addressBlock) addressBlock.classList.remove('active');
        hideAddressElements();
        const cartSummary = document.getElementById('cart-summary');
        if (cartSummary) cartSummary.style.display = 'none';
    }
}

function handlePhoneInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 2) {
            value = '(' + value;
        } else if (value.length <= 7) {
            value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
        } else {
            value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7, 11);
        }
    }
    e.target.value = value;
    shippingData.customerPhone = value;
    if (value.replace(/\D/g, '').length === 11) {
        e.target.blur();
    }
}

async function handleProceed() {
    if (cart.length === 0) return;
    if (!shippingData.deliveryType) {
        alert('Por favor, selecione uma opção de entrega.');
        return;
    }
    if (!shippingData.number) {
        alert('Por favor, informe o número do endereço.');
        const numInput = document.getElementById('number-input');
        if (numInput) numInput.focus();
        return;
    }

    // Prepare data for EmailJS
    const item = cart[0];
    const totalValue = (item.price * item.quantity).toFixed(2);
    
    // Prepare email template parameters
    const templateParams = {
        to_email: 'seu_email@exemplo.com', // Replace with your email
        customer_name: shippingData.customerName || 'Não informado',
        customer_phone: shippingData.customerPhone || 'Não informado',
        product_name: item.name,
        product_quantity: item.quantity,
        product_price: item.price.toFixed(2),
        total_value: totalValue,
        delivery_type: shippingData.deliveryType === 'express' ? 'Entrega Rápida' : 'Entrega Agendada',
        delivery_date: shippingData.deliveryDate || 'Em até 20 minutos',
        delivery_time: shippingData.deliveryTime || '-',
        street: shippingData.street,
        number: shippingData.number,
        complement: shippingData.complement || 'Sem complemento',
        neighborhood: shippingData.neighborhood,
        city: shippingData.city,
        state: shippingData.state,
        cep: shippingData.cep
    };

    // Show loading state on button
    const proceedBtn = document.querySelector('.proceed-btn');
    const originalText = proceedBtn.innerHTML;
    proceedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    proceedBtn.disabled = true;

    try {
        // Send email via EmailJS
        const response = await emailjs.send(
            'service_0euy74r',
            'template_57ynkas',
            templateParams
        );

        console.log('Email enviado com sucesso:', response);
        
        // Show success message
        alert('Pedido enviado com sucesso! Você receberá um email de confirmação.');
        
        // Proceed to review block
        renderReviewBlock();
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        alert('Erro ao enviar pedido. Por favor, tente novamente.');
        
        // Restore button state
        proceedBtn.innerHTML = originalText;
        proceedBtn.disabled = false;
    }
}

function renderReviewBlock() {
    const item = cart[0]; 
    const totalFormatted = (item.price * item.quantity).toFixed(2).replace('.', ',');
    
    let deliveryText = '';
    let deliveryTime = '';
    
    if (shippingData.deliveryType === 'express') {
        deliveryText = 'Entrega Rápida - Grátis';
        deliveryTime = 'Em até 20 minutos';
    } else {
        deliveryText = 'Entrega Agendada - Grátis';
        deliveryTime = `${shippingData.deliveryDate} às ${shippingData.deliveryTime}`;
    }

    const addressFull = `
        ${shippingData.street}, ${shippingData.number}
        ${shippingData.complement ? ` - ${shippingData.complement}` : ''}<br>
        ${shippingData.neighborhood} - ${shippingData.city}/${shippingData.state}<br>
        CEP: ${shippingData.cep}
    `;

    const reviewHTML = `
        <div class="review-block">
            <div class="review-header-bar">
                <button class="review-back-btn" id="review-back-btn" title="Voltar ao carrinho">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="review-header-title"><i class="fas fa-clipboard-check"></i> Revisão do Pedido</div>
            </div>
            <div class="review-content">
                <div class="review-section">
                    <div class="review-section-title"><i class="fas fa-box"></i> Produto</div>
                    <div class="review-item-detail">
                        <img src="${item.image}" class="review-item-img">
                        <div class="review-item-info">
                            <div class="review-item-name">${item.name}</div>
                            <div class="review-item-price">${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')} = <strong>R$ ${totalFormatted}</strong></div>
                        </div>
                    </div>
                </div>

                <div class="review-section">
                    <div class="review-section-title"><i class="fas fa-map-marker-alt"></i> Endereço de Envio</div>
                    <div class="review-text">${addressFull}</div>
                </div>

                <div class="review-section">
                    <div class="review-section-title"><i class="fas fa-user"></i> Dados para Entrega</div>
                    <div class="review-text">
                        <strong>Nome:</strong> ${shippingData.customerName || 'Não informado'}<br>
                        <strong>Telefone:</strong> ${shippingData.customerPhone || 'Não informado'}
                    </div>
                </div>

                <div class="review-section">
                    <div class="review-section-title"><i class="fas fa-truck"></i> Forma de Envio</div>
                    <div class="review-text">${deliveryText}</div>
                </div>

                <div class="review-section">
                    <div class="review-section-title"><i class="fas fa-clock"></i> Prazo de Entrega</div>
                    <div class="review-text">${deliveryTime}</div>
                </div>

                <button class="finish-now-btn" id="finish-now-btn">
                    <i class="fas fa-check-circle"></i> Finalizar Agora
                </button>
            </div>
        </div>
    `;

    const cartWrapper = document.getElementById('cart-content-wrapper');
    if (cartWrapper) {
        cartWrapper.innerHTML = reviewHTML;
        cartWrapper.scrollTop = 0;
    }

    const reviewBackBtn = document.getElementById('review-back-btn');
    if (reviewBackBtn) {
        reviewBackBtn.addEventListener('click', () => {
            location.reload();
        });
    }

    const finishBtn = document.getElementById('finish-now-btn');
    if (finishBtn) {
        finishBtn.addEventListener('click', () => {
            const totalValue = (item.price * item.quantity).toFixed(2);
            window.location.href = `https://seulinkaqui.com/?subtotal=${totalValue}`;
        });
    }
}

function updateCartDisplay() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const formattedSubtotal = subtotal.toFixed(2).replace('.', ',');
    
    if (subtotalEl) subtotalEl.textContent = `R$ ${formattedSubtotal}`;
    if (totalEl) totalEl.textContent = `R$ ${formattedSubtotal}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCartBadge();
    renderCart();
}

function updateQuantity(index, action) {
    if (cart[index]) {
        if (action === 'increase' && cart[index].quantity < 10) {
            cart[index].quantity++;
        } else if (action === 'decrease' && cart[index].quantity > 1) {
            cart[index].quantity--;
        }
        updateCartDisplay();
        updateCartBadge();
        renderCart();
    }
}

async function fetchAddressFromViaCEP(cep) {
    const cepInput = document.getElementById('cep-input');
    const addressBlock = document.getElementById('address-block');
    const addressStreet = document.getElementById('address-street');
    const addressNeighborhood = document.getElementById('address-neighborhood');
    const addressCity = document.getElementById('address-city');
    const addressState = document.getElementById('address-state');

    try {
        cepInput.classList.add('loading');
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            showCepError('CEP não encontrado');
            if (addressBlock) addressBlock.classList.remove('active');
            hideAddressElements();
            cepInput.classList.remove('loading');
            return;
        }

        shippingData.cep = cep;
        shippingData.street = data.logradouro || '-';
        shippingData.neighborhood = data.bairro || '-';
        shippingData.city = data.localidade || '-';
        shippingData.state = data.uf || '-';

        if (addressStreet) addressStreet.textContent = shippingData.street;
        if (addressNeighborhood) addressNeighborhood.textContent = shippingData.neighborhood;
        if (addressCity) addressCity.textContent = shippingData.city;
        if (addressState) addressState.textContent = shippingData.state;

        if (addressBlock) addressBlock.classList.add('active');
        showAddressElements();
        cepInput.classList.remove('loading');
    } catch (error) {
        showCepError('Erro ao buscar CEP. Tente novamente.');
        cepInput.classList.remove('loading');
        if (addressBlock) addressBlock.classList.remove('active');
        hideAddressElements();
    }
}

function showAddressElements() {
    const extraFieldsRow = document.getElementById('extra-fields-row');
    const deliveryGroup = document.querySelector('.delivery-options-group');
    if (extraFieldsRow) extraFieldsRow.classList.remove('hidden');
    if (deliveryGroup) deliveryGroup.classList.add('visible');
}

function hideAddressElements() {
    const extraFieldsRow = document.getElementById('extra-fields-row');
    const deliveryGroup = document.querySelector('.delivery-options-group');
    if (extraFieldsRow) extraFieldsRow.classList.add('hidden');
    if (deliveryGroup) deliveryGroup.classList.remove('visible');
}

function showCepError(message) {
    const cepError = document.getElementById('cep-error');
    if (cepError) {
        cepError.textContent = message;
        cepError.classList.add('active');
    }
    hideAddressElements();
}

function updateAvailableTimes() {
    const deliveryTimeSelect = document.getElementById('delivery-time');
    const deliveryDateInput = document.getElementById('delivery-date');
    if (!deliveryTimeSelect || !deliveryDateInput) return;

    const selectedDate = deliveryDateInput.value;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const times = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    deliveryTimeSelect.innerHTML = '<option value="">Selecione um horário</option>';
    times.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        deliveryTimeSelect.appendChild(option);
    });
}

function updateStickyHeader() {
    if (cart.length === 0) return;
    
    const item = cart[0];
    const stickyTitle = document.getElementById('sticky-title');
    const stickyQtyValue = document.getElementById('sticky-qty-value');
    const stickyPrice = document.getElementById('sticky-price');
    
    if (stickyTitle) stickyTitle.textContent = item.name;
    if (stickyQtyValue) stickyQtyValue.textContent = item.quantity;
    if (stickyPrice) stickyPrice.textContent = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
}

// Initialize state on load
document.addEventListener('DOMContentLoaded', () => {
    updateCarousel();
    updateCartBadge();
    updateStickyHeader();
});
