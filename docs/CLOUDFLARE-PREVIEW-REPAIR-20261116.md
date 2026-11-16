# Cloudflare Workers PR 미리보기 빌드 복구 (2026-11-16)

## 확인된 원인
- 운영 배포 명령: `npx wrangler deploy --assets ./ --name footmate-case-study --compatibility-date 2026-11-11`
- PR 미리보기 명령(수정 전): `npx wrangler preview`
- PR #47의 Cloudflare 미리보기 빌드는 `Your Wrangler configuration is missing a previews block` 오류로 실패했다.
- 루트에 `wrangler.jsonc`·`wrangler.json`·`wrangler.toml`이 없었다.
- 과거 이슈 [#44](https://github.com/dohyunkimmm/footmate-case-study/issues/44)는 **당시 임시 브랜치 트리거가 삭제돼 종료**된 것으로, 최신 PR 미리보기 검증 완료를 뜻하지 않는다.

## 최소 변경
1. `wrangler.preview.jsonc`를 추가해 정적 자산 `./`와 필수 `previews: {}`를 선언한다. 자동으로 읽히는 기본 파일명이 아닌 **미리보기 전용** 파일명을 사용한다.
2. Cloudflare Workers Builds의 **Preview Base Deploy Command만** `npx wrangler preview --config wrangler.preview.jsonc`로 조정한다. API의 계정 설정 변경이므로 Git 저장소에는 상태 설명만 남긴다.
3. `.assetsignore`에 해당 미리보기 설정 파일을 추가해 정적 자산 배포에서 제외한다.
4. **Production Deploy Command·Git 연결 대상·main 배포 경로를 변경하지 않는다.** API로 명령의 변경 전/후 값을 확인하고, PR 미리보기 빌드 및 운영 배포를 각각 확인한다.

## 검증·안전선
- PR 미리보기: 빌드 상태 `success`, 미리보기 URL/리소스 응답과 배포 SHA 확인
- 원본 보호: 9개 본문 섹션, PPTX 9장+6장+P0–P2 6장, XLSX·계산식, 다운로드 경로·QA 코드 불변
- 현재 게시 설정과 별개로 Cloudflare PR 미리보기를 테스트할 것. GitHub Actions QA 성공만으로 Cloudflare 빌드 성공을 추정하지 않는다.
- 롤백: Cloudflare Preview 명령만 이전 값 `npx wrangler preview`로 되돌리고, 본 문서·`wrangler.preview.jsonc` 및 `.assetsignore` 추가를 별도 PR로 취소. 운영 배포 명령은 영향을 받지 않는다.

공식 설명: [Worker Previews 설정](https://developers.cloudflare.com/workers/previews/configuration/) · [Wrangler preview / --config 옵션](https://developers.cloudflare.com/workers/wrangler/commands/workers/) · [Workers Builds 브랜치 미리보기](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/).
