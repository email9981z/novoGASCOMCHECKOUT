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

        carouselPrev.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
        carouselNext.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

        // Touch support for carousel
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
            console.error('Erro: Elementos do carrinho não encontrados no DOM');
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
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
        }

        // Add event listeners with null checks
        if (cartBtn) {
            cartBtn.addEventListener('click', openCart);
        }
        if (cartCloseBtn) {
            cartCloseBtn.addEventListener('click', closeCart);
        }
        if (cartOverlay) {
            cartOverlay.addEventListener('click', closeCart);
        }

        // Add to cart
        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                const existingItem = cart.find(item => item.name === currentProductName && item.variant === currentVariant);

                if (existingItem) {
                    existingItem.quantity += mainQuantity;
                } else {
                    cart.push({
                        name: currentProductName,
                        variant: currentVariant,
                        price: currentPrice,
                        quantity: mainQuantity,
                        image: document.getElementById('main-image').src
                    });
                }

                // Reset main quantity selector after adding to cart
                mainQuantity = 1;
                if (mainQtyNumber) mainQtyNumber.textContent = mainQuantity;

                updateCartDisplay();
                updateCartBadge();
                
                const originalText = orderBtn.innerHTML;
                orderBtn.innerHTML = '<i class="fas fa-check"></i> Adicionado ao Carrinho!';
                orderBtn.style.background = 'linear-gradient(135deg, var(--success) 0%, #218838 100%)';
                
                setTimeout(() => {
                    orderBtn.innerHTML = originalText;
                    orderBtn.style.background = '';
                }, 2000);

                openCart();
            });
        }

        function updateCartBadge() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (cartBadge) cartBadge.textContent = totalItems;
            if (totalItems > 0 && cartBadge) {
                cartBadge.classList.add('active');
            }
            // Update sticky header when quantity changes
            updateStickyHeader();
        }

        function updateCartDisplay() {
            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Seu carrinho está vazio</p>
                    </div>
                `;
                shippingSection.style.display = 'none';
                if (cartSummary) cartSummary.style.display = 'none';
                subtotalEl.textContent = 'R$ 0,00';
                totalEl.textContent = 'R$ 0,00';
                return;
            }
            
            shippingSection.style.display = 'block';
            // Initially hide summary until shipping is selected
            if (!shippingData.deliveryType && cartSummary) {
                cartSummary.style.display = 'none';
            } else if (shippingData.deliveryType && cartSummary) {
                cartSummary.style.display = 'block';
            }

            let itemsHTML = '';
            let subtotal = 0;

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                const formattedUnitPrice = item.price.toFixed(2).replace('.', ',');
                const formattedItemTotal = itemTotal.toFixed(2).replace('.', ',');
                itemsHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <div class="cart-item-title" title="${item.name}">${item.name}</div>
                            <div class="cart-item-price">R$ ${formattedUnitPrice} x ${item.quantity} = <strong>R$ ${formattedItemTotal}</strong></div>
                            <div class="quantity-selector">
                                <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
                            </div>
                            <button class="cart-item-remove-btn" data-index="${index}">Remover</button>
                        </div>
                    </div>
                `;
            });

            cartContent.innerHTML = itemsHTML;
            document.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.currentTarget.dataset.index);
                    removeFromCart(index);
                });
            });

            document.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.currentTarget.dataset.index);
                    const action = e.currentTarget.dataset.action;
                    updateQuantity(index, action);
                });
            });

            const formattedSubtotal = subtotal.toFixed(2).replace('.', ',');
            if (subtotalEl) subtotalEl.textContent = `R$ ${formattedSubtotal}`;
            if (totalEl) totalEl.textContent = `R$ ${formattedSubtotal}`;
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartDisplay();
            updateCartBadge();
        }

        function addQuantityToCart(index) {
            if (cart[index]) {
                cart[index].quantity++;
                updateCartDisplay();
                updateCartBadge();
            }
        }

        function removeQuantityFromCart(index) {
            if (cart[index] && cart[index].quantity > 1) {
                cart[index].quantity--;
                updateCartDisplay();
                updateCartBadge();
            }
        }

        function updateQuantity(index, action) {
            if (action === 'increase') {
                addQuantityToCart(index);
            } else if (action === 'decrease') {
                removeQuantityFromCart(index);
            }
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
                    // Hide summary bar when searching for CEP
                    if (cartSummary) cartSummary.style.display = 'none';
                    fetchAddressFromViaCEP(value.replace(/\D/g, ''));
                    // Blur the input to hide the keyboard
                    setTimeout(() => {
                        e.target.blur();
                    }, 300);
                } else {
                    if (addressBlock) addressBlock.classList.remove('active');
                    hideAddressElements();
                    // Keep summary hidden if CEP is incomplete
                    if (cartSummary) cartSummary.style.display = 'none';
                }
            });
        }

        // Fetch address from ViaCEP API
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

        // Show address elements after successful CEP search
        function showAddressElements() {
            const deliveryGroup = document.querySelector('.delivery-options-group');

            if (extraFieldsRow) extraFieldsRow.classList.remove('hidden');
            if (deliveryGroup) deliveryGroup.classList.add('visible');
        }

        // Hide address elements when CEP is incomplete or invalid
        function hideAddressElements() {
            const deliveryGroup = document.querySelector('.delivery-options-group');

            if (extraFieldsRow) extraFieldsRow.classList.add('hidden');
            if (deliveryGroup) deliveryGroup.classList.remove('visible');
        }

        function showCepError(message) {
            cepError.textContent = message;
            cepError.classList.add('active');
            hideAddressElements();
        }

        // Number and complement inputs
        numberInput.addEventListener('change', (e) => {
            shippingData.number = e.target.value;
        });

        complementInput.addEventListener('change', (e) => {
            shippingData.complement = e.target.value;
        });

        // Scheduling inputs
        if (deliveryDateInput) {
            // Set minimum date to today
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
            
            // Clear current options except the first one
            deliveryTimeSelect.innerHTML = '<option value="">Selecione...</option>';
            
            // Generate time slots: horas exatas e meias horas (00, 30)
            const timeSlots = [];
            for (let hour = 0; hour < 24; hour++) {
                timeSlots.push(`${String(hour).padStart(2, '0')}:00`);
                timeSlots.push(`${String(hour).padStart(2, '0')}:30`);
            }
            
            // Determine the starting point for available times
            let startIndex = 0;
            
            if (selectedDate === todayStr) {
                // If today, start from the next available slot based on current time
                const currentHour = now.getHours();
                const currentMinutes = now.getMinutes();
                
                // If current time is past the half hour (e.g., 07:36)
                if (currentMinutes >= 30) {
                    // Start from next hour's half (e.g., 08:30)
                    // Index calculation: (nextHour * 2) + 1 (the +1 gets the :30 slot)
                    startIndex = (currentHour + 1) * 2 + 1;
                } else {
                    // If current time is before half hour (e.g., 07:26)
                    // Start from next full hour (e.g., 08:00)
                    startIndex = (currentHour + 1) * 2;
                }
            }
            
            // Add available time slots
            for (let i = startIndex; i < timeSlots.length; i++) {
                const timeStr = timeSlots[i];
                addOption(timeStr);
            }

            function addOption(val) {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = val;
                deliveryTimeSelect.appendChild(opt);
            }
        }

        // Initial call to populate times for today
        updateAvailableTimes();

        // Delivery option selection - NO pre-selection
        deliveryOptions.forEach(option => {
            option.addEventListener('click', () => {
                deliveryOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                const type = option.dataset.delivery;
                shippingData.deliveryType = type;
                
                // Update dynamic delivery info in summary
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
                
                // Show customer data section
                if (customerDataSection) {
                    customerDataSection.classList.add('active');
                }

                // Show summary bar only after selecting a delivery option
                if (cartSummary) {
                    cartSummary.style.display = 'block';
                    
                    // Scroll to the summary with smooth animation
                    setTimeout(() => {
                        cartSummary.scrollIntoView({
                            behavior: 'smooth',
                            block: 'end'
                        });
                    }, 100);
                }
            });
        });

        // Sticky product header is now always visible at top of cart-content
        // It will stick naturally due to CSS position: sticky

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

        // Sticky header quantity controls
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

        // Finalize Purchase Logic
        
        // Função para enviar os dados via EmailJS
        async function sendOrderEmail() {
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

                // Validate address if needed
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

                sendOrderEmail(); renderReviewBlock();
            });
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
                                <strong>Nome:</strong> ${shippingData.customerName || 'Nao informado'}<br>
                                <strong>Telefone:</strong> ${shippingData.customerPhone || 'Nao informado'}
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
                    // Recarrega a página para restaurar o estado original do carrinho e formulários
                    location.reload();
                });
            }

            // Usar delegação de evento para garantir que o clique funcione mesmo após a troca do HTML
            document.addEventListener('click', function(e) {
                if (e.target && (e.target.id === 'finish-now-btn' || e.target.closest('#finish-now-btn'))) {
                    // Calcula o valor total numérico para a URL
                    const totalValue = (item.price * item.quantity).toFixed(2);
                    // Redireciona para o link com o parâmetro subtotal
                    window.location.href = `https://seulinkaqui.com/?subtotal=${totalValue}`;
                }
            });


            // Function to show error modal
            function showErrorModal() {
                // Create modal HTML
                const modalHTML = `
                    <div class="error-modal active" id="error-modal-overlay">
                        <div class="error-modal-content">
                            <div class="error-modal-icon">
                                <i class="fas fa-exclamation-circle"></i>
                            </div>
                            <div class="error-modal-title">Seleção Inválida</div>
                            <div class="error-modal-message">
                                Selecione no máximo 2 botijões do mesmo modelo
                            </div>
                            <button class="error-modal-btn" id="error-modal-back-btn">
                                <i class="fas fa-redo"></i> Voltar
                            </button>
                        </div>
                    </div>
                `;
                
                // Add modal to body
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // Add event listener to back button
                const backBtn = document.getElementById('error-modal-back-btn');
                if (backBtn) {
                    backBtn.addEventListener('click', () => {
                        // Remove modal
                        const modal = document.getElementById('error-modal-overlay');
                        if (modal) {
                            modal.classList.remove('active');
                            setTimeout(() => {
                                modal.remove();
                            }, 300);
                        }
                        // Reload page to reset
                        setTimeout(() => {
                            location.reload();
                        }, 300);
                    });
                }
            }
        }

        // Phone formatting and keyboard handling
        const phoneInput = document.getElementById('customer-phone');
        const customerNameInput = document.getElementById('customer-name');
        
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                // Remove all non-numeric characters
                let value = e.target.value.replace(/\D/g, '');
                
                // Apply formatting: (XX) XXXXX-XXXX
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
                
                // Store the phone number in shippingData
                shippingData.customerPhone = value;
                
                // Hide keyboard when format is complete (11 digits)
                if (value.replace(/\D/g, '').length === 11) {
                    e.target.blur();
                }
            });
            
            // Store customer name
            phoneInput.addEventListener('blur', function() {
                shippingData.customerPhone = this.value;
            });
        }
        
        if (customerNameInput) {
            customerNameInput.addEventListener('blur', function() {
                shippingData.customerName = this.value;
            });
        }

        // Initialize state
        updateCartDisplay();
        updateCartBadge();
        updateStickyHeader();



        (function() {
            // Inicializa o EmailJS assim que o script for carregado
            if (typeof emailjs !== 'undefined') {
                emailjs.init("ik9ItcbFPwvdfWsPn");
            } else {
                // Caso o script demore a carregar, tenta novamente após o carregamento da janela
                window.addEventListener('load', function() {
                    if (typeof emailjs !== 'undefined') {
                        emailjs.init("ik9ItcbFPwvdfWsPn");
                    }
                });
            }
        })();
