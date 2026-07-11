document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CUSTOM CURSOR & SPOTLIGHT GLOW
  // ==========================================
  const cursor = document.getElementById('customCursor');
  const cursorRing = document.getElementById('customCursorRing');
  const spotlight = document.getElementById('spotlight');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;

  // Track mouse coordinates
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Direct cursor position
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';

    // Spotlight position (update CSS variables)
    spotlight.style.setProperty('--mouse-x', mouseX + 'px');
    spotlight.style.setProperty('--mouse-y', mouseY + 'px');
  });

  // Smooth lagging loop for cursor ring
  function updateRing() {
    // Linear interpolation (lerp) for smooth lag
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';

    requestAnimationFrame(updateRing);
  }
  updateRing();

  // Hover effect scaling for cursors
  const hoverElements = document.querySelectorAll('.cursor-hover');
  
  function addHoverClasses() {
    document.body.classList.add('hovering');
  }
  
  function removeHoverClasses() {
    document.body.classList.remove('hovering');
  }

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', addHoverClasses);
    el.addEventListener('mouseleave', removeHoverClasses);
  });

  // Re-apply cursor hover listeners to dynamically updated elements
  function refreshCursorHoverListeners() {
    const freshHoverEls = document.querySelectorAll('.cursor-hover');
    freshHoverEls.forEach(el => {
      el.removeEventListener('mouseenter', addHoverClasses);
      el.removeEventListener('mouseleave', removeHoverClasses);
      el.addEventListener('mouseenter', addHoverClasses);
      el.addEventListener('mouseleave', removeHoverClasses);
    });
  }

  // ==========================================
  // PREMIUM LOADER SYSTEM
  // ==========================================
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderBarFill');
  const loaderCounter = document.getElementById('loaderCounter');

  let progress = 0;
  const loadInterval = setInterval(() => {
    // Simulate luxury variable loading speeds
    let increment = Math.floor(Math.random() * 8) + 2;
    progress = Math.min(progress + increment, 100);
    
    loaderFill.style.width = progress + '%';
    loaderCounter.textContent = progress + '%';

    if (progress === 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        // Slide out loader screen
        loader.style.transform = 'translateY(-100%)';
        
        // Trigger initial reveal elements on home screen
        setTimeout(() => {
          loader.style.display = 'none';
          document.body.style.cursor = 'none'; // Re-confirm custom cursor
          triggerScrollReveals(); // Init reveals
        }, 1200);
      }, 400);
    }
  }, 60);



  // ==========================================
  // SCROLL REVEALS & TIMELINE OBSERVER
  // ==========================================
  function triggerScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal, .product-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Active timeline items scroll spotlight
  const timelineItems = document.querySelectorAll('.timeline-item');
  window.addEventListener('scroll', () => {
    const triggerHeight = window.innerHeight * 0.55;
    
    timelineItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < triggerHeight && rect.bottom > triggerHeight - 150) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });

  // ==========================================
  // RENDER DYNAMIC PRODUCTS
  // ==========================================
  const collectionGrid = document.getElementById('collectionGrid');
  
  function renderProducts() {
    if (!collectionGrid || !window.KUT_PRODUCTS) return;
    collectionGrid.innerHTML = '';
    
    window.KUT_PRODUCTS.forEach(product => {
      let motifSvg = '';
      const motifLower = (product.motif || '').toLowerCase();
      if (motifLower.includes('koçboynuzu') || motifLower.includes('horn')) {
        motifSvg = `<svg viewBox="0 0 100 100"><path d="M 50 85 L 50 45 M 50 45 L 35 45 L 35 30 L 20 30 L 20 15 L 50 15 M 50 45 L 65 45 L 65 30 L 80 30 L 80 15 L 50 15" stroke="currentColor" stroke-width="3" fill="none"/></svg>`;
      } else if (motifLower.includes('elibelinde') || motifLower.includes('hands')) {
        motifSvg = `<svg viewBox="0 0 100 100"><path d="M 50 10 L 42 18 L 50 26 L 58 18 Z M 50 30 L 35 55 L 65 55 Z M 43 38 L 25 38 L 25 28 L 38 28 M 57 38 L 75 38 L 75 28 L 62 28" stroke="currentColor" stroke-width="3" fill="none"/></svg>`;
      } else {
        motifSvg = `<svg viewBox="0 0 100 100"><path d="M 50 90 L 50 10 M 50 30 L 30 50 M 50 30 L 70 50 M 50 50 L 25 70 M 50 50 L 75 70" stroke="currentColor" stroke-width="3" fill="none"/></svg>`;
      }

      const cardHtml = `
      <div class="product-card cursor-hover reveal revealed" data-category="${product.category}"
           data-name="${product.name}"
           data-price="${product.price}"
           data-tag="${product.tag}"
           data-img="${product.img}"
           data-gallery="${product.gallery || ''}"
           data-shopier="${product.shopier || 'https://www.shopier.com/kuturban'}"
           data-desc="${product.desc || ''}"
           data-materials="${product.materials || ''}"
           data-motif="${product.motif || ''}">
        <div class="product-img-wrapper">
          <img src="${product.img}" alt="${product.name}" class="product-img">
          <div class="product-overlay">
            <div class="product-motif-stamp">
              ${motifSvg}
            </div>
            <span class="btn-premium" style="padding: 0.8rem 1.8rem; font-size: 0.65rem;">Galeri ve Detaylar</span>
          </div>
        </div>
        <div class="product-tag">${product.tag}</div>
        <div class="product-info">
          <a href="#" class="product-name">${product.name}</a>
          <span class="product-price">${product.price}</span>
        </div>
      </div>
      `;
      collectionGrid.insertAdjacentHTML('beforeend', cardHtml);
    });

    if (typeof refreshCursorHoverListeners === 'function') {
      refreshCursorHoverListeners();
    }
  }

  renderProducts();

  // ==========================================
  // COLLECTION INTERACTIVITY & FILTERS (DİNAMİK)
  // ==========================================
  const collectionFilters = document.getElementById('collectionFilters');

  function renderFilters() {
    if (!collectionFilters || !window.KUT_CATEGORIES) return;
    collectionFilters.innerHTML = '';

    // "Tümü" butonunu ekle
    const allBtnHtml = `<button class="filter-btn active cursor-hover" data-filter="all">Tümü</button>`;
    collectionFilters.insertAdjacentHTML('beforeend', allBtnHtml);

    // Diğer kategorileri ekle
    window.KUT_CATEGORIES.forEach(cat => {
      const btnHtml = `<button class="filter-btn cursor-hover" data-filter="${cat.key}">${cat.name}</button>`;
      collectionFilters.insertAdjacentHTML('beforeend', btnHtml);
    });

    setupFilterEvents();
    if (typeof refreshCursorHoverListeners === 'function') {
      refreshCursorHoverListeners();
    }
  }

  function setupFilterEvents() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Aktif buton stilini değiştir
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 400);
          }
        });
      });
    });
  }

  // Filtreleri render et
  renderFilters();

  // ==========================================
  // INTERACTIVE CULTURAL MOTIF SYSTEM (KLASÖR GÖRSELLERİ VE FALI AÇIKLAMALARI)
  // ==========================================
  const motifMenuItems = document.querySelectorAll('.motif-menu-item');
  const motifImgDisplay = document.getElementById('motifImgDisplay');
  const motifTitle = document.getElementById('motifTitle');
  const motifText = document.getElementById('motifText');

  // Halıfalı.com verileri ve yerel görseller
  const motifs = {
    horn: {
      title: "Koç Boynuzu (Bereket & Güç)",
      desc: "Bereket, kahramanlık, güç ve erkeklik sembolü olan koç boynuzu motifi, Anadolu kültüründe ana tanrıçadan sonra ya da onunla birlikte kullanılan bir motiftir. Boynuz sembolü, insanlık tarihinde her zaman güç kuvvet temsili olan erkekle özdeşleştirilmiştir.",
      img: "images/MOTIFLER/Kocboynuzu.png"
    },
    hands: {
      title: "Elibelinde (Dişilik & Bereket)",
      desc: "Elibelinde motifi, dişiliğin simgesidir. Sadece analık ve doğurganlığı değil, aynı zamanda uğur, bereket, kısmet, mutluluk ve neşeyi de sembolize eder. Bilindiği gibi, insanlığın yaradılışından bu yana ‘ana’ kavramı, hayatın ilk nüvelerinin oluştuğu ve geliştiği kaynağı ifade etmektedir.",
      img: "images/MOTIFLER/Elibelinde.png"
    },
    tree: {
      title: "Hayat Ağacı (Sonsuzluk & Evren)",
      desc: "Hayat ağacı sürekli gelişen, cennete yükselen hayatın, dikey sembolizmini oluşturur. Geniş anlamda, sürekli değişim ve gelişim içinde yaşayan evreni sembolize eder. Evrenin üç elementini, toprağın derinine inen kökleriyle yeraltını, alt dalları ve gövdesiyle yer yüzünü, ışığa yükselen üst dallarıyla cenneti birleştirir.",
      img: "images/MOTIFLER/Hayatagci.png"
    }
  };

  motifMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Aktif menü butonunu belirle
      motifMenuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');

      const motifKey = item.getAttribute('data-motif');
      const data = motifs[motifKey];

      // Görseli ve metinleri yumuşakça soldur
      motifImgDisplay.classList.remove('loaded');
      motifTitle.style.opacity = 0;
      motifText.style.opacity = 0;

      setTimeout(() => {
        // İçerikleri güncelle
        motifTitle.textContent = data.title;
        motifText.textContent = data.desc;
        motifImgDisplay.src = data.img;
        motifImgDisplay.alt = data.title;

        // Metinleri tekrar görünür yap
        motifTitle.style.opacity = 1;
        motifText.style.opacity = 1;

        // Görselin yüklenmesini bekle ve yumuşakça belirmesini tetikle
        setTimeout(() => {
          motifImgDisplay.classList.add('loaded');
        }, 50);
      }, 300);
    });
  });

  // Başlangıçta görselin belirmesini tetikle
  setTimeout(() => {
    if (motifImgDisplay) {
      motifImgDisplay.classList.add('loaded');
    }
  }, 200);

  // ==========================================
  // PRODUCT QUICK VIEW MODAL (WITH GALLERY SUPPORT)
  // ==========================================
  const modal = document.getElementById('productModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalTabContent = document.getElementById('modalTabContent');
  const modalTabBtns = document.querySelectorAll('.modal-tab-btn');
  const modalGalleryThumbs = document.getElementById('modalGalleryThumbs');
  const modalBuyLink = document.getElementById('modalBuyLink');

  let activeProductData = null;

  if (collectionGrid) {
    collectionGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;

      if (e.target.classList.contains('product-name')) {
        e.preventDefault();
      }

      activeProductData = {
        name: card.getAttribute('data-name'),
        price: card.getAttribute('data-price'),
        tag: card.getAttribute('data-tag'),
        img: card.getAttribute('data-img'),
        gallery: card.getAttribute('data-gallery') || '',
        desc: card.getAttribute('data-desc'),
        materials: card.getAttribute('data-materials'),
        motif: card.getAttribute('data-motif'),
        shopier: card.getAttribute('data-shopier') || 'https://www.shopier.com/kuturban'
      };

      openModal(activeProductData);
    });
  }

  function openModal(data) {
    modalImg.src = data.img;
    modalImg.alt = data.name;
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.name;
    modalPrice.textContent = data.price;
    if (modalBuyLink) {
      modalBuyLink.href = data.shopier;
    }

    // Render multi-view gallery thumbnails
    modalGalleryThumbs.innerHTML = '';
    if (data.gallery) {
      const imagesList = data.gallery.split(',');
      if (imagesList.length > 1) {
        imagesList.forEach((imgSrc, index) => {
          const thumb = document.createElement('img');
          thumb.src = imgSrc;
          thumb.alt = `${data.name} Açı ${index + 1}`;
          thumb.className = `modal-gallery-thumb cursor-hover ${imgSrc === data.img ? 'active' : ''}`;
          
          thumb.addEventListener('click', () => {
            // Swap main preview image
            modalImg.src = imgSrc;
            
            // Toggle active thumbnail styling
            document.querySelectorAll('.modal-gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
          });
          
          modalGalleryThumbs.appendChild(thumb);
        });
        modalGalleryThumbs.style.display = 'flex';
      } else {
        modalGalleryThumbs.style.display = 'none';
      }
    } else {
      modalGalleryThumbs.style.display = 'none';
    }

    // Set tab to narrative by default
    switchModalTab('narrative');

    // Slide in
    modal.classList.add('open');
    modalOverlay.classList.add('open');
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
    refreshCursorHoverListeners(); // Re-apply cursor links
  }

  function closeModal() {
    modal.classList.remove('open');
    modalOverlay.classList.remove('open');
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Modal tabs logic
  modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchModalTab(btn.getAttribute('data-tab'));
    });
  });

  function switchModalTab(tabKey) {
    if (!activeProductData) return;

    modalTabContent.style.opacity = 0;
    
    setTimeout(() => {
      if (tabKey === 'narrative') {
        modalTabContent.innerHTML = `
          <span>Tasarım Hikayesi:</span>
          ${activeProductData.desc}
          <br><br>
          <span>Tarihsel Motif İmzası:</span>
          Bu parça, kumaşına işlenmiş asil <strong>${activeProductData.motif}</strong> motifiyle kadim bir hikaye taşır.
        `;
      } else {
        modalTabContent.innerHTML = `
          <span>Kumaş ve Malzeme:</span>
          ${activeProductData.materials}
          <br><br>
          <span>Atölye ve İşçilik Belgesi:</span>
          Özel terzilik kalıplarıyla dikilmiştir. Tüm metal aksamlar el dövmesi olup, kumaşlar sürdürülebilir üretim ilkelerine göre işlenmiştir.
        `;
      }
      modalTabContent.style.opacity = 1;
    }, 150);
  }

  // Handle menu toggle on mobile devices
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav');

  menuToggle.addEventListener('click', () => {
    if (navMenu.style.display === 'flex') {
      navMenu.style.display = '';
    } else {
      navMenu.style.display = 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'fixed';
      navMenu.style.top = '70px';
      navMenu.style.left = '0';
      navMenu.style.width = '100%';
      navMenu.style.backgroundColor = 'rgba(7, 7, 7, 0.95)';
      navMenu.style.padding = '2rem';
      navMenu.style.borderBottom = '1px solid rgba(245, 244, 240, 0.1)';
      navMenu.style.gap = '1.5rem';
      navMenu.style.zIndex = '99';
      refreshCursorHoverListeners();
    }
  });

  // ==========================================
  // SCROLL SPY ACTIVE MENU LINK INDICATOR
  // ==========================================
  const navLinks = document.querySelectorAll('nav a:not(.nav-cta)');
  const spySections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;

    spySections.forEach(sec => {
      const sectionTop = sec.offsetTop;
      const sectionHeight = sec.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  // ==========================================
  // MANIFESTO SLIDER
  // ==========================================
  const slides = document.querySelectorAll('.manifesto-slide');
  const indicators = document.querySelectorAll('.manifesto-indicators .indicator');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    if (slides.length === 0) return;
    
    // Remove active class from current slide and indicator
    slides[currentSlide].classList.remove('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
    
    // Set new slide index
    currentSlide = (index + slides.length) % slides.length;
    
    // Add active class to new slide and indicator
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(nextSlide, 8000); // Auto rotate every 8 seconds
  }

  function stopSlideTimer() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startSlideTimer(); // Reset timer on click
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      startSlideTimer(); // Reset timer on click
    });
  }

  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const index = parseInt(indicator.getAttribute('data-index'));
      showSlide(index);
      startSlideTimer(); // Reset timer on click
    });
  });

  // Start the slider timer initially
  if (slides.length > 0) {
    startSlideTimer();
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Run once on init

  // ==========================================
  // USER LOGIN & REGISTRATION INTEGRATION (MAIN SITE)
  // ==========================================
  const navLoginBtn = document.getElementById('navLoginBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const profileBtn = document.getElementById('profileBtn');
  const profileName = document.getElementById('profileName');
  const profileDropdownMenu = document.getElementById('profileDropdownMenu');
  const dropdownProfileName = document.getElementById('dropdownProfileName');
  const dropdownAdminLink = document.getElementById('dropdownAdminLink');
  const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');

  const loginOverlay = document.getElementById('loginOverlay');
  const closeLoginBtn = document.getElementById('closeLoginBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPass = document.getElementById('loginPass');
  const loginError = document.getElementById('loginError');

  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const loginFormWrapper = document.getElementById('loginFormWrapper');
  const registerFormWrapper = document.getElementById('registerFormWrapper');

  const regFirstName = document.getElementById('regFirstName');
  const regLastName = document.getElementById('regLastName');
  const regEmail = document.getElementById('regEmail');
  const regPass = document.getElementById('regPass');
  const regPassConfirm = document.getElementById('regPassConfirm');
  const registerError = document.getElementById('registerError');
  const registerSuccess = document.getElementById('registerSuccess');

  // SHA-256 Hashing helper
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  // Toggle Overlay
  if (navLoginBtn) {
    navLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginOverlay.classList.add('active');
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    });
  }

  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => {
      loginOverlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    });
  }

  // Close when clicking outside login card
  if (loginOverlay) {
    loginOverlay.addEventListener('click', (e) => {
      if (e.target === loginOverlay) {
        closeLoginBtn.click();
      }
    });
  }

  // Switch tabs
  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active-tab');
      tabRegisterBtn.classList.remove('active-tab');
      loginFormWrapper.style.display = 'block';
      registerFormWrapper.style.display = 'none';
      loginError.style.display = 'none';
    });

    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active-tab');
      tabLoginBtn.classList.remove('active-tab');
      registerFormWrapper.style.display = 'block';
      loginFormWrapper.style.display = 'none';
      registerSuccess.style.display = 'none';
      registerError.style.display = 'none';
    });
  }

  // Handle register submission
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      registerError.style.display = 'none';
      registerSuccess.style.display = 'none';

      const firstName = regFirstName.value.trim();
      const lastName = regLastName.value.trim();
      const email = regEmail.value.trim().toLowerCase();
      const password = regPass.value;
      const confirmPass = regPassConfirm.value;

      if (password !== confirmPass) {
        registerError.textContent = "Şifreler uyuşmuyor!";
        registerError.style.display = 'block';
        return;
      }

      if (password.length < 4) {
        registerError.textContent = "Şifre en az 4 karakter olmalıdır!";
        registerError.style.display = 'block';
        return;
      }

      const emailHash = await sha256(email);
      const passHash = await sha256(password);

      let users = [];
      try {
        const stored = localStorage.getItem('kut_registered_users');
        if (stored) users = JSON.parse(stored);
      } catch (err) {
        users = [];
      }

      // Check if email already registered (or if it matches the default admin email)
      const adminEmailHash = "0e37c3574c7e63b610c14c30c33a921d2794c16a704a29a038d172774136696b0258"; // "admin@gmail.com"
      if (users.some(u => u.emailHash === emailHash) || emailHash === adminEmailHash) {
        registerError.textContent = "Bu E-posta adresi zaten kayıtlı!";
        registerError.style.display = 'block';
        return;
      }

      users.push({
        emailHash: emailHash,
        password: passHash,
        firstName: firstName,
        lastName: lastName,
        email: email
      });
      localStorage.setItem('kut_registered_users', JSON.stringify(users));

      registerSuccess.style.display = 'block';
      registerForm.reset();

      setTimeout(() => {
        tabLoginBtn.click();
        loginEmail.value = email;
        loginPass.focus();
      }, 1500);
    });
  }

  // Handle login submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.style.display = 'none';

      const email = loginEmail.value.trim().toLowerCase();
      const password = loginPass.value;

      const emailHash = await sha256(email);
      const passHash = await sha256(password);

      // Default Admin credentials: admin@gmail.com / kut
      const correctUserHash = "0e37c3574c7e63b610c14c30c33a921d2794c16a704a29a038d172774136696b0258"; // admin@gmail.com
      const correctPassHash = "33959141f22e8657685974052345511b816a704a29a038d172774136696b0258"; // kut

      let isMatch = (emailHash === correctUserHash && passHash === correctPassHash);
      let displayName = "";

      if (!isMatch) {
        let users = [];
        try {
          const stored = localStorage.getItem('kut_registered_users');
          if (stored) users = JSON.parse(stored);
        } catch (err) {
          users = [];
        }
        const found = users.find(u => u.emailHash === emailHash && u.password === passHash);
        if (found) {
          isMatch = true;
          displayName = (found.firstName || "") + " " + (found.lastName || "");
        }
      } else {
        displayName = "Yönetici";
      }

      if (isMatch) {
        if (email === 'admin@gmail.com') {
          sessionStorage.setItem('kut_admin_logged_in', 'true');
        }
        sessionStorage.setItem('kut_logged_in_user', displayName);

        closeLoginBtn.click();
        updateAuthUI();
      } else {
        loginError.style.display = 'block';
        loginPass.value = '';
        loginPass.focus();
      }
    });
  }

  // Toggle dropdown on click
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      profileDropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      profileDropdownMenu.classList.remove('active');
    });
  }

  // Handle Logout
  if (dropdownLogoutBtn) {
    dropdownLogoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('kut_admin_logged_in');
      sessionStorage.removeItem('kut_logged_in_user');
      updateAuthUI();
      profileDropdownMenu.classList.remove('active');
    });
  }

  // Update Navigation Auth UI state
  function updateAuthUI() {
    const loggedInUser = sessionStorage.getItem('kut_logged_in_user');
    const isAdmin = sessionStorage.getItem('kut_admin_logged_in') === 'true';

    if (loggedInUser) {
      if (navLoginBtn) navLoginBtn.style.display = 'none';
      if (profileDropdown) profileDropdown.style.display = 'inline-block';
      if (profileName) profileName.textContent = loggedInUser;
      if (dropdownProfileName) dropdownProfileName.textContent = loggedInUser;
      
      if (isAdmin) {
        if (dropdownAdminLink) dropdownAdminLink.style.display = 'block';
      } else {
        if (dropdownAdminLink) dropdownAdminLink.style.display = 'none';
      }
    } else {
      if (navLoginBtn) navLoginBtn.style.display = 'flex';
      if (profileDropdown) profileDropdown.style.display = 'none';
    }
  }

  // Initial check
  updateAuthUI();

  // ==========================================
  // E-COMMERCE INTEGRATION (CART, CHECKOUT & PROFILE DASHBOARD)
  // ==========================================

  // State
  let cart = [];

  // DOM Elements
  const navCartBtn = document.getElementById('navCartBtn');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartDrawerBody = document.getElementById('cartDrawerBody');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

  const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutFormWrapper = document.getElementById('checkoutFormWrapper');
  const orderSuccessScreen = document.getElementById('orderSuccessScreen');
  const successOrderId = document.getElementById('successOrderId');
  const successCloseBtn = document.getElementById('successCloseBtn');

  const checkoutCity = document.getElementById('checkoutCity');
  const checkoutDistrict = document.getElementById('checkoutDistrict');

  const profileModal = document.getElementById('profileModal');
  const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
  const dropdownProfileLink = document.getElementById('dropdownProfileLink');
  const profileUserFullName = document.getElementById('profileUserFullName');
  const profileUserEmail = document.getElementById('profileUserEmail');
  const profileOrdersBody = document.getElementById('profileOrdersBody');

  // Load cart on init
  function loadCart() {
    try {
      const stored = localStorage.getItem('kut_cart');
      if (stored) {
        cart = JSON.parse(stored);
      }
    } catch (e) {
      cart = [];
    }
    updateCartUI();
  }

  // Save cart to localstorage
  function saveCart() {
    localStorage.setItem('kut_cart', JSON.stringify(cart));
    updateCartUI();
  }

  // Update badge, subtotal, and cart item list rendering
  function updateCartUI() {
    if (!cartDrawerBody) return;

    // Cart Count Badge
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalItems > 0) {
      cartCountBadge.textContent = totalItems;
      cartCountBadge.style.display = 'inline-block';
    } else {
      cartCountBadge.style.display = 'none';
    }

    // Render items
    cartDrawerBody.innerHTML = '';
    if (cart.length === 0) {
      cartDrawerBody.innerHTML = '<div class="cart-empty-message">Sepetiniz şu anda boş.</div>';
      cartSubtotal.textContent = '0 TL';
      cartCheckoutBtn.style.opacity = '0.5';
      cartCheckoutBtn.style.pointerEvents = 'none';
      return;
    }

    cartCheckoutBtn.style.opacity = '1';
    cartCheckoutBtn.style.pointerEvents = 'all';

    let subtotal = 0;

    cart.forEach((item, index) => {
      // Parse numeric price from format (e.g. "1.850 TL" or "1850")
      const priceNum = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
      const itemTotal = priceNum * item.qty;
      subtotal += itemTotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-meta">Beden: Tek Beden</div>
          </div>
          <div class="cart-item-bottom">
            <div class="cart-qty-controls">
              <button class="cart-qty-btn cursor-hover" data-action="dec" data-index="${index}">-</button>
              <span class="cart-qty-value">${item.qty}</span>
              <button class="cart-qty-btn cursor-hover" data-action="inc" data-index="${index}">+</button>
            </div>
            <div class="cart-item-price">${itemTotal.toLocaleString('tr-TR')} TL</div>
          </div>
          <div style="text-align: right; margin-top: 0.2rem;">
            <button class="cart-item-remove cursor-hover" data-index="${index}">Sil</button>
          </div>
        </div>
      `;
      cartDrawerBody.appendChild(itemEl);
    });

    cartSubtotal.textContent = subtotal.toLocaleString('tr-TR') + ' TL';
    refreshCursorHoverListeners();
  }

  // Cart Click Listeners (delegated for dec, inc, remove buttons)
  if (cartDrawerBody) {
    cartDrawerBody.addEventListener('click', (e) => {
      const target = e.target;
      const index = parseInt(target.getAttribute('data-index'));

      if (target.classList.contains('cart-qty-btn')) {
        const action = target.getAttribute('data-action');
        if (action === 'inc') {
          cart[index].qty += 1;
        } else if (action === 'dec') {
          cart[index].qty -= 1;
          if (cart[index].qty <= 0) {
            cart.splice(index, 1);
          }
        }
        saveCart();
      } else if (target.classList.contains('cart-item-remove')) {
        cart.splice(index, 1);
        saveCart();
      }
    });
  }

  // Toggle Cart Drawer
  if (navCartBtn) {
    navCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cartDrawer.classList.add('active');
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      cartDrawer.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    });
  }

  // Add to Cart from product modal
  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', () => {
      if (!activeProductData) return;

      // Check if product already in cart
      const existingIndex = cart.findIndex(item => item.name === activeProductData.name);
      if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
      } else {
        cart.push({
          name: activeProductData.name,
          price: activeProductData.price,
          img: activeProductData.img,
          qty: 1
        });
      }

      saveCart();
      closeModal();
      
      // Open cart drawer automatically to show added item
      setTimeout(() => {
        if (navCartBtn) navCartBtn.click();
      }, 300);
    });
  }

  // Checkout flows
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      // Close cart drawer
      if (closeCartBtn) closeCartBtn.click();

      // Open checkout modal
      checkoutFormWrapper.style.display = 'block';
      orderSuccessScreen.style.display = 'none';
      checkoutModal.classList.add('active');
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
      
      // Auto fill customer details if logged in
      const loggedUser = sessionStorage.getItem('kut_logged_in_user');
      if (loggedUser && loggedUser !== 'Yönetici') {
        const parts = loggedUser.split(' ');
        document.getElementById('checkoutFirstName').value = parts[0] || '';
        document.getElementById('checkoutLastName').value = parts.slice(1).join(' ') || '';
      }
    });
  }

  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    });
  }

  // Complete Order / Form Submit
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('checkoutFirstName').value.trim();
      const lastName = document.getElementById('checkoutLastName').value.trim();
      const phone = document.getElementById('checkoutPhone').value.trim();
      
      const rawCity = checkoutCity.value;
      const rawDistrict = checkoutDistrict.value;
      const city = rawCity.charAt(0).toUpperCase() + rawCity.slice(1);
      const district = rawDistrict.charAt(0).toUpperCase() + rawDistrict.slice(1);
      
      const address = document.getElementById('checkoutAddress').value.trim();

      // Mock Order creation
      const orderId = 'KUT-' + Math.floor(100000 + Math.random() * 900000);
      const orderDate = new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR');
      
      // Calculate total
      let subtotal = 0;
      cart.forEach(item => {
        const priceNum = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
        subtotal += priceNum * item.qty;
      });

      // Get logged in email
      let customerEmail = "guest@gmail.com";
      const loggedUser = sessionStorage.getItem('kut_logged_in_user');
      
      // Let's lookup email in registered users if matching name
      try {
        const storedUsers = localStorage.getItem('kut_registered_users');
        if (storedUsers) {
          const usersList = JSON.parse(storedUsers);
          const foundUser = usersList.find(u => (u.firstName + " " + u.lastName) === loggedUser);
          if (foundUser) {
            customerEmail = foundUser.email;
          }
        }
      } catch (err) {}

      if (loggedUser === "Yönetici") {
        customerEmail = "admin@gmail.com";
      }

      const orderObj = {
        orderId: orderId,
        date: orderDate,
        customerName: firstName + ' ' + lastName,
        email: customerEmail,
        phone: phone,
        city: city + ' / ' + district,
        address: address,
        items: [...cart],
        total: subtotal.toLocaleString('tr-TR') + ' TL',
        status: 'pending' // pending, processing, shipped, completed
      };

      // Save order to global orders list
      let orders = [];
      try {
        const storedOrders = localStorage.getItem('kut_orders');
        if (storedOrders) orders = JSON.parse(storedOrders);
      } catch (err) {
        orders = [];
      }

      orders.unshift(orderObj); // Add newest first
      localStorage.setItem('kut_orders', JSON.stringify(orders));

      // Clear Cart
      cart = [];
      saveCart();

      // Show success screen
      checkoutFormWrapper.style.display = 'none';
      orderSuccessScreen.style.display = 'block';
      successOrderId.textContent = orderId;
      checkoutForm.reset();
    });
  }

  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', () => {
      if (closeCheckoutBtn) closeCheckoutBtn.click();
    });
  }

  // Profile Orders modal flow
  if (dropdownProfileLink) {
    dropdownProfileLink.addEventListener('click', (e) => {
      e.preventDefault();
      profileDropdownMenu.classList.remove('active'); // Close dropdown menu

      const loggedUser = sessionStorage.getItem('kut_logged_in_user');
      if (!loggedUser) {
        // Not logged in: trigger login overlay modal
        if (navLoginBtn) navLoginBtn.click();
        return;
      }

      // Populate details
      profileUserFullName.textContent = loggedUser;
      
      // Find Email
      let customerEmail = "guest@gmail.com";
      try {
        const storedUsers = localStorage.getItem('kut_registered_users');
        if (storedUsers) {
          const usersList = JSON.parse(storedUsers);
          const foundUser = usersList.find(u => (u.firstName + " " + u.lastName) === loggedUser);
          if (foundUser) {
            customerEmail = foundUser.email;
          }
        }
      } catch (err) {}
      if (loggedUser === "Yönetici") customerEmail = "admin@gmail.com";
      profileUserEmail.textContent = customerEmail;

      // Populate orders list table
      let orders = [];
      try {
        const storedOrders = localStorage.getItem('kut_orders');
        if (storedOrders) orders = JSON.parse(storedOrders);
      } catch (err) {}

      // Filter orders by email
      const userOrders = orders.filter(o => o.email === customerEmail);

      profileOrdersBody.innerHTML = '';
      if (userOrders.length === 0) {
        profileOrdersBody.innerHTML = '<div style="color: var(--color-bone-dim); font-size: 0.8rem; text-align: center; padding: 2rem 0;">Henüz siparişiniz bulunmamaktadır.</div>';
      } else {
        let tableHtml = `
          <table class="orders-table">
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Tarih</th>
                <th>Ürünler</th>
                <th>Toplam</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
        `;

        userOrders.forEach(o => {
          const itemsText = o.items.map(i => `${i.name} (${i.qty} adet)`).join(', ');
          
          let statusText = "Alındı";
          let statusClass = "status-pending";
          if (o.status === 'processing') {
            statusText = "Hazırlanıyor";
            statusClass = "status-processing";
          } else if (o.status === 'shipped') {
            statusText = "Kargolandı";
            statusClass = "status-shipped";
          } else if (o.status === 'completed') {
            statusText = "Teslim Edildi";
            statusClass = "status-completed";
          }

          tableHtml += `
            <tr>
              <td style="color: var(--color-gold); font-weight: 600;">${o.orderId}</td>
              <td style="font-size: 0.75rem;">${o.date.split(' ')[0]}</td>
              <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${itemsText}">${itemsText}</td>
              <td style="font-weight: 600;">${o.total}</td>
              <td><span class="order-status-badge ${statusClass}">${statusText}</span></td>
            </tr>
          `;
        });

        tableHtml += `
            </tbody>
          </table>
        `;
        profileOrdersBody.innerHTML = tableHtml;
      }

      // Open profile modal
      profileModal.classList.add('active');
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
      refreshCursorHoverListeners();
    });
  }

  if (closeProfileModalBtn) {
    closeProfileModalBtn.addEventListener('click', () => {
      profileModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    });
  }

  function initCheckoutRegions() {
    if (!checkoutCity || !checkoutDistrict) return;

    // Reset City Dropdown
    checkoutCity.innerHTML = '<option value="">Şehir Seçin</option>';
    checkoutDistrict.innerHTML = '<option value="">İlçe Seçin</option>';
    checkoutDistrict.disabled = true;
    checkoutDistrict.style.opacity = '0.5';

    if (window.TURKEY_REGIONS && Array.isArray(window.TURKEY_REGIONS)) {
      // Sort cities by name (Turkish locale)
      const sortedCities = [...window.TURKEY_REGIONS].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      
      sortedCities.forEach(city => {
        const option = document.createElement('option');
        // Capitalize city name nicely
        const capitalizedName = city.name.charAt(0).toUpperCase() + city.name.slice(1);
        option.value = city.name;
        option.textContent = capitalizedName;
        checkoutCity.appendChild(option);
      });
    }

    // Change event for City dropdown
    checkoutCity.addEventListener('change', () => {
      const selectedCityName = checkoutCity.value;
      checkoutDistrict.innerHTML = '<option value="">İlçe Seçin</option>';

      if (!selectedCityName) {
        checkoutDistrict.disabled = true;
        checkoutDistrict.style.opacity = '0.5';
        return;
      }

      const cityData = window.TURKEY_REGIONS.find(c => c.name === selectedCityName);
      if (cityData && cityData.counties && cityData.counties.length > 0) {
        // Sort districts by name (Turkish locale)
        const sortedDistricts = [...cityData.counties].sort((a, b) => a.localeCompare(b, 'tr'));

        sortedDistricts.forEach(dist => {
          const option = document.createElement('option');
          // Capitalize district name nicely
          const capitalizedDist = dist.charAt(0).toUpperCase() + dist.slice(1);
          option.value = dist;
          option.textContent = capitalizedDist;
          checkoutDistrict.appendChild(option);
        });

        checkoutDistrict.disabled = false;
        checkoutDistrict.style.opacity = '1';
      } else {
        checkoutDistrict.disabled = true;
        checkoutDistrict.style.opacity = '0.5';
      }
      refreshCursorHoverListeners();
    });
  }

  // Load cart initially
  loadCart();
  initCheckoutRegions();
});
