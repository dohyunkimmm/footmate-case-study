/* FootMate 신사업 사업성 분석·경영계획 · main presentation */
(() => {
'use strict';
// Restore native history scrolling when returning from the former paged reader.
if ('scrollRestoration' in history) history.scrollRestoration='auto';
const sections = [
  {
    "name": "추진 배경·검토 결론",
    "title": "풋살 매칭 플랫폼의 사업성 검토 및 중장기 경영계획",
    "lead": "시장·경쟁 분석부터 수익구조 설계, 손익분기점 분석, 5개년 경영계획 및 투자 판단까지.",
    "body": "<div class=\"case-verdict\"><span class=\"case-status\">핵심 판단</span><h2>운영자 제휴로 시작하고,<br>수익성 확인 후 투자한다.</h2><p>수수료와 결제비 부담 조건을 먼저 협상합니다.</p></div><nav class=\"case-quicklinks\" aria-label=\"핵심 분석 바로가기\"><a href=\"#section-05\">수익성·손익분기 분석</a><a href=\"#section-09\">5개년 경영계획·투자 판단</a></nav><dl class=\"case-kpis\" aria-label=\"기준 시나리오 주요 수치\"><div class=\"case-kpi\"><dt>월 완료 예약 · 가정</dt><dd>626<small>건</small></dd></div><div class=\"case-kpi\"><dt>예약당 공헌이익 · 가정</dt><dd>340<small>원</small></dd></div><div class=\"case-kpi\"><dt>예상 월 현금 손익</dt><dd class=\"is-negative\">약 −38.7<small>만 원</small></dd></div></dl><p class=\"case-scenario-note\">가정 기반 월간 시나리오 · 제휴 5곳 · 수수료 10% · 결제비 3%</p><div class=\"decision-grid\" aria-label=\"문제·수행 범위·핵심 판단\"><article class=\"decision-card\"><p class=\"decision-card-label\">검토 배경</p><h3>지역 공급과 참가 수요</h3><p>초기 생활권에서 공급 확보와 참가 완료 가능성 확인.</p></article><article class=\"decision-card\"><p class=\"decision-card-label\">수행 범위</p><h3>사업성 분석부터 경영계획까지</h3><p>시장·경쟁, 수익구조·손익 모델, 5개년 계획과 투자 판단.</p></article><article class=\"decision-card\"><p class=\"decision-card-label\">핵심 판단</p><h3>기존 운영자 제휴 우선</h3><p>제휴·재참가 우선 확인, 결제·정산은 후속.</p></article></div><div class=\"case-evidence-note\" aria-label=\"서비스 데모 안내\"><p><strong>보조 자료:</strong> 참가·취소·정원 관리와 추천 기능의 동작 예시.</p></div><section id=\"attachments\" class=\"case-documents\" aria-labelledby=\"case-documents-heading\"><div class=\"case-documents-head\"><div class=\"case-documents-intro\"><h2 id=\"case-documents-heading\">발표자료</h2></div><div class=\"case-downloads\" aria-label=\"원본 발표자료\"><a href=\"/src/case-study/downloads/footmate_report.pptx\" download=\"footmate_report.pptx\">기획 자료 받기</a><a href=\"/src/case-study/downloads/footmate_5year_strategy.pptx\" download=\"footmate_5year_strategy.pptx\">전략 자료 받기</a></div></div><div class=\"case-deck-stack\"><details class=\"case-doc-preview case-report-preview\"><summary><span class=\"case-preview-summary-main\"><span class=\"case-preview-symbol\" aria-hidden=\"true\">01</span><span class=\"case-preview-summary-text\"><strong>사업성 분석·경영계획</strong><span class=\"case-preview-description\">사업성 검토 · 손익분기 · 투자 판단</span></span></span><span class=\"case-preview-summary-side\"><span class=\"case-preview-count\">9장</span><span class=\"case-preview-action\">살펴보기</span><span class=\"case-preview-indicator\" aria-hidden=\"true\"></span></span></summary><div class=\"case-doc-preview-body\"><iframe class=\"case-ppt-frame\" title=\"사업성 분석·경영계획 슬라이드 9장\" allowfullscreen data-src=\"/src/case-study/materials.html?preview=1&viewer=20261108-copy-pruned\" loading=\"lazy\"></iframe></div></details><details class=\"case-doc-preview case-strategy-preview\"><summary><span class=\"case-preview-summary-main\"><span class=\"case-preview-symbol\" aria-hidden=\"true\">02</span><span class=\"case-preview-summary-text\"><strong>중장기 성장 전략</strong><span class=\"case-preview-description\">공급 확대 · 5개년 손익 · 성과관리</span></span></span><span class=\"case-preview-summary-side\"><span class=\"case-preview-count\">6장</span><span class=\"case-preview-action\">살펴보기</span><span class=\"case-preview-indicator\" aria-hidden=\"true\"></span></span></summary><div class=\"case-doc-preview-body\"><iframe class=\"case-ppt-frame\" title=\"중장기 성장 전략 슬라이드 6장\" allowfullscreen data-src=\"/src/case-study/materials.html?preview=1&deck=strategy&viewer=20261108-copy-pruned\" loading=\"lazy\"></iframe></div></details></div></section>"
  },
  {
    "name": "시장·경쟁 분석",
    "title": "지역 수요·경쟁 분석",
    "lead": "초기 진입 지역의 공급 여건과 주요 서비스를 비교한다.",
    "body": "<p>시장·경쟁은 공개 자료로 분석하고, 지불 의향은 면담·가격 실험으로 검증합니다.</p><div class=\"table-wrap\" role=\"region\" aria-label=\"고객·공급별 확인 항목\" tabindex=\"0\"><table><caption>고객·공급별 확인 항목</caption><thead><tr><th scope=\"col\">대상</th><th scope=\"col\">제공 가치</th><th scope=\"col\">확인할 조건</th></tr></thead><tbody><tr><th scope=\"row\">개인 참가자</th><td data-label=\"제공 가치\">개인 단위로 지역·시간·수준에 맞는 모집 경기 선택</td><td data-label=\"확인할 조건\">예약 의향, 실제 참가, 30일 내 재참가</td></tr><tr><th scope=\"row\">기존 경기 운영자</th><td data-label=\"제공 가치\">모집 경기의 추가 노출과 잔여 자리 충원</td><td data-label=\"확인할 조건\">노출·예약 연동 허용, 정확한 정원 정보, 정산 조건</td></tr><tr><th scope=\"row\">초기 진입 지역</th><td data-label=\"제공 가치\">수원·용인 중 공급 확보가 가능한 한 생활권부터 현장 검증</td><td data-label=\"확인할 조건\">제휴 가능한 운영자·경기 시간·참가자 모집 경로</td></tr></tbody></table></div><div class=\"card-grid\"><article class=\"story-card\"><h2>우선 검토 방향</h2><p>퇴근·주말 수요와 지역별 경기 공급 확인.</p></article><article class=\"story-card\"><h2>검증 단계</h2><p>면담 → 무료 시범 운영 → 유료 의향·재참가 확인.</p></article></div><p class=\"source-note\">근거 · <a href=\"https://www.mcst.go.kr/site/s_policy/subPolicy/sportstour/sportstour29.jsp\" target=\"_blank\" rel=\"noopener noreferrer\">문화체육관광부 2025년 국민생활체육조사 ↗</a></p><p class=\"source-note\">근거 · <a href=\"https://www.plabfootball.com/\" target=\"_blank\" rel=\"noopener noreferrer\">플랩풋볼 공식 서비스 ↗</a></p><h2 class=\"block-title\">경쟁·진입 전략</h2><div class=\"table-wrap\" role=\"region\" aria-label=\"경쟁과 대안 비교\" tabindex=\"0\"><table><caption>경쟁과 대안 비교</caption><thead><tr><th scope=\"col\">대안</th><th scope=\"col\">공개 자료</th><th scope=\"col\">FootMate의 대응</th></tr></thead><tbody><tr><th scope=\"row\">플랩풋볼</th><td data-label=\"공개 자료\">소셜 매치·구장 예약과 레벨·매너·AI 팀 배정 관련 안내 제공</td><td data-label=\"FootMate의 대응\">경기 추천과 함께 공급 정보의 정확성과 운영 신뢰도를 강화</td></tr><tr><th scope=\"row\">퍼즐플레이</th><td data-label=\"공개 자료\">경기 모집·기록·영상·랭크 기능과 유료 참가 경기 제공</td><td data-label=\"FootMate의 대응\">생활권별 경기 연결·정원 정보 관리</td></tr><tr><th scope=\"row\">운영자 직접 모집</th><td data-label=\"공개 자료\">운영자 모집 채널·정원·정산 방식 확인.</td><td data-label=\"FootMate의 대응\">모집 시간·추가 충원 효과 비교.</td></tr><tr><th scope=\"row\">FootMate 제안</th><td data-label=\"공개 자료\">지역·시간·수준에 맞는 경기 탐색과 참가·정원·운영 관리 제안</td><td data-label=\"FootMate의 대응\">지역·운영자별 공급 정확도와 참가 완료를 검증한 뒤 확장</td></tr></tbody></table></div><div class=\"card-grid\"><article class=\"story-card\"><h2>진입 방식</h2><p>한 생활권·핵심 시간대부터 시작.</p></article><article class=\"story-card\"><h2>추천 효과 검증</h2><p>기본 정렬 대비 참가·재참가 비교 후 AI 투자 결정.</p></article></div><p class=\"source-note\">근거 · <a href=\"https://www.plabfootball.com/faq?category=22\" target=\"_blank\" rel=\"noopener noreferrer\">플랩풋볼 레벨 안내 ↗</a></p><p class=\"source-note\">근거 · <a href=\"https://puzzleplay.kr/faq\" target=\"_blank\" rel=\"noopener noreferrer\">퍼즐플레이 공식 FAQ · 경기·랭크 운영 ↗</a></p><p class=\"source-note\">경쟁 정보 확인 · 2026-11-08 · 참가비·수수료는 별도 사업 가정</p>"
  },
  {
    "name": "사업모델·역할",
    "title": "사업모델 비교·제휴형 선택",
    "lead": "누가 모집·운영·취소·정산 책임을 갖는지 먼저 정의한다.",
    "body": "<p class=\"decision\">운영자 제휴형으로 시작하고, 직접 운영·구독형은 검증 후 검토한다.</p><div class=\"table-wrap\" role=\"region\" aria-label=\"사업모델 비교\" tabindex=\"0\"><table><caption>사업모델 비교</caption><thead><tr><th scope=\"col\">모델</th><th scope=\"col\">수익 구조</th><th scope=\"col\">비용·운영 요건</th><th scope=\"col\">판단</th></tr></thead><tbody><tr><th scope=\"row\">제휴형 경기 연결</th><td data-label=\"수익 구조\">완료 예약 거래액의 수수료</td><td data-label=\"비용·운영 요건\">운영자 공급 연동·고객 대응·정산 필요</td><td data-label=\"판단\">초기 현장 검증 우선안</td></tr><tr><th scope=\"row\">직접 경기 운영</th><td data-label=\"수익 구조\">참가비 총액에서 운영 원가 차감</td><td data-label=\"비용·운영 요건\">구장 대관·매니저 확보·최소 운영 인원·기상 대응 필요</td><td data-label=\"판단\">충원율과 운영 역량 확보 후 검토</td></tr><tr><th scope=\"row\">운영 도구 구독</th><td data-label=\"수익 구조\">운영자별 월 구독료</td><td data-label=\"비용·운영 요건\">업무 효율 가치·지불 의향 검증 필요</td><td data-label=\"판단\">지불 의향 확인 후 후속 검토</td></tr></tbody></table></div><details class=\"case-extra\"><summary>제휴형 운영 책임·유료 전환 요건</summary><div class=\"detail-body\"><div class=\"table-wrap\" role=\"region\" aria-label=\"제휴형 운영 책임 제안\" tabindex=\"0\"><table><caption>제휴형 운영 책임 제안</caption><thead><tr><th scope=\"col\">주체</th><th scope=\"col\">역할</th><th scope=\"col\">계약 전 확인</th></tr></thead><tbody><tr><th scope=\"row\">FootMate</th><td data-label=\"역할\">경기 노출·조건 추천·참가 기록·문의 접수·정산 금액 대조</td><td data-label=\"계약 전 확인\">거래 주체, 결제·환불 책임, 수수료 정산 기준</td></tr><tr><th scope=\"row\">경기 운영자</th><td data-label=\"역할\">경기 개설·정원 기준 정보·현장 진행·취소 결정</td><td data-label=\"계약 전 확인\">인원 미달·기상·노쇼·안전 대응과 정보 갱신 책임</td></tr><tr><th scope=\"row\">참가자</th><td data-label=\"역할\">조건·정책 확인 후 직접 참가 확정</td><td data-label=\"계약 전 확인\">취소 기한·출석·환불 조건 확인</td></tr></tbody></table></div><p aria-label=\"참가·결제는 이용자가 직접 확정하도록 설계한다.\">결제·환불·정산은 계약 후 확정. 참가·결제는 이용자 직접 승인.</p></div></details><details class=\"case-extra\"><summary>대안별 전환 조건·제휴 협상 근거</summary><div class=\"detail-body\"><h3>대안 선택·전환 조건</h3><div class=\"table-wrap\" role=\"region\" aria-label=\"사업모델 선택 기준\" tabindex=\"0\"><table><caption>사업모델 선택 기준</caption><thead><tr><th scope=\"col\">대안</th><th scope=\"col\">초기 투자·운영 범위</th><th scope=\"col\">선택 이유·전환 조건</th></tr></thead><tbody><tr><th scope=\"row\">제휴형 연결 · 우선 현장 검증</th><td data-label=\"초기 투자·운영 범위\">기존 경기 공급 연결. 연동·고객 대응·정산 비용 확인</td><td data-label=\"선택 이유·전환 조건\">공급 일정·수수료·정산 조건 확보 후 현장 검증</td></tr><tr><th scope=\"row\">직접 운영 · 조건부 대안</th><td data-label=\"초기 투자·운영 범위\">대관·매니저·현장 운영. 손익분기 14명(월 비용 별도).</td><td data-label=\"선택 이유·전환 조건\">반복 수요·현장 인력 확보, 취소 비용 포함 손익 검토 후 전환</td></tr><tr><th scope=\"row\">운영 도구 구독 · 후속 대안</th><td data-label=\"초기 투자·운영 범위\">운영 시간·도입 비용·지원 원가 조사. 구독료·전환율은 후속 검증</td><td data-label=\"선택 이유·전환 조건\">반복 업무·지불 의향 확인 후 구독 방식 시험 운영</td></tr></tbody></table></div><h3>제휴·영업 전략 의사결정 요약</h3><div class=\"table-wrap\" role=\"region\" tabindex=\"0\" aria-label=\"제휴 전략 의사결정표\"><table><caption>제휴·영업 전략 의사결정표 · 산정 근거</caption><thead><tr><th scope=\"col\">우선 검토</th><th scope=\"col\">제휴·협상 조건</th><th scope=\"col\">손익 영향과 판단</th></tr></thead><tbody><tr><th scope=\"row\">1 · 초기 공급 확보</th><td data-label=\"제휴·협상 조건\">운영자의 실제 슬롯·정원·취소 책임·수수료 수용 범위 확인</td><td data-label=\"손익 영향과 판단\">기준 10%·340원/건. 공급·책임 기준을 합의한 뒤 진행.</td></tr><tr><th scope=\"row\">2 · 조건별 협상</th><td data-label=\"제휴·협상 조건\">수수료 12%, 플랫폼 결제비 운영자 부담을 개별·복합 비교</td><td data-label=\"손익 영향과 판단\">12% 580원·결제비 0% 700원·복합 940원/건.</td></tr><tr><th scope=\"row\">3 · 조건부 확대</th><td data-label=\"제휴·협상 조건\">공급 유지율·플랫폼 예약 비중·추가 관리비를 동일 기간에 재계산</td><td data-label=\"손익 영향과 판단\">복합 협상 · 6번째부터 월 3만 원/곳. 손익분기 약 28곳.</td></tr><tr><th scope=\"row\">협상 제안 · 우선안</th><td data-label=\"제휴·협상 조건\">수수료 12% · 결제비 운영자 부담</td><td data-label=\"손익 영향과 판단\">940원/건. 우선안으로 견적과 예상 손익 대조.</td></tr><tr><th scope=\"row\">협상 제안 · 조정안</th><td data-label=\"제휴·협상 조건\">수수료 10% 유지 · 결제비 운영자 부담</td><td data-label=\"손익 영향과 판단\">700원/건. 공급 확약을 전제로 확대 손익 재산정.</td></tr><tr><th scope=\"row\">계약 검토 · 운영 책임</th><td data-label=\"제휴·협상 조건\">운영자 취소 승인·환불 실행 / 플랫폼 문의 접수</td><td data-label=\"손익 영향과 판단\">정산 주기·수수료 차감·환불 차액 대사 기준 합의.</td></tr><tr><th scope=\"row\">계약 검토 · 집행 조건</th><td data-label=\"제휴·협상 조건\">슬롯·취소 기준·정산 내역을 계약 부속표에 명시</td><td data-label=\"손익 영향과 판단\">결제·환불·정산 책임 합의 후 유료 시범 승인.</td></tr></tbody></table></div></div></details>"
  },
  {
    "name": "수요·공급 시나리오",
    "title": "플랫폼 예약·거래 규모 추정",
    "lead": "공급량과 참가율에 따른 월 예약 건수를 추정한다.",
    "body": "<p>예약 비중 60%·취소율 8%·취소 후 완료율 97%. 슬롯은 경기 1회.</p><figure class=\"model-funnel\"><figcaption>기준 모델의 거래 전환 · 월</figcaption><ol><li><span>전체 공급</span><strong>약 1,559석</strong></li><li><span>충원 75%</span><strong>약 1,169석</strong></li><li><span>플랫폼 예약 비중 60%</span><strong>약 701건</strong></li><li><span>취소 후 92%</span><strong>약 645건</strong></li><li><span>완료 97%</span><strong>626건</strong></li></ol><p class=\"source-note\">중간값은 근삿값이며 최종 완료 예약만 정수로 반올림한다.</p></figure><p class=\"formula\">월 완료 예약 = 공급처 × 주간 슬롯 × 4.33주 × 정원 × 충원율 × 플랫폼 예약 비중 × (1 − 취소율) × 완료율</p><div class=\"table-wrap\" role=\"region\" aria-label=\"월 공급·거래 시나리오\" tabindex=\"0\"><table><caption>월 공급·거래 시나리오</caption><thead><tr><th scope=\"col\">변수</th><th scope=\"col\">보수</th><th scope=\"col\">기준</th><th scope=\"col\">확장</th></tr></thead><tbody><tr><th scope=\"row\">제휴 공급처</th><td data-label=\"보수\">2곳</td><td data-label=\"기준\">5곳</td><td data-label=\"확장\">8곳</td></tr><tr><th scope=\"row\">공급처당 주간 슬롯</th><td data-label=\"보수\">2회</td><td data-label=\"기준\">4회</td><td data-label=\"확장\">6회</td></tr><tr><th scope=\"row\">슬롯 정원</th><td data-label=\"보수\">18명</td><td data-label=\"기준\">18명</td><td data-label=\"확장\">18명</td></tr><tr><th scope=\"row\">충원율</th><td data-label=\"보수\">50%</td><td data-label=\"기준\">75%</td><td data-label=\"확장\">90%</td></tr><tr><th scope=\"row\">FootMate 예약 비중</th><td data-label=\"보수\">60%</td><td data-label=\"기준\">60%</td><td data-label=\"확장\">60%</td></tr><tr><th scope=\"row\">취소율 / 취소 후 완료율</th><td data-label=\"보수\">8% / 97%</td><td data-label=\"기준\">8% / 97%</td><td data-label=\"확장\">8% / 97%</td></tr><tr><th scope=\"row\">월 완료 예약 · 최종 반올림</th><td data-label=\"보수\">83건</td><td data-label=\"기준\">626건</td><td data-label=\"확장\">1,803건</td></tr><tr><th scope=\"row\">건당 거래금액</th><td data-label=\"보수\">12,000원</td><td data-label=\"기준\">12,000원</td><td data-label=\"확장\">12,000원</td></tr><tr><th scope=\"row\">월 완료 거래액</th><td data-label=\"보수\">996,000원</td><td data-label=\"기준\">7,512,000원</td><td data-label=\"확장\">21,636,000원</td></tr><tr><th scope=\"row\">수수료 매출 · 10%</th><td data-label=\"보수\">99,600원</td><td data-label=\"기준\">751,200원</td><td data-label=\"확장\">2,163,600원</td></tr></tbody></table></div><p>공급처=계약 운영자. 중복 제외. 예약·이용자 별도 집계.</p><details><summary>산정 기준 점검·갱신</summary><div class=\"detail-body\"><p>제휴·충원율 실측 후 갱신.</p><p>참가비 12,000원·수수료 10%는 검토 기준.</p></div></details>"
  },
  {
    "name": "수익성·손익분기점",
    "title": "단위 손익·투자 조건",
    "lead": "기준 거래와 협상안의 수익성을 비교한다.",
    "body": "<div class=\"reader-summary\"><h3>손익 판단 요약</h3><div class=\"case-profit-summary\"><div><span>기준 가정 · 제휴 5곳</span><strong>월 현금 −38.7만 원</strong><p>626건 × 공헌이익 340원</p><p>기회비용 포함 −238.7만 원</p></div><div><span>협상안 · 수수료 12%, 결제비 0%</span><strong>손익분기 공급처 28곳</strong><p>공헌이익 940원 · 추가 관리비 포함</p><p>기회비용 포함 · 관리비 제외 23곳</p></div></div></div><figure class=\"case-economics-chart\" aria-labelledby=\"case-economics-heading\"><figcaption><span class=\"case-visual-eyebrow\">산정 조건별 비교 · 1건당</span><strong id=\"case-economics-heading\">협상 조건별 공헌이익</strong><span>수수료와 결제비 부담에 따른 변화</span></figcaption><div class=\"case-economics-rows\"><div class=\"case-economics-row\"><span class=\"case-economics-name\">기준 · 10%, 결제비 3%</span><div class=\"case-economics-track\" aria-hidden=\"true\"><span style=\"width:36.2%\"></span></div><strong class=\"case-economics-value\">340원</strong></div><div class=\"case-economics-row\"><span class=\"case-economics-name\">수수료 협상 · 12%</span><div class=\"case-economics-track\" aria-hidden=\"true\"><span style=\"width:61.7%\"></span></div><strong class=\"case-economics-value\">580원</strong></div><div class=\"case-economics-row\"><span class=\"case-economics-name\">결제비 운영자 부담</span><div class=\"case-economics-track\" aria-hidden=\"true\"><span style=\"width:74.5%\"></span></div><strong class=\"case-economics-value\">700원</strong></div><div class=\"case-economics-row is-best\"><span class=\"case-economics-name\">복합 협상 · 12%, 결제비 0%</span><div class=\"case-economics-track\" aria-hidden=\"true\"><span style=\"width:100%\"></span></div><strong class=\"case-economics-value\">940원</strong></div></div><p>참가비 12,000원 · 변동비 500원/건 · 고정비 차감 전</p></figure><section id=\"case-profit-model\" class=\"case-profit-model\" aria-labelledby=\"profit-model-title\"><div class=\"case-profit-head\"><h3 id=\"profit-model-title\">공급 확대 손익 계산</h3><button id=\"case-profit-reset\" type=\"button\">초기화</button></div><p class=\"case-model-context\">협상안 계산 · 기본 시나리오와 별도 · 기회비용 포함.</p><div class=\"case-profit-inputs\"><label>공급처 수<input id=\"case-profit-partners\" type=\"number\" min=\"1\" max=\"500\" step=\"1\" value=\"28\" required></label><label>수수료율 (%)<input id=\"case-profit-rate\" type=\"number\" min=\"0\" max=\"100\" step=\"1\" value=\"12\" required></label><label>결제비 (%)<input id=\"case-profit-pg\" type=\"number\" min=\"0\" max=\"100\" step=\"1\" value=\"0\" required></label><label>추가 관리비 (원/곳)<input id=\"case-profit-cost\" type=\"number\" min=\"0\" max=\"1000000\" step=\"1000\" value=\"30000\" required></label></div><p id=\"case-profit-error\" class=\"case-profit-error\" role=\"alert\" hidden>입력 범위를 확인하세요. 붉게 표시된 입력칸을 수정해 주세요.</p><div class=\"case-profit-results\" aria-live=\"polite\" aria-atomic=\"true\"><div><span>월 완료 예약</span><strong id=\"case-profit-orders\">3,506건</strong></div><div><span>예약당 공헌이익</span><strong id=\"case-profit-unit\">940원</strong></div><div><span>기회비용 포함 월 손익</span><strong id=\"case-profit-economic\">+5,640원</strong></div><div><span>손익분기 공급처</span><strong id=\"case-profit-bep\">28곳</strong></div></div><p class=\"case-profit-note\">산정 기준 · 충원 75% / 예약 60% / 취소 8% / 완료 97% / 유지 100%</p><div class=\"case-compare\" aria-labelledby=\"case-compare-title\"><h4 id=\"case-compare-title\">같은 공급처 수로 비교</h4><p>기회비용과 추가 관리비를 포함한 월 손익입니다.</p><dl aria-live=\"polite\"><div><dt>기준안 · 10% / 3%</dt><dd data-compare=\"base\">—</dd></div><div><dt>조정안 · 10% / 0%</dt><dd data-compare=\"fallback\">—</dd></div><div><dt>우선안 · 12% / 0%</dt><dd data-compare=\"preferred\">—</dd></div></dl></div></section><div class=\"table-wrap\" role=\"region\" aria-label=\"제휴형 예약 1건의 단위 손익 · 산정 기준\" tabindex=\"0\"><table><caption>제휴형 예약 1건의 단위 손익 · 산정 기준</caption><thead><tr><th scope=\"col\">항목</th><th scope=\"col\">금액·계산</th><th scope=\"col\">의미</th></tr></thead><tbody><tr><th scope=\"row\">수수료 수익</th><td data-label=\"금액\">12,000원 × 10% = 1,200원</td><td data-label=\"의미\">거래액 중 플랫폼 수수료만 수익으로 산정</td></tr><tr><th scope=\"row\">결제 비용</th><td data-label=\"금액\">12,000원 × 3% = 360원</td><td data-label=\"의미\">플랫폼이 거래액 기준 결제 비용을 지출하는 산정 기준</td></tr><tr><th scope=\"row\">기타 변동비</th><td data-label=\"금액\">500원</td><td data-label=\"의미\">고객 대응 150원 + 고객 확보비 배분 300원 + IT·AI 50원</td></tr><tr><th scope=\"row\">예약당 공헌이익</th><td data-label=\"금액\">1,200 − 360 − 500 = 340원</td><td data-label=\"의미\">고정비 차감 전</td></tr><tr><th scope=\"row\">월 고정비</th><td data-label=\"금액\">600,000원</td><td data-label=\"의미\">현금비용 산정 기준 · 다음 섹션에 구성</td></tr><tr><th scope=\"row\">기회비용</th><td data-label=\"금액\">2,000,000원/월</td><td data-label=\"의미\">창업자 투입 시간의 환산 비용 · 현금 지출 아님</td></tr></tbody></table></div><p class=\"decision\">손익분기 · 현금 1,765건 / 기회비용 포함 7,648건</p><details class=\"case-extra\"><summary>월 손익 민감도·직접 운영 기준</summary><div class=\"detail-body\"><div class=\"case-evidence-part\"><h4>월 사업 손익 민감도 · 보수·기준·확장 (산정 기준)</h4><div class=\"table-wrap\" role=\"region\" aria-label=\"월 사업 손익 민감도 · 대표 모델\" tabindex=\"0\"><table><caption>월 사업 손익 민감도 · 대표 모델</caption><thead><tr><th scope=\"col\">항목</th><th scope=\"col\">보수 83건</th><th scope=\"col\">기준 626건</th><th scope=\"col\">확장 1,803건</th></tr></thead><tbody><tr><th scope=\"row\">공헌이익 합계</th><td data-label=\"보수 83건\">28,220원</td><td data-label=\"기준 626건\">212,840원</td><td data-label=\"확장 1,803건\">613,020원</td></tr><tr><th scope=\"row\">현금 기준 손익</th><td data-label=\"보수 83건\">−571,780원</td><td data-label=\"기준 626건\">−387,160원</td><td data-label=\"확장 1,803건\">13,020원</td></tr><tr><th scope=\"row\">기회비용 포함</th><td data-label=\"보수 83건\">−2,571,780원</td><td data-label=\"기준 626건\">−2,387,160원</td><td data-label=\"확장 1,803건\">−1,986,980원</td></tr></tbody></table></div></div><div class=\"case-evidence-part\"><h4>직접 운영안과 계산 범위</h4><p>직접 운영 산정 기준 · 참가비 12,000원/인 · 정원 18명</p><p>경기 원가 150,000원(구장·매니저·기타)</p><p>결제비 360원·변동비 500원/건 · 월 고정비·기회비용 별도</p><p>손익분기 14명 · 18명 +50,520원 · 12명 −16,320원</p><p>추가 비용(세금·보증금·취소 손실 등)은 투자 심사에 반영한다.</p></div></div></details><details><summary>제휴 손익과 협상 근거</summary><div class=\"detail-body\"><div class=\"case-evidence-part\"><h4>기준 거래 계산·수수료 협상 비교표 자세히 보기</h4><p>04의 공급·거래 시나리오(기준 월 626건)를 동일하게 적용한다.</p><div class=\"table-wrap\"><table><thead><tr><th>산정 기준</th><th>월 정원</th><th>완료 예약</th><th>수수료 매출</th><th>현금 손익</th><th>기회비용 포함</th></tr></thead><tbody><tr><th scope=\"row\">5곳 × 주 4회 × 18명</th><td data-label=\"월 정원\">1,558.8석</td><td data-label=\"완료 예약\">626건</td><td data-label=\"수수료 매출\">751,200원</td><td data-label=\"현금 손익\">−387,160원</td><td data-label=\"기회비용 포함\">−2,387,160원</td></tr></tbody></table></div><div class=\"table-wrap\"><table><thead><tr><th>대안</th><th>수수료</th><th>플랫폼 결제비</th><th>건당 공헌이익</th><th>기회비용 포함 월 손익</th><th>손익분기 예약</th></tr></thead><tbody><tr><th scope=\"row\">기준</th><td data-label=\"수수료\">10%</td><td data-label=\"플랫폼 결제비\">3%</td><td data-label=\"건당 공헌이익\">340원</td><td data-label=\"기회비용 포함 월 손익\">−2,387,160원</td><td data-label=\"손익분기 예약\">7,648건</td></tr><tr><th scope=\"row\">수수료 협상</th><td data-label=\"수수료\">12%</td><td data-label=\"플랫폼 결제비\">3%</td><td data-label=\"건당 공헌이익\">580원</td><td data-label=\"기회비용 포함 월 손익\">−2,236,920원</td><td data-label=\"손익분기 예약\">4,483건</td></tr><tr><th scope=\"row\">결제비 운영자 부담</th><td data-label=\"수수료\">10%</td><td data-label=\"플랫폼 결제비\">0%</td><td data-label=\"건당 공헌이익\">700원</td><td data-label=\"기회비용 포함 월 손익\">−2,161,800원</td><td data-label=\"손익분기 예약\">3,715건</td></tr><tr><th scope=\"row\">복합 협상</th><td data-label=\"수수료\">12%</td><td data-label=\"플랫폼 결제비\">0%</td><td data-label=\"건당 공헌이익\">940원</td><td data-label=\"기회비용 포함 월 손익\">−2,011,560원</td><td data-label=\"손익분기 예약\">2,766건</td></tr></tbody></table></div><p>복합 협상 우선 검토. 제휴 수용성·공급 유지·관리비 확인 후 확대.</p></div><div class=\"case-evidence-part\"><h4>공급 유지율·플랫폼 예약 비중별 비교</h4><p class=\"decision\">추가 관리비 · 23곳 −43.3만 원 / 28곳 +0.6만 원</p><p>관리비 · 6번째 공급처부터 곳당 월 3만 원 별도.</p><div class=\"table-wrap\" role=\"region\" aria-label=\"공급 확대·협상 민감도 · 추가 산정 기준\" tabindex=\"0\"><table><caption>공급 확대·협상 민감도 · 추가 산정 기준</caption><thead><tr><th scope=\"col\">조건</th><th scope=\"col\">월 완료·추가 관리비</th><th scope=\"col\">기회비용 포함 월 손익</th></tr></thead><tbody><tr><th scope=\"row\">23곳 · 관리비 증가 제외</th><td data-label=\"월 완료·추가 관리비\">2,880건 · 0원</td><td data-label=\"기회비용 포함 월 손익\">+107,200원</td></tr><tr><th scope=\"row\">23곳 · 추가 1곳당 월 3만 원</th><td data-label=\"월 완료·추가 관리비\">2,880건 · 540,000원</td><td data-label=\"기회비용 포함 월 손익\">−432,800원</td></tr><tr><th scope=\"row\">23곳 · 공급 유지율 80%</th><td data-label=\"월 완료·추가 관리비\">2,304건 · 540,000원</td><td data-label=\"기회비용 포함 월 손익\">−974,240원</td></tr><tr><th scope=\"row\">23곳 · 유지율 80%·플랫폼 예약 비중 48%</th><td data-label=\"월 완료·추가 관리비\">1,843건 · 540,000원</td><td data-label=\"기회비용 포함 월 손익\">−1,407,580원</td></tr><tr><th scope=\"row\">28곳 · 유지율 100%·플랫폼 예약 비중 60%</th><td data-label=\"월 완료·추가 관리비\">3,506건 · 690,000원</td><td data-label=\"기회비용 포함 월 손익\">+5,640원</td></tr></tbody></table></div><p class=\"source-note\">유지율=실제 공급처 비중. 플랫폼 예약 비중 48%(기준 −20%).</p><p>관리비 반영 손익분기는 28곳. 증설·취소 비용은 후속 검토한다.</p></div><div class=\"case-evidence-part\"><h4>손익 계산과 거래 기록 비교</h4><div class=\"table-wrap\" role=\"region\" aria-label=\"계산에 포함하는 비용과 대조 방법\" tabindex=\"0\"><table><caption>계산에 포함하는 비용과 대조 방법</caption><thead><tr><th scope=\"col\">구분</th><th scope=\"col\">포함 범위</th><th scope=\"col\">대조 방법</th></tr></thead><tbody><tr><th scope=\"row\">예상 월 손익</th><td data-label=\"포함 범위\">완료 건수 × 건당 공헌이익 − 월 고정비·기회비용</td><td data-label=\"대조 방법\">가격·수수료·비용 조건 간 비교</td></tr><tr><th scope=\"row\">거래 원장(거래별 매출·환불·비용 기록)</th><td data-label=\"포함 범위\">완료·취소·노쇼별 실제 배분 비용과 환불·수수료</td><td data-label=\"대조 방법\">같은 기간·같은 거래 집단의 매출과 비용 집계</td></tr><tr><th scope=\"row\">차이 원인 분석</th><td data-label=\"포함 범위\">수수료 매출 차이 − 취소·노쇼 비용 − 완료 건 비용 − 고정비 차이</td><td data-label=\"대조 방법\">거래 기록의 현금 손익과 대조. 기회비용은 양쪽에 동일하게 반영</td></tr></tbody></table></div><p>원장 대조 · 중복 차감 금지. 건수·매출·환불 일치.</p></div></div></details><section class=\"roi-projection\" id=\"roi-analysis\" aria-labelledby=\"roi-projection-heading\"><div class=\"roi-heading\"><span class=\"roi-section-label\">본문 05 · 손익 검토</span><h3 class=\"roi-title\" id=\"roi-projection-heading\">12개월 비용 대비 예상 손익률</h3></div><dl class=\"roi-highlights\" aria-label=\"ROI 핵심 산정 기준\"><div><dt>산출 기간</dt><dd>12개월</dd></div><div><dt>기준 비용 대비 예상 손익률</dt><dd>−47.5%</dd></div><div><dt>확장 비용 대비 예상 손익률</dt><dd>−11.4%</dd></div></dl><figure class=\"roi-coverage\" aria-labelledby=\"roi-coverage-heading\"><figcaption><span class=\"case-visual-eyebrow\">시나리오별 비교</span><strong id=\"roi-coverage-heading\">현금비용 대비 수수료 매출 비중</strong></figcaption><div class=\"roi-coverage-rows\"><div class=\"roi-coverage-row\"><span class=\"roi-coverage-label\">보수</span><div class=\"roi-coverage-track\" aria-hidden=\"true\"><span style=\"width:10.3%\"></span></div><strong class=\"roi-coverage-value\">10.3%</strong></div><div class=\"roi-coverage-row is-reference\"><span class=\"roi-coverage-label\">기준</span><div class=\"roi-coverage-track\" aria-hidden=\"true\"><span style=\"width:52.5%\"></span></div><strong class=\"roi-coverage-value\">52.5%</strong></div><div class=\"roi-coverage-row\"><span class=\"roi-coverage-label\">확장</span><div class=\"roi-coverage-track\" aria-hidden=\"true\"><span style=\"width:88.6%\"></span></div><strong class=\"roi-coverage-value\">88.6%</strong></div><div class=\"roi-coverage-row\"><span class=\"roi-coverage-label\">확장·관리비 반영</span><div class=\"roi-coverage-track\" aria-hidden=\"true\"><span style=\"width:85.4%\"></span></div><strong class=\"roi-coverage-value\">85.4%</strong></div></div><p class=\"roi-scale-note\">100% = 총현금비용 충당 기준</p></figure><details class=\"roi-financial-details\"><summary>투자안별 손익률과 비용 산정</summary><div class=\"detail-body\"><div class=\"case-evidence-part\"><h4>시나리오별 금액·ROI 확인</h4><div class=\"table-wrap\" role=\"region\" aria-label=\"12개월 비용 대비 예상 손익률 산출 내역\" tabindex=\"0\"><table><caption>12개월 현금비용 기준 예상치</caption><thead><tr><th scope=\"col\">구분</th><th scope=\"col\">월 완료</th><th scope=\"col\">연 수수료 매출</th><th scope=\"col\">총현금비용</th><th scope=\"col\">예상 순손익</th><th scope=\"col\">비용 대비 예상 손익률</th></tr></thead><tbody><tr><th scope=\"row\">보수</th><td data-label=\"월 완료\">83건</td><td data-label=\"연 수수료 매출\">1,195,200원</td><td data-label=\"총현금비용\">11,556,560원</td><td data-label=\"예상 순손익\">−10,361,360원</td><td data-label=\"비용 대비 예상 손익률\">−89.7%</td></tr><tr><th scope=\"row\">기준</th><td data-label=\"월 완료\">626건</td><td data-label=\"연 수수료 매출\">9,014,400원</td><td data-label=\"총현금비용\">17,160,320원</td><td data-label=\"예상 순손익\">−8,145,920원</td><td data-label=\"비용 대비 예상 손익률\">−47.5%</td></tr><tr><th scope=\"row\">확장</th><td data-label=\"월 완료\">1,803건</td><td data-label=\"연 수수료 매출\">25,963,200원</td><td data-label=\"총현금비용\">29,306,960원</td><td data-label=\"예상 순손익\">−3,343,760원</td><td data-label=\"비용 대비 예상 손익률\">−11.4%</td></tr><tr><th scope=\"row\">확장·관리비 반영</th><td data-label=\"월 완료\">1,803건</td><td data-label=\"연 수수료 매출\">25,963,200원</td><td data-label=\"총현금비용\">30,386,960원</td><td data-label=\"예상 순손익\">−4,423,760원</td><td data-label=\"비용 대비 예상 손익률\">−14.6%</td></tr></tbody></table></div><p class=\"formula\">비용 대비 예상 손익률 = 연 순손익 ÷ 연 총현금비용 × 100</p></div><div class=\"case-evidence-part\"><h4>비용 산정 기준·산출 범위</h4><p>유료 완료 예약 12개월 지속 산정 기준</p><p>건당 수수료 매출 1,200원 · 변동비 860원</p><p>월 고정비 60만 원, 초기 구축 300만 원.</p><p>시범 운영비 50만 원 포함</p><p>인력 기회비용 월 200만 원 별도</p><p>기준 시나리오 · 기회비용 포함 ROI −78.1%</p><p>확장 시나리오 · 관리비 포함 ROI −14.6%</p><p>거래비용·정산·공급 조건 확인 후 재산출</p><p>세금·유료 전환 일정은 별도 검토</p></div></div></details><p class=\"source-note\">월 확장 손익 +13,020원은 초기 구축·시범 비용 제외.</p><p class=\"source-note\">비용 대비 예상 손익률 −11.4%: 초기 구축 300만·시범 50만 원 포함.</p></section>"
  },
  {
    "name": "IT 투자·시스템 구조",
    "title": "IT 구축 범위·투자 계획",
    "lead": "구현한 기능과 추가로 필요한 시스템을 구분한다.",
    "body": "<div class=\"decision-grid\" aria-label=\"구현·검증·후속 과제\"><article class=\"decision-card\"><p class=\"decision-card-label\">구현</p><h2>보조 서비스 구현</h2><p>로그인·경기·참가·취소·정원·AI·알림 구현.</p></article><article class=\"decision-card\"><p class=\"decision-card-label\">검증</p><h2>예시 데이터로 기능 확인</h2><p>참가·취소 흐름과 화면 접근성을 확인.</p></article><article class=\"decision-card\"><p class=\"decision-card-label\">후속 구축 항목</p><h2>유료 전환 시스템</h2><p>계약 조건을 확인한 뒤 결제·환불·정산 기능 구축.</p></article></div><h3>기능별 확인 결과</h3><div class=\"table-wrap\" role=\"region\" aria-label=\"구현·검증 요약\" tabindex=\"0\"><table><caption>구현·검증 요약</caption><thead><tr><th scope=\"col\">영역</th><th scope=\"col\">구현·확인 결과</th><th scope=\"col\">검증 범위·후속 과제</th></tr></thead><tbody><tr><th scope=\"row\">참가·취소</th><td data-label=\"구현 결과\">참가 시 정원 차감·취소 시 복원. 중복 참가 차단.</td><td data-label=\"후속 검증\">참가·정원 처리 구현. 실제 현장 운영은 별도 현장 검증</td></tr><tr><th scope=\"row\">이용 흐름</th><td data-label=\"구현 결과\">로그인 → 참가 → 새로고침 → 취소 흐름 확인.</td><td data-label=\"후속 검증\">화면 동작 검사. 실제 서버의 동시 요청 처리는 별도 검증</td></tr><tr><th scope=\"row\">화면·접근성</th><td data-label=\"구현 결과\">320–1920px·200% 확대·키보드·접근성 검사 통과.</td><td data-label=\"후속 검증\">기술 동작 확인. 고객 수요·재참가·유료 매출과 구분</td></tr><tr><th scope=\"row\">결제·정산</th><td data-label=\"구현 결과\">무료 참가 구현 · 결제·환불·정산은 유료화 단계에 구축</td><td data-label=\"후속 검증\">계약·환불·정산 책임 확정 후 별도 구축·검증</td></tr></tbody></table></div><p><a href=\"https://footmate.fmate.workers.dev/demo\" target=\"_blank\" rel=\"noopener noreferrer\">보조 자료 · 서비스 데모 보기 ↗</a></p><h2 class=\"block-title\">시스템·데이터 구조</h2><ol class=\"architecture\"><li><strong>이용자·운영자</strong><span>조건 선택·참가 요청 / 경기·참가 상태 관리</span></li><li><strong>웹·API</strong><span>로그인 확인·추천 요청·화면 제공</span></li><li><strong>서버 데이터</strong><span>계정·경기·포지션 정원·참가·체크인·피드백</span></li><li><strong>외부 연동·후속</strong><span>AI·이메일·브라우저 알림 / 결제·정산 후속 구축 대상</span></li></ol><details class=\"case-extra\"><summary>IT 도입·구축 범위 상세 비교</summary><div class=\"detail-body\"><div class=\"table-wrap\" role=\"region\" aria-label=\"IT 도입과 구축 범위\" tabindex=\"0\"><table><caption>IT 도입과 구축 범위</caption><thead><tr><th scope=\"col\">영역</th><th scope=\"col\">기존 구현·추가 설계</th><th scope=\"col\">후속 투자 기준</th></tr></thead><tbody><tr><th scope=\"row\">인증·데이터</th><td data-label=\"구현 상태\">기존 구현 · 로그인·참가·포지션별 정원·출석 기록 연동</td><td data-label=\"후속 조건\">접근 통제·정원 일관성·복구 방안 검증</td></tr><tr><th scope=\"row\">웹·API 배포</th><td data-label=\"구현 상태\">기존 구현 · 웹 화면·서버 기능 배포</td><td data-label=\"후속 조건\">배포·복구 절차와 사용량 예산 관리</td></tr><tr><th scope=\"row\">AI</th><td data-label=\"구현 상태\">기존 구현 · 선택 조건에 맞는 실제 경기 중 AI 추천 순서 적용</td><td data-label=\"후속 조건\">기본 정렬 대비 효과 확인 후 호출 예산 확대</td></tr><tr><th scope=\"row\">운영 알림</th><td data-label=\"구현 상태\">기존 연동 · 이메일·동의 기반 브라우저 알림</td><td data-label=\"후속 조건\">전달 상태·중복 방지·재처리·비용 모니터링</td></tr><tr><th scope=\"row\">유료 전환</th><td data-label=\"구현 상태\">향후 구축 · 유료 결제·환불·운영자 정산은 후속 구축 범위</td><td data-label=\"후속 조건\">운영자 계약과 손익 검증 후 결제·환불·거래 기록 대조 체계 구축</td></tr></tbody></table></div></div></details><details><summary>월 IT·운영 예산 세부 내역</summary><div class=\"detail-body\"><div class=\"table-wrap\" role=\"region\" aria-label=\"월 IT·운영 고정비 예산 · 견적 전 계획\" tabindex=\"0\"><table><caption>월 IT·운영 고정비 예산 · 견적 전 계획</caption><thead><tr><th scope=\"col\">항목</th><th scope=\"col\">계획 예산</th><th scope=\"col\">통제 방법</th></tr></thead><tbody><tr><th scope=\"row\">인프라 기본료·저장</th><td data-label=\"예산\">150,000원</td><td data-label=\"운영 기준\">요청·저장 사용량과 경보 한도</td></tr><tr><th scope=\"row\">운영 도구</th><td data-label=\"예산\">100,000원</td><td data-label=\"운영 기준\">필수 도구만 유지, 월별 재검토</td></tr><tr><th scope=\"row\">모니터링·관리</th><td data-label=\"예산\">150,000원</td><td data-label=\"운영 기준\">고정 관리 업무 예산, 건별 대응비와 구분</td></tr><tr><th scope=\"row\">예비비</th><td data-label=\"예산\">200,000원</td><td data-label=\"운영 기준\">예상 외 사용량·운영 보완</td></tr><tr><th scope=\"row\">합계</th><td data-label=\"예산\">600,000원/월</td><td data-label=\"운영 기준\">사업 검토를 위해 산정한 계획 예산</td></tr></tbody></table></div></div></details><details><summary>데이터별 관리·검증 기준</summary><div class=\"detail-body\"><div class=\"table-wrap\" role=\"region\" aria-label=\"주요 데이터와 관리 책임\" tabindex=\"0\"><table><caption>주요 데이터와 관리 책임</caption><thead><tr><th scope=\"col\">데이터</th><th scope=\"col\">관리 기준</th><th scope=\"col\">설계·검증 과제</th></tr></thead><tbody><tr><th scope=\"row\">경기·정원</th><td data-label=\"관리 기준\">운영자 등록, 등록된 경기·포지션별 잔여 인원 확인</td><td data-label=\"후속 검증\">서버 권한·상태 일관성 검증</td></tr><tr><th scope=\"row\">참가·취소</th><td data-label=\"관리 기준\">인증·권한·취소 기한과 정원 복원 확인</td><td data-label=\"후속 검증\">서버 권한·상태 일관성 검증</td></tr><tr><th scope=\"row\">예시 경기 기록</th><td data-label=\"관리 기준\">운영 데이터와 분리한 테스트 기록</td><td data-label=\"후속 검증\">테스트·운영 데이터 분리</td></tr><tr><th scope=\"row\">체크인·피드백</th><td data-label=\"관리 기준\">해당 참가·경기 상태에 연결</td><td data-label=\"후속 검증\">서버 권한·상태 일관성 검증</td></tr><tr><th scope=\"row\">결제·정산 원장</th><td data-label=\"관리 기준\">예약 ID·결제·환불·수수료·지급 상태 대조</td><td data-label=\"후속 검증\">유료 전환 전 구축·검증</td></tr></tbody></table></div></div></details><p>유료 전환 시 참가·결제 상태 분리. 중복 요청·환불·정산 오류 검증.</p><details><summary>참가·정원 관리의 설계 이유</summary><div class=\"detail-body\"><p>잔여 자리 재확인 후 참가·취소 처리.</p><p>참가·정원 동시 갱신. 중복 요청은 기존 결과 반환.</p><p>가상 데이터로 참가·취소·정원 복원 확인.</p></div></details>"
  },
  {
    "name": "운영 안정성·통제",
    "title": "참가·운영 통제",
    "lead": "참가와 취소 과정에서 정보를 정확하게 관리하는 방법.",
    "body": "<div class=\"table-wrap\" role=\"region\" aria-label=\"운영 점검과 통제\" tabindex=\"0\"><table><caption>운영 점검과 통제</caption><thead><tr><th scope=\"col\">점검 항목</th><th scope=\"col\">통제 방식</th><th scope=\"col\">확인·후속 과제</th></tr></thead><tbody><tr><th scope=\"row\">AI 추천 품질</th><td data-label=\"통제 방식\">선택 조건 검증 → 실제 경기 후보 → AI 추천 순서.</td><td data-label=\"확인·후속 과제\">후보·정원 사실을 서버 데이터와 대조 검증</td></tr><tr><th scope=\"row\">AI 장애 대응·비용 관리</th><td data-label=\"통제 방식\">장애 시 기본 정렬 적용, AI 사용량 제한·결과 재사용</td><td data-label=\"확인·후속 과제\">장애 대체 경로 검증·호출당 비용 기록</td></tr><tr><th scope=\"row\">참가·정원 일관성</th><td data-label=\"통제 방식\">서버 권한·정원·참가 상태 검사, 재시도 전 상태 확인</td><td data-label=\"확인·후속 과제\">동시 요청·정원 복구 시나리오 검증</td></tr><tr><th scope=\"row\">운영자 권한 관리</th><td data-label=\"통제 방식\">허용 계정·추가 본인 인증, 담당 역할과 변경 이력 기록</td><td data-label=\"확인·후속 과제\">역할별 접근 통제·실제 계정 검증 계획 수립</td></tr><tr><th scope=\"row\">경기 진행·출석 관리</th><td data-label=\"통제 방식\">운영자 취소 기준·공지·대체 경기·문의 책임</td><td data-label=\"확인·후속 과제\">제휴 계약·시범 운영에서 확정할 정책</td></tr><tr><th scope=\"row\">결제·정산 정확성</th><td data-label=\"통제 방식\">참가·결제 상태 분리 · 중복 처리 방지 · 거래·환불 대조</td><td data-label=\"확인·후속 과제\">유료 전환 전 구축·검증 과제</td></tr></tbody></table></div><div class=\"card-grid\"><article class=\"story-card\"><h2>운영 책임</h2><p>정보·현장·취소·문의 책임을 계약에 명시.</p></article><article class=\"story-card\"><h2>측정·개인정보</h2><p>동의·중복 제거·테스트 데이터 분리.</p></article></div><figure class=\"transaction-flow\"><figcaption>무료 참가·취소 처리</figcaption><ol class=\"state-flow\"><li><strong>1. 참가자 요청</strong><span>경기·포지션 선택 후 참가 요청</span></li><li><strong>2. 서버 확인·정원 처리</strong><span>로그인·중복·잔여 정원 확인 후 반영</span></li><li><strong>3. 참가 확정</strong><span>참가 상태·전체 정원·포지션 정원 갱신</span></li></ol><div class=\"flow-branches\"><div><strong>실패·응답 지연 시 상태 조회</strong><p>상태 조회 후 재시도. 기존 결과 반환·중복 차감 방지.</p></div><div><strong>본인 취소·정원 복원</strong><p>참가·잔여 자리 동시 갱신.</p></div></div></figure>"
  },
  {
    "name": "실행계획·성과관리",
    "title": "8주 현장 검증·투자 심사",
    "lead": "추진 일정과 목표, 예산 및 결정 기준.",
    "body": "<div class=\"reader-summary\"><h3>예산과 핵심 목표</h3><dl class=\"case-decision-points\" aria-label=\"투자·검증·성과 목표 요약\"><div><dt>투자 상한</dt><dd>현금 지출 상한 461만 원 · 기회비용까지 포함하면 831만 원</dd></div><div><dt>초기 검증</dt><dd>운영자 5곳 면담 → 제휴 조건 확인 → 무료 참가 시범 운영</dd></div><div><dt>제안 목표</dt><dd>모집 충원율 75% · 30일 재참가율 30%</dd></div></dl><p class=\"case-decision-next\"><strong>투자 판단:</strong> 공급 계약, 참가·정원 기록, 건당 이익을 종합 검토.</p></div><section class=\"case-roadmap\" aria-labelledby=\"case-roadmap-heading\"><div class=\"case-roadmap-heading\"><span class=\"case-visual-eyebrow\">사업 추진 일정</span><h3 id=\"case-roadmap-heading\">8주 실행 로드맵</h3></div><ol><li><span class=\"case-roadmap-index\">01</span><span class=\"case-roadmap-period\">1–2주</span><strong>공급 검증</strong><small>운영자 5곳 면담</small></li><li><span class=\"case-roadmap-index\">02</span><span class=\"case-roadmap-period\">3–4주</span><strong>무료 시범</strong><small>참가·취소·체크인</small></li><li><span class=\"case-roadmap-index\">03</span><span class=\"case-roadmap-period\">5–8주</span><strong>유료 조건 검토</strong><small>책임 확정 후 실험</small></li><li><span class=\"case-roadmap-index\">04</span><span class=\"case-roadmap-period\">8주 이후</span><strong>투자 심사</strong><small>참가·수익성 비교</small></li></ol></section><div class=\"table-wrap\" role=\"region\" aria-label=\"단계별 실행 계획 · 제안\" tabindex=\"0\"><table><caption>단계별 실행 계획 · 제안</caption><thead><tr><th scope=\"col\">단계</th><th scope=\"col\">주요 작업</th><th scope=\"col\">산출물·진행 조건</th></tr></thead><tbody><tr><th scope=\"row\">1–2주 · 공급 검증</th><td data-label=\"주요 작업\">후보 운영자 5곳 면담, 모집·정원·취소·수수료 책임 확인</td><td data-label=\"산출물·진행 조건\">제휴 의향과 공급 일정. 2곳 미만이면 지역·모델 재검토</td></tr><tr><th scope=\"row\">3–4주 · 무료 참가 시범 운영</th><td data-label=\"주요 작업\">실제 경기 등록·참가·취소·체크인·문의 처리</td><td data-label=\"산출물·진행 조건\">실제 참가자의 운영 기록과 상태·복구 목록</td></tr><tr><th scope=\"row\">5–8주 · 유료 검토</th><td data-label=\"주요 작업\">계약·결제·환불 책임 확정 후 가격·수수료·모집 실험</td><td data-label=\"산출물·진행 조건\">무료 참가 시범 운영으로 선행 요건을 확인한 뒤 결제 전환</td></tr><tr><th scope=\"row\">8주 이후 · 투자 심사</th><td data-label=\"주요 작업\">완료 예약·재참가·공헌이익·운영 시간 비교</td><td data-label=\"산출물·진행 조건\">현장 검증 결과에 따라 확장·집중 운영·모델 전환·종료 판단</td></tr><tr><th scope=\"row\">공동 추진 · 주간 점검</th><td data-label=\"주요 작업\">사업기획은 협상·일정, 운영은 공급·참가를 담당.</td><td data-label=\"산출물·진행 조건\">재무는 비용·정산, 개발은 예약·오류 기록을 대조.</td></tr><tr><th scope=\"row\">공동 추진 · 이슈 관리</th><td data-label=\"주요 작업\">매주 슬롯·충원·취소·완료와 약정 비용 점검.</td><td data-label=\"산출물·진행 조건\">과제별 담당·기한·결정 사항을 주간 회의에서 확정.</td></tr><tr><th scope=\"row\">공동 추진 · 8주 심사</th><td data-label=\"주요 작업\">충원 75%·30일 재참가 30%·건당 공헌이익 확인.</td><td data-label=\"산출물·진행 조건\">30일 경과 집단과 유료 완료 기록으로 확대 심사.</td></tr></tbody></table></div><p class=\"source-note\">초기 모집 목표 100명. 추천 효과 검증 표본은 별도 산정.</p><figure class=\"case-cash-chart\" aria-labelledby=\"case-cash-title\"><figcaption><strong id=\"case-cash-title\">5개년 투자 후 현금수지</strong><span>같은 공급 확대 가정 · 단위 만 원</span></figcaption><ul class=\"case-cash-legend\"><li>협상안 적용</li><li>기존 조건 유지</li></ul><svg aria-hidden=\"true\" viewBox=\"-12 0 492 223\"></svg></figure><details class=\"case-extra\"><summary>중장기 사업계획 · 예산과 확대 기준</summary><div class=\"detail-body\"><p><strong>5개년 기준 시나리오</strong> · 2년 차부터 수수료 12%·운영자 결제비 부담.</p><div class=\"table-wrap\" role=\"region\" tabindex=\"0\" aria-label=\"5개년 경영계획과 현금수지\"><table><caption>5개년 경영계획 · 금액 단위 만 원</caption><thead><tr><th scope=\"col\">항목</th><th scope=\"col\">1년 차</th><th scope=\"col\">2년 차</th><th scope=\"col\">3년 차</th><th scope=\"col\">4년 차</th><th scope=\"col\">5년 차</th></tr></thead><tbody><tr><th scope=\"row\">제휴 공급처</th><td data-label=\"1년 차\">5곳</td><td data-label=\"2년 차\">12곳</td><td data-label=\"3년 차\">20곳</td><td data-label=\"4년 차\">28곳</td><td data-label=\"5년 차\">36곳</td></tr><tr><th scope=\"row\">연 완료 예약</th><td data-label=\"1년 차\">7,512건</td><td data-label=\"2년 차\">18,024건</td><td data-label=\"3년 차\">30,048건</td><td data-label=\"4년 차\">42,072건</td><td data-label=\"5년 차\">54,084건</td></tr><tr><th scope=\"row\">수수료 매출</th><td data-label=\"1년 차\">901</td><td data-label=\"2년 차\">2,595</td><td data-label=\"3년 차\">4,327</td><td data-label=\"4년 차\">6,058</td><td data-label=\"5년 차\">7,788</td></tr><tr><th scope=\"row\">거래 변동비</th><td data-label=\"1년 차\">646</td><td data-label=\"2년 차\">901</td><td data-label=\"3년 차\">1,502</td><td data-label=\"4년 차\">2,104</td><td data-label=\"5년 차\">2,704</td></tr><tr><th scope=\"row\">현금 운영비</th><td data-label=\"1년 차\">770</td><td data-label=\"2년 차\">972</td><td data-label=\"3년 차\">1,260</td><td data-label=\"4년 차\">1,548</td><td data-label=\"5년 차\">1,836</td></tr><tr><th scope=\"row\">구축·확장 투자비</th><td data-label=\"1년 차\">300</td><td data-label=\"2년 차\">100</td><td data-label=\"3년 차\">150</td><td data-label=\"4년 차\">200</td><td data-label=\"5년 차\">250</td></tr><tr data-cash-series=\"negotiated\"><th scope=\"row\">투자 후 현금수지</th><td data-label=\"1년 차\">−815</td><td data-label=\"2년 차\">622</td><td data-label=\"3년 차\">1,415</td><td data-label=\"4년 차\">2,207</td><td data-label=\"5년 차\">2,998</td></tr><tr data-cash-series=\"current\"><th scope=\"row\">기존 수수료·결제 조건 유지 시 현금수지</th><td data-label=\"1년 차\">−815</td><td data-label=\"2년 차\">−459</td><td data-label=\"3년 차\">−388</td><td data-label=\"4년 차\">−318</td><td data-label=\"5년 차\">−247</td></tr></tbody></table></div><p class=\"source-note\">기준 · 참가비 12,000원 · 수수료 10% · 결제비 3%.</p><p class=\"source-note\">완료 예약은 공급·충원·취소 가정 · 변동비 860→500원/건.</p><p class=\"source-note\">연 운영비 720만 원 + 5곳 초과분 36만 원/곳.</p><p class=\"source-note\">투자비 · 1년 차 시범 50만 원 · 2~5년 차 제안 예산.</p><p class=\"source-note\">현금수지 = 수수료 매출 − 변동비 − 운영비 − 투자비.</p><p class=\"source-note\">인력 기회비용 월 200만 원 별도.</p><div class=\"table-wrap\" role=\"region\" tabindex=\"0\" aria-label=\"연차별 사업계획과 투자 기준\"><table><caption>연차별 사업계획과 투자 기준</caption><thead><tr><th scope=\"col\">기간</th><th scope=\"col\">사업·예산 계획</th><th scope=\"col\">핵심 지표</th><th scope=\"col\">승인 기준</th></tr></thead><tbody><tr><th scope=\"row\">1년 차 · 한 생활권</th><td data-label=\"사업·예산 계획\">기본 현금 예산 1,070만 원 · 거래 변동비 별도</td><td data-label=\"핵심 지표\">충원율 75% · 30일 재참가율 30%</td><td data-label=\"승인 기준\">8주 결과와 유료 예약당 공헌이익을 확인</td></tr><tr><th scope=\"row\">2년 차 · 인접 생활권</th><td data-label=\"사업·예산 계획\">생활권별 공급과 추가 관리비를 반영해 분기 예산 산정</td><td data-label=\"핵심 지표\">지역별 완료 예약 · 공헌이익 · 현금 손익</td><td data-label=\"승인 기준\">추가 운영비를 반영한 지역별 손익과 가용 현금 확인</td></tr><tr><th scope=\"row\">3년 차 · 제휴 운영 확대</th><td data-label=\"사업·예산 계획\">지역별 계획을 합산하고 연간 투자 우선순위 결정</td><td data-label=\"핵심 지표\">지역별 손익분기 · 현금 소요 · 공급 유지율</td><td data-label=\"승인 기준\">지역별 수익성과 운영 책임 확인 후 단계별 승인</td></tr><tr><th scope=\"row\">4년 차 · 운영 표준화</th><td data-label=\"사업·예산 계획\">공급처 28곳 · 정산·지원 프로세스 통합</td><td data-label=\"핵심 지표\">인력 기회비용 포함 월 운영손익</td><td data-label=\"승인 기준\">추가 관리비를 반영한 월 손익 3개월 연속 손익분기</td></tr><tr><th scope=\"row\">5년 차 · 권역 확대</th><td data-label=\"사업·예산 계획\">공급처 36곳 · 다음 권역 투자 검토</td><td data-label=\"핵심 지표\">투자 후 현금수지 · 권역별 재참가율</td><td data-label=\"승인 기준\">현금수지와 권역별 수익성 검토 후 예산 확정</td></tr></tbody></table></div><div class=\"table-wrap\" role=\"region\" tabindex=\"0\" aria-label=\"1년 차 분기별 운영 계획\"><table><caption>1년 차 분기별 운영 계획</caption><thead><tr><th scope=\"col\">시기</th><th scope=\"col\">운영 계획</th><th scope=\"col\">관리 산출물</th></tr></thead><tbody><tr><th scope=\"row\">1분기</th><td data-label=\"운영 계획\">8주 파일럿 · 현금 집행 상한 461만 원</td><td data-label=\"관리 산출물\">제휴 조건과 충원·완료·취소 기록</td></tr><tr><th scope=\"row\">2분기</th><td data-label=\"운영 계획\">유료 조건 검토 · 30일 재참가 추적</td><td data-label=\"관리 산출물\">수수료·결제비·지원 비용 대조</td></tr><tr><th scope=\"row\">3분기</th><td data-label=\"운영 계획\">시간대와 공급처별 예산 재배분</td><td data-label=\"관리 산출물\">월 손익 차이 분석과 비용 관리</td></tr><tr><th scope=\"row\">4분기</th><td data-label=\"운영 계획\">연간 결과 검토와 다음 해 예산 심사</td><td data-label=\"관리 산출물\">생활권별 수익성과 투자 우선순위</td></tr></tbody></table></div><p class=\"source-note\">연간 운영 720만 원 + 구축 300만 원 + 시범 50만 원.</p><p class=\"source-note\">8주 예산은 연간 예산에 포함. 인력 기회비용은 월 200만 원.</p><p class=\"source-note\">운영자별 집계 → 생활권별 손익 → 전체 월간 보고.</p></div></details><details class=\"case-extra\"><summary>월간 경영보고 예시 · KPI·손익 비교</summary><div class=\"detail-body\"><p>6월 완료 예약 · 계획 1,052건 / 가상 실적 1,019건.</p><p>현금 손익 · 계획 −242,320원 / 가상 실적 −459,360원.</p><div class=\"table-wrap\" role=\"region\" tabindex=\"0\" aria-label=\"6월 월간 보고 예시 · 가상 데이터\"><table><caption>6월 월간 보고 예시 · 가상 데이터</caption><thead><tr><th scope=\"col\">항목</th><th scope=\"col\">계획 대비 손익 영향</th><th scope=\"col\">다음 조치</th></tr></thead><tbody><tr><th scope=\"row\">완료 물량</th><td data-label=\"계획 대비 손익 영향\">−39,600원</td><td data-label=\"다음 조치\">슬롯·충원·취소·완료 단계별 차이 대조</td></tr><tr><th scope=\"row\">수수료 단가</th><td data-label=\"계획 대비 손익 영향\">+400원</td><td data-label=\"다음 조치\">가격·수수료를 정산 원장과 대조</td></tr><tr><th scope=\"row\">순비용</th><td data-label=\"계획 대비 손익 영향\">−177,840원</td><td data-label=\"다음 조치\">고객 확보·지원·IT 비용의 증가 항목 확인</td></tr><tr><th scope=\"row\">합계</th><td data-label=\"계획 대비 손익 영향\">−217,040원</td><td data-label=\"다음 조치\">비용 배분과 후속 조치에 반영</td></tr></tbody></table></div><div class=\"table-wrap\" role=\"region\" tabindex=\"0\" aria-label=\"모의 월간 경영보고\"><table><caption>월간 계획·시나리오 데이터 비교</caption><thead><tr><th scope=\"col\">관리 항목</th><th scope=\"col\">기준·대조</th><th scope=\"col\">차이 분석·결정</th></tr></thead><tbody><tr><th scope=\"row\">공급·완료 KPI</th><td data-label=\"기준·대조\">626건/월 산정 기준. 슬롯·충원·예약·취소·완료율 분리.</td><td data-label=\"차이 분석·결정\">계획과 가상 결과의 물량 차이를 공급량·충원·취소로 분해</td></tr><tr><th scope=\"row\">수수료·손익</th><td data-label=\"기준·대조\">월 기준 · 매출 75.1만 원 / 건당 340원 / 현금 −38.7만 원</td><td data-label=\"차이 분석·결정\">원장 대조 · 수수료·변동비·고정비 확인 · 중복 차감 방지</td></tr><tr><th scope=\"row\">보고 절차 제안</th><td data-label=\"기준·대조\">월말+3일 원장 대조. +5일 차이 분석.</td><td data-label=\"차이 분석·결정\">원인·증빙·변경 산정 기준·승인 여부를 기록할 관리 절차 설계</td></tr></tbody></table></div></div></details><details><summary>8주 예산과 투자 심사 지표</summary><div class=\"detail-body\"><div class=\"case-evidence-part\"><h4>8주 자원 산정·승인 범위</h4><p>예산 · 구축 300만 / 월 기회비용 200만 / 시범 50만 원.</p><p>창업자 투입 · 148시간 × 25,000원.</p><div class=\"table-wrap\" role=\"region\" aria-label=\"8주 현장 검증 자원 · 집행 상한 제안\" tabindex=\"0\"><table><caption>8주 현장 검증 자원 · 집행 상한 제안</caption><thead><tr><th scope=\"col\">항목</th><th scope=\"col\">산정·범위</th><th scope=\"col\">8주 금액</th></tr></thead><tbody><tr><th scope=\"row\">초기 구축</th><td data-label=\"산정·범위\">기존 초기 투자 계획. 필요한 범위만 착수 전 승인</td><td data-label=\"8주 금액\">3,000,000원</td></tr><tr><th scope=\"row\">고정 운영</th><td data-label=\"산정·범위\">월 600,000원 × 8주 ÷ 4.33주 · 만 원 단위 올림</td><td data-label=\"8주 금액\">1,110,000원</td></tr><tr><th scope=\"row\">시범 운영 추가비</th><td data-label=\"산정·범위\">모집·현장 지원 등 추가 집행 한도 산정 기준. 고정비와 중복 제외</td><td data-label=\"8주 금액\">500,000원</td></tr><tr><th scope=\"row\">현금 집행 상한</th><td data-label=\"산정·범위\">초기 구축 + 고정 운영 + 시범 운영 추가비. 수익 차감 전</td><td data-label=\"8주 금액\">4,610,000원</td></tr><tr><th scope=\"row\">기회비용</th><td data-label=\"산정·범위\">200만 원 × 8주 ÷ 4.33주 · 만 원 단위 올림</td><td data-label=\"8주 금액\">3,700,000원</td></tr><tr><th scope=\"row\">총 자원 상한</th><td data-label=\"산정·범위\">현금 집행 상한 + 기회비용</td><td data-label=\"8주 금액\">8,310,000원</td></tr></tbody></table></div><p>기회비용 · 4.33주 기준·만 원 올림. 변동비 한도·수익 차감 전.</p><p>해지·환불·안전 책임 확인. 예산 초과 시 집행 보류.</p></div><div class=\"case-evidence-part\"><h4>투자 심사 지표 · 정의와 목표</h4><div class=\"table-wrap\" role=\"region\" aria-label=\"투자 판단에 필요한 수치\" tabindex=\"0\"><table><caption>투자 판단에 필요한 수치</caption><thead><tr><th scope=\"col\">지표</th><th scope=\"col\">계산·측정 기준</th><th scope=\"col\">다음 판단</th></tr></thead><tbody><tr><th scope=\"row\">모집 충원율</th><td data-label=\"계산·측정 기준\">확정 좌석 ÷ 공개 정원(취소 전·전체 채널).</td><td data-label=\"다음 판단\">목표 75%, 인원 미달 취소 별도 집계</td></tr><tr><th scope=\"row\">30일 재참가율</th><td data-label=\"계산·측정 기준\">30일 내 재참가 고유 이용자 ÷ 30일 경과 이용자.</td><td data-label=\"다음 판단\">제안 목표 30%, 첫 참가 후 30일이 지난 집단만 평가</td></tr><tr><th scope=\"row\">예약당 공헌이익</th><td data-label=\"계산·측정 기준\">수수료 수익 − 결제비 − 유입·지원·IT 변동비</td><td data-label=\"다음 판단\">실제 정산 표본에서 양수인지 확인</td></tr><tr><th scope=\"row\">참가 안정성</th><td data-label=\"계산·측정 기준\">참가 처리·중복 방지·정원 일관성과 복구 결과</td><td data-label=\"다음 판단\">중대한 데이터 오류를 해결한 뒤 공급 확대</td></tr><tr><th scope=\"row\">AI 추가 가치</th><td data-label=\"계산·측정 기준\">기본 정렬 대비 참가 완료와 추가 비용</td><td data-label=\"다음 판단\">기본 정렬을 기준으로 추가 효과에 따라 AI 적용</td></tr></tbody></table></div></div></div></details><details><summary>월간 지표 관리와 손익 검증</summary><div class=\"detail-body\"><div class=\"case-evidence-part\"><h4>월간 지표 관리·정정 책임표</h4><p>2027 상반기 가상 데이터, 하반기 공급 전망.</p><p>예약 ID별 취소·노쇼 구분. 환불 차감 후 수수료 적용.</p><div class=\"table-wrap\"><table><thead><tr><th>관리 항목</th><th>정의·주기</th><th>담당 역할</th><th>마감·정정 통제</th></tr></thead><tbody><tr><th scope=\"row\">수수료 매출</th><td data-label=\"정의·주기\">완료 거래액 × 계약 수수료 / 월</td><td data-label=\"담당 역할\">사업 관리</td><td data-label=\"마감·정정 통제\">월말 이후 3일 이내 대조, 환불·수수료 원장 확인</td></tr><tr><th scope=\"row\">손익 차이</th><td data-label=\"정의·주기\">물량·건당 수익·비용 영향 분해 / 월</td><td data-label=\"담당 역할\">경영기획</td><td data-label=\"마감·정정 통제\">월말 이후 5일 이내 원인 보고</td></tr><tr><th scope=\"row\">공급·완료율</th><td data-label=\"정의·주기\">슬롯·정원·플랫폼 예약·취소·완료 / 주</td><td data-label=\"담당 역할\">운영</td><td data-label=\"마감·정정 통제\">운영자별 중복 등록·미래 일정 검증</td></tr><tr><th scope=\"row\">데이터 정정</th><td data-label=\"정의·주기\">원본 보존, 예약 ID·수정 사유·버전 기록</td><td data-label=\"담당 역할\">데이터 관리</td><td data-label=\"마감·정정 통제\">담당자 확인 후 재집계, 보고 버전 갱신</td></tr></tbody></table></div></div><div class=\"case-evidence-part\"><h4>손익 변화 검사 세부표</h4><p class=\"source-note\">CAC·수수료·취소율 변화별 손익 비교.</p><div class=\"table-wrap\"><table><thead><tr><th>검증 시나리오</th><th>검증 내용</th><th>판단</th></tr></thead><tbody><tr><th scope=\"row\">플랫폼 예약 비중 20% 감소</th><td data-label=\"검증 내용\">매출·공헌이익·필요 공급처 재계산</td><td data-label=\"판단\">수수료 협상만으로 만회 가능한지 확인</td></tr><tr><th scope=\"row\">고객 확보비 2배</th><td data-label=\"검증 내용\">신규 비중을 반영한 건당 이익 재계산</td><td data-label=\"판단\">0 이하이면 유입 지출 확대 보류</td></tr><tr><th scope=\"row\">취소율 20%</th><td data-label=\"검증 내용\">완료 거래와 취소 CS 비용 반영</td><td data-label=\"판단\">환불·지원비 부담 재협상</td></tr><tr><th scope=\"row\">공헌이익 0 이하</th><td data-label=\"검증 내용\">손익분기 출력 경계 검사</td><td data-label=\"판단\">건당 공헌이익 개선 우선</td></tr><tr><th scope=\"row\">ID·환불·합계 대조</th><td data-label=\"검증 내용\">중복 예약, 환불 초과, 월합계 일치 검사</td><td data-label=\"판단\">검증 결과와 재현 방법은 첨부 자료에 기록</td></tr></tbody></table></div><p class=\"source-note\">충원율 75%=전체 채널·취소 전(04). 플랫폼 지표 별도.</p></div></div></details><details class=\"case-extra\"><summary>측정 방법과 현장 검증 판단</summary><div class=\"detail-body\"><div class=\"case-evidence-part\"><h4>검토 방향별 측정 방법과 평가 시점</h4><div class=\"table-wrap\" role=\"region\" aria-label=\"8주 현장 검증 설계안\" tabindex=\"0\"><table><caption>8주 현장 검증 설계안</caption><thead><tr><th scope=\"col\">검토 방향·대상</th><th scope=\"col\">수집 자료·평가 시점</th><th scope=\"col\">평가 결과별 조치</th></tr></thead><tbody><tr><th scope=\"row\">지역 공급 · 후보 운영자 5곳</th><td data-label=\"수집 자료·평가 시점\">1–2주 · 제휴·슬롯·정원·취소·수수료 확인.</td><td data-label=\"평가 결과별 조치\">2곳 이상 시범 운영. 미만이면 지역·제휴 조건 재검토.</td></tr><tr><th scope=\"row\">참가 수요 · 해당 생활권 이용자</th><td data-label=\"수집 자료·평가 시점\">3–8주 · 정원·확정·취소·완료·운영 시간 기록.</td><td data-label=\"평가 결과별 조치\">충원 목표 75%·미달 취소 대조 후 시간대·공급량 조정</td></tr><tr><th scope=\"row\">반복 이용 · 첫 참가 완료 집단</th><td data-label=\"수집 자료·평가 시점\">첫 참가 후 30일 추적 · 추적 완료자만 분모(무료·유료 구분)</td><td data-label=\"평가 결과별 조치\">추적 완료자 재참가 목표 30%.</td></tr><tr><th scope=\"row\">단위 손익 · 실제 유료 완료 예약</th><td data-label=\"수집 자료·평가 시점\">유료 전환 후 매출·환불·결제비·획득비·지원·IT 비용 기록.</td><td data-label=\"평가 결과별 조치\">양의 공헌이익·고정비 회수 조건 확인. 지불 의향·실현 매출 구분</td></tr><tr><th scope=\"row\">AI 추가 가치 · 같은 적격 후보 집단</th><td data-label=\"수집 자료·평가 시점\">실험 전 배정·노출·완료·호출 비용 확정. 표본은 효과 크기로 산정.</td><td data-label=\"평가 결과별 조치\">초기 모집 목표 100명. 표본 부족 시 탐색적 결과 보고·추가 측정</td></tr></tbody></table></div><p class=\"source-note\">역할 · 운영자 현장 / 서비스 기록 / 기획 심사. 권한 추후 확정.</p></div><div class=\"case-evidence-part\"><h4>현장 검증 결과별 의사결정</h4><div class=\"table-wrap\" role=\"region\" aria-label=\"진행 여부와 후속 조치\" tabindex=\"0\"><table><caption>진행 여부와 후속 조치</caption><thead><tr><th scope=\"col\">상태</th><th scope=\"col\">판단 기준</th><th scope=\"col\">후속 행동</th></tr></thead><tbody><tr><th scope=\"row\">진행</th><td data-label=\"판단 기준\">공급·운영 안정성 확보 및 추적 완료자 목표 달성</td><td data-label=\"후속 행동\">다음 단계 필요 예산만 승인. 확대 경제성 별도 심사</td></tr><tr><th scope=\"row\">목표 재점검</th><td data-label=\"판단 기준\">30일 경과 집단의 충원 75%·재참가 30% 목표를 점검.</td><td data-label=\"후속 행동\">시간대·공급·가격 중 변경 방향 확정 후 남은 예산 내 재실험</td></tr><tr><th scope=\"row\">자료 보완</th><td data-label=\"판단 기준\">모집 규모·비교 표본·기록 보완 필요</td><td data-label=\"후속 행동\">표본·기록·추가 비용을 보완한 후 효과 평가</td></tr><tr><th scope=\"row\">측정 진행</th><td data-label=\"판단 기준\">첫 참가 후 30일 추적 진행 중</td><td data-label=\"후속 행동\">추적 중인 집단은 별도 집계 · 완료 후 재심사</td></tr><tr><th scope=\"row\">중단·재승인</th><td data-label=\"판단 기준\">중대한 정원·권한 오류, 책임 미확정, 예상 집행 상한 초과</td><td data-label=\"후속 행동\">해당 모집·집행 중단. 원인 해소·잔여 예산 확인 후 재승인</td></tr></tbody></table></div><p>8주 후 현금·약정·미완료 보고.</p></div></div></details>"
  },
  {
    "name": "종합 판단·근거",
    "title": "검토 결론·후속 과제",
    "lead": "확인한 근거와 추가로 검증할 사항.",
    "body": "<div class=\"card-grid\"><article class=\"story-card\"><h2>사업모델 방향</h2><p>운영자 제휴형 우선 · 수수료·결제비 복합 협상.</p></article><article class=\"story-card\"><h2>핵심 확인 지표</h2><p>건당 공헌이익·플랫폼 예약 비중·재참가 확인.</p></article><article class=\"story-card\"><h2>단계적 투자 기준</h2><p>취소·고객지원비 반영 손익·비용 대비 예상 손익률 재산정.</p></article></div><p class=\"decision\">공급 계약·수익성 기준 충족 후 단계적 투자 확대.</p>"
  }
];
  // 기존 9개 장·31개 표를 유지하면서 장기 전략을 선택형 상세 보기로 제공.
  sections[8].title = "5개년 경영전략·투자 판단";
  sections[8].body += `
    <details class="strategy-more">
      <summary>5개년 성장전략·투자계획 펼치기</summary>
      <ul class="strategy-year-list">
        <li>1년 차·5곳: 생활권 제휴·완료 예약 관리<span class="strategy-year-amount">−238.7만 원/월</span></li>
        <li>2년 차·12곳: 수수료 협상·지역 확대<span class="strategy-year-amount">−139.8만 원/월</span></li>
        <li>3년 차·20곳: 재참가·운영 표준화<span class="strategy-year-amount">−69.6만 원/월</span></li>
        <li>4년 차·28곳: 관리비 반영·자원 배분<span class="strategy-year-amount">+0.6만 원/월</span></li>
        <li>5년 차·36곳: 권역 확대·현금수지 관리<span class="strategy-year-amount">+70.7만 원/월</span></li>
      </ul>
      <figure class="strategy-year-economics" aria-labelledby="strategy-year-economics-title">
        <figcaption><span>5-YEAR UNIT ECONOMICS · 월간 정상상태 시나리오</span><strong id="strategy-year-economics-title">손익분기점 전환 경로</strong><p>공급처 확대와 수수료·결제비 조건 개선에 따른 월 경제적 손익(만원)입니다.</p></figcaption>
        <svg viewBox="0 0 780 229" role="img" aria-labelledby="strategy-year-economics-title strategy-year-economics-desc" preserveAspectRatio="xMidYMid meet">
          <desc id="strategy-year-economics-desc">1년 차 공급처 5곳, 월 −238.7만 원. 2년 차 12곳 −139.8만 원. 3년 차 20곳 −69.6만 원. 4년 차 28곳 +0.6만 원. 5년 차 36곳 +70.7만 원. 4년 차에 월 경제적 손익분기점에 근접합니다.</desc>
          <line class="economics-grid" x1="46" x2="760" y1="68" y2="68"></line>
          <text class="economics-zero" x="47" y="58">0원 · 손익분기선</text>
          <path class="economics-area" d="M90 198 L240 145 L390 108 L540 68 L690 29 L690 68 L540 68 L390 68 L240 68 L90 68 Z"></path>
          <polyline class="economics-line" points="90,198 240,145 390,108 540,68 690,29"></polyline>
          <circle class="economics-point" cx="90" cy="198" r="6"></circle><circle class="economics-point" cx="240" cy="145" r="6"></circle><circle class="economics-point" cx="390" cy="108" r="6"></circle><circle class="economics-point is-bep" cx="540" cy="68" r="8"></circle><circle class="economics-point" cx="690" cy="29" r="6"></circle>
          <text x="90" y="181" text-anchor="middle">−238.7만</text><text x="240" y="128" text-anchor="middle">−139.8만</text><text x="390" y="92" text-anchor="middle">−69.6만</text><text class="economics-bep-label" x="540" y="48" text-anchor="middle">+0.6만</text><text x="690" y="17" text-anchor="middle">+70.7만</text>
          <text class="economics-axis" x="90" y="225" text-anchor="middle">1년 · 5곳</text><text class="economics-axis" x="240" y="225" text-anchor="middle">2년 · 12곳</text><text class="economics-axis" x="390" y="225" text-anchor="middle">3년 · 20곳</text><text class="economics-axis economics-bep-label" x="540" y="225" text-anchor="middle">4년 · 28곳</text><text class="economics-axis" x="690" y="225" text-anchor="middle">5년 · 36곳</text>
        </svg>
        <p class="strategy-chart-note">월 정상상태 경제손익 · 연간 투자 후 현금수지와 별도.</p>
        <p class="strategy-chart-note">1년 차 건당 340원, 2~5년 차 940원 적용.</p>
      </figure>
      <h3>경영계획과 투자 조정</h3>
      <p>연간 목표를 월별 공급·수익·비용으로 연결.</p>
      <p>계획 대비 차이의 원인을 확인.</p>
      <p>성과와 현금 소요에 따라 투자 우선순위 조정.</p>
      <p class="case-scenario-note">공급처 수는 경영계획 시나리오.</p>
    </details>
  `;

  const toc=document.querySelector('.toc'),track=document.querySelector('.track');
  toc.innerHTML=sections.map((s,i)=>`<a class="toc-item" href="#section-${String(i+1).padStart(2,'0')}" data-index="${i}"><span class="toc-n">${String(i+1).padStart(2,'0')}</span><span class="toc-t">${s.name}</span></a>`).join('');
  track.innerHTML=sections.map((s,i)=>`<section class="slide" id="section-${String(i+1).padStart(2,'0')}" aria-labelledby="heading-${i}"><header class="section-head">${i===0?'<span class="case-identity">신사업 사업성 분석·경영계획</span>':''}<span class="eyebrow">${String(i+1).padStart(2,'0')} / ${s.name}</span><${i===0?'h1':'h2'} class="section-title" id="heading-${i}" tabindex="-1">${s.title.replaceAll("·","&#8288;·&#8288;")}</${i===0?'h1':'h2'}>${s.lead?`<p class="lead">${s.lead}</p>`:''}</header>${s.body}</section>`).join('');
  // Derive the visual comparison from the original table, not duplicated assumptions.
  const scenarioTable=track.querySelector('#section-04 .table-wrap table');
  if(scenarioTable){
    const scenarioRow=[...scenarioTable.querySelectorAll('tbody tr')].find(row=>
      row.querySelector('th')?.textContent.trim()==='월 완료 예약 · 최종 반올림');
    const labels=[...scenarioTable.querySelectorAll('thead th')].slice(1,4).map(cell=>cell.textContent.trim());
    const values=[...(scenarioRow?.querySelectorAll('td')||[])].slice(0,3).map(cell=>({
      label:cell.textContent.trim(),amount:Number(cell.textContent.replace(/[^\d]/g,''))
    }));
    if(labels.length===3&&values.length===3&&values.every(value=>Number.isFinite(value.amount)&&value.amount>0)){
      const max=Math.max(...values.map(value=>value.amount));
      const figure=document.createElement('figure');
      figure.className='case-scenario-visual';
      figure.setAttribute('aria-label','월 완료 예약 건수: 보수·기준·확장 가정 비교');
      const caption=document.createElement('figcaption');
      caption.innerHTML='<strong>월 완료 예약 시나리오</strong><span>보수 · 기준 · 확장 가정 비교</span>';
      figure.append(caption);
      const rows=document.createElement('div');
      rows.className='case-scenario-rows';
      values.forEach((value,i)=>{
        const row=document.createElement('div');
        row.className='case-scenario-row'+(i===1?' is-baseline':'');
        const name=document.createElement('span');
        name.className='case-scenario-name';
        name.textContent=labels[i];
        const bar=document.createElement('span');
        bar.className='case-scenario-track';
        bar.setAttribute('aria-hidden','true');
        const fill=document.createElement('span');
        fill.className='case-scenario-fill';
        fill.style.width=(value.amount/max*100).toFixed(2)+'%';
        bar.append(fill);
        const number=document.createElement('span');
        number.className='case-scenario-number';
        number.textContent=value.label;
        row.append(name,bar,number);
        rows.append(row);
      });
      figure.append(rows);
      const note=document.createElement('p');
      note.className='case-scenario-note';
      note.textContent='표의 완료 예약 추정치를 시각화한 계획 시나리오이며 실제 거래 실적이 아닙니다.';
      figure.append(note);
      scenarioTable.closest('.table-wrap')?.before(figure);
    }
  }
  const cashChart=track.querySelector('.case-cash-chart svg');
  if(cashChart){
    const series=['negotiated','current'].map(key=>
      [...track.querySelectorAll('[data-cash-series="'+key+'"] td')].map(cell=>Number(cell.textContent.replaceAll(',','').replace('−','-')))
    );
    const x=i=>76+i*87;
    const y=value=>158-value*.043;
    const grid=[3000,2000,1000,0,-1000].map(value=>
      `<line x1="64" x2="438" y1="${y(value)}" y2="${y(value)}" class="${value===0?'cash-zero':'cash-grid'}"/><text x="54" y="${y(value)+5}" text-anchor="end">${value.toLocaleString('ko-KR')}</text>`
    ).join('');
    const years=series[0].map((_,i)=>`<text x="${x(i)}" y="215" text-anchor="middle">${i+1}년 차</text>`).join('');
    const paths=series.map((values,index)=>`<g class="cash-line cash-line-${index}">${values.map((value,i)=>
      `<rect x="${x(i)-18+index*18}" y="${Math.min(y(value),y(0))}" width="16" height="${Math.abs(y(value)-y(0))}"/>`
    ).join('')}</g>`).join('');
    cashChart.innerHTML=grid+years+paths;
  }
  const onDemandPreview=track.querySelector('.case-doc-preview');
  if(onDemandPreview){
    const frame=onDemandPreview.querySelector('.case-ppt-frame');
    onDemandPreview.addEventListener('toggle',()=>{
      if(onDemandPreview.open && frame?.dataset.src){
        frame.src=frame.dataset.src;
        frame.removeAttribute('data-src');
      }
    });
    // The embedded PPT reports its actual slide + toolbar height.
    // Keep the frame flush with that height instead of leaving a tall white gap.
    window.addEventListener('message',event=>{
      if(event.origin!==location.origin || event.source!==frame?.contentWindow ||
         event.data?.type!=='case-materials-height')return;
      const height=Number(event.data.height);
      if(Number.isFinite(height) && height>150 && height<10000){
        frame.style.height=Math.ceil(height)+'px';
      }
    });
  }
  const strategyPreview=track.querySelector('.case-strategy-preview');
  if(strategyPreview){
    const frame=strategyPreview.querySelector('.case-ppt-frame');
    strategyPreview.addEventListener('toggle',()=>{
      if(strategyPreview.open && frame?.dataset.src){
        frame.src=frame.dataset.src;
        frame.removeAttribute('data-src');
      }
    });
    window.addEventListener('message',event=>{
      if(event.origin!==location.origin || event.source!==frame?.contentWindow ||
         event.data?.type!=='case-materials-height')return;
      const height=Number(event.data.height);
      if(Number.isFinite(height) && height>150 && height<10000){
        frame.style.height=Math.ceil(height)+'px';
      }
    });
  }
  // Compact in-page calculator, using the same assumptions as the financial model.
  const profit=document.getElementById('case-profit-model');
  if(profit){
    const fields={partners:profit.querySelector('#case-profit-partners'),rate:profit.querySelector('#case-profit-rate'),pg:profit.querySelector('#case-profit-pg'),cost:profit.querySelector('#case-profit-cost')};
    const output={orders:profit.querySelector('#case-profit-orders'),unit:profit.querySelector('#case-profit-unit'),economic:profit.querySelector('#case-profit-economic'),bep:profit.querySelector('#case-profit-bep')};
    const comparison=[['base',10,3],['fallback',10,0],['preferred',12,0]].map(([key,rate,pg])=>({element:profit.querySelector('[data-compare="'+key+'"]'),rate,pg}));
    const alert=profit.querySelector('#case-profit-error');
    const num=n=>Math.round(n).toLocaleString('ko-KR');
    const compute=(partners,rate,pg,cost)=>{
      const orders=Math.round(partners*4*4.33*18*.75*.6*(1-.08)*.97);
      const unit=Math.round(12000*rate/100)-Math.round(12000*pg/100)-150-50-.5*600;
      return {orders,unit,economic:orders*unit-600000-2000000-Math.max(0,partners-5)*cost};
    };
    function recalculate(){
      const v=Object.fromEntries(Object.entries(fields).map(([name,input])=>[name,Number(input.value)]));
      const invalidInputs=Object.entries(fields).filter(([,input])=>!input.checkValidity()||input.value==='');
      Object.values(fields).forEach(input=>{
        const invalid=invalidInputs.some(([,field])=>field===input);
        input.setAttribute('aria-invalid',String(invalid));
        if(invalid)input.setAttribute('aria-describedby','case-profit-error');
        else input.removeAttribute('aria-describedby');
      });
      const comparisonValid=fields.partners.checkValidity()&&fields.cost.checkValidity();
      comparison.forEach(({element,rate,pg})=>{
        if(!comparisonValid){element.textContent='—';return;}
        const value=compute(v.partners,rate,pg,v.cost).economic;
        element.textContent=(value>0?'+':'')+num(value)+'원';
      });
      if(invalidInputs.length){
        const guidance={
          partners:'공급처 수는 1~500곳의 정수로 입력하세요.',
          rate:'수수료율은 0~100% 범위에서 입력하세요.',
          pg:'결제비는 0~100% 범위에서 입력하세요.',
          cost:'추가 관리비는 0~1,000,000원을 1,000원 단위로 입력하세요.'
        };
        alert.textContent=invalidInputs.map(([name])=>guidance[name]).join(' ');
        Object.values(output).forEach(el=>el.textContent='—');
        alert.hidden=false;return;
      }
      alert.hidden=true;
      const current=compute(v.partners,v.rate,v.pg,v.cost);
      let bep=null;
      for(let p=1;p<=500;p++){if(compute(p,v.rate,v.pg,v.cost).economic>=0){bep=p;break;}}
      output.orders.textContent=num(current.orders)+'건';
      output.unit.textContent=num(current.unit)+'원';
      output.economic.textContent=(current.economic>0?'+':'')+num(current.economic)+'원';
      output.bep.textContent=bep===null?'500곳 이내 미달':num(bep)+'곳';
      output.economic.classList.toggle('negative',current.economic<0);
    }
    Object.values(fields).forEach(input=>input.addEventListener('input',recalculate));
    profit.querySelector('#case-profit-reset').addEventListener('click',()=>{
      Object.entries({partners:28,rate:12,pg:0,cost:30000}).forEach(([name,value])=>fields[name].value=value);
      recalculate();
    });
    recalculate();
  }
  // Mobile reading aid: current section and a direct return to the contents.
  const mobileReaderNav=document.createElement('nav');
  mobileReaderNav.className='mobile-reader-nav';
  mobileReaderNav.setAttribute('aria-label','현재 섹션과 목차 이동');
  mobileReaderNav.innerHTML='<span class="mobile-reader-count">01 / 09</span><span class="mobile-reader-name">추진 배경·검토 결론</span><button type="button" class="mobile-reader-toc">목차</button>';
  track.before(mobileReaderNav);
  mobileReaderNav.querySelector('.mobile-reader-toc').addEventListener('click',()=>{
    document.querySelector('.sidebar').scrollIntoView({behavior:'instant',block:'start'});
    (toc.querySelector('.toc-item.on')||toc.querySelector('.toc-item')).focus({preventScroll:true});
  });
  // Presentation metadata keeps table widths and key model values explicit.
  track.querySelectorAll('table').forEach(table=>{
    const headers=[...table.querySelectorAll('thead th')].map(cell=>cell.textContent.trim());
    const caption=table.querySelector('caption')?.textContent || '';
    const widths=headers.length===3 ? [20,40,40] : headers.length===4 ? [22,26,26,26] : null;
    if(caption==='사업모델 비교') widths.splice(0,4,20,23,32,25);
    if(caption==='사업모델 선택 기준') widths.splice(0,3,26,37,37);
    if(caption==='8주 현장 검증 설계안') widths.splice(0,3,25,39,36);
    if(headers[0]==='관리 항목') widths.splice(0,4,18,30,16,36);
    if(headers.length===6) table.classList.add('numeric-table');
    if(widths){
      const group=document.createElement('colgroup');
      widths.forEach(width=>{const col=document.createElement('col');col.style.width=width+'%';group.append(col);});
      table.insertBefore(group,table.querySelector('thead'));
    }
    if(headers[2]?.startsWith('기준') && headers[1]?.startsWith('보수')){
      table.classList.add('scenario-table');
      table.querySelectorAll('tr').forEach(row=>row.children[2]?.classList.add('baseline-cell'));
    }
    table.querySelectorAll('tbody tr').forEach(row=>{
      if(['월 완료 예약 · 최종 반올림','예약당 공헌이익','현금 기준 손익','기회비용 포함'].includes(row.firstElementChild?.textContent.trim())) row.classList.add('key-result');
    });
  });
  // Distinguish comparable numeric values without changing source data or mobile card labels.
  track.querySelectorAll('#section-04 tbody td,#section-05 tbody td,#section-08 tbody td').forEach(cell=>{
    const value=cell.textContent.trim().replace(/\u00a0/g,' ');
    if(/^[+−-]?\s*(?:약\s*)?\d[\d,]*(?:\.\d+)?\s*(?:원|만원|건|곳|%|석|회|명)$/.test(value)){
      cell.classList.add('numeric-value');
      if(/^[−-]/.test(value))cell.classList.add('is-negative');
    }
  });
  // Only include a table region in the Tab order when it can scroll horizontally.
  const tableRegions=[...track.querySelectorAll('.table-wrap[tabindex="0"]')];
  function syncTableFocus(){
    tableRegions.forEach(region=>{
      const canScroll=getComputedStyle(region).overflowX!=='visible' && region.scrollWidth>region.clientWidth+1;
      region.tabIndex=canScroll?0:-1;
    });
  }
  syncTableFocus();
  track.addEventListener('toggle',syncTableFocus,true);
  // Keep one document heading and a consistent section/subheading hierarchy.
  track.querySelectorAll('.slide:not(:first-child) .story-card h2,.slide:not(:first-child) .block-title').forEach(heading=>{
    const subheading=document.createElement('h3');subheading.className=heading.className;
    subheading.innerHTML=heading.innerHTML;heading.replaceWith(subheading);
  });
  // Non-interactive reading progress: helps orient readers in the 9-section report.
  const readerProgress=document.createElement('div');
  readerProgress.className='fm-reading-progress';
  readerProgress.setAttribute('aria-hidden','true');
  readerProgress.innerHTML='<span></span>';
  document.body.append(readerProgress);
  function updateReadingProgress(){
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const position=Math.max(0,Math.min(1,scrollY/max));
    readerProgress.firstElementChild.style.width=(position*100).toFixed(2)+'%';
  }
  const slides=[...track.children],links=[...toc.children];
  let current=-1,scheduled=false;
  function updateCurrent(){
    scheduled=false;
    updateReadingProgress();
    const offset=120;
    let index=0;
    slides.forEach((slide,i)=>{if(slide.getBoundingClientRect().top<=offset)index=i;});
    if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)index=slides.length-1;
    mobileReaderNav.querySelector('.mobile-reader-count').textContent=String(index+1).padStart(2,'0')+' / 09';
    mobileReaderNav.querySelector('.mobile-reader-name').textContent=sections[index].name;
    if(index===current)return;
    current=index;
    links.forEach((link,i)=>{link.classList.toggle('on',i===index);if(i===index)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(updateCurrent);}}
  toc.addEventListener('click',event=>{
    const link=event.target.closest('a');if(!link)return;
    const heading=slides[Number(link.dataset.index)].querySelector('.section-title');
    requestAnimationFrame(()=>heading.focus({preventScroll:true}));
  });
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  window.addEventListener('resize',syncTableFocus);
  window.addEventListener('hashchange',schedule);
  // History traversal must restore the fragment and keyboard focus together.
  window.addEventListener('popstate',()=>{
    requestAnimationFrame(()=>{
      const slide=slides.find(section=>'#'+section.id===location.hash);
      if(slide){
        slide.scrollIntoView({behavior:'instant',block:'start'});
        slide.querySelector('.section-title').focus({preventScroll:true});
      }
      schedule();
    });
  });
  window.addEventListener('pageshow',schedule);
  new ResizeObserver(()=>{schedule();syncTableFocus();}).observe(track);
  updateCurrent();
})();
