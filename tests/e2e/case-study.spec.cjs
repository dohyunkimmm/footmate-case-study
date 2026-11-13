// Independent Case Study: continuous reading, desktop typography and navigation.
const {test,expect}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;
for(const width of [1920,1440,800,390,320]){
 test('continuous case study reading and typography at '+width+'px',async({page},testInfo)=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width,height:1080});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.sidebar .sb-logo')).toHaveText('FootMate');
  await expect(page.locator('.sidebar .sb-sub')).toHaveText('신사업 사업성 분석·경영계획');
  await expect(page.locator('.sidebar')).not.toContainText('Case Study');
  await expect(page.locator('.sidebar')).toHaveAttribute('aria-label','본문 목차');
  await expect(page.locator('.toc-item')).toHaveCount(9);
  await expect(page.locator('#section-01 .case-identity')).toHaveText('신사업 사업성 분석·경영계획');
  await expect(page.locator('#section-01 .case-evidence-note')).toHaveCount(0);
  await expect(page.locator('#section-08 .case-roadmap-heading')).not.toContainText('실제 성과 아님');
  await expect(page.locator('#section-01 .case-quicklinks a')).toHaveCount(0);
  await expect(page.locator('#section-04 .case-scenario-row')).toHaveCount(3);
  await expect(page.locator('.slide')).toHaveCount(9);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.cs-controls,.dot,.btn-next,.btn-prev')).toHaveCount(0);
  for(let i=0;i<9;i++){
   const link=page.locator('.toc-item').nth(i),section=page.locator('.slide').nth(i);
   await link.click();
   await expect(section.locator('.section-title')).toBeFocused();
   await expect(link).toHaveAttribute('aria-current','location');
   expect(new URL(page.url()).hash).toBe('#section-'+String(i+1).padStart(2,'0'));
   const metrics=await section.evaluate(n=>({hidden:n.hidden,overflow:n.scrollWidth>n.clientWidth+1,top:n.getBoundingClientRect().top}));
   expect(metrics.hidden).toBe(false);expect(metrics.overflow).toBe(false);if(i<8)expect(Math.abs(metrics.top)).toBeLessThan(width<=800?80:40);else await expect(section.locator('.section-title')).toBeInViewport();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   for(const table of await section.locator('.table-wrap').all())expect(await table.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
   if(width===1920){
    const typography=await section.evaluate(n=>({body:parseFloat(getComputedStyle(n).fontSize),heading:parseFloat(getComputedStyle(n.querySelector('.section-title')).fontSize),table:[...n.querySelectorAll('td')].every(td=>parseFloat(getComputedStyle(td).fontSize)>=16),width:n.clientWidth}));
    expect(typography.body).toBeGreaterThanOrEqual(17);expect(typography.heading).toBe(36);expect(typography.table).toBe(true);expect(typography.width).toBeLessThanOrEqual(1200);
    await testInfo.attach('desktop-1920-section-'+(i+1),{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
   }
   if(width===390) await testInfo.attach('mobile-390-section-'+(i+1),{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
  }
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations).toEqual([]);expect(errors).toEqual([]);
 });
}
test('KPI summary and mobile section navigation stay usable at 320 and 390px',async({page},testInfo)=>{
 for(const width of [320,390]){
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width,height:844});
  await page.goto('/');
  const kpis=page.locator('#section-01 .case-kpis');
  await expect(kpis).toBeVisible();
  for(const text of ['626','340','−38.7'])await expect(kpis).toContainText(text);
  await expect(page.locator('#section-01 .kpi-note')).toHaveCount(0);
  await expect(page.locator('.mobile-reader-nav')).toBeVisible();
  await expect(page.locator('.mobile-reader-count')).toHaveText('01 / 09');
  await testInfo.attach('manual-kpi-'+width,{body:await page.locator('#section-01').screenshot({animations:'disabled'}),contentType:'image/png'});
  await page.locator('.toc-item').nth(5).click();
  await expect(page.locator('.mobile-reader-count')).toHaveText('06 / 09');
  await expect(page.locator('.mobile-reader-name')).toHaveText('IT 투자·시스템 구조');
  await expect(page.locator('#section-06 td[data-label="구현 상태"]')).toHaveCount(5);
  await expect(page.locator('#section-06 td[data-label="후속 조건"]')).toHaveCount(5);
  await testInfo.attach('manual-section6-'+width,{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
  await page.getByRole('button',{name:'목차'}).click();
  await expect(page.locator('.toc-item').nth(5)).toBeFocused();
  await expect(page.locator('.toc-item').nth(5)).toBeInViewport();
  await testInfo.attach('manual-return-to-toc-'+width,{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
});
test('desktop KPI cards remain three columns without mobile navigation',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');
 await expect(page.locator('.mobile-reader-nav')).toBeHidden();
 await expect(page.locator('.case-kpi')).toHaveCount(3);
 const columns=await page.locator('.case-kpi').evaluateAll(nodes=>nodes.map(n=>Math.round(n.getBoundingClientRect().top)));
 expect(new Set(columns).size).toBe(1);
});
test('tables only enter Tab order when horizontally scrollable',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await expect(page.locator('.table-wrap[tabindex="0"]')).toHaveCount(0);
 await page.locator('#section-08 details').evaluateAll(nodes=>nodes.forEach(node=>node.open=true));
 await expect(page.locator('.table-wrap[tabindex="0"]')).toHaveCount(0);
 await page.setViewportSize({width:1440,height:900});
 await expect.poll(()=>page.locator('.table-wrap').evaluateAll(nodes=>nodes.every(node=>{
  const scrollable=getComputedStyle(node).overflowX!=='visible' && node.scrollWidth>node.clientWidth+1;
  return (node.tabIndex===0)===scrollable;
 }))).toBe(true);
});
test('mobile TOC stays readable while the first decision enters the opening viewport',async({page})=>{
 for(const [width,height] of [[320,740],[390,844],[800,900]]){
  await page.setViewportSize({width,height});await page.goto('/');
  const labels=page.locator('.toc-item');
  await expect(labels).toHaveCount(9);
  const layout=await page.evaluate(()=>{
   const toc=document.querySelector('.toc');
   const nodes=[...toc.querySelectorAll('.toc-item')];
   return {
    tocScrollWidth:toc.scrollWidth,tocClientWidth:toc.clientWidth,
    labelLayouts:nodes.map(n=>({top:Math.round(n.getBoundingClientRect().top),height:n.getBoundingClientRect().height,
     labelOverflow:n.querySelector('.toc-t').scrollWidth-n.querySelector('.toc-t').clientWidth})),
    firstDecisionTop:document.querySelector('#section-01 .case-verdict').getBoundingClientRect().top,
    documentOverflow:document.documentElement.scrollWidth>innerWidth+1
   };
  });
  expect(new Set(layout.labelLayouts.map(x=>x.top)).size).toBe(1);
  expect(layout.tocScrollWidth).toBeGreaterThan(layout.tocClientWidth+1);
  expect(layout.labelLayouts.every(x=>x.height>=44&&x.labelOverflow<=1)).toBe(true);
  expect(layout.firstDecisionTop).toBeLessThan(height);
  expect(layout.documentOverflow).toBe(false);
  await labels.last().click();
  await expect(labels.last()).toHaveAttribute('aria-current','location');
  await expect(page.locator('#section-09 .section-title')).toBeInViewport();
 }
});
test('last section stays readable without forced desktop height',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const [width,height] of [[1440,900],[1920,1080]]){
  await page.setViewportSize({width,height});await page.goto('/');
  await page.locator('.toc-item').nth(8).click();
  await expect(page.locator('.toc-item').nth(8)).toHaveAttribute('aria-current','location');
  const section=page.locator('#section-09');
  const sectionHeight=await section.evaluate(el=>el.getBoundingClientRect().height);
  expect(sectionHeight).toBeLessThan(height);
  await expect(section.locator('.section-title')).toBeInViewport();
 }
});

