/* ═══════════════════════════════════
   TINTO — Timeline Controller
   ═══════════════════════════════════ */
;(function () {
  'use strict'

  const progressFill = document.getElementById('progressFill')
  const scrollCue = document.getElementById('scrollCue')
  const reveals = document.querySelectorAll('.tl-reveal')
  const hero = document.querySelector('.tl-hero')

  /* ── Intersection Observer — fade in/out on snap ── */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle('tl-visible', e.isIntersecting)
      })
    },
    { threshold: 0.5 }
  )
  reveals.forEach((el) => revealObs.observe(el))

  /* ── Scroll-driven updates ── */
  let ticking = false

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(updateOnScroll)
  }

  function updateOnScroll() {
    const scrollY = window.scrollY
    const docH = document.documentElement.scrollHeight - window.innerHeight
    const progress = docH > 0 ? scrollY / docH : 0

    // Progress bar
    progressFill.style.width = (progress * 100).toFixed(1) + '%'

    // Fade scroll cue after first scroll
    if (scrollCue) {
      scrollCue.style.opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.3))
    }

    ticking = false
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  updateOnScroll()

  /* ── Swipe-down on hero to start journey ── */
  let touchStartY = 0

  hero.addEventListener(
    'touchstart',
    (e) => {
      touchStartY = e.touches[0].clientY
    },
    { passive: true }
  )

  hero.addEventListener(
    'touchend',
    (e) => {
      const deltaY = touchStartY - e.changedTouches[0].clientY
      if (deltaY > 50) {
        const firstChapter = document.querySelector('.tl-chapter')
        if (firstChapter) {
          firstChapter.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    { passive: true }
  )

  /* ── Click on scroll cue ── */
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      const firstChapter = document.querySelector('.tl-chapter')
      if (firstChapter) {
        firstChapter.scrollIntoView({ behavior: 'smooth' })
      }
    })
    scrollCue.style.cursor = 'pointer'
  }

  /* ── Parallax on hero ── */
  const heroInner = document.querySelector('.tl-hero-inner')

  function heroParallax() {
    if (!heroInner) return
    const scrollY = window.scrollY
    const heroH = hero.offsetHeight
    if (scrollY < heroH) {
      const ratio = scrollY / heroH
      heroInner.style.transform = `translateY(${ratio * 40}px)`
      heroInner.style.opacity = 1 - ratio * 0.6
    }
  }

  window.addEventListener('scroll', heroParallax, { passive: true })
})()
