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
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  for(const section of ['#section-05','#section-08']){
   await expect(page.locator(section+' > .table-wrap')).toHaveCount(1);
   await expect(page.locator(section+' > details')).toHaveCount(section==='#section-05'?2:5);
  }
  const scenarios=page.locator('#section-05 > details').filter({has:page.getByText('월 손익 민감도·직접 운영 기준',{exact:true})});
  await expect(scenarios.locator('table')).toBeHidden();
  await scenarios.locator('summary').click();
  await expect(scenarios.locator('table')).toBeVisible();
  const report=page.locator('#section-08 > details').filter({has:page.getByText('월간 경영보고 예시 · KPI·손익 비교',{exact:true})});
  const reportTables = report.locator('table');
  await expect(reportTables).toHaveCount(2);
  for (const table of await reportTables.all()) await expect(table).toBeHidden();
  await report.locator('summary').click();
  for (const table of await reportTables.all()) await expect(table).toBeVisible();
  await expect(page.locator('#section-08 .reader-summary')).toContainText('831만 원');
 const plan=page.locator('#section-08 details').filter({has:page.getByText('중장기 사업계획 · 예산과 확대 기준',{exact:true})});
 await plan.locator('summary').click();
 await expect(plan.getByRole('table')).toHaveCount(3);
 await expect(page.locator('#section-05 details:not(.case-profit-advanced)')).toHaveCount(3);
 await expect(page.locator('#section-08 details')).toHaveCount(5);
 await expect(page.locator('.case-cash-chart .cash-line')).toHaveCount(2);
 await expect(page.locator('.case-cash-chart polyline')).toHaveCount(2);
 await expect(plan).toContainText('기본 현금 예산 1,070만 원');
 await expect(plan.getByRole('table',{name:'5개년 경영계획 · 금액 단위 만 원'})).toContainText('2,998');
 await expect(plan).toContainText('기존 수수료·결제 조건 유지 시 현금수지');
 await expect(plan).toContainText('3년 차 · 제휴 운영 확대');
 const monthly=page.locator('#section-08 details').filter({has:page.getByText('월간 경영보고 예시 · KPI·손익 비교',{exact:true})});
 await monthly.locator('summary').click();
 await expect(monthly).toContainText('가상 실적 1,019건');
 await expect(monthly).toContainText('−217,040원');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
});