test('05 and 08 keep one representative table visible and preserve expandable evidence',async({page})=>{
  for (const width of [390,1440]) {
    await page.setViewportSize({width,height:900}); await page.goto('/');
    const finance=page.locator('#section-05'),plan=page.locator('#section-08');
    await expect(finance.locator('table')).toHaveCount(7);
    await expect(plan.locator('table')).toHaveCount(12);
    const sensitivity=finance.locator('details').filter({has:page.getByText('월 손익 민감도·직접 운영 기준',{exact:true})});
    await expect(sensitivity.locator('table').first()).toBeHidden();
    await sensitivity.locator('summary').click();
    await expect(sensitivity.locator('table').first()).toBeVisible();
    const report=plan.locator('details').filter({has:page.getByText('월간 경영보고 예시 · KPI·손익 비교',{exact:true})});
    await expect(report.locator('table')).toHaveCount(2);
    await report.locator('summary').click();
    await expect(report.locator('table').first()).toBeVisible();
    await expect(plan).toContainText('기본 현금 예산 461만원');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
});
test('recruiter scanning: 01 ownership, 03 options, 06 evidence remain concise and expandable',async({page})=>{
  for (const width of [320,390,1440]) {
    await page.setViewportSize({width,height:900}); await page.goto('/');
    await expect(page.locator('#section-01 .case-kpi')).toHaveCount(3);
    const options=page.locator('#section-03');
    await expect(options).toContainText('운영자 제휴형으로 시작');
    await expect(options.locator('details')).toHaveCount(3);
    await expect(options.locator('table')).toHaveCount(4);
    await expect(options.getByText('세 가지 사업모델 비교',{exact:true})).toBeVisible();
    const first=options.locator('details').first();
    await expect(first.locator('table')).toBeHidden();
    await first.locator('summary').click();
    await expect(first.locator('table')).toBeVisible();
    const it=page.locator('#section-06');
    await expect(it.locator('.decision-card')).toHaveCount(3);
    await expect(it.locator('table')).toHaveCount(4);
    await expect(it).toContainText('결제·정산');
    await expect(page.locator('.track table')).toHaveCount(31);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
});
test('reader summary, detailed numbers and optional tables remain consistent',async({page})=>{
  await page.setViewportSize({width:390,height:844}); await page.goto('/');
  await expect(page.locator('#section-01 .case-kpi').nth(2)).toContainText('약 −38.7');
  await expect(page.locator('#section-05 .reader-summary')).toContainText('28곳');
  await expect(page.locator('#section-05 .reader-summary')).toContainText('수수료 12%, 결제비 0%');
  await expect(page.locator('#section-08 .reader-summary')).toContainText('461만원');
  await expect(page.locator('#section-08 .reader-summary')).toContainText('831만원');
  await expect(page.locator('.track table')).toHaveCount(31);
  const detail=page.locator('#section-05 details').filter({has:page.getByText('제휴 손익과 협상 근거',{exact:true})});
  await expect(detail.locator('table').first()).toBeHidden();
  await detail.locator('summary').click();
  await expect(detail.locator('table').first()).toBeVisible();
  await expect(page.locator('#section-05')).toContainText('−387,160원');
  await page.goto('/src/case-study/forecast.html');
  await expect(page.locator('#expansion')).toContainText('28곳');
});
test('scroll position, deep links and browser history work without page switching',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1920,height:1080});
 await page.goto('/#section-04');await expect(page.locator('.toc-item').nth(3)).toHaveAttribute('aria-current','location');
 await page.locator('.toc-item').nth(5).click();await page.goBack();await expect(page.locator('.toc-item').nth(3)).toHaveAttribute('aria-current','location');
 await page.reload();await expect(page.locator('.toc-item').nth(3)).toHaveAttribute('aria-current','location');
 await page.locator('#section-08').evaluate(n=>n.scrollIntoView());await expect(page.locator('.toc-item').nth(7)).toHaveAttribute('aria-current','location');
 await expect(page.locator('.slide[hidden]')).toHaveCount(0);
});
test('case study distinguishes implementation evidence from proposed business results',async({page})=>{
  await page.goto('/');
  await expect(page.locator('#section-01 .case-kpis')).toContainText('626');
  await expect(page.locator('#section-01 .case-kpis')).toContainText('340');
  await expect(page.locator('#section-01 .case-next-decision')).toContainText('기본 현금 예산 461만원');
  await expect(page.locator('#section-05')).toContainText('기회비용 포함');
  await expect(page.locator('#section-06 .decision-card')).toHaveCount(3);
  await expect(page.locator('#section-06')).toContainText('가상 데이터');
  await expect(page.locator('#section-08')).toContainText('30일 추적 완료');
  await expect(page.locator('#section-09')).toContainText('건당 공헌이익·플랫폼 예약 비중·재참가');
  await expect(page.locator('.track')).not.toContainText('실제 확정 매출');
  await expect(page.locator('a[href*="github.com"]')).toHaveCount(0);
});
test('200 percent text retains the full report without horizontal page overflow',async({page})=>{
 await page.setViewportSize({width:1920,height:1080});await page.goto('/');
 await page.addStyleTag({content:'.slide,.slide p,.slide th,.slide td{font-size:34px!important;line-height:1.85!important}'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await expect(page.locator('.slide[hidden]')).toHaveCount(0);
});

test('continuous reader restores back navigation after a legacy manual-scroll session',async({page})=>{
 await page.addInitScript(()=>{history.scrollRestoration='manual';});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:1920,height:1080});
 await page.goto('/');
 expect(await page.evaluate(()=>history.scrollRestoration)).toBe('auto');
 await page.locator('.toc-item').nth(0).click();
 await page.locator('.toc-item').nth(8).click();
 await expect(page.locator('.toc-item').nth(8)).toHaveAttribute('aria-current','location');
 await page.goBack();
 await expect(page).toHaveURL(/#section-01$/);
 await expect(page.locator('.toc-item').nth(0)).toHaveAttribute('aria-current','location');
 expect(await page.locator('#section-01').evaluate(n=>Math.abs(n.getBoundingClientRect().top))).toBeLessThan(40);
});

test('normal-motion back and forward restore the section heading and keyboard focus',async({page})=>{
 await page.setViewportSize({width:1920,height:1080});
 await page.goto('/');
 await page.locator('.toc-item').nth(0).click();
 await page.locator('.toc-item').nth(8).click();
 await expect(page.locator('.toc-item').nth(8)).toHaveAttribute('aria-current','location');
 await page.goBack();
 await expect(page.locator('#section-01 .section-title')).toBeFocused();
 await expect(page.locator('.toc-item').nth(0)).toHaveAttribute('aria-current','location');
 await expect.poll(()=>page.locator('#section-01').evaluate(n=>Math.abs(n.getBoundingClientRect().top))).toBeLessThan(40);
 await page.goForward();
 await expect(page.locator('#section-09 .section-title')).toBeFocused();
 await expect(page.locator('.toc-item').nth(8)).toHaveAttribute('aria-current','location');
 await expect(page.locator('#section-09 .section-title')).toBeInViewport();
});


test('expansion assumptions include added cost and supply loss without changing the base ledger',async({page},testInfo)=>{
 await page.goto('/src/case-study/forecast.html#expansion');
 const base=await page.locator('#kpis').innerText(),ledger=await page.locator('#monthly').innerText();
 const result=page.locator('#expansion-result');
 await expect(result).toContainText('2,880건');await expect(result).toContainText('-432,800원');await expect(result).toContainText('28곳');
 await page.locator('#expansion-cost').fill('0');await expect(result).toContainText('107,200원');await expect(result).toContainText('23곳');
 await page.locator('#expansion-reset').click();
 await page.locator('#expansion-retention').fill('80');await expect(result).toContainText('-974,240원');
 await page.locator('#expansion-share').fill('48');await expect(result).toContainText('1,843건');await expect(result).toContainText('-1,407,580원');
 await page.locator('#expansion-retention').fill('0');await expect(result).toContainText('500곳 이내 미달');
 await page.locator('#expansion-reset').click();await page.locator('#expansion-partners').fill('28');await expect(result).toContainText('5,640원');
 await page.locator('#expansion-partners').fill('');await expect(result).toHaveText('입력 범위를 확인하세요.');
 await page.locator('#expansion-partners').fill('23.5');await expect(result).toHaveText('입력 범위를 확인하세요.');
 await page.locator('#expansion-reset').click();
 expect(await page.locator('#kpis').innerText()).toBe(base);expect(await page.locator('#monthly').innerText()).toBe(ledger);
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:1080});await page.locator('#expansion').scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await testInfo.attach('expansion-'+width,{body:await page.locator('#expansion').screenshot({animations:'disabled'}),contentType:'image/png'});
 }
 const scan=await new AxeBuilder({page}).include('#expansion').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations).toEqual([]);
});

