# Implementation Plan

## Phase 1: 프로젝트 구조 및 기본 설정

- [x] 1. 모노레포 구조 설정
  - [x] 1.1 루트 package.json 및 Moonrepo 설정 파일 생성
    - 루트 package.json에 workspaces 설정
    - .moon/workspace.yml 및 .moon/toolchain.yml 생성
    - concurrently 스크립트 설정
    - _Requirements: 7.1, 7.3, 7.4_
  - [x] 1.2 shared 폴더 구조 및 GraphQL 스키마 생성
    - shared/graphql/schema.graphql 파일 생성
    - shared/types/ TypeScript 타입 정의
    - shared/package.json 설정
    - _Requirements: 7.2, 6.1_
  - [ ]* 1.3 Property test: GraphQL 스키마 직렬화 라운드트립
    - **Property 17: GraphQL Serialization Round-Trip**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 2. Backend (NestJS) 프로젝트 초기화
  - [x] 2.1 mixly-be 폴더에 NestJS 프로젝트 생성
    - NestJS CLI로 프로젝트 생성
    - GraphQL 모듈 설정 (@nestjs/graphql, @nestjs/apollo)
    - TypeORM 및 PostgreSQL 연결 설정
    - _Requirements: 7.1_
  - [x] 2.2 데이터베이스 엔티티 생성
    - User, Playlist, Track, PlaylistTrack, Follow, Like 엔티티
    - TypeORM 마이그레이션 설정
    - _Requirements: 2.1, 4.1, 4.3_

- [-] 3. Frontend (Expo) 프로젝트 설정
  - [ ] 3.1 mixly 폴더에 NativeWind 설정
    - tailwind.config.js 생성
    - NativeWind 플러그인 설정
    - _Requirements: 7.1_
  - [ ] 3.2 GraphQL 클라이언트 설정
    - Apollo Client 설치 및 설정
    - shared 폴더의 타입 연동
    - _Requirements: 6.1, 7.2_

## Phase 2: 인증 시스템

- [ ] 4. 인증 모듈 구현 (Backend)
  - [ ] 4.1 Auth 모듈 및 서비스 생성
    - JWT 토큰 생성/검증 로직
    - 비밀번호 해싱 (bcrypt)
    - _Requirements: 1.1, 1.2_
  - [ ] 4.2 회원가입 및 로그인 리졸버 구현
    - register mutation 구현
    - login mutation 구현
    - refreshToken mutation 구현
    - _Requirements: 1.1, 1.2, 1.5_
  - [ ]* 4.3 Property test: 인증 토큰 라운드트립
    - **Property 1: Authentication Token Round-Trip**
    - **Validates: Requirements 1.1, 1.2, 1.5**
  - [ ]* 4.4 Property test: 잘못된 자격 증명 거부
    - **Property 2: Invalid Credentials Rejection**
    - **Validates: Requirements 1.3**

- [ ] 5. 인증 UI 구현 (Frontend)
  - [ ] 5.1 로그인/회원가입 화면 구현
    - app/(auth)/login.tsx 생성
    - app/(auth)/register.tsx 생성
    - NativeWind 스타일링
    - _Requirements: 1.1, 1.2_
  - [ ] 5.2 인증 상태 관리 훅 구현
    - useAuth 훅 생성
    - 토큰 저장 (SecureStore)
    - _Requirements: 1.5_

- [ ] 6. Checkpoint - 인증 시스템 테스트
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: 플레이리스트 관리

- [ ] 7. 플레이리스트 모듈 구현 (Backend)
  - [ ] 7.1 Playlist 서비스 CRUD 구현
    - create, update, delete 메서드
    - getById, getByUser 메서드
    - _Requirements: 2.1, 2.5, 2.6_
  - [ ]* 7.2 Property test: 플레이리스트 생성 지속성
    - **Property 3: Playlist Creation Persistence**
    - **Validates: Requirements 2.1**
  - [ ]* 7.3 Property test: 플레이리스트 삭제 완전성
    - **Property 6: Playlist Deletion Completeness**
    - **Validates: Requirements 2.5**
  - [ ]* 7.4 Property test: 메타데이터 업데이트 지속성
    - **Property 7: Playlist Metadata Update Persistence**
    - **Validates: Requirements 2.6**
  - [ ] 7.5 트랙 관리 기능 구현
    - addTrack, removeTrack 메서드
    - reorderTracks 메서드
    - _Requirements: 2.2, 2.3, 2.4_
  - [ ]* 7.6 Property test: 트랙 카운트 불변성
    - **Property 4: Track Count Invariant**
    - **Validates: Requirements 2.2, 2.3**
  - [ ]* 7.7 Property test: 트랙 순서 지속성
    - **Property 5: Track Reorder Persistence**
    - **Validates: Requirements 2.4**
  - [ ] 7.8 공유 링크 기능 구현
    - generateShareLink 메서드
    - getByShareCode 메서드
    - _Requirements: 3.3, 3.4_
  - [ ]* 7.9 Property test: 공유 링크 고유성 및 접근
    - **Property 9: Share Link Uniqueness and Access**
    - **Validates: Requirements 3.3, 3.4**
  - [ ] 7.10 가시성 접근 제어 구현
    - 공개/비공개 접근 로직
    - _Requirements: 3.1, 3.2_
  - [ ]* 7.11 Property test: 가시성 접근 제어
    - **Property 8: Visibility Access Control**
    - **Validates: Requirements 3.1, 3.2**