test('recruiter scanning: 01 ownership, 03 options, 06 evidence remain concise and expandable',async({page})=>{
 for(const width of [320,390,1440]){
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await expect(page.locator('#section-01 .decision-card')).toHaveCount(0);
  await expect(page.locator('#section-01 .case-kpi')).toHaveCount(3);
  await expect(page.locator('#section-03 > .table-wrap')).toHaveCount(1);
  await expect(page.locator('#section-03 table')).toHaveCount(4);
  await expect(page.locator('#section-03 > details')).toHaveCount(2);
  const optionDetails=page.locator('#section-03 > details').last();
  await expect(optionDetails.locator('table').first()).toBeHidden();
  await optionDetails.locator('summary').click();
  await expect(optionDetails.locator('table')).toHaveCount(2);
  await expect(optionDetails.locator('table').first()).toBeVisible();
  const techCards=page.locator('#section-06 .decision-card');
  await expect(techCards).toHaveCount(3);
  await expect(techCards.nth(0)).toContainText('보조 서비스 구현');
  await expect(techCards.nth(1)).toContainText('예시 데이터로 기능 확인');
  await expect(techCards.nth(2)).toContainText('계약 조건을 확인한 뒤 결제·환불·정산 기능 구축');
  await expect(page.locator('#section-06 .architecture li').last()).toContainText('결제·정산 후속 구축 대상');
  await expect(page.locator('#section-06 > .table-wrap')).toHaveCount(1);
  await expect(page.locator('#section-06 table')).toHaveCount(4);
  await expect(page.locator('.track table')).toHaveCount(31);
  for(const id of ['#section-01','#section-03','#section-06'])
   expect(await page.locator(id).evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
});

test('reader summary, detailed numbers and optional tables remain consistent',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await expect(page.locator('#section-01 .case-kpi').nth(2)).toContainText('약 −38.7만 원');
 await expect(page.locator('#section-05 .reader-summary')).toContainText('23곳');
 await expect(page.locator('#section-05 .reader-summary')).toContainText('28곳');
 await expect(page.locator('#section-05 .reader-summary')).toContainText('수수료 12%, 결제비 0%');
 await expect(page.locator('#section-05 .reader-summary')).not.toContainText('현금 손익분기');
 await expect(page.locator('#section-08 .reader-summary')).toContainText('831만 원');
 await expect(page.locator('.track table')).toHaveCount(31);
 await expect(page.locator('#section-04 .model-funnel')).toContainText('약 1,559석');
 for(const [section,label] of [['#section-05','제휴 손익과 협상 근거'],['#section-06','월 IT·운영 예산 세부 내역'],['#section-08','월간 지표 관리와 손익 검증']]){
  const summary=page.locator(section+' details summary').filter({hasText:label});
  await expect(summary).toBeVisible();
  await summary.click();
  await expect(summary.locator('..')).toHaveAttribute('open','');
 }
 await expect(page.locator('#section-05')).toContainText('−387,160원');
 await expect(page.locator('#section-09')).toContainText('운영자 제휴형 우선 · 수수료·결제비 복합 협상.');
 await page.goto('/src/case-study/forecast.html');
 await expect(page.getByRole('heading',{name:'기준 손익 시나리오'})).toBeVisible();
 await expect(page.locator('#expansion')).toContainText('약 23곳');
 await expect(page.locator('#expansion')).toContainText('약 28곳');
 await page.goto('/src/case-study/materials.html');
 await expect(page.locator('body')).toContainText('2027년');
 await expect(page.locator('body')).toContainText('약 28곳');
 await expect(page.locator('a[href$=".zip"]')).toHaveCount(0);
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
 await expect(page.locator('body')).not.toContainText(/2026\.06\.08|교육과정/);
 await expect(page.locator('.sidebar a[href="https://footmate.fmate.workers.dev/demo"]')).toHaveCount(0);
 await expect(page.locator('a[href="https://footmate.fmate.workers.dev/demo"]')).toHaveCount(1);
 await expect(page.locator('#section-06 a[href="https://footmate.fmate.workers.dev/demo"]')).toHaveText('보조 자료 · 서비스 데모 보기 ↗');
 await expect(page.locator('#section-06 a[href="https://footmate.fmate.workers.dev/demo"]')).toHaveAttribute('target','_blank');
 for(const text of ['626건','340원','1,765건','7,648건','−387,160원'])await expect(page.locator('.track')).toContainText(text);
 await expect(page.locator('#section-08')).toContainText('추진 일정과 목표, 예산 및 결정 기준.');
 await expect(page.locator('#section-01 .case-next-decision')).toContainText('현금 집행 상한 461만 원');
 await expect(page.locator('.track')).not.toContainText('김도현');
 await expect(page.locator('#section-01')).not.toContainText('실제 계약·매출 실적이 아닙니다');
 await expect(page.locator('#section-01 .lead')).toHaveCount(0);
 await expect(page.locator('#section-06')).not.toContainText('직접 구축·외부 활용·후속 투자 구분. 접근·복구·비용 검토.');
 await expect(page.locator('#section-09')).toContainText('건당 공헌이익·플랫폼 예약 비중·재참가 확인.');
 await expect(page.locator('#section-06')).toContainText('구현·검증 요약');
 await expect(page.locator('a[href*="github.com"]')).toHaveCount(0);
 await expect(page.locator('#section-06')).toContainText('가상 데이터');
 await expect(page.locator('#section-06')).toContainText('실제 서버의 동시 요청 처리는 별도 검증');
 await expect(page.locator('#section-07 .transaction-flow')).toContainText('로그인·중복·잔여 정원 확인 후 반영');
 await expect(page.locator('#section-08')).toContainText('30일 경과 이용자');
 await expect(page.locator('#section-09')).toContainText('취소·고객지원비 반영 손익·비용 대비 예상 손익률 재산정.');
 await expect(page.locator('#section-09')).not.toContainText('−202,540원');
 await expect(page.locator('#section-09')).not.toContainText('발표자료(PPT)·분석 모델(Excel) 보기');
 await expect(page.locator('#section-09')).not.toContainText(/첨부 자료 대조|대조 기준|자동 재검사|B8·B9|model\.json/);
 await expect(page.locator('#section-09 .table-wrap')).toHaveCount(0);
 await expect(page.locator('#case-materials-frame')).toHaveCount(0); // Avoid the duplicate embedded report and its large preview payload.
 await expect(page.locator('#section-09 a[href="/src/case-study/materials.html"]')).toHaveCount(0);
 await expect(page.locator('link[href*="tossface.css"]')).toHaveCount(1);
 await expect(page.locator('link[href*="pretendardvariable-dynamic-subset.css"]')).toHaveCount(1);
 await expect(page.locator('#section-08')).not.toContainText('포트폴리오용 합성 데이터·가정.');

 for(const id of ['#section-01','#section-04','#section-05']){
  await expect(page.locator(id)).toContainText('626건');
  if(id==='#section-01')await expect(page.locator(id)).toContainText('약 −38.7');
  else if(id!=='#section-04')await expect(page.locator(id)).toContainText('−387,160원');
 }
 await expect(page.locator('#section-04')).not.toContainText(/이전 단순|기존 1,169건/);
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

test('investment evidence exposes budget scope and separates missing data from unmet targets',async({page},testInfo)=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/#section-08');
 await expect(page.locator('#section-08')).toContainText('현금 지출 상한 461만 원');
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:1080});
  for(const id of ['#section-05','#section-06','#section-08']){
   await page.locator(id+' details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));
   expect(await page.locator(id).evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
  }
  for(const label of ['8주 예산과 투자 심사 지표','측정 방법과 현장 검증 판단']){
   const detail=page.locator('#section-08 details').filter({has:page.getByText(label,{exact:true})});
   await testInfo.attach('investment-'+width+'-'+(label.startsWith('8주')?'budget':'decision'),{body:await detail.screenshot({animations:'disabled'}),contentType:'image/png'});
  }
 }
 await expect(page.locator('#section-08')).toContainText('8,310,000원');
 await expect(page.locator('#section-08')).toContainText('취소 전·전체 채널');
 await expect(page.locator('#section-08')).toContainText('자료 보완');await expect(page.locator('#section-08')).toContainText('측정 진행');
 const scan=await new AxeBuilder({page}).include('#section-05').include('#section-06').include('#section-08').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations).toEqual([]);
});



test('implementation decisions stay readable inside the case study',async({page},testInfo)=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/#section-06');
 const detail=page.locator('#section-06 details').filter({has:page.getByText('참가·정원 관리의 설계 이유',{exact:true})});await detail.locator('summary').click();
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:1080});
  await testInfo.attach('inline-evidence-'+width,{body:await page.locator('#section-06 .table-wrap').filter({has:page.getByText('구현·검증 요약',{exact:true})}).screenshot({animations:'disabled'}),contentType:'image/png'});
  await testInfo.attach('inline-decision-'+width,{body:await detail.screenshot({animations:'disabled'}),contentType:'image/png'});
  expect(await page.locator('#section-06').evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
 }
 await expect(detail).toContainText('잔여 자리 재확인 후 참가·취소 처리.');
 await expect(page.locator('a[href*="github.com"]')).toHaveCount(0);
});

test('removed ledger ZIP stays unpublished while PPT and Excel remain available',async({request})=>{
 const material=await request.get('/src/case-study/materials.html');expect(material.ok()).toBe(true);const html=await material.text();
 expect(html).not.toContain('footmate_materials.zip');expect(html).not.toContain('원장·가정 포함 전체 자료 ZIP');
 expect(html).not.toContain('downloads/footmate_report.pptx');expect(html).not.toContain('downloads/footmate_model.xlsx');
 const removed=await request.get('/src/case-study/downloads/footmate_materials.zip');
 expect(removed.headers()['content-type']||'').not.toMatch(/zip/i);
 expect((await removed.body()).subarray(0,4).toString('hex')).not.toBe('504b0304');
});