test('investment evidence exposes budget scope and separates missing data from unmet targets',async({page})=>{
  await page.goto('/#section-08');
  const investment=page.locator('#section-08');
  await expect(investment).toContainText('기본 현금 예산 461만원');
  await expect(investment).toContainText('기회비용 포함 831만원');
  const budget=investment.locator('details').filter({has:page.getByText('8주 예산과 투자 심사 지표',{exact:true})});
  await budget.locator('summary').click();
  await expect(budget).toContainText('8,310,000원');
  const metric=investment.locator('details').filter({has:page.getByText('측정 방법과 현장 검증 판단',{exact:true})});
  await metric.locator('summary').click();
  await expect(metric).toContainText('30일');
  for (const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
});
test('implementation decisions stay readable inside the case study',async({page})=>{
  await page.goto('/#section-06');
  const it=page.locator('#section-06');
  await expect(it.locator('.decision-card')).toHaveCount(3);
  const evidence=it.locator('details').filter({has:page.getByText('기능별 확인 결과',{exact:true})});
  await evidence.locator('summary').click();
  const table=evidence.locator('.table-wrap[aria-label="구현·검증 요약"]');
  await expect(table).toBeVisible();
  await expect(table).toContainText('결제·정산');
  const reasoning=it.locator('details').filter({has:page.getByText('참가·정원 관리의 설계 이유',{exact:true})});
  await reasoning.locator('summary').click();
  await expect(reasoning).toContainText('잔여 자리');
  for (const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});
    expect(await it.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
  }
});
test('removed ledger ZIP stays unpublished while PPT and Excel remain available',async({request})=>{
 const material=await request.get('/src/case-study/materials.html');expect(material.ok()).toBe(true);const html=await material.text();
 expect(html).not.toContain('footmate_materials.zip');expect(html).not.toContain('원장·가정 포함 전체 자료 ZIP');
 expect(html).not.toContain('downloads/footmate_report.pptx');expect(html).not.toContain('downloads/footmate_model.xlsx');
 const removed=await request.get('/src/case-study/downloads/footmate_materials.zip');
 expect(removed.headers()['content-type']||'').not.toMatch(/zip/i);
 expect((await removed.body()).subarray(0,4).toString('hex')).not.toBe('504b0304');
});


