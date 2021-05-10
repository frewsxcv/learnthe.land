import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import React from "react";

export const Frame = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Navbar expand="sm" variant="light" bg="light">
        <Container>
          <Navbar.Brand>learnthe.land</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="py-3">
        {children}
      </Container>
    </>
  );
};
