import * as React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

export const SelectionGrid = ({ children }: { children: React.ReactNode }) => {
  return <Row>{children}</Row>;
};

export const SelectionGridItem = ({
  header,
  onSelect,
  children,
}: {
  header: string;
  onSelect(): void;
  children: React.ReactNode;
}) => {
  return (
    <Col xs={12} sm={6} lg={4}>
      <Card style={{ marginBottom: '20px' }}>
        <Card.Header>{header}</Card.Header>
        <Card.Body>
          <div className="d-grid gap-3">
            {children}
            <Button onClick={onSelect}>Select</Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};
