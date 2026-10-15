// SOFOF TECH — Comprehensive Interactivity & Animation Engine

document.addEventListener('DOMContentLoaded', () => {

  // 1. DevxHub-Grade Scroll-Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active', 'is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.04,
    rootMargin: '0px 0px 40px 0px'
  });

  revealElements.forEach(el => {
    // If element is already in initial viewport, activate it without delay
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('active', 'is-revealed');
    } else {
      revealObserver.observe(el);
    }
  });

  // Sticky Header Subtle Shadow on Scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('shadow-sm');
    } else {
      header?.classList.remove('shadow-sm');
    }
  }, { passive: true });

  // 2. Animated Counter Rollup on Scroll
  const statNumbers = document.querySelectorAll('.counter-num');
  let countersStarted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = Math.max(20, Math.floor(1500 / target));

          const updateCount = () => {
            const increment = Math.ceil(target / 40);
            if (count < target) {
              count = Math.min(target, count + increment);
              stat.textContent = count + suffix;
              setTimeout(updateCount, speed);
            } else {
              stat.textContent = target + suffix;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) countObserver.observe(statsSection);

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // 4. FAQ Accordion Handler
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const answer = item.querySelector('.faq-answer');
      const isAlreadyOpen = !answer.classList.contains('hidden');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer')?.classList.add('hidden');
      });

      if (!isAlreadyOpen) {
        item.classList.add('active');
        answer?.classList.remove('hidden');
      }
    });
  });

  // 5. Gallery Filter for Inside SOFOF (Photos & Tours)
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const getVisiblePhotoItems = () => Array.from(document.querySelectorAll('.gallery-photo-item:not(.hidden)'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-[#16151D]', 'text-white', 'border-[#16151D]');
        b.classList.add('bg-white', 'text-[#5E5B6B]', 'border-[#E8E8EE]');
      });
      btn.classList.add('active', 'bg-[#16151D]', 'text-white', 'border-[#16151D]');
      btn.classList.remove('bg-white', 'text-[#5E5B6B]', 'border-[#E8E8EE]');

      const filter = btn.getAttribute('data-filter');
      const allItems = document.querySelectorAll('.gallery-photo-item, .gallery-card');

      allItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // 6. Enhanced Fullscreen Lightbox with Next/Prev/Keyboard Navigation
  const photoLightboxModal = document.getElementById('photoLightboxModal');
  const lightboxMainImg = document.getElementById('lightboxMainImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxLocation = document.getElementById('lightboxLocation');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closePhotoLightbox = document.getElementById('closePhotoLightbox');
  const prevPhotoBtn = document.getElementById('prevPhotoBtn');
  const nextPhotoBtn = document.getElementById('nextPhotoBtn');

  let currentPhotoIndex = 0;
  let activePhotoList = [];

  const updateLightboxContent = (index) => {
    if (!activePhotoList.length) return;
    if (index < 0) index = activePhotoList.length - 1;
    if (index >= activePhotoList.length) index = 0;
    currentPhotoIndex = index;

    const item = activePhotoList[currentPhotoIndex];
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-caption') || item.querySelector('h3')?.innerText || '';
    const location = item.getAttribute('data-location') || item.querySelector('p')?.innerText || '';

    if (lightboxMainImg && img) {
      lightboxMainImg.src = img.src;
      lightboxMainImg.alt = img.alt || caption;
    }
    if (lightboxTitle) lightboxTitle.textContent = caption;
    if (lightboxLocation) lightboxLocation.textContent = location;
    if (lightboxCounter) lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${activePhotoList.length}`;
  };

  const openLightboxForIndex = (index) => {
    activePhotoList = getVisiblePhotoItems();
    if (!activePhotoList.length) {
      activePhotoList = Array.from(document.querySelectorAll('.gallery-photo-item, .gallery-card'));
    }
    updateLightboxContent(index);
    if (photoLightboxModal) {
      photoLightboxModal.classList.remove('hidden');
      photoLightboxModal.classList.add('flex');
    }
  };

  const closeLightbox = () => {
    if (photoLightboxModal) {
      photoLightboxModal.classList.add('hidden');
      photoLightboxModal.classList.remove('flex');
    }
  };

  // Attach click listener to gallery photo items
  const bindGalleryItemClicks = () => {
    const photoItems = document.querySelectorAll('.gallery-photo-item');
    photoItems.forEach((item, idx) => {
      item.onclick = () => {
        activePhotoList = getVisiblePhotoItems();
        const currentIndex = activePhotoList.indexOf(item);
        openLightboxForIndex(currentIndex >= 0 ? currentIndex : idx);
      };
    });
  };
  bindGalleryItemClicks();

  closePhotoLightbox?.addEventListener('click', closeLightbox);
  prevPhotoBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightboxContent(currentPhotoIndex - 1);
  });
  nextPhotoBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightboxContent(currentPhotoIndex + 1);
  });

  photoLightboxModal?.addEventListener('click', (e) => {
    if (e.target === photoLightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!photoLightboxModal || photoLightboxModal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightboxContent(currentPhotoIndex - 1);
    if (e.key === 'ArrowRight') updateLightboxContent(currentPhotoIndex + 1);
  });

});

