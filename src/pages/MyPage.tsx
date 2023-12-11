import styled from 'styled-components'
import userImage from '@/assets/userIcon.png'
import FavRing from '@/components/mypage/FavRing'

function MyPage() {
  return (
    <Box>
      <ContentBox>
        <ProfileContain>
          <Image src={userImage} alt="사용자 이미지" />

          <ProfileInfo>
            <p>bomlang4211@gmail.com</p>
            <ProfileBtn>프로필 편집</ProfileBtn>
          </ProfileInfo>
        </ProfileContain>

        <Container>
          <FavRing />
          <FavRing />
          <FavRing />
          <FavRing />
        </Container>

        <MarginContainer>
          <Wrapper>
            <p>게시물</p>
            <span>10</span>
          </Wrapper>

          <Wrapper>
            <p>좋아요</p>
            <span>5</span>
          </Wrapper>
        </MarginContainer>

        <PostsContain>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
          <Post></Post>
        </PostsContain>
      </ContentBox>
    </Box>
  )
}

export default MyPage

const Box = styled.section`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 70px;

  @media (min-width: 1031px) {
    display: flex;
    align-items: center;
  }
  @media (min-width: 701px) and(max-width: 1030px) {
    display: flex;
    align-items: center;
  }
`

const ContentBox = styled.div`
  width: 390px;
`

const ProfileContain = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
`

const Image = styled.img`
  width: 90px;
  height: 90px;
`

const ProfileInfo = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;

  /* padding-right: 34px; */
`

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
`

const MarginContainer = styled(Container)`
  margin: 15px 0;
  border: 1px solid black;
`

const Wrapper = styled.button`
  width: 50%;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    background-color: tomato;
  }
`

const PostsContain = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
`

const Post = styled.div`
  width: 129px;
  height: 129px;
  background-color: blueviolet;
`

const ProfileBtn = styled.button`
  width: 240px;
  height: 30px;
  background-color: EFEFEF;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  border: none;
`