test('single resource section, inline financial model and PPT viewer',async({page,request},testInfo)=>{
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  await expect(page.locator('.sidebar .docs-link')).toHaveCount(0);
  await expect(page.locator('#section-09 .case-materials')).toHaveCount(0);
  await expect(page.locator('a[href="/src/case-study/materials.html"]')).toHaveCount(0);
  const documents=page.locator('#attachments');
  await documents.scrollIntoViewIfNeeded();
  await expect(documents.getByRole('heading',{name:'발표자료',exact:true})).toBeVisible();
  await expect(documents.locator('.case-documents-lead')).toHaveCount(0);
  await expect(documents).not.toContainText('PPT 10장 · Excel 손익 모델');
  await expect(page.locator('#section-01 .case-scenario-note')).toHaveText('가정 기반 월간 시나리오 · 제휴 5곳 · 수수료 10% · 결제비 3%');
  await expect(documents.locator('.case-downloads a[download]')).toHaveCount(2);
  await expect(page.getByRole('link',{name:'기획 자료 받기'})).toHaveCount(1);
  await expect(page.getByRole('link',{name:'Excel 다운로드'})).toHaveCount(0);
  await expect(documents.getByRole('link',{name:'기획 자료 받기'})).toHaveAttribute('download','footmate_report.pptx');
  await expect(documents.locator('.case-downloads a[href*=".xlsx"]')).toHaveCount(0);
   await expect(documents.getByRole('link',{name:'전략 자료 받기'})).toHaveAttribute('download','footmate_5year_strategy.pptx');
  await expect(page.locator('a[href="/src/case-study/forecast.html"]')).toHaveCount(0);
  const model=page.locator('#case-profit-model');
  await model.scrollIntoViewIfNeeded();
  await expect(model.getByRole('heading',{name:'공급 확대 손익 계산'})).toBeVisible();
  await expect(model.locator('#case-profit-orders')).toHaveText('3,506건');
  await expect(model.locator('[data-compare="base"]')).toHaveText('-2,097,960원');
  await expect(model.locator('[data-compare="fallback"]')).toHaveText('-835,800원');
  await expect(model.locator('[data-compare="preferred"]')).toHaveText('+5,640원');
  await expect(model.locator('#case-profit-economic')).toHaveText('+5,640원');
  await expect(model.locator('#case-profit-bep')).toHaveText('28곳');
  await testInfo.attach('visual-'+width+'-financial-model',{body:await model.screenshot({animations:'disabled'}),contentType:'image/png'});
  await model.getByRole('button',{name:'기준 10% · 3%'}).click();
  await expect(model.locator('#case-profit-economic')).toHaveText('-2,097,960원');
  await model.getByRole('button',{name:'우선 12% · 0%'}).click();
  await model.locator('#case-profit-partners').fill('23');
  await expect(model.locator('#case-profit-economic')).toHaveText('-432,800원');
  await model.getByText('공급 유지율·예약 비중 조정',{exact:true}).click();
  await model.locator('#case-profit-retention').fill('80');
  await expect(model.locator('#case-profit-economic')).toHaveText('-974,240원');
  await model.locator('#case-profit-share').fill('48');
  await expect(model.locator('#case-profit-economic')).toHaveText('-1,407,580원');
  await model.getByRole('button',{name:'초기화'}).click();
  await model.getByRole('button',{name:'민감도 사례 적용'}).click();
  await expect(model.locator('#case-profit-orders')).toHaveText('1,843건');
  await expect(model.locator('#case-profit-economic')).toHaveText('-1,407,580원');
  await model.getByRole('button',{name:'초기화'}).click();
  await expect(model.locator('#case-profit-economic')).toHaveText('+5,640원');
  await model.getByText('공급 유지율·예약 비중 조정',{exact:true}).click();
  await model.locator('#case-profit-rate').fill('101');
  await expect(model.locator('#case-profit-error')).toBeVisible();
  await model.getByRole('button',{name:'초기화'}).click();
  await expect(model.locator('#case-profit-error')).toBeHidden();
  await documents.scrollIntoViewIfNeeded();
  const preview=documents.locator('.case-report-preview');
  const frame=preview.locator('.case-ppt-frame');
  await expect(preview).not.toHaveAttribute('open',/.+/);
  await expect(frame).toHaveAttribute('data-src','/src/case-study/materials.html?preview=1&viewer=20261112-layout');
  const summary=preview.locator('summary');
  await expect(summary).toContainText('사업성 분석·경영계획');
  const resourceFonts=await summary.evaluate(el=>({
    text:getComputedStyle(el).fontFamily,
    icon:getComputedStyle(el.querySelector('.case-preview-indicator'),'::after').fontFamily
  }));
  expect(resourceFonts.text).toContain('Pretendard');
  expect(resourceFonts.icon).toContain('Tossface');
  // Verify rendered palette contrast, not just hard-coded expected colors.
  const colorAudit=await documents.evaluate(root=>{
    const selectors=[
      ['PPT CTA','summary',null],
      ['PPT download','.case-downloads a[download]',null],
      ['PPT reader','.case-downloads a:not([download])',null],
      ['Section heading','.case-documents-head h2','.case-documents'],
      ['Deck description','.case-preview-description','.case-documents']
    ];
    const rgb=value=>(value.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
    const luminance=value=>{
      const linear=rgb(value).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});
      return .2126*linear[0]+.7152*linear[1]+.0722*linear[2];
    };
    return selectors.map(([label,selector,backgroundSelector])=>{
      const node=root.querySelector(selector);
      const foreground=getComputedStyle(node).color;
      const background=getComputedStyle(backgroundSelector?node.closest(backgroundSelector):node).backgroundColor;
      const bg=background==='rgba(0, 0, 0, 0)'?'rgb(255, 255, 255)':background;
      const [a,b]=[luminance(foreground),luminance(bg)];
      return {label,contrast:Number(((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(2))};
    });
  });
  for(const item of colorAudit)expect(item.contrast,JSON.stringify(item)).toBeGreaterThanOrEqual(4.5);
  await summary.focus();
  await expect(summary).toBeFocused();
  await testInfo.attach('visual-'+width+'-PPT-closed-focus',{body:await documents.screenshot({animations:'disabled'}),contentType:'image/png'});
  await summary.click();
  await expect(frame).toHaveAttribute('src','/src/case-study/materials.html?preview=1&viewer=20261112-layout');
  const slides=frame.contentFrame();
  // A preview shows the full thumbnail contact sheet, not the presentation controls.
  await expect(slides.locator('.slide-gallery-card')).toHaveCount(9,{timeout:15000});
  await expect(slides.locator('.slide-gallery')).toBeVisible();
  await expect(slides.locator('.slide-gallery-reader .fm-icon')).toHaveCount(1);
  await expect(slides.locator('.slide-gallery-card').first()).toBeVisible();
  await expect(slides.locator('.slide-gallery-card').nth(1)).toBeVisible();
  await expect(slides.locator('.slide-gallery-card').nth(2)).toBeHidden();
  await expect(slides.locator('.slide-gallery-more')).toHaveText('전체 9장 펼치기');
  await expect(slides.locator('.toolbar')).toBeHidden();
  await expect(slides.locator('.viewer-stage')).toBeHidden();
  await expect(slides.locator('.slide-gallery-card').first()).toHaveAttribute('href','/src/case-study/materials.html?preview=1&mode=slides&slide=0');
  await expect.poll(()=>slides.locator('.slide-gallery-card img').first().evaluate(image=>image.complete&&image.naturalWidth>200&&image.naturalHeight>100),{timeout:15000}).toBe(true);
  await testInfo.attach('visual-'+width+'-PPT-thumbnail-preview',{body:await documents.screenshot({animations:'disabled'}),contentType:'image/png'});
  if(width===1440){
   await slides.locator('.slide-gallery-more').click();
   await expect(slides.locator('.slide-gallery-card').last()).toBeVisible();
   await expect(slides.locator('.slide-gallery-more')).toHaveAttribute('aria-expanded','true');
   await slides.locator('.slide-gallery-more').click();
   await expect(slides.locator('.slide-gallery-card').last()).toBeHidden();
  }
  // Exercise the dedicated large-slide reader without replacing the case study page.
  await frame.evaluate(element=>{element.src='/src/case-study/materials.html?preview=1&mode=slides'});
  await expect(slides.locator('#page')).toHaveText('01 / 09',{timeout:15000});
  await expect(slides.locator('.viewer-stage')).toBeVisible();
  await expect(slides.locator('.slide-gallery')).toBeHidden();
  await expect.poll(()=>slides.locator('#slide').evaluate(image=>image.complete&&image.naturalWidth>200&&image.naturalHeight>100),{timeout:15000}).toBe(true);

  await expect(preview.locator('.case-preview-summary-text')).toContainText('사업성 분석·경영계획');
  await expect(preview.locator('.case-preview-symbol')).toHaveText('01');
  await expect(slides.locator('#slideSelect,.filmstrip')).toHaveCount(0);
  await expect(slides.locator('#slideTitle')).toHaveText('플랫폼 운영과 수익성 개선');
  await expect(slides.locator('link[href*="tossface.css"]')).toHaveCount(1);
  await expect(slides.locator('link[href*="pretendardvariable-dynamic-subset.css"]')).toHaveCount(1);
  const fonts=await slides.locator('body').evaluate(el=>({
    text:getComputedStyle(el).fontFamily,
     icon:getComputedStyle(el.ownerDocument.querySelector('#prev .fm-icon')).fontFamily
  }));
  expect(fonts.text).toContain('Pretendard');
  expect(fonts.icon).toContain('Tossface');
  await expect(slides.locator('#slideProgressTrack')).toHaveAttribute('aria-valuenow','1');
  for(let i=0;i<3;i++)await slides.locator('#next').click();
  await expect(slides.locator('#page')).toHaveText('04 / 09');
  await expect.poll(()=>slides.locator('#slide').evaluate(image=>image.complete&&image.naturalWidth>200&&image.naturalHeight>100),{timeout:15000}).toBe(true);
  await expect(slides.locator('#slideTitle')).toHaveText('수익성 개선안');
  await expect(slides.locator('#slideSummary')).toContainText('수수료·결제비');
  await expect(slides.locator('#slide')).toHaveAttribute('aria-describedby','slideSummary slide-keypoint');
  await expect(slides.locator('#slideProgressTrack')).toHaveAttribute('aria-valuenow','4');
  // Arrow keys work even when a viewer control button has focus.
  const nextButton=slides.getByRole('button',{name:'다음 슬라이드'});
  await nextButton.focus();
  await nextButton.press('ArrowRight');
  await expect(slides.locator('#page')).toHaveText('05 / 09');
  await nextButton.press('ArrowLeft');
  await expect(slides.locator('#page')).toHaveText('04 / 09');
  for(let i=0;i<3;i++)await slides.locator('#prev').click();
  await expect(slides.locator('#page')).toHaveText('01 / 09');
  await expect(slides.locator('#slideTitle')).toHaveText('플랫폼 운영과 수익성 개선');
  const firstSlideSrc=await slides.locator('#slide').getAttribute('src');
  for(let i=0;i<8;i++)await slides.locator('#next').click();
  await expect(slides.locator('#page')).toHaveText('09 / 09');
  await expect.poll(()=>slides.locator('#slide').evaluate(img=>img.complete&&img.naturalWidth>200&&img.naturalHeight>100),{timeout:15000}).toBe(true);
  expect(await slides.locator('#slide').getAttribute('src')).not.toBe(firstSlideSrc);
  await testInfo.attach('visual-'+width+'-PPT-last-image',{body:await slides.locator('.viewer-stage').screenshot({animations:'disabled'}),contentType:'image/png'});
  for(let i=0;i<8;i++)await slides.locator('#prev').click();
  await expect(slides.locator('#page')).toHaveText('01 / 09');
  await testInfo.attach('visual-'+width+'-PPT-expanded',{body:await documents.screenshot({animations:'disabled'}),contentType:'image/png'});
  await expect(slides.getByRole('button',{name:'슬라이드 크게 보기'})).toBeVisible();
  // Mobile slide controls must be readable and finger-friendly.
  const toolbar=slides.locator('.toolbar');
  const controls=await toolbar.locator('button').evaluateAll(nodes=>nodes.map(node=>{
    const rect=node.getBoundingClientRect();
    return {name:node.textContent.trim(),width:rect.width,height:rect.height};
  }));
  for(const control of controls){
    expect(control.width,control.name+' target width').toBeGreaterThanOrEqual(44);
    expect(control.height,control.name+' target height').toBeGreaterThanOrEqual(44);
  }
  await expect(toolbar.locator('#expand')).toHaveCSS('background-color','rgb(20, 44, 57)');
  expect(await toolbar.evaluate(node=>node.scrollWidth<=node.clientWidth+1)).toBe(true);
  // Fullscreen temporarily stretches the viewer; exit must restore its natural
  // slide + toolbar height without leaving blank space inside the iframe.
  const enlarge=slides.getByRole('button',{name:'슬라이드 이미지 확대'});
  await enlarge.click();
  await expect.poll(()=>slides.locator('html').evaluate(el=>Boolean(el.ownerDocument.fullscreenElement)),{timeout:10000}).toBe(true);
  await slides.getByRole('button',{name:'슬라이드 원래 크기'}).click();
  await expect.poll(()=>slides.locator('html').evaluate(el=>Boolean(el.ownerDocument.fullscreenElement)),{timeout:10000}).toBe(false);
  await expect.poll(async()=>{
    const outer=await frame.evaluate(el=>el.getBoundingClientRect().height);
    const natural=await slides.locator('.viewer').evaluate(el=>el.getBoundingClientRect().height);
    return Math.abs(outer-natural);
  },{timeout:15000}).toBeLessThan(12);
  await testInfo.attach('visual-'+width+'-PPT-after-fullscreen',{body:await documents.screenshot({animations:'disabled'}),contentType:'image/png'});
  await expect.poll(async()=>{
    const outer=await frame.evaluate(el=>el.getBoundingClientRect().height);
    const inner=await slides.locator('html').evaluate(el=>el.scrollHeight);
    return Math.abs(outer-inner);
  },{timeout:15000}).toBeLessThan(12);
  await slides.getByRole('button',{name:'다음 슬라이드'}).click();
  await expect(slides.locator('#page')).toHaveText('02 / 09');
  await slides.getByRole('button',{name:'이전 슬라이드'}).click();
  await expect(slides.locator('#page')).toHaveText('01 / 09');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  if(width===1440){
   const strategy=documents.locator('.case-strategy-preview');
   await strategy.locator('summary').click();
   const strategySlides=strategy.locator('.case-ppt-frame').contentFrame();
   await expect(strategySlides.locator('.slide-gallery-card')).toHaveCount(6,{timeout:15000});
   await expect(strategySlides.locator('.slide-gallery-card').first()).toBeVisible();
   await expect(strategySlides.locator('.slide-gallery-card').last()).toBeHidden();
   await expect(strategySlides.locator('.slide-gallery-more')).toHaveText('전체 6장 펼치기');
   await strategySlides.locator('.slide-gallery-more').click();
   await expect(strategySlides.locator('.slide-gallery-card').last()).toBeVisible();
   await expect(strategySlides.locator('.slide-gallery-card').last()).toHaveAttribute('href','/src/case-study/materials.html?preview=1&mode=slides&deck=strategy&slide=5');
   await expect(strategySlides.locator('.viewer-stage')).toBeHidden();
   await testInfo.attach('visual-strategy-PPT-thumbnail-preview',{body:await strategy.screenshot({animations:'disabled'}),contentType:'image/png'});
  }
 }
 for(const [path,type] of [
  ['/src/case-study/downloads/footmate_report.pptx','presentation'],
  ['/src/case-study/downloads/footmate_model.xlsx','spreadsheet']
 ]){
  const response=await request.get(path);
  expect(response.ok()).toBe(true);
  expect(['application/octet-stream',type].some(expected=>(response.headers()['content-type']||'').includes(expected))).toBe(true);
  expect((await response.body()).subarray(0,2).toString()).toBe('PK');
 }
});


