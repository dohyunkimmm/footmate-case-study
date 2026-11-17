const {test,expect}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;

test('Strategy summaries preserve the existing nine-section and 31-table report',async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.slide')).toHaveCount(9);
  await expect(page.locator('.toc-item')).toHaveCount(9);
  await expect(page.locator('.track table')).toHaveCount(31);
  await expect(page.locator('#section-02 .fm-strategy-addendum')).toContainText('시장 진입 전략');
  await expect(page.locator('#section-03 .fm-strategy-addendum')).toContainText('운영 주체와 시설 사용권을 먼저 확인한다.');
  await expect(page.locator('#section-08 .fm-strategy-addendum')).toContainText('성장·투자 논리');
  await expect(page.locator('#section-08 .fm-strategy-links')).toHaveCount(0);
  const resources=page.locator('#section-01 #attachments');
  await expect(resources.locator('.case-deck-card')).toHaveCount(3);
  await expect(resources.locator('a[download]')).toHaveCount(3);
  await expect(resources.locator('.case-deck-card').nth(2)).toContainText('사업 전략');
  await expect(resources.getByRole('link',{name:'사업 전략 발표 보기'})).toHaveAttribute('href','/src/case-study/strategy-brief.html');
  const publicAddendumText = await page.locator('.fm-strategy-addendum').allTextContents();
  for (const text of publicAddendumText) expect(text).not.toMatch(/P0|P1|P2|보완|Short-list|데스크 리서치/);

  // Both the body and presentation text are rendered from one six-slide source.
  await expect(page.locator('#section-02 .fm-strategy-cards li')).toHaveCount(3);
  await expect(page.locator('#section-02 .fm-strategy-addendum')).toContainText('적격 제휴 의향 2곳');
  await expect(page.locator('#section-03 .fm-strategy-addendum')).toContainText('시설·서비스 8건');
  await page.locator('#section-08 .fm-strategy-more summary').click();
  await expect(page.locator('#section-08 .fm-strategy-cards article')).toHaveCount(3);
  await expect(page.locator('#section-08 .fm-strategy-addendum')).toContainText('5→12→20→28→36곳');
  await expect(page.locator('#section-08 .fm-strategy-addendum')).toContainText('4년 차 월 +0.6만원');

  await expect(page.locator('h1')).toHaveCount(1);
  expect(errors).toEqual([]);
});

for(const width of [320,390,1440]){
  test('separate editable strategy deck loads and navigates at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:900});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/src/case-study/strategy-brief.html');
    await expect(page.locator('.fm-presentation-slide')).toHaveCount(1);
    await expect(page.locator('.fm-deck-back')).toHaveAttribute('href','/#section-01');
    await expect(page.locator('.fm-deck-back')).toHaveText('← 본문으로');
    await expect(page.locator('.fm-deck-downloads a').nth(1)).toHaveText('다른 발표자료 보기');
    expect(await page.locator('body').innerText()).not.toMatch(/본문 발표자료로|&#x20;|사업성·중장기 전략 발표 보기/);
    await expect(page.locator('.fm-deck-title')).toHaveText('검증 후 투자');
    await expect(page.locator('#strategy-number')).toHaveText('01 / 06');
    await expect(page.locator('#strategy-picker option')).toHaveCount(6);
    expect(await page.locator('body').innerText()).not.toMatch(/P0|P1|P2|보완|핵심 판단|개인 분석/);

    await expect(page.locator('.fm-deck-points li')).toHaveCount(3);
    await expect(page.locator('.fm-deck-points')).toContainText('약 −38.7만원');
    await expect(page.locator('.fm-deck-points')).toContainText('변동비 별도 승인');
    await expect(page.locator('.fm-deck-points')).toContainText('인력 기회비용 포함 약 −238.7만원');
    await page.locator('#strategy-picker').selectOption('2');
    await expect(page.locator('.fm-deck-title')).toHaveText('제휴 가능성 검토');
    await expect(page.locator('.fm-deck-points')).toContainText('공개자료 비교 대상');
    await expect(page.locator('.fm-deck-points')).toContainText('실사 미진행');
    await page.locator('#strategy-picker').selectOption('4');
    await expect(page.locator('.fm-deck-points')).toContainText('플랫폼 경유 예약');
    await expect(page.locator('.fm-deck-points')).toContainText('30일 추적 완료자');
    await page.locator('#strategy-picker').selectOption('0');

    await page.locator('#strategy-next').click();
    await expect(page.locator('.fm-deck-title')).toHaveText('한 생활권에서 시작');
    await page.locator('#strategy-picker').selectOption('5');
    await expect(page.locator('.fm-deck-title')).toHaveText('확대 조건과 자원배분');
    await expect(page.locator('#strategy-next')).toBeDisabled();
    await expect(page.locator('#strategy-prev')).toBeEnabled();
    // A slide title must appear in the slide, not again above the download buttons.
    await expect(page.locator('#strategy-current, .fm-deck-main > .fm-deck-caption')).toHaveCount(0);
    await expect(page.locator('#strategy-deck + .fm-deck-downloads')).toHaveCount(1);
    await expect(page.locator('.fm-deck-top')).not.toContainText('사업 전략');
    await expect(page.locator('.fm-deck-main')).not.toContainText('재무 수치와 성장 전망은 사업 가정');
    const slideTitles=['검증 후 투자','한 생활권에서 시작','제휴 가능성 검토','제휴형을 먼저 검증','예약 수와 수익성을 함께 관리','확대 조건과 자원배분'];
    for(const [i,heading] of slideTitles.entries()){
      await page.locator('#strategy-picker').selectOption(String(i));
      await expect(page.locator('#strategy-deck h2')).toHaveText(heading);
      const repeated=await page.evaluate(()=>{
        let node=document.getElementById('strategy-deck').nextElementSibling;
        let following='';
        while(node){following+=node.textContent+' ';node=node.nextElementSibling;}
        return following;
      });
      expect(repeated).not.toContain(heading);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    if(width===390){
      const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(result.violations).toEqual([]);
    }
    const download=await page.request.get('/src/case-study/downloads/footmate_strategy_p0_p2.pptx');
    expect(download.ok()).toBe(true);
    const bytes=await download.body();
    expect(bytes.subarray(0,4).toString('hex')).toBe('504b0304');
    expect(bytes.length).toBeGreaterThan(15000);
    await page.locator('.fm-deck-back').click();
    await expect(page).toHaveURL(/\/#section-01$/);
    await expect(page.locator('#section-01 #attachments .case-deck-card')).toHaveCount(3);
    expect(errors).toEqual([]);
  });
}
