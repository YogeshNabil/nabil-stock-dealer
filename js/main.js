/**
 * Nabil Stock Dealer - Main JavaScript
 * Handles animations, navigation, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Preloader.init();
    Navigation.init();
    ScrollAnimations.init();
    SmoothScroll.init();
    LiveChat.init();
});

/**
 * Preloader Module
 */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Enable scroll after preloader is hidden
                document.body.style.overflow = '';
            }, 500);
        });

        // Prevent scroll while loading
        document.body.style.overflow = 'hidden';
    }
};

/**
 * Navigation Module
 */
const Navigation = {
    lastScrollY: 0,
    scrollThreshold: 100,

    init() {
        this.header = document.getElementById('header');
        this.headerNav = document.getElementById('headerNav');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.dropdowns = document.querySelectorAll('.nav-dropdown');

        if (!this.header) return;

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Mobile dropdown toggle
        this.dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    // Close other dropdowns
                    this.dropdowns.forEach(d => {
                        if (d !== dropdown) d.classList.remove('active');
                    });
                    dropdown.classList.toggle('active');
                }
            });
        });

        // Close menu when clicking a non-dropdown link
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const isDropdownTrigger = link.closest('.nav-dropdown') && link === link.closest('.nav-dropdown').querySelector('.nav-link');
                if (!isDropdownTrigger) {
                    this.closeMenu();
                }
            });
        });

        // Header scroll effect with direction detection
        window.addEventListener('scroll', () => this.handleScroll());

        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
                this.dropdowns.forEach(d => d.classList.remove('active'));
            }
        });
    },

    toggleMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    },

    closeMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.dropdowns.forEach(d => d.classList.remove('active'));
    },

    handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - this.lastScrollY;
        
        // Add scrolled class for visual effects
        if (currentScrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Hide/show nav bar based on scroll direction with threshold
        if (currentScrollY > this.scrollThreshold) {
            // Only trigger if scroll delta is significant (prevents jitter)
            if (scrollDelta > 8) {
                // Scrolling down fast enough - hide nav & side tools, center logo
                this.header.classList.add('nav-hidden');
                document.body.classList.add('scrolled-down');
            } else if (scrollDelta < -5) {
                // Scrolling up - show everything
                this.header.classList.remove('nav-hidden');
                document.body.classList.remove('scrolled-down');
            }
        } else {
            // At top - always show everything
            this.header.classList.remove('nav-hidden');
            document.body.classList.remove('scrolled-down');
        }

        this.lastScrollY = currentScrollY;
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }
};

/**
 * Scroll Animations Module
 */
const ScrollAnimations = {
    init() {
        this.animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (this.animatedElements.length === 0) return;

        this.createObserver();
    },

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for elements in the same section
                    const delay = this.calculateDelay(entry.target);
                    
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    // Optional: unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.animatedElements.forEach(el => observer.observe(el));
    },

    calculateDelay(element) {
        // Get all siblings with the same class in the same parent
        const parent = element.closest('.services-grid, .contact-info, .contact-grid, .section-header');
        
        if (parent) {
            const siblings = parent.querySelectorAll('.animate-on-scroll');
            const index = Array.from(siblings).indexOf(element);
            return index * 100; // 100ms stagger
        }
        
        return 0;
    }
};

/**
 * Smooth Scroll Module
 */
const SmoothScroll = {
    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    },

    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href === '#') return;

        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};

/**
 * Counter Animation (for stats)
 */