test('decision story, economic comparison and roadmap have consistent visual evidence',async({page},testInfo)=>{
 test.setTimeout(90000);
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await expect(page.locator('#section-01 .case-quick-path')).toHaveCount(0);
  await expect(page.locator('.toc-item')).toHaveCount(9);
  const chart=page.locator('#section-05 .case-economics-chart');
  await expect(chart).toBeVisible();
  await expect(chart.locator('.case-economics-row')).toHaveCount(4);
  await expect(chart.locator('.case-economics-value')).toHaveText(['340원','580원','700원','940원']);
  const barWidths=await chart.locator('.case-economics-track>span').evaluateAll(nodes=>nodes.map(el=>el.style.width));
  expect(barWidths).toEqual(['36.2%','61.7%','74.5%','100%']);
  await expect(chart).toContainText('고정비 차감 전');
  await expect(chart).not.toContainText('실적 아님');
  const roadmap=page.locator('#section-08 .case-roadmap');
  await expect(roadmap.getByRole('heading',{name:'8주 실행 로드맵'})).toBeVisible();
  await expect(roadmap.locator('li')).toHaveCount(4);
  await expect(roadmap).toContainText('8주 이후');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  for(const section of [page.locator('#section-01 .case-next-decision'),chart,roadmap]){
   expect(await section.evaluate(el=>el.scrollWidth<=el.clientWidth+1),'responsive content overflow').toBe(true);
  }
  await testInfo.attach('visual-'+width+'-economics-chart',{body:await chart.screenshot({animations:'disabled'}),contentType:'image/png'});
  await testInfo.attach('visual-'+width+'-roadmap',{body:await roadmap.screenshot({animations:'disabled'}),contentType:'image/png'});
 }
});

