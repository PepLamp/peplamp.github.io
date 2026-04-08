(() => {
  const root = document.documentElement;
  let ticking = false;
  const bgPosX = 0.75;
  const bgPosY = 0.5;
  const initialEdgeX = () => window.innerWidth * 0.67;
  const initialEdgeX2 = () => window.innerWidth * 0.80;

  let imgNatural = null;
  let edgeU = null;
  let edgeU2 = null;

  const coverMetrics = (vw, vh, iw, ih) => {
    const scale = Math.max(vw / iw, vh / ih);
    const renderedW = iw * scale;
    const renderedH = ih * scale;
    const offsetX = (vw - renderedW) * bgPosX;
    const offsetY = (vh - renderedH) * bgPosY;
    return { scale, offsetX, offsetY };
  };

  const viewportXToImageU = (x) => {
    if (!imgNatural) return null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { w: iw, h: ih } = imgNatural;
    const { scale, offsetX } = coverMetrics(vw, vh, iw, ih);
    const imgX = (x - offsetX) / scale;
    return imgX / iw;
  };

  const imageUToViewportX = (u) => {
    if (!imgNatural) return initialEdgeX();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { w: iw, h: ih } = imgNatural;
    const { scale, offsetX } = coverMetrics(vw, vh, iw, ih);
    return offsetX + u * iw * scale;
  };

  const ensureEdgeU = () => {
    if (edgeU != null && edgeU2 != null) return;
    if (edgeU == null) {
      const u = viewportXToImageU(initialEdgeX());
      edgeU = u == null ? 0.67 : u;
    }
    if (edgeU2 == null) {
      const u2 = viewportXToImageU(initialEdgeX2());
      edgeU2 = u2 == null ? 0.8 : u2;
    }
  };

  const update = () => {
    ticking = false;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const t = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    root.style.setProperty("--scroll-tint", String(t));

    ensureEdgeU();
    const baseEdgeX = imageUToViewportX(edgeU);
    const clampedEdgeX = Math.min(window.innerWidth, Math.max(0, baseEdgeX));
    const slidePx = clampedEdgeX * (1 - t);

    root.style.setProperty("--rect-w-px", `${slidePx}px`);
    root.style.setProperty("--pep-slide-px", `${slidePx}px`);

    const baseEdgeX2 = imageUToViewportX(edgeU2);
    const clampedEdgeX2 = Math.min(window.innerWidth, Math.max(0, baseEdgeX2));
    const rect2W = Math.max(0, window.innerWidth - clampedEdgeX2);
    root.style.setProperty("--rect2-w-px", `${rect2W * (1 - t)}px`);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    imgNatural = { w: img.naturalWidth || 1, h: img.naturalHeight || 1 };
    edgeU = null;
    edgeU2 = null;
    update();
  };
  img.src = "./source/background_rocks.jpg";

  update();
})();