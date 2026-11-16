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
  await expect(page.locator('#section-03 .fm-strategy-addendum')).toContainText('확정된 제휴·투자 대상은 없다.');
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
  await expect(page.locator('#section-02 .fm-strategy-addendum')).toContainText('적격 의향 2곳');
  await expect(page.locator('#section-03 .fm-strategy-addendum')).toContainText('공개자료 조사 대상 8건');
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
    await expect(page.locator('.fm-deck-title')).toHaveText('검증 후 투자');
    await expect(page.locator('#strategy-number')).toHaveText('01 / 06');
    await expect(page.locator('#strategy-picker option')).toHaveCount(6);
    expect(await page.locator('body').innerText()).not.toMatch(/P0|P1|P2|보완|핵심 판단|개인 분석/);

    await expect(page.locator('.fm-deck-points li')).toHaveCount(3);
    await expect(page.locator('.fm-deck-points')).toContainText('약 −38.7만원');
    await expect(page.locator('.fm-deck-points')).toContainText('변동비 별도 승인');

    await page.locator('#strategy-next').click();
    await expect(page.locator('.fm-deck-title')).toHaveText('한 생활권에서 시작');
    await page.locator('#strategy-picker').selectOption('5');
    await expect(page.locator('.fm-deck-title')).toHaveText('성장보다 수익성 검증');
    await expect(page.locator('#strategy-next')).toBeDisabled();
    await expect(page.locator('#strategy-prev')).toBeEnabled();
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
    expect(errors).toEqual([]);
  });
}