test('scenario hierarchy, input guidance and responsive readability evidence',async({page},testInfo)=>{
 test.setTimeout(90000);
 await page.emulateMedia({reducedMotion:'reduce'});
 const failures=[];page.on('pageerror',error=>failures.push(error.message));
 for(const width of [320,390,800,1440,1920]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('#section-01 .case-scenario-note')).toHaveText('가정 기반 월간 시나리오 · 제휴 5곳 · 수수료 10% · 결제비 3%');
  await expect(page.locator('#section-05 .reader-summary')).toContainText('수수료 12%, 결제비 0%');
  expect((await page.locator('#section-01 .case-scenario-note').textContent()).trim().length).toBeLessThanOrEqual(100);
  await expect(page.locator('#section-05 .case-model-context')).toContainText('기회비용 포함');
  await expect(page.locator('#section-08 .case-decision-points > div')).toHaveCount(3);
  await expect(page.locator('#section-08 .reader-summary')).toContainText('현금 지출 상한 461만 원');
  await expect(page.locator('#section-08 .reader-summary')).toContainText('30일 재참가율 30%');
  await expect(page.locator('#attachments .case-preview-context')).toHaveCount(0);
  await expect(page.locator('#attachments')).not.toContainText('썸네일에서 원하는 장을 선택하세요.');
  expect(await page.locator('#section-05 .numeric-value').count()).toBeGreaterThan(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const touchTargets=await page.locator('#section-05 > details > summary,#section-08 > details > summary').evaluateAll(nodes=>nodes.map(el=>el.getBoundingClientRect().height));
  expect(Math.min(...touchTargets)).toBeGreaterThanOrEqual(44);
  const model=page.locator('#case-profit-model'),rate=model.locator('#case-profit-rate');
  const borderContrast=await rate.evaluate(input=>{
   const channel=(v)=>{const n=v/255;return n<=0.04045?n/12.92:Math.pow((n+0.055)/1.055,2.4)};
   const lum=(color)=>{
    const rgb=(color.match(/[0-9.]+/g)||[]).slice(0,3).map(Number);
    return .2126*channel(rgb[0])+.7152*channel(rgb[1])+.0722*channel(rgb[2]);
   };
   const a=lum(getComputedStyle(input).borderTopColor),b=lum(getComputedStyle(input).backgroundColor);
   return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  });
  expect(borderContrast).toBeGreaterThanOrEqual(3);
  await expect(model.locator('#case-profit-economic')).toHaveText('+5,640원');
  await expect(model.locator('#case-profit-error')).toBeHidden();
  await testInfo.attach('ux-qa-'+width+'-01-context',{body:await page.locator('#section-01 .case-scenario-note').screenshot({animations:'disabled'}),contentType:'image/png'});
  await testInfo.attach('ux-qa-'+width+'-08-decision',{body:await page.locator('#section-08 .reader-summary').screenshot({animations:'disabled'}),contentType:'image/png'});
  await rate.fill('101');
  await expect(rate).toHaveAttribute('aria-invalid','true');
  await expect(rate).toHaveAttribute('aria-describedby','case-profit-error');
  await expect(model.locator('#case-profit-error')).toContainText('수수료율은 0~100% 범위');
  await expect(model.locator('#case-profit-orders')).toHaveText('—');
  await testInfo.attach('ux-qa-'+width+'-05-validation',{body:await model.screenshot({animations:'disabled'}),contentType:'image/png'});
  await model.locator('#case-profit-reset').click();
  await expect(rate).toHaveValue('12');
  await expect(rate).toHaveAttribute('aria-invalid','false');
  await expect(rate).not.toHaveAttribute('aria-describedby',/case-profit-error/);
  await expect(model.locator('#case-profit-error')).toBeHidden();
  await expect(model.locator('#case-profit-economic')).toHaveText('+5,640원');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 expect(failures).toEqual([]);
});


test('supporting resource pages omit duplicate labels but retain scenario disclosures',async({page})=>{
 await page.goto('/src/case-study/materials.html');
 await expect(page.locator('main > h1')).toHaveText('FootMate 사업성 분석·경영계획 자료');
 await expect(page.locator('a.back')).toHaveText('본문으로');
 await expect(page.locator('main')).not.toContainText('본편 9장 · 5개년 전략 보완자료 6장');
 await expect(page.locator('main')).not.toContainText('FootMate · 플랫폼 운영·경영관리');
 await expect(page.locator('main')).not.toContainText('FootMate · 경영진 의사결정 메모');
 await expect(page.locator('main')).not.toContainText('산정 조건을 바꿔 손익 변화를 확인하세요.');
 await expect(page.locator('main')).toContainText('가상');
 await expect(page.locator('main')).toContainText('계산기 입력값과는 연동되지 않습니다.');
 await page.goto('/src/case-study/forecast.html');
 await expect(page.locator('main')).not.toContainText('FootMate · 플랫폼 운영·경영관리');
 await expect(page.locator('main')).toContainText('2027년 월별 계획과 가상 거래를 구분해 비교합니다.');
 await expect(page.locator('main')).toContainText('실제 수요와 제휴 계약은 현장에서 확인할 항목입니다.');
});

test('reader-facing copy avoids accidental adjacent repetition',async({page})=>{
 await page.goto('/');
 const texts=await page.locator('.slide p,.slide h2,.slide h3,.slide caption,.slide summary,.slide dt,.slide dd').evaluateAll(nodes=>nodes.map(node=>node.textContent.replace(/\s+/g,' ').trim()));
 for(const value of texts){
  expect(value).not.toMatch(/(?:^|\s)([가-힣A-Za-z0-9]{2,})\s+\1(?=$|\s|[.,!?])/u);
 }
 await expect(page.locator('#section-08')).not.toContainText('30일 30일');
 await expect(page.locator('#section-08')).not.toContainText('목표 · 충원 75% / 재참가 30%. 8주 후');
 await expect(page.locator('#section-08')).toContainText('8주 후 현금·약정·미완료 보고.');
 await expect(page.locator('#section-07 .flow-branches')).not.toContainText('참가·잔여 자리 동시 갱신. 반복 요청은 기존 결과 반환.');
 await expect(page.locator('.track')).not.toContainText('시간 기회비용');
 await expect(page.locator('.track')).not.toContainText('창업자 시간 기회비용');
 await expect(page.locator('#section-05 .case-profit-results')).toContainText('기회비용 포함');
});


test('restricted fullscreen enlarges the current slide inline on first click',async({page})=>{
 await page.addInitScript(()=>{
  if(window.top.innerWidth===320)Object.defineProperty(document,'fullscreenEnabled',{configurable:true,value:false});
  else Element.prototype.requestFullscreen=()=>Promise.reject(new Error('Denied'));
 });
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  await page.goto('/');
  await page.locator('.case-report-preview summary').click();
  const frame=page.locator('.case-report-preview .case-ppt-frame');
  const slides=frame.contentFrame();
  await expect(slides.locator('.slide-gallery-card')).toHaveCount(9,{timeout:15000});
  await frame.evaluate(element=>{element.src='/src/case-study/materials.html?preview=1&mode=slides'});
  await expect(slides.locator('.viewer-stage')).toBeVisible();
  await expect(slides.locator('#page')).toHaveText('01 / 09',{timeout:15000});
  await slides.getByRole('button',{name:'슬라이드 이미지 확대'}).click();
  await expect(slides.locator('.viewer')).toHaveClass(/inline-zoom/);
  expect(await slides.locator('.viewer-stage').evaluate(e=>e.scrollWidth>e.clientWidth)).toBe(true);
  await slides.getByRole('button',{name:'슬라이드 원래 크기'}).press('Escape');
  await expect(slides.locator('.viewer')).not.toHaveClass(/inline-zoom/);
 }
});

