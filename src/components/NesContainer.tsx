import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

export const NesContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header>{title}</Card.Header>
            <Card.Body>
              {/* <Card.Title>Special title treatment</Card.Title> */}
              <Card.Text>
                {children}
              </Card.Text>
              {/* <Button variant="primary">Go somewhere</Button> */}
            </Card.Body>
          </Card>
          {/* <div>{title}</div>
          <div>{children}</div> */}
        </Col>
      </Row>
    </Container>
  );
};
