import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

export const NesContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Navbar expand="sm" variant="dark" bg="primary">
        <Container>
          <Navbar.Brand>learnthe.land</Navbar.Brand>
        </Container>
      </Navbar>
      <Navbar className="shadow" expand="sm" variant="light" bg="light">
        <Container>
          <Navbar.Brand>{title}</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="mt-5">
        {children}
      </Container>
    </>
  );
};
