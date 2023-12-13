import styled from 'styled-components';

const HeaderLogo = () => {
  return (
    <Logo>C3WebFunding</Logo>
  )
}

const Logo = styled.h1`
  font-weight: normal;
  font-size: 30px;
  margin-left: 20px;
  font-family: 'Poppins';
  letter-spacing: 2px;
  cursor: pointer;
`

export default HeaderLogo