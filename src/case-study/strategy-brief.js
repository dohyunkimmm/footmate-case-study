/* FootMate P0-P2 strategy addendum. Keep the original nine body sections and tables intact. */
(() => {
  'use strict';
  const base = '/src/case-study/';
  const deckUrl = base + 'strategy-brief.html';
  const pptxUrl = base + 'downloads/footmate_strategy_p0_p2.pptx';
  const addendum = (id, html) => {
    const target = document.querySelector(id);
    if (target && !target.querySelector('.fm-strategy-addendum')) {
      const block = document.createElement('section');
      block.className = 'fm-strategy-addendum';
      block.setAttribute('aria-label', '전략 고도화 보완 검토');
      block.innerHTML = html;
      target.appendChild(block);
    }
  };
  if (!document.getElementById('strategy-deck')) {
    addendum('#section-02', `
      <h3>시장 진입 전략 · P0 보완</h3>
      <p class="fm-strategy-lead">수원·용인 중 공급·계약 근거를 먼저 확보하는 한 생활권에서 제한 검증합니다. 일본·미국은 공개 사업모델 비교 단계이며 해외 진출 결정은 아닙니다.</p>
      <div class="fm-strategy-cards">
        <article><strong>초기 진입</strong><p>운영자 5곳 조건 확인 → 적격 2곳 이상 검증 → 실제 공급·정원·참가 원장 대조</p></article>
        <article><strong>확대 조건</strong><p>유료 완료·30일 재참가·건당 공헌이익과 안전·정산 책임이 확인되면 재심의</p></article>
      </div>
      <p class="fm-strategy-evidence">출처: P0 GTM 검토안 · 수치와 일정은 사업 가정·제안이며 실제 영업 실적이 아닙니다.</p>
    `);
    addendum('#section-03', `
      <h3>Corporate Development · P0 보완</h3>
      <p class="fm-strategy-lead">공개자료상 조사 대상과 계약·투자 후보를 구분합니다. 현재 후보사 제휴 의향, 재무·법무 실사 및 인수 가능성은 확인되지 않았습니다.</p>
      <div class="fm-strategy-cards">
        <article><strong>Long-list · 조사 대상 8건</strong><p>경기시설·공공시설·경쟁 플랫폼을 유형별로 구분하고, 공개 정보가 증명하는 범위만 기록</p></article>
        <article><strong>우선 확인 2건 · 정식 Short-list 0건</strong><p>수원·용인 시설의 실제 운영 주체·사용권·안전·정산 조건 확인 전 협상·투자 판단 보류</p></article>
      </div>
      <p class="fm-strategy-evidence">출처: P0 후보 평가·CDD 문서 · 접촉·실사·제휴·인수 실적이 아닙니다.</p>
    `);
    addendum('#section-08', `
      <h3>전사 전략과제·투자 커뮤니케이션 · P1/P2</h3>
      <p class="fm-strategy-lead">사업 포트폴리오를 확대하기보다 검증 우선순위를 정하고, KPI·현금·위험을 경영 의사결정으로 연결합니다.</p>
      <div class="fm-strategy-cards">
        <article><strong>P1 · 포트폴리오</strong><p>제휴형 우선 실증. 직접 운영·구독·지분투자·인수는 별도 원가·계약·실사 후 심사</p></article>
        <article><strong>P1 · 성과관리</strong><p>공급·완료 예약과 건당 공헌이익을 함께 보고, 30일 재참가는 관측 완료 고객만 평가</p></article>
        <article><strong>P2 · Equity Story</strong><p>시장 문제 → 서비스 가치 → 수익성 검증 → 성장 조건 → 투자·위험 순으로 설명. 실적과 가정 분리</p></article>
      </div>
      <p class="fm-strategy-evidence">5개년 계획·8주 예산·재무 수치는 기존 보고서의 가정 그대로이며, 신규 분석이 실제 성과를 의미하지 않습니다.</p>
      <div class="fm-strategy-links" aria-label="P0부터 P2까지 전략 발표자료">
        <a href="${deckUrl}">P0–P2 보완 발표 보기 (6장)</a>
        <a href="${pptxUrl}" download="footmate_strategy_p0_p2.pptx">P0–P2 편집용 PPTX 받기</a>
      </div>
    `);
    // Addendum cards load after the original nine-section reader; restore deep links
    // after their new height is measured, including browser reload/history restores.
    const restoreSectionHash = () => {
      if (!/^#section-\d{2}$/.test(location.hash)) return;
      const target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({behavior: 'instant', block: 'start'});
    };
    if (/^#section-\d{2}$/.test(location.hash)) {
      requestAnimationFrame(() => requestAnimationFrame(restoreSectionHash));
      window.addEventListener('pageshow', () => requestAnimationFrame(restoreSectionHash));
    }
    return;
  }

  const slides = Array.isArray(window.FOOTMATE_STRATEGY_SLIDES) ? window.FOOTMATE_STRATEGY_SLIDES : [];
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