test('PPT preview closes explicitly and the contents control section navigation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,800,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await expect(page.locator('.reader-back,.mobile-reader-back')).toHaveCount(0);
  await page.locator('.toc-item').nth(3).click();
  await expect(page).toHaveURL(/#section-04$/);
  await expect(page.locator('#section-04 .section-title')).toBeFocused();
  await page.locator('.toc-item').first().click();
  const preview=page.locator('.case-report-preview');
  await preview.locator('summary').click();
  await expect(preview).toHaveAttribute('open','');

  await preview.locator('summary').click();
  await expect(preview).not.toHaveAttribute('open','');
  await expect(preview.locator('summary')).toBeFocused();
  await preview.locator('summary').click();
  await expect(preview).toHaveAttribute('open','');
  await expect(preview.locator('.case-ppt-frame')).toHaveAttribute('src','/src/case-study/materials.html?preview=1&viewer=20261112-layout');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
});

test('cross-engine case study navigation and preview controls',async({page})=>{
 test.setTimeout(120000);
 const {firefox,webkit,devices}=require('@playwright/test');
 await page.goto('/');
 const site=new URL('/',page.url()).href;
 for(const [name,engine] of [['firefox',firefox],['webkit',webkit]]){
  // The CI container launches as root; Firefox requires a root-owned HOME.
  // Override Chromium-only launch flags inherited from the test project.
  const browser=await engine.launch({env:{...process.env,HOME:'/root'},args:[]});
  try{
   const context=await browser.newContext(name==='webkit'
    ? {...devices['iPhone 13'],viewport:{width:390,height:844},reducedMotion:'reduce'}
    : {viewport:{width:390,height:844},reducedMotion:'reduce'});
   try{
    const cross=await context.newPage();
    for(const width of [320,390,800]){
     await cross.setViewportSize({width,height:844});
     const errors=[];cross.on('pageerror',error=>errors.push(error.message));
     await cross.goto(site);
     await expect(cross.locator('.slide')).toHaveCount(9);
     await expect(cross.locator('.mobile-reader-back')).toHaveCount(0);
     await cross.locator('.toc-item').nth(2).click();
     await expect(cross).toHaveURL(/#section-03$/);
     await cross.locator('.toc-item').nth(1).click();
     await expect(cross).toHaveURL(/#section-02$/);
     const model=cross.locator('#case-profit-model');
     await expect(model.locator('#case-profit-economic')).toHaveText('+5,640원');
     await expect(model.locator('#case-profit-error')).toBeHidden();
     expect(await cross.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' at '+width+'px').toBe(true);
     expect(errors,name+' script errors at '+width+'px').toEqual([]);
    }
    const preview=cross.locator('.case-report-preview');
    await preview.locator('summary').click();

    await preview.locator('summary').click();
    await expect(preview).not.toHaveAttribute('open','');
   }finally{await context.close();}
  }finally{await browser.close();}
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
 const preview=page.locator('.case-strategy-preview');
 await expect(preview).toHaveCount(1);
 await expect(preview.locator('summary')).toContainText('중장기 성장 전략');
 const frame=preview.locator('iframe.case-ppt-frame');
 await expect(frame).toHaveAttribute('data-src',/materials\.html\?preview=1&deck=strategy/);
 await expect(frame).not.toHaveAttribute('src',/.+/);
 await preview.locator('summary').click();
 await expect(preview).toHaveAttribute('open','');
 await expect(frame).toHaveAttribute('src',/materials\.html\?preview=1&deck=strategy/);
 await expect(frame).not.toHaveAttribute('data-src',/.+/);
 const slides=frame.contentFrame();
 await expect(slides.locator('.slide-gallery-card')).toHaveCount(6,{timeout:15000});
 await expect(slides.locator('.slide-gallery-card').nth(2)).toBeHidden();
 await expect(slides.locator('.slide-gallery-reader')).toHaveAttribute('href','/src/case-study/materials.html?preview=1&mode=slides&deck=strategy');
 await expect(slides.locator('.toolbar')).toBeHidden();
 await frame.evaluate(element=>{element.src='/src/case-study/materials.html?preview=1&mode=slides&deck=strategy'});
 await expect(slides.locator('.viewer-stage')).toBeVisible();
 await expect(slides.locator('#page')).toHaveText('01 / 06');
 await expect(slides.locator('#slideProgressTrack,#slideProgress')).toHaveCount(2);
 await expect(slides.locator('#slideProgressTrack')).toHaveAttribute('aria-valuemax','6');
 await expect.poll(()=>slides.locator('#slide').evaluate(img=>img.naturalWidth)).toBeGreaterThan(1000);
 await slides.getByRole('button',{name:'다음 슬라이드',exact:true}).click();
 await expect(slides.locator('#page')).toHaveText('02 / 06');
 await expect(slides.locator('#slideTitle')).toContainText('5개년 성장 전략');
 await expect(slides.locator('#slide')).toHaveAttribute('src',/decision-2\.jpg/);
 await slides.locator('#slide-picker').selectOption('3');
 await expect(slides.locator('#slide-permalink')).toHaveAttribute('href',/deck=strategy&slide=3$/);
 await expect(slides.locator('#slide-keypoint')).toContainText('+2,998만 원');
 await preview.locator('summary').click();
 await expect(preview).not.toHaveAttribute('open','');
 await expect(page.locator('.case-report-preview')).toHaveCount(1);
 await expect(page.locator('.case-report-preview iframe')).toHaveAttribute('data-src',/\/src\/case-study\/materials\.html/);
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
 const copy=await page.locator('.slide p:not(.lead):not(.formula),.slide h2,.slide h3,.slide summary,.slide caption,.slide th,.slide td,.slide dt,.slide dd,.slide li').evaluateAll(nodes=>nodes.map(node=>({text:node.textContent.replace(/\s+/g,' ').trim(),tag:node.tagName.toLowerCase(),className:node.className||''})).filter(x=>x.text));
 for(const item of copy){
  expect([...item.text].length,item.tag+' '+item.className+': '+item.text).toBeLessThanOrEqual(45);
 }
 await expect(page.locator('#section-02')).toContainText('시장·경쟁은 공개 자료로 분석하고, 지불 의향은 면담·가격 실험으로 검증합니다.');
 await expect(page.locator('#section-03')).toContainText('운영자 제휴형으로 시작하고, 직접 운영·구독형은 검증 후 검토한다.');
 await expect(page.locator('#section-05')).toContainText('손익분기 · 현금 1,765건 / 기회비용 포함 7,648건');
 await expect(page.locator('#section-08')).toContainText('2027 상반기 가상 데이터, 하반기 공급 전망.');
});

test('case-study body copy stays concise and terminology stays consistent',async({page})=>{
 await page.goto('/');
 const bodyParagraphs=await page.locator('.track p:not(.lead)').evaluateAll(nodes=>nodes.map(n=>n.innerText.trim()).filter(Boolean));
 expect(bodyParagraphs.filter(t=>t.length>85)).toEqual([]);
 for(const phrase of ['시장·경쟁은 공개 자료로 분석하고, 지불 의향은 면담·가격 실험으로 검증합니다.','수수료 매출 차이 − 취소·노쇼 비용 − 완료 건 비용 − 고정비 차이','유지율=실제 공급처 비중. 플랫폼 예약 비중 48%(기준 −20%).','예산 · 구축 300만 / 월 기회비용 200만 / 시범 50만 원.'])await expect(page.locator('.track')).toContainText(phrase);
 for(const url of ['/src/case-study/materials.html','/src/case-study/forecast.html','/src/case-study/decision-memos.html']){
  await page.goto(url);
  const body=page.locator('body');
  await expect(body).not.toContainText('무단 불참');
  await expect(body).not.toContainText('획득비');
  const longParagraphs=await page.locator('main p').evaluateAll(nodes=>nodes.map(n=>n.innerText.trim()).filter(t=>t.length>165));
  expect(longParagraphs,url).toEqual([]);
 }
 await page.goto('/src/case-study/materials.html');
 for(const phrase of ['2027년 손익 시나리오(산정 기준)','2027년 가상 예약·월별 집계입니다.','기회비용 포함 9,660만 원'])await expect(page.locator('body')).toContainText(phrase);
 await page.goto('/src/case-study/forecast.html');
 for(const phrase of ['기준 5곳과 별도인 확대안입니다.','손익분기 공급처: 1~500곳 중 월 손익이 0 이상인 최소 수.','실제 수요와 제휴 계약은 현장에서 확인할 항목입니다.'])await expect(page.locator('body')).toContainText(phrase);
 await page.goto('/src/case-study/decision-memos.html');
 for(const phrase of ['초기 운영은 운영자 제휴형으로 추진합니다.','월 손익 −2,387,160원','실제 계약 효과는 제휴 협의와 시범 운영을 통해 확인합니다.'])await expect(page.locator('body')).toContainText(phrase);
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
    const box=await roi.evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth}));
    expect(box.scroll,String(width)).toBeLessThanOrEqual(box.client+1);
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
  const final=page.locator('#section-09');
  for(const phrase of [
    '운영자 제휴형 우선 · 수수료·결제비 복합 협상.',
    '건당 공헌이익·플랫폼 예약 비중·재참가 확인.',
    '취소·고객지원비 반영 손익·비용 대비 예상 손익률 재산정.',
    '공급 계약·수익성 기준 충족 후 단계적 투자 확대.'
  ])await expect(final).toContainText(phrase);
  await expect(final.locator('.story-card')).toHaveCount(3);
  await page.goto('/src/case-study/materials.html?preview=1&mode=slides&slide=8');
  await expect(page.locator('#page')).toHaveText('09 / 09');
  await expect(page.locator('#slideTitle')).toHaveText('최종 판단 · 단계적 투자');
  await expect(page.locator('#slideSummary')).toContainText('핵심 지표·단계적 투자 기준');
  await expect(page.locator('.slide-transcript,#slideTranscript')).toHaveCount(0);
});