const CounterAnimation = {
    init() {
        const counters = document.querySelectorAll('[data-counter]');
        
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
};

/**
 * Form Validation (basic)
 */
const FormValidation = {
    init() {
        const form = document.querySelector('.contact-form');
        
        if (!form) return;

        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    },

    handleSubmit(e, form) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (isValid) {
            // Show success message (in production, this would submit to a server)
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12l5 5 9-9"/>
                </svg>
                Message Sent!
            `;
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                form.reset();
            }, 3000);
        }
    }
};

// Initialize form validation
document.addEventListener('DOMContentLoaded', () => {
    FormValidation.init();
    CounterAnimation.init();
});

/**
 * Parallax Effect (subtle)
 */
const Parallax = {
    init() {
        this.elements = document.querySelectorAll('[data-parallax]');
        
        if (this.elements.length === 0) return;

        window.addEventListener('scroll', () => this.handleScroll());
    },

    handleScroll() {
        const scrollY = window.scrollY;

        this.elements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
        });
    }
};

/**
 * Share Calculator Functions
 */
// Calculator tab switching
document.addEventListener('DOMContentLoaded', () => {
    const calcTabs = document.querySelectorAll('.calc-tab');
    const calcPanels = document.querySelectorAll('.calc-panel');
    
    calcTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.getAttribute('data-tab');
            
            // Update tabs
            calcTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update panels
            calcPanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(targetPanel + 'Panel')?.classList.add('active');
            
            // Clear results
            clearResults();
        });
    });
});

// Broker commission rates based on transaction amount
function getBrokerCommission(amount) {
    if (amount <= 50000) return amount * 0.004;        // 0.40%
    if (amount <= 500000) return amount * 0.0037;      // 0.37%
    if (amount <= 2000000) return amount * 0.0034;     // 0.34%
    if (amount <= 10000000) return amount * 0.003;     // 0.30%
    return amount * 0.0027;                             // 0.27%
}

// Calculate Buy
function calculateBuy() {
    const qty = parseFloat(document.getElementById('buyQty').value);
    const price = parseFloat(document.getElementById('buyPrice').value);
    
    if (!qty || !price || qty <= 0 || price <= 0) {
        alert('Please enter valid quantity and price');
        return;
    }
    
    const amount = qty * price;
    const brokerComm = getBrokerCommission(amount);
    const sebonFee = amount * 0.00015;  // 0.015%
    const dpCharge = 25;                 // Fixed DP charge
    const totalCost = amount + brokerComm + sebonFee + dpCharge;
    const costPerShare = totalCost / qty;
    
    const resultsHtml = `
        <div class="calc-result-grid">
            <div class="calc-result-item">
                <span class="calc-result-label">Share Amount</span>
                <span class="calc-result-value">Rs. ${amount.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="calc-result-item">
                <span class="calc-result-label">Broker Commission</span>
                <span class="calc-result-value">Rs. ${brokerComm.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="calc-result-item">
                <span class="calc-result-label">SEBON Fee (0.015%)</span>
                <span class="calc-result-value">Rs. ${sebonFee.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="calc-result-item">
                <span class="calc-result-label">DP Charge</span>
                <span class="calc-result-value">Rs. ${dpCharge.toFixed(2)}</span>
            </div>
            <div class="calc-result-total">
                <span class="calc-result-label">Total Cost</span>
                <span class="calc-result-value">Rs. ${totalCost.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="calc-result-item" style="grid-column: 1 / -1;">
                <span class="calc-result-label">Cost Per Share</span>
                <span class="calc-result-value">Rs. ${costPerShare.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
        </div>
    `;
    
    document.getElementById('calcResults').innerHTML = resultsHtml;
}

// Calculate Sell
function calculateSell() {
    const qty = parseFloat(document.getElementById('sellQty').value);
    const buyPrice = parseFloat(document.getElementById('sellBuyPrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const holderType = document.getElementById('sellHolder').value;
    const holdingPeriod = document.getElementById('sellPeriod').value;
    
    if (!qty || !buyPrice || !sellPrice || qty <= 0 || buyPrice <= 0 || sellPrice <= 0) {
        alert('Please enter all valid values');
        return;
    }
    
    const buyAmount = qty * buyPrice;
    const sellAmount = qty * sellPrice;
    const capitalGain = sellAmount - buyAmount;
    
    const brokerComm = getBrokerCommission(sellAmount);
    const sebonFee = sellAmount * 0.00015;
    const dpCharge = 25;
    
    // Capital gain tax calculation
    let cgtRate = 0;
    if (capitalGain > 0) {
        if (holderType === 'individual') {
            cgtRate = holdingPeriod === 'short' ? 0.075 : 0.05;  // 7.5% or 5%
        } else {
            cgtRate = holdingPeriod === 'short' ? 0.10 : 0.10;   // 10%
        }
    }
    const cgt = Math.max(0, capitalGain) * cgtRate;
    
    const totalDeductions = brokerComm + sebonFee + dpCharge + cgt;
    const netReceivable = sellAmount - totalDeductions;
    const profitLoss = netReceivable - buyAmount;
    
    const resultsHtml = `
        <div class="calc-result-grid">
            <div class="calc-result-item">
                <span class="calc-result-label">Sell Amount</span>
                <span class="calc-result-value">Rs. ${sellAmount.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="calc-result-item">
                <span class="calc-result-label">Broker Commission</span>
                <span class="calc-result-value">Rs. ${brokerComm.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="calc-result-item">
                <span class="calc-result-label">SEBON Fee (0.015%)</span>
                <span class="calc-result-value">Rs. ${sebonFee.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="calc-result-item">
                <span class="calc-result-label">DP Charge</span>
                <span class="calc-result-value">Rs. ${dpCharge.toFixed(2)}</span>
            </div>
            <div class="calc-result-item">
                <span class="calc-result-label">Capital Gain Tax (${(cgtRate * 100).toFixed(1)}%)</span>
                <span class="calc-result-value">Rs. ${cgt.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="calc-result-item">
                <span class="calc-result-label">Total Deductions</span>
                <span class="calc-result-value">Rs. ${totalDeductions.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="calc-result-total">
                <span class="calc-result-label">Net Receivable</span>
                <span class="calc-result-value">Rs. ${netReceivable.toLocaleString('en-NP', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="calc-result-item" style="grid-column: 1 / -1;">
                <span class="calc-result-label">Profit/Loss</span>
                <span class="calc-result-value" style="color: ${profitLoss >= 0 ? 'var(--success)' : 'var(--error)'}">
                    ${profitLoss >= 0 ? '+' : ''}Rs. ${profitLoss.toLocaleString('en-NP', {minimumFractionDigits: 2})}
                </span>
            </div>
        </div>
    `;
    
    document.getElementById('calcResults').innerHTML = resultsHtml;
}

// Clear functions
function clearBuyCalc() {
    document.getElementById('buyQty').value = '';
    document.getElementById('buyPrice').value = '';
    clearResults();
}

function clearSellCalc() {
    document.getElementById('sellQty').value = '';
    document.getElementById('sellBuyPrice').value = '';
    document.getElementById('sellPrice').value = '';
    clearResults();
}

function clearResults() {
    document.getElementById('calcResults').innerHTML = '<p class="calc-placeholder">Enter values above and click Calculate</p>';
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Live Chat Module
 */
const LiveChat = {
    init() {
        this.chatBtn = document.getElementById('chatBtn');
        if (!this.chatBtn) return;
        
        this.bindEvents();
    },

    bindEvents() {
        this.chatBtn.addEventListener('click', () => this.toggleChat());
    },

    toggleChat() {
        this.chatBtn.classList.toggle('active');
        
        // Here you would integrate with your actual chat service
        // For now, it just toggles the button state
        if (this.chatBtn.classList.contains('active')) {
            // Open chat - integrate with Tawk.to, Crisp, Intercom, etc.
            console.log('Chat opened - integrate with your chat service');
        } else {
            // Close chat
            console.log('Chat closed');
        }
    }
};
