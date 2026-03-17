/**
 * OG Image Generator
 *
 * Canvas 기반 OG 이미지 (1200x630) 생성 스크립트
 * 실행: node scripts/generate-og-image.js
 *
 * 참고: 이 스크립트는 canvas 패키지가 필요합니다.
 * npm install canvas --save-dev
 *
 * 또는 아래 HTML 파일을 브라우저에서 열어 수동으로 PNG를 다운로드할 수 있습니다.
 */

import { readFileSync, writeFileSync } from 'fs';

// og-image.html을 읽어서 public에 복사
const html = readFileSync('public/og-image.html', 'utf-8');
console.log('✅ og-image.html 확인 완료');
console.log('');
console.log('PNG 생성 방법:');
console.log('1. 브라우저에서 public/og-image.html 열기');
console.log('2. 개발자도구 → Console에서 다음 실행:');
console.log('');
console.log("   html2canvas(document.querySelector('.og'), {width:1200, height:630}).then(c => {");
console.log("     const a = document.createElement('a');");
console.log("     a.download = 'og-image.png';");
console.log("     a.href = c.toDataURL('image/png');");
console.log("     a.click();");
console.log('   });');
console.log('');
console.log('또는 Chrome 개발자도구 → 스크린샷 캡처 사용');