test('decision-led portfolio keeps assumptions, mobile layout and slide navigation usable',async({page})=>{
 for(const width of [320,390,800,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  await expect(page.locator('.case-verdict')).toContainText('수익성 확인 후 투자한다.');
  await expect(page.locator('.case-kpi .is-negative')).toContainText('−38.7');
  await expect(page.locator('.case-profit-summary')).toContainText('추가 관리비 포함');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await expect(page.locator('.case-jump,.case-open-slides')).toHaveCount(0);
  await page.locator('#case-documents-heading').scrollIntoViewIfNeeded();
  await expect(page.locator('#case-documents-heading')).toBeInViewport();
 }
 await page.goto('/src/case-study/materials.html?preview=1&mode=slides&slide=3');
 await expect(page.locator('#page')).toHaveText('04 / 09');
 await expect(page.locator('.slide-transcript,#slideTranscript')).toHaveCount(0);
 await page.getByRole('button',{name:'다음 슬라이드',exact:true}).click();
 await expect(page.locator('#page')).toHaveText('05 / 09');
 await expect(page.locator('.slide-transcript,#slideTranscript')).toHaveCount(0);
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
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  const report=await page.evaluate(()=>{
   return [...document.querySelectorAll('.slide')].map((section,index)=>{
    const elements=[...section.children].filter(node=>{
      const style=getComputedStyle(node);
      return style.display!=='none'&&style.visibility!=='hidden'&&node.getBoundingClientRect().height>0;
    });
    const label=node=>node.tagName.toLowerCase()+(node.classList.length?'.'+[...node.classList].slice(0,2).join('.'):'');
    const pairs=[];
    for(let i=1;i<elements.length;i++){
     const previous=elements[i-1],current=elements[i];
     pairs.push({from:label(previous),to:label(current),gap:Math.round(current.getBoundingClientRect().top-previous.getBoundingClientRect().bottom)});
    }
    return {section:index+1,count:elements.length,pairs};
   });
  });
  const notable=report.flatMap(x=>x.pairs.filter(p=>p.gap>76||p.gap< -10).map(p=>({section:x.section,...p})));
  expect(notable,JSON.stringify({width,notable})).toHaveLength(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const text=await page.locator('#section-05').textContent();
  expect(text).toContain('충원 75% · 취소 8% · 취소 후 완료 97%');
  expect(text).toContain('공급 유지율 100% · 플랫폼 예약 비중 60%');
  expect(text).toContain('주 4회');
  expect(text).not.toContain('기준 산정 기준');
  const yearText=await page.locator('#section-08').textContent();
  for(const year of [1,2,3,4,5]){
   expect(yearText).toContain(year+'년 차');
   expect(yearText).not.toContain(year+'년차');
  }
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
