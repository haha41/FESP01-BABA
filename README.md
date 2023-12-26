# BABA 웹사이트 - 멋쟁이 사자처럼 FE 01기 파이널 프로젝트


## 프로젝트 소개

- BABA는 재밌게 감상한 컨텐츠를 평가하고 추천하는 웹사이트입니다.
- 오늘 무엇을 볼지 고민이라면? BABA에서 오늘의 추천 컨텐츠를 확인하세요.
- 재밌게 본 컨텐츠를 기록하고, 나중에 다시 보고 싶은 컨텐츠를 찜목록에 저장하세요.

## 팀원

팀원과 역할에 대한 정보를 작성하세요.

- 팀원1: [이호](https://github.com/bomlang) - 조장
- 팀원2: [정소희](https://github.com/haha41) - 팀원
- 팀원3: [장현주](https://github.com/hyeonjuuu) - 팀원

## 기술 스택

프로젝트에서 사용한 주요 기술 스택을 나열하세요.

- 번들러 및 개발 환경: Vite
- 개발 언어: 타입스크립트
- UI 라이브러리 및 프레임워크: React, React-Router
- 상태 관리: Zustand
- 애니메이션 라이브러리: React Spring, Framer Motion, Swiper
- HTTP 통신: Axios


## 설치 및 실행 방법

1. 저장소를 클론합니다.
```bash
git clone https://github.com/bomlang/FESP01-BABA.git

```

2. 프로젝트 폴더로 이동합니다.
```bash
cd FESP01-BABA

```

3. 의존성 패키지를 설치합니다.
```bash
npm install
```

 4. 프로젝트를 실행합니다.
```bash
npm start
```

---


## 페이지별 기능 

### 초기화면
- 대부분의 주요 기능은 로그인한 사용자를 중심으로 구성되어 있으므로, 사용자를 로그인 또는 회원가입 화면으로 안내합니다.

<img width="956" alt="스크린샷 2023-12-25 오후 1 47 51" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/28dd8f81-c373-41c7-bd0c-bf1a771bae99">
<img width="416" alt="스크린샷 2023-12-25 오후 1 48 38" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/c3c97a51-c342-4cbb-a0ae-8fff92c00a86">


### 메인화면 

- **홈** 버튼을 클릭하면 로그인 여부에 상관없이 메인 화면으로 이동할 수 있습니다.
- 메인 화면에서는 사용자들이 올린 게시글을 최신 날짜순으로 확인할 수 있습니다.
- 원하는 장르를 선택하여 카테고리를 탐색하고, 해당 장르의 추천 컨텐츠를 만나볼 수 있습니다.

<img width="1507" alt="스크린샷 2023-12-25 오후 1 51 52" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/b92c3975-f3f2-4dc5-9c42-ed53695ec0f3">
<img width="445" alt="스크린샷 2023-12-25 오후 1 52 11" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/817fc163-6216-4248-aa34-c7ab5fd8e3a4">


### 검색화면

- 검색창에 원하는 컨텐츠의 제목을 입력하면, 해당 컨텐츠의 간단한 정보를 확인할 수 있습니다.
- 또한 해당 컨텐츠의 평균 평점과 사용자들이 남긴 피드백과 평점을 살펴볼 수 있습니다.

<img width="1489" alt="스크린샷 2023-12-25 오후 1 59 59" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/caba4fa0-35c6-48a9-b0a7-85bca42fec5f">
<img width="1512" alt="스크린샷 2023-12-25 오후 2 00 24" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/bb68c694-2798-4e24-acad-0a09965320d9">


### 로그인 & 회원가입화면

- 간단한 정보를 입력하여 회원가입이 가능합니다.
- 이메일 형식과 안전한 비밀번호 여부를 유효성 검사를 통해 확인합니다.
- Supa Base를 활용하여 회원가입 시 사용자 테이블이 생성되고 정보가 저장됩니다.
- 회원가입 완료 후, 로그인을 시도하여 성공하면 사용자의 닉네임, 이름, 프로필사진이 나타납니다. (초기 프로필은 설정되지 않아, 마이페이지에서 설정이 가능합니다.)

<img width="1031" alt="스크린샷 2023-12-25 오후 2 01 43" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/c29f2be2-9fdd-44a6-b87f-dec00787f6bd">
<img width="473" alt="스크린샷 2023-12-25 오후 2 03 19" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/07e9136b-6745-4b20-9442-d93d4115f7ca">

<img width="933" alt="스크린샷 2023-12-25 오후 2 07 55" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/f717b8d4-fb42-4275-affd-29117c0be92b">


### 리뷰 작성페이지

- 검색창에 리뷰하고 싶은 컨텐츠의 제목을 입력하면, 해당 컨텐츠의 포스터, 제목, 간단한 정보가 자동으로 삽입됩니다.
- 사용자는 시청한 OTT를 선택하고, 컨텐츠에 대한 평점을 매길 수 있으며, 간단한 리뷰글도 작성할 수 있습니다.


<img width="841" alt="스크린샷 2023-12-25 오후 2 09 56" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/725c75ed-930a-4a1e-9334-838c08625207">
<img width="782" alt="스크린샷 2023-12-25 오후 2 12 20" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/c3f4df4c-4086-4f9b-97e4-c7aa2fbe3d46">


### 마이페이지

- 마이페이지에선 프로필을 등록 및 삭제가 가능합니다.
- 로그아웃을 마이페이지에서 할 수 있습니다.
- 로그인한 사용자가 쓴 리뷰글 또는 좋아요를 누른 게시글이 나뉘어져 보여지게 됩니다.
- 만약 다른 사용자가 내 게시글에 좋아요를 눌렀다면, 해당 게시글은 타원모양으로 마이페이지에 보여지게 됩니다. (만약 없다면 생성되지 않습니다.)

<img width="660" alt="스크린샷 2023-12-25 오후 2 14 28" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/fbc40584-3327-44a3-8afa-76dc3a4d75bf">
<img width="503" alt="스크린샷 2023-12-25 오후 2 15 14" src="https://github.com/bomlang/FESP01-BABA/assets/61110237/3afdc6d5-4a3a-4221-b783-b249b8e5629e">


