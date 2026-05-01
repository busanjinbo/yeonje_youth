/* ============================================================
   main.js — 이승민 후보 홈페이지
   · 파티클 배경
   · 스크롤 reveal 애니메이션
   · 탭 전환
   · 모바일 햄버거
   · URL 파라미터로 탭 자동 선택
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 파티클 배경 ── */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 55;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(163, 212, 245, ${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ── 스크롤 reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  /* ── 모바일 햄버거 ── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // 메뉴 링크 클릭 시 닫기
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── NAV 스크롤 효과 ── */
  const topNav = document.getElementById('top-nav');
  if (topNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        topNav.classList.add('scrolled');
      } else {
        topNav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ── 탭 전환 (공약 페이지) ── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.pledge-tab-content');

  function activateTab(tabId) {
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    tabContents.forEach(content => {
      const isActive = content.id === `content-${tabId}`;
      content.classList.toggle('active', isActive);
      // 탭 전환 시 해당 섹션의 reveal 재실행
      if (isActive) {
        content.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => observer.observe(el), 50);
        });
      }
    });
    // URL 업데이트 (뒤로가기 지원)
    const url = new URL(window.location);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', url);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  // 모바일 메뉴의 탭 링크
  document.querySelectorAll('.tab-mobile-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab(link.dataset.tab);
      // 탭 위치로 스크롤
      const tabWrap = document.getElementById('tab-nav-wrap');
      if (tabWrap) tabWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // URL 파라미터로 초기 탭 선택
  const params = new URLSearchParams(window.location.search);
  const initTab = params.get('tab');
  if (initTab && document.getElementById(`tab-${initTab}`)) {
    activateTab(initTab);
  }

  /* ── 후보 사진 placeholder 처리 ── */
  // 이미지가 없을 경우 graceful fallback
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      if (this.classList.contains('hero-photo') || this.classList.contains('profile-photo')) {
        this.style.display = 'none';
        const wrap = this.closest('.hero-photo-circle, .profile-photo-wrap');
        if (wrap) {
          wrap.style.background = 'linear-gradient(135deg, #003087, #0056c7)';
          wrap.style.display = 'flex';
          wrap.style.alignItems = 'center';
          wrap.style.justifyContent = 'center';
          const icon = document.createElement('div');
          icon.innerHTML = '<span style="font-size:3rem">👤</span>';
          wrap.appendChild(icon);
        }
      }
    });
  });

  /* ── 부드러운 앵커 스크롤 ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
