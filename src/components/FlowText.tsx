import styled from 'styled-components'
import { motion } from 'framer-motion'
import flowShape from '@/assets/flowShape.svg'

const MarqueeContainer = styled(motion.div)`
  display: flex;
  transform-style: preserve-3d;
  white-space: nowrap;
  will-change: transform;
  margin: 4px;
`

const MarqueeContentContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 30px;
  white-space: nowrap;
  display: flex;
  gap: 8px;
  align-items: center;
  margin-right: 6px;
`

const MarqueeText = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: #303032;
  white-space: nowrap;
`
const MarqueeBoldText = styled(MarqueeText)`
  font-weight: 700;
`
const MarqueeIcon = styled.img`
  width: 20px;
  height: 20px;
  margin: 0 5px;
`

const marqueeVariants = {
  animate: {
    x: [-100, -800],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 4,
        ease: 'linear'
      }
    }
  }
}

const FlowText = () => {
  return (
    <MarqueeContainer
      initial={{ x: '-110%' }}
      animate="animate"
      transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
      variants={marqueeVariants}
    >
      <MarqueeContentContainer>
        <MarqueeIcon src={flowShape} alt="" />
        <MarqueeText>Share your Review,</MarqueeText>
        <MarqueeBoldText>BABA</MarqueeBoldText>
      </MarqueeContentContainer>
      <MarqueeContentContainer>
        <MarqueeIcon src={flowShape} alt="" />
        <MarqueeText>Share your Review,</MarqueeText>
        <MarqueeBoldText>BABA</MarqueeBoldText>
      </MarqueeContentContainer>
      <MarqueeContentContainer>
        <MarqueeIcon src={flowShape} alt="" />
        <MarqueeText>Share your Review,</MarqueeText>
        <MarqueeBoldText>BABA</MarqueeBoldText>
      </MarqueeContentContainer>
      <MarqueeContentContainer>
        <MarqueeIcon src={flowShape} alt="" />
        <MarqueeText>Share your Review,</MarqueeText>
        <MarqueeBoldText>BABA</MarqueeBoldText>
      </MarqueeContentContainer>
      <MarqueeContentContainer>
        <MarqueeIcon src={flowShape} alt="" />
        <MarqueeText>Share your Review,</MarqueeText>
        <MarqueeBoldText>BABA</MarqueeBoldText>
      </MarqueeContentContainer>
    </MarqueeContainer>
  )
}

export default FlowText
