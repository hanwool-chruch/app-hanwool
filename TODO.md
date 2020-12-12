### QR Login 출석 프로그램
- 청년부 출석을 위해 QR Login 도입
- 예시 : https://churchqr.net/
- 구성은 QR CODE 생성기와 리더기로 구성됨
    - QR CODE 생성기
        - 사용자의 정보가 포함된 QR CODE 생성
        - 구글 로그인과 연동
        - 기존 출석 프로그램의 사용자 정보의 연결되어야함 - 현재는 이메일이 유력
    - QR CODE 리더기
        - QR CODE을 읽을 수 있는 어플리케이션 필요
    
### 회계관리 프로그램
- 청년부원들이 자신이 사용하는 금액과 내용을 기입할 수 있는 프로그램
- 필요 기능
    - 본인이 사용한 금액을 올릴 수 있어야 한다
    - 영수증 올릴 수 있는 기능
    - 비용 종류에 따라 카테고리 나눌 수 있음, 팀별 나눌 수 있는 붑ㄴ
    - 결재 시스템 

### 켜뮤니티 프로그램
- 사진이나 게시물을 올리고 공유할 수 있는 프로그램
- 켜뮤니티 프로그램의 경우는 완성된 형태의 오픈소스를 이용하고 Plugin 추가로 기능 확장 가능
- Open-Source Blogging Platforms
    - https://www.codementor.io/@lovellifuad/15-clean-and-simple-open-source-blogging-platforms-for-your-developer-blog-qdrlfwhl6
- 프로그램 개발 보다 어떻게 운영할지 먼저 결정해야 함
- 목적에 따라 둘 중 하나를 선택해야 함
    - 일부 관리자만 글을 올리고 일반 사용자는 댓글 형태로 소통 - Blog
        - https://www.madewithover.com/blog
        - https://www.codeblocq.com/assets/projects/hexo-theme-phantom/
        - https://louisbarranqueiro.github.io/hexo-theme-tranquilpeak/      
    - 모든 사용자가 자유롭게 글을 올릴수 있는 시스템 - 게시판
    

    
## 공통 부분
- 로그인은 구글이나 애플 계정과 연돌 할 수 있는 OAuth 활용
- 기존 오픈 소스를 활용한다