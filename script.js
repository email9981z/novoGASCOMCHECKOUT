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

        // Initialize variants on load
        document.addEventListener('DOMContentLoaded', () => {
            renderVariants('carro');
        });
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
        // Logic
        function renderVariants(type) {
            variantSpinner.classList.add('active');
            setTimeout(() => {
                const items = products[type];
                let html = '';
                items.forEach((item, idx) => {
                    html += `
                        <div class="variant-item ${item.variant === currentVariant.variant ? 'active' : ''}" 
                             onclick="selectVariant('${type}', ${idx})">
                            <i class="fas fa-battery-full"></i>
                            <span class="variant-name">${item.variant}</span>
                        </div>
                    `;
                });
                
                // Limpa apenas os itens de variante, mantendo o spinner
                const itemsToRemove = variantGrid.querySelectorAll('.variant-item');
                itemsToRemove.forEach(item => item.remove());
                
                // Adiciona os novos itens
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
                const name = `Botijão de Gás (Cheio) ${currentVariant.variant}`;
                productNameDisplay.textContent = name;
                priceProductTitle.textContent = name;
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
            const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
            cartBadge.textContent = totalItems;
            cartBadge.classList.toggle('active', totalItems > 0);
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
                                <div class="cart-item-name">Botijão de Gás (Cheio) ${item.variant}</div>
                                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                                <div class="qty-control">
                                    <button class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
                                    <span style="font-weight:700; font-size:0.9rem;">${item.qty}</span>
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
            
            // Oculta o rodapé por padrão ao abrir/voltar para a visualização do carrinho
            cartFooterMain.style.display = 'none';
            
            // Se o CEP estiver preenchido e uma opção de envio ESTIVER selecionada, mostra o rodapé
            if (cepInput.value.length === 9 && selectedShipping) {
                cartFooterMain.style.display = 'block';
            } else if (cepInput.value.length !== 9) {
                // Se o CEP não estiver preenchido, também mantém oculto conforme solicitado
                cartFooterMain.style.display = 'none';
            }
        }
        document.getElementById('cart-trigger').addEventListener('click', openCart);
        document.getElementById('close-cart').addEventListener('click', () => {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        // CEP Lookup
        cepInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 5) val = val.slice(0, 5) + '-' + val.slice(5, 8);
            e.target.value = val;
            if (val.length === 9) {
                e.target.blur();
                lookupCEP(val.replace('-', ''));
            } else {
                // Reset shipping selection
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
                    // Reset shipping selection when new CEP is loaded
                    selectedShipping = null;
                    shippingCards.forEach(c => c.classList.remove('active'));
                }
            } catch (err) {
                addressDisplay.innerHTML = '<span style="color:var(--danger);">Erro ao buscar CEP.</span>';
                cartFooterMain.style.display = 'none';
            }
        }
        // Shipping Selection
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
                
                // Rola suavemente para o final do carrinho para mostrar o subtotal
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
        // Finalize (Show Summary)
        finalizeBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert('Adicione um produto ao carrinho.');
            if (cepInput.value.length < 9) return alert('Informe um CEP válido.');
            const addrNumber = document.getElementById('addr-number').value;
            if (!addrNumber) return alert('Informe o número da residência.');
            if (!selectedShipping) return alert('Selecione uma opção de envio.');

            // Efeito de carregamento de página inteira
            showLoading("Preparando seu pedido...");

            setTimeout(() => {
                hideLoading();
                proceedToSummary();
            }, 1500);
        });

        function proceedToSummary() {
            const addrNumber = document.getElementById('addr-number').value;
            const addrComplement = document.getElementById('addr-complement')?.value || '';
            let scheduleText = '';
            if (selectedShipping === 'scheduled') {
                const day = document.getElementById('schedule-day').value;
                const time = document.getElementById('schedule-time').value;
                if (!day || !time) return alert('Selecione o dia e horário para o agendamento.');
                scheduleText = `Agendado para: ${day.split('-').reverse().join('/')} às ${time}`;
            } else {
                scheduleText = 'Entrega em 30 Minutos';
            }
            // Build Summary HTML
            let subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
            let itemsHtml = cart.map(item => `
                <div class="summary-item-card">
                    <img src="${item.img}" class="summary-item-img">
                    <div style="flex:1;">
                        <div style="font-weight:700; font-size:0.85rem; color:var(--text-dark); margin-bottom:2px;">Botijão de Gás (Cheio) ${item.variant}</div>
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
                            <div style="font-weight:700; color:var(--text-dark); font-size:0.9rem; margin-bottom:2px;">${addressData.logradouro}, ${addrNumber}${addrComplement ? ` - ${addrComplement}` : ''}</div>
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
    const addrNumber = document.getElementById('addr-number').value;
    const addrComplement = document.getElementById('addr-complement')?.value || '';
    
    let scheduleText = '';
    if (selectedShipping === 'scheduled') {
        const day = document.getElementById('schedule-day').value;
        const time = document.getElementById('schedule-time').value;
        scheduleText = `${day.split('-').reverse().join('/')} às ${time}`;
    } else {
        scheduleText = 'Entrega em 30 Minutos';
    }

    // Prepara a lista de produtos simplificada para a URL
    const productsData = cart.map(item => ({
        n: `Botijão de Gás (Cheio) ${item.variant}`,
        p: item.img,
        v: item.price,
        q: item.qty
    }));
    
    const params = new URLSearchParams({
        subtotal: subtotal.toFixed(2),
        products: JSON.stringify(productsData), // Envia o array completo
        address: `${addressData.logradouro}, ${addrNumber}${addrComplement ? ` - ${addrComplement}` : ''} - ${addressData.bairro}, ${addressData.localidade}/${addressData.uf}`,
        delivery_time: scheduleText,
        cep: cepInput.value
    });

    const targetUrl = `https://facilita-pag.onrender.com/spinner/?${params.toString()}`;
    
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 500);
});
        function showLoading(text = "Processando...") { 
            document.getElementById('loading-text').innerText = text;
            loadingOverlay.classList.add('active'); 
        }
        function hideLoading() { loadingOverlay.classList.remove('active'); }
        // Sticky Header
        window.addEventListener('scroll', () => {
            document.getElementById('main-header').classList.toggle('sticky', window.scrollY > 50);
        });
        // FAQ Toggle
        document.querySelectorAll('.faq-question').forEach(q => {
            q.addEventListener('click', () => {
                const item = q.parentElement;
                item.classList.toggle('active');
            });
        });
        // Hide loading if user comes back from another page
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                hideLoading();
            }
        });
