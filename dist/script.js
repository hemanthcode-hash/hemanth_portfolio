const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
  document.documentElement.classList.add('motion');
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => reveals.observe(element));
}
const progress = document.querySelector('.scroll-progress');
let ticking = false;
function updateScroll() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; } }, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) document.querySelectorAll('nav a').forEach(link => {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
}
