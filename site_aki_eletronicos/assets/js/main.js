(function () {
    'use strict';

    // ---------- Header scroll behavior ----------
    var header = document.getElementById('site-header');
    function onScroll() {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Mobile menu ----------
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            var isOpen = mobileMenu.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ---------- Reveal on scroll ----------
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.reveal');
    if (!reduceMotion && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }

    // ---------- Banner carousel ----------
    var bannerTrack = document.querySelector('.banner-carousel .banner-track');
    if (bannerTrack) {
        var slides = Array.prototype.slice.call(bannerTrack.querySelectorAll('.banner-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('.banner-dot'));
        var current = 0;
        function showSlide(index) {
            slides.forEach(function (s, i) { s.classList.toggle('active', i === index); });
            dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
            current = index;
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(parseInt(dot.getAttribute('data-index'), 10));
            });
        });
        if (slides.length > 1) {
            setInterval(function () {
                showSlide((current + 1) % slides.length);
            }, 6000);
        }
    }

    // ---------- Product filters ----------
    var filterBar = document.getElementById('product-filters');
    var productGrid = document.getElementById('product-grid');
    if (filterBar && productGrid) {
        var pills = Array.prototype.slice.call(filterBar.querySelectorAll('.filter-pill'));
        var cards = Array.prototype.slice.call(productGrid.querySelectorAll('.product-card'));
        pills.forEach(function (pill) {
            pill.addEventListener('click', function () {
                pills.forEach(function (p) { p.classList.remove('active'); });
                pill.classList.add('active');
                var filter = pill.getAttribute('data-filter');
                cards.forEach(function (card) {
                    var match = filter === 'all' || card.getAttribute('data-brand') === filter;
                    card.hidden = !match;
                });
            });
        });
    }

    // ---------- Product gallery thumbnails ----------
    var mainImage = document.getElementById('gallery-main-image');
    var thumbs = document.querySelectorAll('.thumb');
    if (mainImage && thumbs.length) {
        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                mainImage.src = thumb.getAttribute('data-src');
            });
        });
    }

    // ---------- Analytics tracking ----------
    function track(eventType, extra) {
        var payload = Object.assign({ event_type: eventType, page: window.location.pathname }, extra || {});
        try {
            fetch('/api/track.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        } catch (e) { /* falha silenciosa: não deve travar a navegação */ }
    }

    document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-track]');
        if (!el) return;
        var eventType = el.getAttribute('data-track');
        var extra = {};
        if (el.dataset.productId) extra.product_id = el.dataset.productId;
        if (el.dataset.bannerId) extra.banner_id = el.dataset.bannerId;
        track(eventType, extra);
    });
})();
