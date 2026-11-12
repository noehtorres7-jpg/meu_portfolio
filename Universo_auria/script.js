// Universo Auria - Acessórios Femininos
// JavaScript funcionalidades

document.addEventListener('DOMContentLoaded', function() {
    // Carrinho de compras
    const cart = {
        items: [],
        total: 0
    };

    // Elementos do DOM
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.querySelector('.cart-count');
    const cartTotalElement = document.getElementById('cartTotal');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartBtn = document.querySelector('.cart-btn');
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const newsletterForm = document.getElementById('newsletterForm');
    const contactForm = document.getElementById('contactForm');

    // Abrir/Fechar carrinho
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });

    closeCartBtn.addEventListener('click', function() {
        closeCart();
    });

    cartOverlay.addEventListener('click', function() {
        closeCart();
    });

    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Menu mobile
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Adicionar ao carrinho
    addToCartBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const productCard = btn.closest('.product-card');
            const product = {
                id: Date.now(),
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.')),
                image: productCard.querySelector('img').src,
                quantity: 1
            };

            addToCart(product);
            showNotification('Produto adicionado ao carrinho!');
        });
    });

    function addToCart(product) {
        // Verificar se o produto já está no carrinho
        const existingItem = cart.items.find(function(item) {
            return item.name === product.name;
        });

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push(product);
        }

        updateCart();
    }

    function removeFromCart(productId) {
        cart.items = cart.items.filter(function(item) {
            return item.id !== productId;
        });

        updateCart();
    }

    function updateQuantity(productId, change) {
        const item = cart.items.find(function(item) {
            return item.id === productId;
        });

        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCart();
            }
        }
    }

    function updateCart() {
        // Atualizar contador
        const totalItems = cart.items.reduce(function(sum, item) {
            return sum + item.quantity;
        }, 0);

        cartCountElement.textContent = totalItems;

        // Renderizar itens
        renderCartItems();

        // Atualizar total
        cart.total = cart.items.reduce(function(sum, item) {
            return sum + (item.price * item.quantity);
        }, 0);

        cartTotalElement.textContent = 'R$ ' + cart.total.toFixed(2).replace('.', ',');
    }

    function renderCartItems() {
        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Seu carrinho está vazio</p>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = cart.items.map(function(item) {
            return `
                <div class="cart-item" data-id="' + item.id + '">
                    <img src="' + item.image + '" alt="' + item.name + '">
                    <div class="cart-item-info">
                        <h4>' + item.name + '</h4>
                        <p>R$ ' + item.price.toFixed(2).replace('.', ',') + '</p>
                        <div class="quantity-controls" style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                            <button class="qty-btn" onclick="updateQuantity(' + item.id + ', -1)" style="width: 25px; height: 25px; border: 1px solid #ddd; background: white; cursor: pointer;">-</button>
                            <span>' + item.quantity + '</span>
                            <button class="qty-btn" onclick="updateQuantity(' + item.id + ', 1)" style="width: 25px; height: 25px; border: 1px solid #ddd; background: white; cursor: pointer;">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(' + item.id + ')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    // Funções globais para onclick no HTML
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;

    // Atualizar carrinho inicial
    updateCart();

    // Formulário de newsletter
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;

        if (validateEmail(email)) {
            showNotification('Obrigado! Você se cadastrou com sucesso e ganhou 10% de desconto!');
            newsletterForm.reset();
        } else {
            showNotification('Por favor, digite um e-mail válido.', 'error');
        }
    });

    // Formulário de contato
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;

        if (validateEmail(email) && name.trim() !== '') {
            showNotification('Mensagem enviada com sucesso! Em breve entraremos em contato.');
            contactForm.reset();
        } else {
            showNotification('Por favor, preencha todos os campos corretamente.', 'error');
        }
    });

    // Validação de email
    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Notificações
    function showNotification(message, type) {
        type = type || 'success';

        // Remover notificação anterior
        var existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Criar nova notificação
        var notification = document.createElement('div');
        notification.className = 'notification ' + type;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            background-color: ' + (type === 'success' ? '#4caf50' : '#f44336') + ';
            color: white;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        // Adicionar animação
        var style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        notification.textContent = message;
        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(function() {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                var target = document.querySelector(targetId);
                if (target) {
                    var headerOffset = 100;
                    var elementPosition = target.getBoundingClientRect().top;
                    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Fechar menu mobile se estiver aberto
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Header fixo com transição ao rolar
    var header = document.querySelector('.header');
    var lastScroll = 0;

    window.addEventListener('scroll', function() {
        var currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Animações ao scroll
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animação aos elementos
    var animatedElements = document.querySelectorAll('.category-card, .product-card, .collection-card, .contact-item');
    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Botão de wishlist (favoritos)
    var wishlistBtns = document.querySelectorAll('.add-to-wishlist');
    wishlistBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var icon = btn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#e74c3c';
                showNotification('Produto adicionado aos favoritos!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                showNotification('Produto removido dos favoritos.');
            }
        });
    });

    // EFEITO DE DIGITAÇÃO NO HERO
    var heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        var text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'none';

        var i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        // Iniciar efeito de digitação após 0.5 segundos
        setTimeout(typeWriter, 500);
    }

    // Máscara para telefone (exemplo básico)
    var phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(function(input) {
        input.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = '(' + value;
                } else if (value.length <= 6) {
                    value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
                } else if (value.length <= 10) {
                    value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6);
                } else {
                    value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
                }
            }
            e.target.value = value;
        });
    });

    console.log('Universo Auria - Site carregado com sucesso!');
});
