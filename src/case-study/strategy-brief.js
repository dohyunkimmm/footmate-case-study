/* FootMate P0-P2 strategy addendum. Keep the original nine body sections and tables intact. */
(() => {
  'use strict';
  const base = '/src/case-study/';
  const deckUrl = base + 'strategy-brief.html';
  const pptxUrl = base + 'downloads/footmate_strategy_p0_p2.pptx';
  const slides = Array.isArray(window.FOOTMATE_STRATEGY_SLIDES) ? window.FOOTMATE_STRATEGY_SLIDES : [];
  // The website and editable deck use the same authored data. Do not duplicate
  // market, financial or target figures in independently maintained HTML prose.
  function attachBrief(sectionId, ids, heading, collapsed = false) {
    const target = document.querySelector(sectionId);
    if (!target || target.querySelector('.fm-strategy-addendum')) return;
    const block = document.createElement('section');
    block.className = 'fm-strategy-addendum';
    block.setAttribute('aria-label', '전략 고도화 보완 검토');
    const h3 = document.createElement('h3');
    h3.textContent = heading;
    block.appendChild(h3);
    const wrapper = document.createElement(collapsed ? 'details' : 'div');
    if (collapsed) {
      wrapper.className = 'fm-strategy-more';
      const summary = document.createElement('summary');
      summary.textContent = 'P1·P2 핵심 판단과 검증 조건 펼치기';
      wrapper.appendChild(summary);
    }
    const cards = document.createElement('div');
    cards.className = 'fm-strategy-cards';
    for (const id of ids) {
      const slide = slides.find(item => item.id === id);
      if (!slide) throw new Error('Missing strategy brief: ' + id);
      const article = document.createElement('article');
      const title = document.createElement('h4');
      title.textContent = slide.phase + ' · ' + slide.title;
      const decision = document.createElement('p');
      decision.className = 'fm-strategy-takeaway';
      decision.textContent = slide.takeaway;
      const list = document.createElement('ul');
      slide.bullets.forEach(value => {
        const item = document.createElement('li');
        item.textContent = value;
        list.appendChild(item);
      });
      const source = document.createElement('p');
      source.className = 'fm-strategy-evidence';
      source.textContent = slide.source + ' · 계획 가정/공개자료와 실측 성과 구분';
      article.append(title, decision, list, source);
      cards.appendChild(article);
    }
    wrapper.appendChild(cards);
    block.appendChild(wrapper);
    if (sectionId === '#section-08') {
      const links = document.createElement('div');
      links.className = 'fm-strategy-links';
      links.setAttribute('aria-label', 'P0부터 P2까지 전략 발표자료');
      const view = document.createElement('a');
      view.href = deckUrl;
      view.textContent = 'P0–P2 보완 발표 보기 (6장)';
      const download = document.createElement('a');
      download.href = pptxUrl;
      download.download = 'footmate_strategy_p0_p2.pptx';
      download.textContent = 'P0–P2 편집용 PPTX 받기';
      links.append(view, download);
      block.appendChild(links);
    }
    target.appendChild(block);
  }
  if (!document.getElementById('strategy-deck')) {
    attachBrief('#section-02', ['gtm'], '시장 진입 전략 · P0 보완');
    attachBrief('#section-03', ['corpdev'], 'Corporate Development · P0 보완');
    attachBrief('#section-08', ['portfolio', 'kpi', 'equity'], '전략과제·성과관리·투자 커뮤니케이션 · P1/P2', true);
    const restoreSectionHash = () => {
      if (!/^#section-\d{2}$/.test(location.hash)) return;
      const target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({behavior:'instant',block:'start'});
    };
    if (/^#section-\d{2}$/.test(location.hash)) {
      requestAnimationFrame(() => requestAnimationFrame(restoreSectionHash));
      window.addEventListener('pageshow', () => requestAnimationFrame(restoreSectionHash));
    }
    return;
  }

  const stage = document.getElementById('strategy-deck');
  const number = document.getElementById('strategy-number');
  const title = document.getElementById('strategy-current');
  const prev = document.getElementById('strategy-prev');
  const next = document.getElementById('strategy-next');
  const picker = document.getElementById('strategy-picker');
  if (!stage || !slides.length || !prev || !next || !picker) return;
  slides.forEach((slide, i) => {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = String(i + 1).padStart(2, '0') + ' · ' + slide.title;
    picker.appendChild(option);
  });
  let active = 0;
  function render(index, keepFocus = false) {
    active = Math.max(0, Math.min(index, slides.length - 1));
    const slide = slides[active];
    stage.replaceChildren();
    const article = document.createElement('article');
    article.className = 'fm-presentation-slide';
    article.setAttribute('aria-label', (active + 1) + '번째 슬라이드');
    article.innerHTML = '<p class="fm-deck-phase"></p><h2 tabindex="-1" class="fm-deck-title"></h2><p class="fm-deck-subtitle"></p><div class="fm-deck-decision"><span>핵심 판단</span><strong></strong></div><ul class="fm-deck-points"></ul><p class="fm-deck-source"></p>';
    article.querySelector('.fm-deck-phase').textContent = slide.phase;
    article.querySelector('.fm-deck-title').textContent = slide.title;
    article.querySelector('.fm-deck-subtitle').textContent = slide.subtitle;
    article.querySelector('.fm-deck-decision strong').textContent = slide.takeaway;
    article.querySelector('.fm-deck-source').textContent = slide.source + ' · 개인 전략 분석 / 미검증과 가정 구분';
    const items = article.querySelector('ul');
    slide.bullets.forEach(line => {const li = document.createElement('li'); li.textContent = line; items.appendChild(li);});
    stage.appendChild(article);
    number.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    title.textContent = slide.title;
    picker.value = String(active);
    prev.disabled = active === 0;
    next.disabled = active === slides.length - 1;
    if (keepFocus) article.querySelector('h2').focus({preventScroll: true});
  }
  prev.addEventListener('click', () => render(active - 1, true));
  next.addEventListener('click', () => render(active + 1, true));
  picker.addEventListener('change', () => render(Number(picker.value), true));
  document.addEventListener('keydown', e => {
    if (e.target.closest('input,select,button,[contenteditable]') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowLeft' && active > 0) {e.preventDefault(); render(active - 1, true);}
    if (e.key === 'ArrowRight' && active < slides.length - 1) {e.preventDefault(); render(active + 1, true);}
  });
  render(0);
})();