- [ ] 8. 플레이리스트 UI 구현 (Frontend)
  - [ ] 8.1 플레이리스트 목록 화면 구현
    - app/(tabs)/index.tsx 수정 (내 플레이리스트)
    - PlaylistCard 컴포넌트
    - _Requirements: 2.1_
  - [ ] 8.2 플레이리스트 상세 화면 구현
    - app/playlist/[id].tsx 생성
    - TrackList 컴포넌트
    - _Requirements: 2.2, 2.3, 2.4_
  - [ ] 8.3 플레이리스트 생성/편집 모달 구현
    - 제목, 설명, 커버 이미지 입력
    - 공개/비공개 설정
    - _Requirements: 2.1, 2.6, 3.1, 3.2_

- [ ] 9. Checkpoint - 플레이리스트 기능 테스트
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: 소셜 기능

- [ ] 10. 소셜 모듈 구현 (Backend)
  - [ ] 10.1 팔로우/언팔로우 기능 구현
    - follow, unfollow 메서드
    - getFollowers, getFollowing 메서드
    - _Requirements: 4.1, 4.2_
  - [ ]* 10.2 Property test: 팔로우/언팔로우 라운드트립
    - **Property 10: Follow/Unfollow Round-Trip**
    - **Validates: Requirements 4.1, 4.2**
  - [ ] 10.3 좋아요 기능 구현
    - likePlaylist, unlikePlaylist 메서드
    - _Requirements: 4.3, 4.4_
  - [ ]* 10.4 Property test: 좋아요 카운트 불변성
    - **Property 11: Like Count Invariant**
    - **Validates: Requirements 4.3, 4.4**
  - [ ] 10.5 피드 기능 구현
    - getFeed 메서드 (팔로우한 사용자의 플레이리스트)
    - _Requirements: 4.5_
  - [ ]* 10.6 Property test: 피드 정렬
    - **Property 12: Feed Ordering**
    - **Validates: Requirements 4.5**

- [ ] 11. 소셜 UI 구현 (Frontend)
  - [ ] 11.1 사용자 프로필 화면 구현
    - app/user/[id].tsx 생성
    - FollowButton 컴포넌트
    - _Requirements: 4.1, 4.2_
  - [ ] 11.2 피드 화면 구현
    - app/(tabs)/feed.tsx 생성
    - 무한 스크롤 구현
    - _Requirements: 4.5_
  - [ ] 11.3 좋아요 버튼 구현
    - PlaylistCard에 좋아요 기능 추가
    - _Requirements: 4.3, 4.4_

- [ ] 12. Checkpoint - 소셜 기능 테스트
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: 검색 및 탐색

- [ ] 13. 검색 모듈 구현 (Backend)
  - [ ] 13.1 검색 기능 구현
    - search 메서드 (키워드 기반)
    - 필터링 로직
    - _Requirements: 5.1, 5.3_
  - [ ]* 13.2 Property test: 검색 결과 관련성
    - **Property 13: Search Result Relevance**
    - **Validates: Requirements 5.1**
  - [ ]* 13.3 Property test: 검색 필터 정확성
    - **Property 15: Search Filter Correctness**
    - **Validates: Requirements 5.3**
  - [ ] 13.4 트렌딩 기능 구현
    - getTrending 메서드
    - _Requirements: 5.2_
  - [ ]* 13.5 Property test: 트렌딩 정렬
    - **Property 14: Trending Order**
    - **Validates: Requirements 5.2**
  - [ ] 13.6 페이지네이션 구현
    - 커서 기반 페이지네이션
    - _Requirements: 5.4_
  - [ ]* 13.7 Property test: 페이지네이션 일관성
    - **Property 16: Pagination Consistency**
    - **Validates: Requirements 5.4**

- [ ] 14. 검색 UI 구현 (Frontend)
  - [ ] 14.1 검색 화면 구현
    - app/(tabs)/explore.tsx 수정
    - 검색 입력 및 결과 표시
    - _Requirements: 5.1_
  - [ ] 14.2 트렌딩 섹션 구현
    - 트렌딩 플레이리스트 목록
    - _Requirements: 5.2_
  - [ ] 14.3 필터 UI 구현
    - 장르/카테고리 필터
    - _Requirements: 5.3_

- [ ] 15. Checkpoint - 검색 기능 테스트
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: 에러 처리 및 검증

- [ ] 16. 에러 처리 강화
  - [ ] 16.1 GraphQL 에러 필터 구현
    - 커스텀 예외 클래스 생성
    - 에러 응답 포맷팅
    - _Requirements: 6.4_
  - [ ]* 16.2 Property test: 잘못된 입력 거부
    - **Property 18: Malformed Input Rejection**
    - **Validates: Requirements 6.4**

- [ ] 17. Final Checkpoint - 전체 테스트
  - Ensure all tests pass, ask the user if questions arise.
