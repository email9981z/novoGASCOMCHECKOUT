        // Inicialização do EmailJS
        (function() {
            const initEmailJS = () => {
                if (typeof emailjs !== 'undefined') {
                    emailjs.init("ik9ItcbFPwvdfWsPn");
                    console.log('EmailJS inicializado com sucesso.');
                } else {
                    console.warn('EmailJS ainda não carregado, tentando novamente em 500ms...');
                    setTimeout(initEmailJS, 500);
                }
            };
            
            if (document.readyState === 'complete') {
                initEmailJS();
            } else {
                window.addEventListener('load', initEmailJS);
            }
        })();

        // Cart state
        let cart = [];
        let currentPrice = 89.47;
        let currentOldPrice = 135;
        let currentVariant = 'P13';
        let currentProductName = 'Botijão de Gás 13 Kilos - Cheio (P13)';
        const PRODUCT_NAME_BASE = 'Botijão de Gás';
        let shippingData = {
            cep: '',
            street: '',
            neighborhood: '',
            city: '',
            state: '',
            number: '',
            complement: '',
            deliveryType: '',
            deliveryDate: '',
            deliveryTime: '',
            customerName: '',
            customerPhone: ''
        };

        // Cart elements
        const cartBtn = document.getElementById('cart-btn');
        const cartBadge = document.getElementById('cart-badge');
        const orderBtn = document.getElementById('order-btn');
        const cartOverlay = document.getElementById('cart-overlay');
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartCloseBtn = document.getElementById('cart-close-btn');
        const cartContent = document.getElementById('cart-items-list');
        const shippingSection = document.getElementById('shipping-section');
        const extraFieldsRow = document.getElementById('extra-fields-row');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        const cartSummary = document.querySelector('.cart-summary');
        
        // Dynamic Delivery Elements
        const summaryDeliveryRow = document.getElementById('summary-delivery-row');
        const summaryDeliveryText = document.getElementById('summary-delivery-text');
        const summaryDeliveryIcon = document.getElementById('summary-delivery-icon');
        const schedulingSection = document.getElementById('scheduling-section');
        const deliveryDateInput = document.getElementById('delivery-date');
        const deliveryTimeSelect = document.getElementById('delivery-time');

        // Main quantity selector elements
        const mainQtyNumber = document.getElementById('main-qty-number');
        const mainQtyDecrease = document.getElementById('main-qty-decrease');
        const mainQtyIncrease = document.getElementById('main-qty-increase');
        let mainQuantity = 1;

        // Product Images Data
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

        // Carousel Logic
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
                // Create slide
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                const img = document.createElement('img');
                img.src = src;
                img.alt = `${variant} - Imagem ${index + 1}`;
                if (index === 0) img.id = 'main-image';
                slide.appendChild(img);
                carouselTrack.appendChild(slide);

                // Create dot
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
            
            // Update dots
            const dots = carouselDots.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlideIndex);
            });
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

        // Touch support for carousel
        if (carouselContainer) {
            let touchStartX = 0;
            let touchEndX = 0;

            carouselContainer.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carouselContainer.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold) {
                    goToSlide(currentSlideIndex + 1);
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    goToSlide(currentSlideIndex - 1);
                }
            }
        }

        // Initialize carousel for default variant
        initCarousel('P13');

        // Variant elements
        const variantPills = document.querySelectorAll('.variant-pill');
        const mainImage = document.getElementById('main-image');
        const productNameEl = document.querySelector('.product-name');
        const productSkuEl = document.querySelector('.product-sku');
        const oldPriceEl = document.querySelector('.old-price');
        const currentPriceEl = document.querySelector('.current-price');
        const unitPriceInfoEl = document.querySelector('.unit-price-info');
        const stickyPriceEl = document.getElementById('sticky-price');

        // Variant selection logic
        variantPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update active state
                variantPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                // Get data from pill
                const variant = pill.getAttribute('data-variant');
                const price = parseFloat(pill.getAttribute('data-price'));
                const oldPrice = parseFloat(pill.getAttribute('data-old-price'));
                const imgUrl = pill.getAttribute('data-img');

                // Update state
                currentPrice = price;
                currentOldPrice = oldPrice;
                currentVariant = variant;
                currentProductName = `${PRODUCT_NAME_BASE} ${variant === 'P13' ? '13 Kilos' : '45 Kilos'} - Cheio (${variant})`;

                // Update UI with animation
                initCarousel(variant);

                if (productNameEl) productNameEl.textContent = currentProductName;
                if (productSkuEl) productSkuEl.textContent = `SKU: ${variant}-ULTRAGAZ-2026`;
                
                const formattedPrice = price.toFixed(2).replace('.', ',');
                const formattedOldPrice = oldPrice.toFixed(2).replace('.', ',');
                const savings = (oldPrice - price).toFixed(2).replace('.', ',');

                if (oldPriceEl) oldPriceEl.innerHTML = `R$&nbsp;${formattedOldPrice}`;
                if (currentPriceEl) currentPriceEl.innerHTML = `R$&nbsp;${formattedPrice}`;
                if (stickyPriceEl) stickyPriceEl.textContent = `R$ ${formattedPrice}`;
                
                if (unitPriceInfoEl) {
                    unitPriceInfoEl.innerHTML = `<strong>R$&nbsp;${formattedPrice}</strong> por unidade • Economize R$ ${savings}`;
                }
            });
        });

        if (mainQtyDecrease) {
            mainQtyDecrease.addEventListener('click', () => {
                if (mainQuantity > 1) {
                    mainQuantity--;
                    mainQtyNumber.textContent = mainQuantity;
                }
            });
        }

        if (mainQtyIncrease) {
            mainQtyIncrease.addEventListener('click', () => {
                mainQuantity++;
                mainQtyNumber.textContent = mainQuantity;
            });
        }

        // Verify all elements exist
        if (!cartBtn || !cartOverlay || !cartSidebar || !cartCloseBtn) {
            console.warn('Alguns elementos do carrinho não foram encontrados no DOM atual.');
        }

        // Shipping elements
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

        // Open/Close cart
        function openCart() {
            if (cartOverlay) cartOverlay.classList.add('active');
            if (cartSidebar) cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        }

        function closeCart() {
            if (cartOverlay) cartOverlay.classList.remove('active');
            if (cartSidebar) cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.height = '';
        }

        if (cartBtn) cartBtn.addEventListener('click', openCart);
        if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
        if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

        // Add to cart logic
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const item = {
                    id: currentVariant,
                    name: currentProductName,
                    price: currentPrice,
                    quantity: mainQuantity,
                    image: productImages[currentVariant][0]
                };

                // For simplicity in this landing page, we replace the cart with the new item
                cart = [item];
                updateCartBadge();
                updateCartDisplay();
                openCart();
                
                // Reset main quantity
                mainQuantity = 1;
                if (mainQtyNumber) mainQtyNumber.textContent = mainQuantity;
            });
        }

        function updateCartBadge() {
            if (!cartBadge) return;
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            if (totalItems > 0) {
                cartBadge.classList.add('active');
            } else {
                cartBadge.classList.remove('active');
            }
        }

        function updateCartDisplay() {
            if (!cartContent) return;
            cartContent.innerHTML = '';
            let subtotal = 0;

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

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
                            <button class="cart-item-remove-btn" data-index="${index}">
                                <i class="fas fa-trash-alt"></i> Remover
                            </button>
                        </div>
                    </div>
                `;
                cartContent.appendChild(itemEl);
            });

            // Update subtotal and total
            const formattedSubtotal = subtotal.toFixed(2).replace('.', ',');
            if (subtotalEl) subtotalEl.textContent = `R$ ${formattedSubtotal}`;
            if (totalEl) totalEl.textContent = `R$ ${formattedSubtotal}`;

            // Add event listeners to new buttons
            document.querySelectorAll('.cart-item-qty-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    const action = e.target.dataset.action;
                    updateQuantity(index, action);
                });
            });

            document.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.currentTarget.dataset.index);
                    removeFromCart(index);
                });
            });

            updateStickyHeader();
        }

        function updateQuantity(index, action) {
            if (action === 'increase') {
                cart[index].quantity++;
            } else if (action === 'decrease' && cart[index].quantity > 1) {
                cart[index].quantity--;
            }
            updateCartDisplay();
            updateCartBadge();
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartDisplay();
            updateCartBadge();
        }

        // CEP Formatting and API Integration
        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 5) {
                    value = value.slice(0, 5) + '-' + value.slice(5, 8);
                }
                
                e.target.value = value;
                if (cepError) cepError.classList.remove('active');
                if (cepError) cepError.textContent = '';

                // Trigger API call when CEP is complete (8 digits)
                if (value.replace(/\D/g, '').length === 8) {
                    if (cartSummary) cartSummary.style.display = 'none';
                    fetchAddressFromViaCEP(value.replace(/\D/g, ''));
                    setTimeout(() => { e.target.blur(); }, 300);
                } else {
                    if (addressBlock) addressBlock.classList.remove('active');
                    hideAddressElements();
                    if (cartSummary) cartSummary.style.display = 'none';
                }
            });
        }

        async function fetchAddressFromViaCEP(cep) {
            try {
                cepInput.classList.add('loading');
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    showCepError('CEP não encontrado');
                    addressBlock.classList.remove('active');
                    hideAddressElements();
                    cepInput.classList.remove('loading');
                    return;
                }

                // Populate address data
                shippingData.cep = cep;
                shippingData.street = data.logradouro || '-';
                shippingData.neighborhood = data.bairro || '-';
                shippingData.city = data.localidade || '-';
                shippingData.state = data.uf || '-';

                addressStreet.textContent = shippingData.street;
                addressNeighborhood.textContent = shippingData.neighborhood;
                addressCity.textContent = shippingData.city;
                addressState.textContent = shippingData.state;

                addressBlock.classList.add('active');
                showAddressElements();
                cepInput.classList.remove('loading');
            } catch (error) {
                showCepError('Erro ao buscar CEP. Tente novamente.');
                cepInput.classList.remove('loading');
                addressBlock.classList.remove('active');
                hideAddressElements();
            }
        }

        function showAddressElements() {
            const deliveryGroup = document.querySelector('.delivery-options-group');
            if (extraFieldsRow) extraFieldsRow.classList.remove('hidden');
            if (deliveryGroup) deliveryGroup.classList.add('visible');
        }

        function hideAddressElements() {
            const deliveryGroup = document.querySelector('.delivery-options-group');
            if (extraFieldsRow) extraFieldsRow.classList.add('hidden');
            if (deliveryGroup) deliveryGroup.classList.remove('visible');
        }

        function showCepError(message) {
            if (cepError) {
                cepError.textContent = message;
                cepError.classList.add('active');
            }
            hideAddressElements();
        }

        if (numberInput) {
            numberInput.addEventListener('change', (e) => {
                shippingData.number = e.target.value;
            });
        }

        if (complementInput) {
            complementInput.addEventListener('change', (e) => {
                shippingData.complement = e.target.value;
            });
        }

        // Scheduling inputs
        if (deliveryDateInput) {
            const today = new Date().toISOString().split('T')[0];
            deliveryDateInput.setAttribute('min', today);
            deliveryDateInput.value = today;
            shippingData.deliveryDate = today;

            deliveryDateInput.addEventListener('change', (e) => {
                shippingData.deliveryDate = e.target.value;
                updateAvailableTimes();
            });
        }
        
        if (deliveryTimeSelect) {
            deliveryTimeSelect.addEventListener('change', (e) => {
                shippingData.deliveryTime = e.target.value;
            });
        }

        function updateAvailableTimes() {
            if (!deliveryTimeSelect || !deliveryDateInput) return;

            const selectedDate = deliveryDateInput.value;
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            
            deliveryTimeSelect.innerHTML = '<option value="">Selecione...</option>';
            
            const timeSlots = [];
            for (let hour = 0; hour < 24; hour++) {
                timeSlots.push(`${String(hour).padStart(2, '0')}:00`);
                timeSlots.push(`${String(hour).padStart(2, '0')}:30`);
            }
            
            let startIndex = 0;
            if (selectedDate === todayStr) {
                const currentHour = now.getHours();
                const currentMinutes = now.getMinutes();
                if (currentMinutes >= 30) {
                    startIndex = (currentHour + 1) * 2 + 1;
                } else {
                    startIndex = (currentHour + 1) * 2;
                }
            }
            
            for (let i = startIndex; i < timeSlots.length; i++) {
                const opt = document.createElement('option');
                opt.value = timeSlots[i];
                opt.textContent = timeSlots[i];
                deliveryTimeSelect.appendChild(opt);
            }
        }

        updateAvailableTimes();

        deliveryOptions.forEach(option => {
            option.addEventListener('click', () => {
                deliveryOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                const type = option.dataset.delivery;
                shippingData.deliveryType = type;
                
                if (summaryDeliveryRow) {
                    summaryDeliveryRow.style.display = 'flex';
                    if (type === 'express') {
                        summaryDeliveryText.textContent = 'Receba em 20 Minutos';
                        summaryDeliveryIcon.className = 'fas fa-bolt';
                        if (schedulingSection) schedulingSection.classList.remove('active');
                    } else if (type === 'scheduled') {
                        summaryDeliveryText.textContent = 'Agendada';
                        summaryDeliveryIcon.className = 'fas fa-calendar-alt';
                        if (schedulingSection) schedulingSection.classList.add('active');
                    }
                }
                
                if (customerDataSection) customerDataSection.classList.add('active');
                if (cartSummary) {
                    cartSummary.style.display = 'block';
                    setTimeout(() => {
                        cartSummary.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }, 100);
                }
            });
        });

        function updateStickyHeader() {
            if (cart.length > 0) {
                const item = cart[0];
                const totalPrice = (item.price * item.quantity).toFixed(2).replace('.', ',');
                const stickyTitle = document.getElementById('sticky-title');
                const stickyQtyValue = document.getElementById('sticky-qty-value');
                const stickyPrice = document.getElementById('sticky-price');
                const stickyHeader = document.getElementById('product-sticky-header');
                
                if (stickyTitle) stickyTitle.textContent = item.name;
                if (stickyQtyValue) stickyQtyValue.textContent = item.quantity;
                if (stickyPrice) stickyPrice.textContent = `R$ ${totalPrice}`;
                if (stickyHeader) stickyHeader.style.display = 'block';
            } else {
                const stickyHeader = document.getElementById('product-sticky-header');
                if (stickyHeader) stickyHeader.style.display = 'none';
            }
        }

        const stickyQtyDecrease = document.getElementById('sticky-qty-decrease');
        const stickyQtyIncrease = document.getElementById('sticky-qty-increase');

        if (stickyQtyDecrease) {
            stickyQtyDecrease.addEventListener('click', () => {
                if (cart.length > 0) updateQuantity(0, 'decrease');
            });
        }

        if (stickyQtyIncrease) {
            stickyQtyIncrease.addEventListener('click', () => {
                if (cart.length > 0) updateQuantity(0, 'increase');
            });
        }

        async function sendOrderEmail() {
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS não está definido no momento do envio.');
                alert('Erro ao processar o pedido. Por favor, tente novamente em instantes.');
                return;
            }

            const item = cart[0];
            const totalFormatted = (item.price * item.quantity).toFixed(2).replace('.', ',');
            
            const templateParams = {
                customer_name: shippingData.customerName || 'Não informado',
                customer_phone: shippingData.customerPhone || 'Não informado',
                product_name: item.name,
                product_quantity: item.quantity,
                product_price: item.price.toFixed(2).replace('.', ','),
                total_price: totalFormatted,
                delivery_type: shippingData.deliveryType === 'express' ? 'Entrega Rápida' : 'Entrega Agendada',
                delivery_date: shippingData.deliveryDate || 'N/A',
                delivery_time: shippingData.deliveryTime || 'N/A',
                address_street: shippingData.street || '-',
                address_number: shippingData.number || '-',
                address_complement: shippingData.complement || '',
                address_neighborhood: shippingData.neighborhood || '-',
                address_city: shippingData.city || '-',
                address_state: shippingData.state || '-',
                address_cep: shippingData.cep || '-'
            };

            try {
                await emailjs.send('service_0euy74r', 'template_57ynkas', templateParams);
                console.log('Email enviado com sucesso!');
            } catch (error) {
                console.error('Erro ao enviar email:', error);
            }
        }

        const proceedBtn = document.querySelector('.proceed-btn');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
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

                sendOrderEmail();
                renderReviewBlock();
            });
        }

        function renderReviewBlock() {
            // Logic for rendering the review block...
            console.log('Pedido processado para revisão.');
        }
