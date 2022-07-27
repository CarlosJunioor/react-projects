import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/cryptoavi2.png'

function Menu() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
        <img
              alt=""
              src={logo}
              width="40"
              height="30"
            />
          <Navbar.Brand href="#home">Crypto Aviation</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Hangar</Nav.Link>
            <Nav.Link href="#features">Staking</Nav.Link>
            <Nav.Link href="#pricing">Marketplace</Nav.Link>
            <Nav.Link href="#pricing">Airport</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Menu;