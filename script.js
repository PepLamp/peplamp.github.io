(() => {
  const root = document.documentElement;
  let ticking = false;

  const update = () => {
    ticking = false;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const t = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    root.style.setProperty("--scroll-tint", String(t));
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();

