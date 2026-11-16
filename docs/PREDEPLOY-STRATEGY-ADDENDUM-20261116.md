# FootMate | P0–P2 본문·발표자료 배포 전 점검 (2026-11-16)

## 적용 지침

[통합 디자인 기준](DESIGN-SYSTEM.md)과 [발표자료 15장 검토 기록](PRESENTATION-SPACING-REVIEW-20261111.md), [QA 워크플로](../.github/workflows/report-qa.yml)를 기준으로 한다. **사이트 9개 섹션·기존 PPTX 9장+6장·원본 미리보기·재무 XLSX는 보존**한다.

## 변경 내역

| 위치 | 변경 목적 | 비변경 보장 |
| --- | --- | --- |
| `index.html` | P0–P2 보완 JS/CSS 참조 2건 연결 | 9섹션 DOM/기존 스타일·스크립트 유지 |
| `src/case-study/strategy-brief.js` / `.css` | 02 시장 GTM, 03 CorpDev, 08 포트폴리오·KPI·Equity Story에 **요약 보완** | 기존 31개 표, 9개 섹션, 수치·계산·유저 입력 로직 유지 |
| `src/case-study/strategy-brief-data.js` | 별도 발표 6장 문구의 단일 원본 | 기존 PPTX 2종·15장 미리보기 불변 |
| `src/case-study/strategy-brief.html` | 별도 반응형 6장 발표 읽기, 키보드·선택/이전/다음 이동 | 기존 `materials.html` 슬라이드 뷰어 그대로 |
| `src/case-study/downloads/footmate_strategy_p0_p2.pptx` | **편집 가능한 텍스트·도형** 기반 신규 보완 6장 | 기존 `footmate_report.pptx`, `footmate_5year_strategy.pptx` 변경 없음 |
| `src/case-study/materials.html` | 기존 발표자료 앞에 신규 발표 읽기·다운로드 링크 추가 | 기존 다운로드/슬라이드 재생 코드 유지 |
| `qa/check-strategy-brief.py`·`tests/e2e/strategy-brief.spec.cjs` | PPTX 정합성·링크·반응형·접근성 검사 | 기존 QA 기준 완화 없음 |

**해석:** 신규 HTML 읽기는 정적 콘텐츠 기반 **별도 웹 발표 보기**이며, 기존 15장 PPTX 기반 이미지 미리보기의 대체가 아니다. 신규 보완 PPTX는 편집할 수 있으나 이를 실측 성과나 공개 투자 설명서로 활용하지 않는다. 신규 HTML 페이지와 PPTX는 같은 6장 텍스트를 사용하도록 자동 대조한다. PNG/JPG 미리보기를 새로 제공하려면 **PPTX 실제 렌더 결과에서 생성**하고 별도 PR에서 시각 검수한다.

## 디자인·콘텐츠 품질 기준

- 기존 색상 토큰: 네이비 `#142C39`, 선택안 `#087B60`, 옅은 민트 `#EAF5F1`, 본문 `#1B2931`, 보조 `#52636D`; Pretendard, 대비 가능한 레이블, `tabular-nums`.
- **한 슬라이드 한 결론**: 사업 판단 → GTM → CorpDev → 포트폴리오 → KPI → Equity Story의 6장. 원본 9장·전략 6장은 유지.
- **숫자·출처 보존**: 626건·340원·월 −387,160원·8주 현금 461만원·5개년 공급처 5/12/20/28/36곳은 기존 **가정**으로만 인용.
- 해외 비교·제휴/인수 후보·사업 시너지는 **실제 계약/실사/투자 결과가 아니며** 미검증 상태를 표시.
- 콘텐츠 출처: [원본 분석](IT-STRATEGY-CASE-STUDY.md), [P0 GTM](P0-GTM-ENTRY-STRATEGY-20261116.md), [P0 CorpDev](P0-CORPDEV-CANDIDATE-SCREENING-20261116.md), [P1 포트폴리오](P1-PORTFOLIO-CAPITAL-ALLOCATION-20261116.md), [P1 KPI](P1-STRATEGY-KPI-GOVERNANCE-20261116.md), [P2 Equity Story](P2-EQUITY-STORY-EXECUTIVE-MEMO-20261116.md).

## 배포 전 게이트

1. **파일 차이 검사:** 기존 2개 PPTX·XLSX·15장 이미지·`report-previews.js`·`nine-sections.js`·손익 계산 경로의 blob SHA가 기존 `main`과 일치해야 한다.
2. **정적·재무 검사:** `python3 qa/crosscheck-case-study-presentations.py`와 `python3 qa/check-strategy-brief.py` 모두 통과해야 한다. 새 PPTX는 6개 ZIP 슬라이드 파트·편집 가능한 도형·웹 문구 동등성을 검사한다.
3. **브라우저 QA:** `npm run test:report`로 기존 46개 테스트와 신규 보완 테스트를 실행한다. 320px·390px·1440px에서 수평 넘침, 슬라이드 조작, 다운로드, 접근성 위반이 없어야 한다.
4. **사람의 시각 검수:** 기존 15장 불변 확인 + 신규 6장 PPTX를 실제 편집/렌더 도구에서 열어 글자 잘림·폰트 대체·줄바꿈·콘텐츠 중첩을 확인한다. **자동 ZIP 검사만으로 PPTX 시각 품질을 보증하지 않는다.**
5. **검토용 PR:** PR의 변경 파일·원본 유지·검사 결과를 확인한 다음에만 병합 여부 결정. 사용자가 명시하지 않은 운영 설정 변경·직접 운영 배포·자동 병합은 하지 않는다.
6. **운영 배포 점검:** GitHub 병합은 Cloudflare Workers 운영 배포 성공과 다르다. 운영 사이트의 URL·커밋 버전·자산 경로·다운로드·모바일 동작을 별도로 대조한다. 이전 [배포 설정 이슈 #44](https://github.com/dohyunkimmm/footmate-case-study/issues/44)는 검증 없이 해결 처리하지 않는다.

### 판단 상태

**이 문서는 배포 전 체크리스트다.** PR 또는 CI 실행 전에는 완료/성공으로 주장하지 않는다. 각 검사 실행의 SHA·링크·결론은 PR에 기록하고 실패 시 `main`과 운영 사이트를 그대로 유지한다.