test('single resource section, inline financial model and PPT viewer',async({page})=>{
  for (const width of [320,390,1440]) {
    await page.setViewportSize({width,height:900}); await page.goto('/');
    const materials=page.locator('#attachments');
    await expect(materials.getByRole('heading',{name:'발표자료'})).toBeVisible();
    await expect(materials.locator('.case-deck-card')).toHaveCount(2);
    await expect(materials.locator('a[download$=".pptx"]')).toHaveCount(2);
    await expect(materials.getByRole('link',{name:'사업성 검토 발표 보기'})).toHaveAttribute('href',/materials\.html\?preview=1&mode=slides/);
    await expect(materials.getByRole('link',{name:'5개년 성장 전략 발표 보기'})).toHaveAttribute('href',/deck=strategy/);
    const model=page.locator('#case-profit-model');
    await expect(model.locator('#case-profit-economic')).toHaveText('+5,640원');
    await expect(model.locator('#case-profit-bep')).toHaveText('28곳');
    await model.getByRole('button',{name:'기준 10% · 3%'}).click();
    await expect(model.locator('#case-profit-economic')).toHaveText('-2,097,960원');
    await model.getByRole('button',{name:'초기화'}).click();
    await expect(model.locator('#case-profit-economic')).toHaveText('+5,640원');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
  await page.goto('/src/case-study/materials.html?preview=1&mode=slides');
  await expect(page.locator('#page')).toHaveText('01 / 09');
  await page.getByRole('button',{name:'다음 슬라이드'}).click();
  await expect(page.locator('#page')).toHaveText('02 / 09');
});
test('decision story, economic comparison and roadmap have consistent visual evidence',async({page})=>{
  for (const width of [320,390,1440]) {
    await page.setViewportSize({width,height:900}); await page.goto('/');
    const item=page.locator('#section-05 details').filter({has:page.getByText('협상안 산정 조건과 건당 공헌이익',{exact:true})});
    await item.locator('summary').click();
    const chart=item.locator('.case-economics-chart');
    await expect(chart).toBeVisible();
    await expect(chart.locator('.case-economics-row')).toHaveCount(4);
    await expect(chart.locator('.case-economics-value')).toHaveText(['340원','580원','700원','940원']);
    const widths=await chart.locator('.case-economics-track>span').evaluateAll(nodes=>nodes.map(n=>n.style.width));
    expect(widths).toEqual(['36.2%','61.7%','74.5%','100%']);
    const roadmap=page.locator('#section-08 .case-roadmap');
    await expect(roadmap).toContainText('8주');
    await expect(page.locator('#section-01 .case-next-decision')).toContainText('8주 현장 검증');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
});
test('scenario hierarchy, input guidance and responsive readability evidence',async({page})=>{
  for(const width of [320,390,800,1440]){
    await page.setViewportSize({width,height:900}); await page.goto('/');
    await expect(page.locator('#section-01 .case-scenario-note')).toContainText('제휴 5곳');
    await expect(page.locator('#section-05 .reader-summary')).toContainText('수수료 12%, 결제비 0%');
    await expect(page.locator('#section-08 .case-decision-points')).toContainText('기본 현금 예산 461만원');
    await expect(page.locator('#section-08 .case-decision-points')).toContainText('30일');
    const model=page.locator('#case-profit-model');
    await expect(model.locator('#case-profit-economic')).toHaveText('+5,640원');
    await model.locator('#case-profit-rate').fill('101');
    await expect(model.locator('#case-profit-error')).toBeVisible();
    await expect(model.locator('#case-profit-rate')).toHaveAttribute('aria-invalid','true');
    await model.getByRole('button',{name:'초기화'}).click();
    await expect(model.locator('#case-profit-error')).toBeHidden();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
});
test('supporting resource pages omit duplicate labels but retain scenario disclosures',async({page})=>{
  await page.goto('/src/case-study/materials.html');
  await expect(page.locator('main > h1')).toHaveText('FootMate 사업성 검토');
  await expect(page.locator('a.back')).toHaveText('본문으로');
  await expect(page.locator('main')).toContainText('2027년 손익 시나리오');
  await expect(page.locator('main')).toContainText('가상');
  await expect(page.locator('main')).not.toContainText('본편 9장 · 5개년 전략 보완자료 6장');
  await page.goto('/src/case-study/forecast.html');
  await expect(page.locator('main')).toContainText('2027년 월별 계획과 가상 거래');
  await expect(page.locator('main')).toContainText('실제 수요와 제휴 계약');
});
test('reader-facing copy avoids accidental adjacent repetition',async({page})=>{
 await page.goto('/');
 const texts=await page.locator('.slide p,.slide h2,.slide h3,.slide caption,.slide summary,.slide dt,.slide dd').evaluateAll(nodes=>nodes.map(node=>node.textContent.replace(/\s+/g,' ').trim()));
 for(const value of texts){
  expect(value).not.toMatch(/(?:^|\s)([가-힣A-Za-z0-9]{2,})\s+\1(?=$|\s|[.,!?])/u);
 }
 await expect(page.locator('#section-08')).not.toContainText('30일 30일');
 await expect(page.locator('#section-08')).not.toContainText('목표 · 충원 75% / 재참가 30%. 8주 후');
 await expect(page.locator('#section-08')).toContainText('8주 후 현금 지출·약정 금액·남은 과제 보고');
 await expect(page.locator('#section-07 .flow-branches')).not.toContainText('참가·잔여 자리 동시 갱신. 반복 요청은 기존 결과 반환.');
 await expect(page.locator('.track')).not.toContainText('시간 기회비용');
 await expect(page.locator('.track')).not.toContainText('창업자 시간 기회비용');
 await expect(page.locator('#section-05 .case-profit-results')).toContainText('기회비용 포함');
});


test('restricted fullscreen enlarges the current slide inline on first click',async({page})=>{
  await page.addInitScript(()=>{
    Object.defineProperty(document,'fullscreenEnabled',{configurable:true,value:false});
  });
  for(const width of [320,390]){
    await page.setViewportSize({width,height:844});
    await page.goto('/src/case-study/materials.html?preview=1&mode=slides');
    await expect(page.locator('#page')).toHaveText('01 / 09');
    await page.getByRole('button',{name:'슬라이드 이미지 확대'}).click();
    await expect(page.locator('.viewer')).toHaveClass(/inline-zoom/);
    await page.getByRole('button',{name:'슬라이드 이미지 축소'}).click();
    await expect(page.locator('.viewer')).not.toHaveClass(/inline-zoom/);
    await expect(page.locator('#slideProgressTrack')).toHaveAttribute('aria-valuemax','9');
  }
});
test('PPT preview closes explicitly and the contents control section navigation',async({page})=>{
  for(const width of [320,390,800,1440]){
    await page.setViewportSize({width,height:900});await page.goto('/');
    const materials=page.locator('#attachments');
    await expect(materials.locator('.case-deck-card')).toHaveCount(2);
    await expect(materials.locator('.case-ppt-frame,.case-report-preview')).toHaveCount(0);
    const report=materials.getByRole('link',{name:'사업성 검토 발표 보기'});
    const strategy=materials.getByRole('link',{name:'5개년 성장 전략 발표 보기'});
    await expect(report).toHaveAttribute('target','_blank');
    await expect(strategy).toHaveAttribute('target','_blank');
    await expect(report).toHaveAttribute('href',/mode=slides/);
    await expect(strategy).toHaveAttribute('href',/deck=strategy/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
  await page.goto('/src/case-study/materials.html?preview=1&mode=slides');
  await page.getByRole('button',{name:'다음 슬라이드'}).click();
  await expect(page.locator('#page')).toHaveText('02 / 09');
  await page.getByRole('button',{name:'이전 슬라이드'}).click();
  await expect(page.locator('#page')).toHaveText('01 / 09');
});
test('cross-engine case study navigation and preview controls',async({page})=>{
  test.setTimeout(120000);
  const {firefox,webkit,devices}=require('@playwright/test');
  await page.goto('/');
  const site=new URL('/',page.url()).href;
  for(const [name,engine] of [['firefox',firefox],['webkit',webkit]]){
    const browser=await engine.launch({env:{...process.env,HOME:'/root'},args:[]});
    try {
      const ctx=await browser.newContext(name==='webkit'
        ? {...devices['iPhone 13'],viewport:{width:390,height:844},reducedMotion:'reduce'}
        : {viewport:{width:390,height:844},reducedMotion:'reduce'});
      try {
        const current=await ctx.newPage(),errors=[];
        current.on('pageerror',err=>errors.push(err.message));
        for(const width of [320,390,800]){
          await current.setViewportSize({width,height:844});
          await current.goto(site);
          await expect(current.locator('.slide')).toHaveCount(9);
          await current.locator('.toc-item').nth(2).click();
          await expect(current).toHaveURL(/#section-03$/);
          await expect(current.locator('#attachments .case-deck-card')).toHaveCount(2);
          await expect(current.locator('#case-profit-economic')).toHaveText('+5,640원');
          expect(await current.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' '+width).toBe(true);
        }
        expect(errors).toEqual([]);
      } finally {await ctx.close();}
    } finally {await browser.close();}
  }
});
test('Rolling Forecast copy, sections and dedicated slide are absent in all materials',async({page})=>{
 const forbidden=/Rolling\s*Forecast|수정\s?전망|재예측|분기\s?전망/i;
 for(const path of ['/','/src/case-study/materials.html','/src/case-study/forecast.html','/src/case-study/decision-memos.html']){
  await page.goto(path);
  await expect(page.locator('body')).not.toContainText(forbidden);
 }
 await page.goto('/src/case-study/materials.html?preview=1');
 await expect(page.locator('#page')).toHaveText('01 / 09');
 await expect(page.locator('#rolling-management,#rolling-kpis,#annual')).toHaveCount(0);
 await expect(page.locator('#slideProgressTrack')).toHaveAttribute('aria-valuemax','9');
 const fs=require('node:fs');
 for(const path of ['src/case-study/nine-sections.js','src/case-study/materials.html','src/case-study/forecast.html','README.md']){
  expect(fs.readFileSync(path,'utf8'),path).not.toMatch(forbidden);
 }
 const previews=fs.readFileSync('src/case-study/report-previews.js','utf8');
 const slides=JSON.parse(previews.replace(/^window\.REPORT_SLIDES=/,'').trim().replace(/;$/,''));
 expect(slides).toHaveLength(9);
 for(const slide of slides)expect(slide.title).not.toMatch(forbidden);
 const {spawnSync}=require('node:child_process');
 const audit=spawnSync('python3',['-c',String.raw`
from zipfile import ZipFile
from xml.etree import ElementTree as ET
import re
for file,count in [('src/case-study/downloads/footmate_report.pptx',9),('src/case-study/downloads/footmate_5year_strategy.pptx',6)]:
    with ZipFile(file) as z:
        slides=[x for x in z.namelist() if re.fullmatch(r'ppt/slides/slide[0-9]+\.xml',x)]
        assert len(slides)==count,(file,len(slides))
        text=' '.join(node.text or '' for name in slides for node in ET.fromstring(z.read(name)).iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t'))
        assert not re.search(r'Rolling\s*Forecast|수정\s?전망|재예측|분기\s?전망',text,re.I),(file,text)
`],{encoding:'utf8',timeout:10000});
 expect(audit.status,audit.stderr).toBe(0);
});

test('six-slide strategy PPT has its own lazy-loaded preview',async({page})=>{
  await page.goto('/');
  const links=page.locator('#attachments .case-deck-card');
  await expect(links).toHaveCount(2);
  await expect(links.nth(1)).toContainText('5개년 성장 전략');
  await expect(links.nth(1).getByRole('link',{name:'5개년 성장 전략 발표 보기'})).toHaveAttribute('href',/deck=strategy/);
  await expect(links.nth(1).locator('a[download]')).toHaveAttribute('download','footmate_5year_strategy.pptx');
  await page.goto('/src/case-study/materials.html?preview=1&mode=slides&deck=strategy');
  await expect(page.locator('#page')).toHaveText('01 / 06');
  await expect(page.locator('#slideProgressTrack')).toHaveAttribute('aria-valuemax','6');
  await expect(page.locator('#slide')).toBeVisible();
  await page.getByRole('button',{name:'다음 슬라이드'}).click();
  await expect(page.locator('#page')).toHaveText('02 / 06');
  await expect(page.locator('#slideTitle')).not.toBeEmpty();
  await page.locator('#slide-picker').selectOption('5');
  await expect(page.locator('#page')).toHaveText('06 / 06');
  await expect(page.getByRole('button',{name:'다음 슬라이드'})).toBeDisabled();
});
test('tables retain continuous rows, compact cells and readable layouts across viewports',async({page},testInfo)=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await page.locator('details:not(.case-doc-preview)').evaluateAll(nodes=>nodes.forEach(el=>{el.open=true;}));
  const audit=await page.locator('.slide .table-wrap').evaluateAll(wraps=>wraps.map((wrap,index)=>{
   const table=wrap.querySelector('table');
   if(!table)return null;
   const box=wrap.getBoundingClientRect();
   if(box.width===0||box.height===0)return null;
   const rows=[...table.querySelectorAll('tbody tr')];
   const gaps=rows.slice(1).map((row,i)=>row.getBoundingClientRect().top-rows[i].getBoundingClientRect().bottom);
   const cells=[...table.querySelectorAll('tbody th,tbody td')];
   return {
    index,caption:table.querySelector('caption')?.textContent?.trim()||'',
    layout:getComputedStyle(table).tableLayout,
    horizontalOverflow:Math.max(0,wrap.scrollWidth-wrap.clientWidth),
    maxRowGap:gaps.length?Math.max(...gaps):0,
    emptyCells:cells.filter(el=>!el.textContent?.trim()).length,
    clippedCells:cells.filter(el=>el.scrollHeight>el.clientHeight+2&&getComputedStyle(el).overflowY!=='visible').length
   };
  }).filter(Boolean));
  expect(audit.length,'tables at '+width+'px').toBeGreaterThanOrEqual(20);
  for(const entry of audit){
   expect(entry.layout,'automatic table columns: '+entry.caption+' @'+width).toBe('auto');
   expect(entry.emptyCells,'empty cell: '+entry.caption+' @'+width).toBe(0);
   expect(entry.clippedCells,'clipped text: '+entry.caption+' @'+width).toBe(0);
   if(width<=800)expect(entry.maxRowGap,'white row gaps: '+entry.caption+' @'+width).toBeLessThanOrEqual(1);
  }
  const rootOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(rootOverflow,'horizontal page overflow @'+width).toBeLessThanOrEqual(1);
  const report=page.locator('#section-07 .table-wrap').first();
  await report.scrollIntoViewIfNeeded();
  if(width===390||width===1440)await testInfo.attach('table-qa-'+width,{body:await report.screenshot({animations:'disabled'}),contentType:'image/png'});
 }
});

test('case study download contents and static performance budgets',async({page})=>{
 const fs=require('node:fs');
 const {spawnSync}=require('node:child_process');
 const sizes=[
  ['src/case-study/downloads/footmate_report.pptx',2_000_000],
  ['src/case-study/downloads/footmate_model.xlsx',1_000_000],
  ['src/case-study/nine-sections.js',200_000],
  ['src/case-study/nine-sections.css',100_000]
 ];
 for(const [file,budget] of sizes)expect(fs.statSync(file).size,file+' static byte budget').toBeLessThan(budget);
 const audit=spawnSync('python3',['-c',String.raw`
from pathlib import Path
from zipfile import ZipFile
import re,xml.etree.ElementTree as ET
root=Path('src/case-study/downloads')
pptx=root/'footmate_report.pptx'
xlsx=root/'footmate_model.xlsx'
with ZipFile(pptx) as p:
    paths=set(p.namelist())
    slides=sorted(x for x in paths if re.fullmatch(r'ppt/slides/slide[0-9]+\.xml',x))
    assert len(slides)==9, 'PPTX slide count: '+str(len(slides))
    pres=ET.fromstring(p.read('ppt/presentation.xml'))
    assert len(pres.findall('.//{http://schemas.openxmlformats.org/presentationml/2006/main}sldId'))==9
    for name in slides:
        node=ET.fromstring(p.read(name))
        shapes=node.findall('.//{http://schemas.openxmlformats.org/presentationml/2006/main}sp')
        images=node.findall('.//{http://schemas.openxmlformats.org/presentationml/2006/main}pic')
        assert shapes or images, 'empty PPT slide: '+name
with ZipFile(xlsx) as x:
    paths=set(x.namelist())
    workbook=ET.fromstring(x.read('xl/workbook.xml'))
    ns='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
    sheets=workbook.findall('.//'+ns+'sheet')
    assert len(sheets)>=1, 'no Excel worksheets'
    parts=[n for n in paths if re.fullmatch(r'xl/worksheets/sheet[0-9]+\.xml',n)]
    assert len(parts)>=len(sheets),'missing Excel sheet parts'
    formulas=0
    errors=[]
    for n in parts:
        node=ET.fromstring(x.read(n))
        formulas+=len(node.findall('.//'+ns+'f'))
        errors.extend(c.attrib.get('r') for c in node.findall('.//'+ns+'c') if c.attrib.get('t')=='e')
    assert formulas>0, 'Excel file has no formulas'
    assert not errors, 'Excel cached error values: '+str(errors[:10])
    print('PASS: 9 PPT slides, '+str(len(sheets))+' Excel sheets, '+str(formulas)+' formulas, zero cached errors')
`],{encoding:'utf8',timeout:25000});
 expect(audit.status,audit.stderr+' '+audit.stdout).toBe(0);
 await page.goto('/');
 const entries=await page.evaluate(()=>{
  const n=performance.getEntriesByType('navigation')[0];
  return {dom:n?Math.round(n.domContentLoadedEventEnd-n.startTime):-1,load:n?Math.round(n.loadEventEnd-n.startTime):-1};
 });
 expect(entries.dom).toBeGreaterThanOrEqual(0);
 expect(entries.load).toBeGreaterThanOrEqual(0);
 expect(entries.load).toBeLessThan(15000);
 console.log('Case Study local browser navigation (ms):',JSON.stringify(entries));
});

test('body card descriptions stay concise',async({page})=>{
 await page.goto('/');
 const descriptions=await page.locator('.story-card p,.decision-card>p:last-child').allTextContents();
 expect(descriptions).toHaveLength(12);
 for(const description of descriptions){
  expect([...description.trim()].length,description).toBeLessThanOrEqual(40);
 }
});
test('all supporting prose stays concise outside page titles and descriptions',async({page})=>{
  await page.goto('/');
  const data=await page.locator('.slide p:not(.lead):not(.formula),.slide h2,.slide h3,.slide summary').evaluateAll(nodes=>
    nodes.map(n=>({text:n.textContent.replace(/\s+/g,' ').trim(),tag:n.tagName.toLowerCase()})).filter(n=>n.text)
  );
  for(const item of data){
    expect([...item.text].length,item.tag+': '+item.text).toBeLessThanOrEqual(item.tag==='p'?85:70);
  }
  await expect(page.locator('#section-02')).toContainText('시장·경쟁은 공개 자료로 분석하고');
  await expect(page.locator('#section-03')).toContainText('운영자 제휴형으로 시작하고');
  await expect(page.locator('#section-05')).toContainText('현금 1,765건 / 기회비용 포함 7,648건');
  await expect(page.locator('#section-08')).toContainText('2027년 상반기 가상 데이터');
});
test('case-study body copy stays concise and terminology stays consistent',async({page})=>{
  await page.goto('/');
  const paragraphs=await page.locator('.track p:not(.lead)').evaluateAll(nodes=>nodes.map(n=>n.textContent.trim()).filter(Boolean));
  expect(paragraphs.filter(text=>[...text].length>85)).toEqual([]);
  for(const phrase of [
    '시장·경쟁은 공개 자료로 분석하고, 지불 의향은 면담·가격 실험으로 검증합니다.',
    '수수료 매출 차이 − 취소·노쇼 비용 − 완료 건 비용 − 고정비 차이',
    '기본 현금 예산 461만원',
    '기회비용 포함 831만원'
  ])await expect(page.locator('.track')).toContainText(phrase);
  for(const url of ['/src/case-study/materials.html','/src/case-study/forecast.html','/src/case-study/decision-memos.html']){
    await page.goto(url);
    await expect(page.locator('body')).not.toContainText('무단 불참');
    await expect(page.locator('body')).not.toContainText('획득비');
  }
  await page.goto('/src/case-study/forecast.html');
  await expect(page.locator('body')).toContainText('실제 수요와 제휴 계약');
});
test('ROI analysis in section 05 stays clear, accessible and numerically consistent',async({page},testInfo)=>{
  await page.goto('/');
  const roi=page.locator('#roi-analysis');
  await expect(page.locator('#section-05 .roi-jump')).toHaveCount(0);
  await expect(roi).toBeVisible();
  await expect(roi.locator('.roi-section-label')).toHaveText('본문 05 · 손익 검토');
  await expect(roi.locator('#roi-projection-heading')).toHaveText('12개월 비용 대비 예상 손익률');
  await expect(roi.locator('.roi-highlights dd')).toHaveText(['12개월','−47.5%','−11.4%']);
  await expect(roi.locator('.roi-coverage-row')).toHaveCount(4);
  await expect(roi.locator('.roi-coverage-value')).toHaveText(['10.3%','52.5%','88.6%','85.4%']);
  await expect(roi).not.toContainText('ROI 음수');
  await expect(roi).not.toContainText('12개월 운영 예상 조건에 따른 수익성 분석');
  await expect(roi).not.toContainText('실제 실적 아님');
  await expect(roi).not.toContainText('첫해 비용 회수에는 조건 개선이 필요합니다.');
  await expect(roi).toContainText('100% = 총현금비용 충당 기준');
  const details=roi.locator('.roi-financial-details');
  await expect(details).not.toHaveAttribute('open','');
  await details.locator('summary').click();
  await expect(roi.locator('table tbody tr')).toHaveCount(4);
  await expect(roi.locator('table tbody tr').nth(1)).toContainText('−8,145,920원');
  await expect(roi.locator('table tbody tr').nth(1)).toContainText('−47.5%');
  const widths=await roi.locator('.roi-coverage-track>span').evaluateAll(nodes=>nodes.map(x=>parseFloat(x.style.width)));
  expect(widths).toEqual([10.3,52.5,88.6,85.4]);
  for(const width of [320,390,800,1440]){
    await page.setViewportSize({width,height:900});
    await page.goto('/#roi-analysis');
    await expect(page.locator('#roi-analysis')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),String(width)).toBe(true);
    const box=await roi.evaluate(el=>{
      const edge=el.getBoundingClientRect().right;
      const overflow=[...el.querySelectorAll('*')].map(node=>({
        tag:node.tagName.toLowerCase(),cls:String(node.className).slice(0,80),
        right:Math.round(node.getBoundingClientRect().right-edge),
        width:Math.round(node.getBoundingClientRect().width)
      })).filter(x=>x.right>1).sort((a,b)=>b.right-a.right).slice(0,8);
      return {scroll:el.scrollWidth,client:el.clientWidth,overflow};
    });
    expect(box.scroll,JSON.stringify({width,...box})).toBeLessThanOrEqual(box.client+1);
    if(width===390||width===1440)await testInfo.attach('roi-review-'+width,{body:await roi.screenshot({animations:'disabled'}),contentType:'image/png'});
  }
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const scan=await new AxeBuilder({page}).include('#roi-analysis').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(scan.violations).toEqual([]);
  await page.goto('/src/case-study/materials.html?preview=1&slide=7');
  await expect(page.locator('#page')).toHaveText('08 / 09');
  await expect(page.locator('#slideTitle')).toHaveText('12개월 비용 대비 예상 손익률');
  await expect(page.locator('#slideSummary')).toContainText('비용 회수율 비교');
});


test('final Case Study decision and presentation conclusion stay aligned',async({page})=>{
  await page.goto('/');
  await expect(page.locator('#section-09')).toContainText('건당 공헌이익·플랫폼 예약 비중·재참가 확인.');
  await expect(page.locator('#section-09')).toContainText('취소·고객지원비 반영 손익');
  await expect(page.locator('#section-09 .story-card')).toHaveCount(3);
  await page.goto('/src/case-study/materials.html?preview=1&mode=slides');
  await page.locator('#slide-picker').selectOption('8');
  await expect(page.locator('#page')).toHaveText('09 / 09');
  await expect(page.locator('#slideTitle')).toHaveText('최종 판단 · 단계적 투자');
  await expect(page.locator('#slide-keypoint')).not.toBeEmpty();
  await expect(page.locator('#slideProgressTrack')).toHaveAttribute('aria-valuenow','9');
});
test('decision-led portfolio keeps assumptions, mobile layout and slide navigation usable',async({page})=>{
  for(const width of [320,390,800,1440]){
    await page.setViewportSize({width,height:900});await page.goto('/');
    await expect(page.locator('.case-verdict')).toContainText('수익성 확인 후 투자한다.');
    await expect(page.locator('.case-kpi .is-negative')).toContainText('−38.7');
    await expect(page.locator('.case-profit-summary')).toContainText('공급 유지율 100% 가정');
    await expect(page.locator('#case-profit-economic')).toHaveText('+5,640원');
    await expect(page.locator('#attachments .case-deck-card')).toHaveCount(2);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
  await page.goto('/src/case-study/materials.html?preview=1&mode=slides');
  await expect(page.locator('#page')).toHaveText('01 / 09');
  await page.getByRole('button',{name:'다음 슬라이드'}).click();
  await expect(page.locator('#page')).toHaveText('02 / 09');
});
test('body and presentations retain consistent figures and necessary disclosures',async()=>{
 const {spawnSync}=require('node:child_process');
 const result=spawnSync('python3',['qa/crosscheck-case-study-presentations.py'],{
  cwd:process.cwd(),encoding:'utf8',timeout:30000
 });
 expect(result.error, String(result.error||'')).toBeUndefined();
 expect(result.status, (result.stdout||'')+'\n'+(result.stderr||'')).toBe(0);
 expect(result.stdout).toContain('PASS: body vs 9-slide report vs 6-slide strategy figures, copy, and decisions match');
});


test('final typography audit keeps preview captions and mobile controls legible',async({page})=>{
 for(const width of [320,390,800]){
  await page.setViewportSize({width,height:844});
  await page.goto('/src/case-study/materials.html?preview=1');
  await expect(page.locator('.slide-gallery-index').first()).toBeVisible();
  const samples=await page.evaluate(()=>{
   const rgb=value=>(value.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
   const luminance=value=>{
    const [r,g,b]=rgb(value).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
    return .2126*r+.7152*g+.0722*b;
   };
   const contrast=(a,b)=>{
    const x=luminance(a),y=luminance(b);
    return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
   };
   return [
    ['Gallery description','.slide-gallery-intro p','.slide-gallery'],
    ['Slide index','.slide-gallery-index','.slide-gallery-card']
   ].map(([name,selector,parent])=>{
    const element=document.querySelector(selector);
    const computed=getComputedStyle(element);
    const background=getComputedStyle(element.closest(parent)).backgroundColor;
    return {name,fontSize:parseFloat(computed.fontSize),contrast:contrast(computed.color,background)};
   });
  });
  for(const sample of samples){
   expect(sample.contrast,JSON.stringify({width,...sample})).toBeGreaterThanOrEqual(4.5);
   expect(sample.fontSize,JSON.stringify({width,...sample})).toBeGreaterThanOrEqual(sample.name==='Gallery description'?13:12);
  }
  await page.goto('/src/case-study/materials.html?preview=1&mode=slides');
  await expect(page.locator('#page')).toHaveText('01 / 09');
  const controlSizes=await page.locator('.viewer .toolbar button').evaluateAll(buttons=>buttons.map(node=>({
   name:node.id,fontSize:parseFloat(getComputedStyle(node).fontSize),
   width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height
  })));
  for(const control of controlSizes){
   expect(control.fontSize,JSON.stringify({width,...control})).toBeGreaterThanOrEqual(12);
   expect(control.height,JSON.stringify({width,...control})).toBeGreaterThanOrEqual(44);
  }
  expect(await page.locator('.viewer .toolbar').evaluate(node=>node.scrollWidth<=node.clientWidth+1),String(width)).toBe(true);
 }
 await page.setViewportSize({width:320,height:844});
 await page.goto('/');
 for(const selector of ['#section-01 .case-identity','.case-deck-stack .case-preview-count']){
  const size=await page.locator(selector).first().evaluate(node=>parseFloat(getComputedStyle(node).fontSize));
  expect(size,selector).toBeGreaterThanOrEqual(12);
 }
});


test('unified web design retains 9-section reading progress and supporting page styles',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 const progress=page.locator('.fm-reading-progress > span');
 await expect(progress).toHaveCount(1);
 const palette=await page.evaluate(()=>{
   const css=getComputedStyle(document.documentElement);
   return [css.getPropertyValue('--fm-navy').trim().toUpperCase(),css.getPropertyValue('--fm-accent').trim().toUpperCase()];
 });
 expect(palette).toEqual(['#142C39','#087B60']);
 await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
 await expect.poll(async()=>progress.evaluate(el=>parseFloat(el.style.width)||0)).toBeGreaterThan(90);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 for(const path of ['/src/case-study/materials.html','/src/case-study/forecast.html','/src/case-study/decision-memos.html']){
   await page.goto(path);
   const shared=await page.evaluate(()=>[...document.styleSheets].some(sheet=>sheet.href?.includes('/src/shared/case-study-design.css')));
   expect(shared,path).toBe(true);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path).toBe(true);
 }
});


test('section headers have readable spacing and desktop sidebar has bottom breathing room',async({page})=>{
 for(const width of [320,390,800,1024,1440,1920]){
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  for(let i=1;i<=9;i++){
   const section=page.locator('#section-'+String(i).padStart(2,'0'));
   const positions=await section.evaluate(node=>{
    const bounds=selector=>{const rect=node.querySelector(selector).getBoundingClientRect();return {top:rect.top,bottom:rect.bottom,left:rect.left,right:rect.right};};
    return {
     identity:node.querySelector('.case-identity')?bounds('.case-identity'):null,
     eyebrow:bounds('.eyebrow'),
     title:bounds('.section-title'),
     lead:node.querySelector('.lead')?bounds('.lead'):null
    };
   });
   if(i===1){
    expect(positions.eyebrow.top-positions.identity.bottom,`identity/index overlap at ${width}px`).toBeGreaterThanOrEqual(10);
   }
   expect(positions.title.top-positions.eyebrow.bottom,`index/title overlap at ${width}px, section ${i}`).toBeGreaterThanOrEqual(8);
   if(positions.lead)expect(positions.lead.top-positions.title.bottom,`title/lead overlap at ${width}px, section ${i}`).toBeGreaterThanOrEqual(10);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`horizontal overflow at ${width}px`).toBe(true);
  if(width>800){
   const sidebarLayout=await page.locator('.sidebar').evaluate(sidebar=>{
    const box=sidebar.getBoundingClientRect();
    const last=sidebar.querySelector('.toc-item:last-child').getBoundingClientRect();
    return {
     bottomGap:box.bottom-last.bottom,
     viewportGap:innerHeight-box.bottom,
     tocBottomPadding:parseFloat(getComputedStyle(sidebar.querySelector('.toc')).paddingBottom),
     tocJustify:getComputedStyle(sidebar.querySelector('.toc')).justifyContent
    };
   });
   expect(sidebarLayout.tocBottomPadding,`nested toc padding at ${width}px`).toBe(0);
   expect(sidebarLayout.tocJustify,`desktop menu distribution at ${width}px`).toBe('space-between');
   expect(Math.abs(sidebarLayout.viewportGap),`outer sidebar bottom gap at ${width}px`).toBeLessThanOrEqual(2);
   expect(sidebarLayout.bottomGap,`sidebar last-item bottom gap at ${width}px`).toBeGreaterThanOrEqual(10);
   expect(sidebarLayout.bottomGap,`sidebar extra blank area at ${width}px`).toBeLessThanOrEqual(18);
  }
 }
});


test('editorial whitespace and vertical-rhythm audit across all nine sections',async({page})=>{
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});await page.goto('/');
    await expect(page.locator('.slide')).toHaveCount(9);
    await expect(page.locator('.section-title')).toHaveCount(9);
    const section=page.locator('#section-05');
    await expect(section).toContainText('충원 75% · 취소 8% · 취소 후 완료 97%');
    await expect(section).toContainText('공급 유지율 100% 가정');
    await expect(section).toContainText('플랫폼 예약 비중 60%');
    await expect(page.locator('#section-08')).toContainText('30일');
    const layout=await page.locator('.slide').evaluateAll(nodes=>nodes.map(n=>({
      width:n.clientWidth,scroll:n.scrollWidth,heading:!!n.querySelector('.section-title')
    })));
    expect(layout.every(x=>x.heading&&x.scroll<=x.width+1)).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
});
test('standalone presentation fits without scrolling on desktop',async({page})=>{
 await page.setViewportSize({width:1920,height:935});
 for(const deck of ['', '&deck=strategy']){
  await page.goto('/src/case-study/materials.html?preview=1&mode=slides'+deck);
  await expect(page.locator('html')).toHaveClass(/standalone-slides/);
  await expect(page.locator('#slide')).toBeVisible();
  const fit=await page.evaluate(()=>{
   const image=document.querySelector('#slide').getBoundingClientRect();
   const note=document.querySelector('#slide-keypoint').getBoundingClientRect();
   return image.bottom<=innerHeight+1&&note.bottom<=innerHeight+1&&document.documentElement.scrollHeight<=innerHeight+1;
  });
  expect(fit).toBe(true);
 }
});
