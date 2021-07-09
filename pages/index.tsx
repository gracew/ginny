import { UserButton } from '@clerk/clerk-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import React from 'react';
import { Badge, Button, Col, Nav, Navbar, Row, Tab } from 'react-bootstrap';
import styles from '../styles/Home.module.css';
import GenerateReservationAgreement from './generate';
import Properties from './properties';


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Generate with Ginny</title>
        <meta name="description" content="The easiest way to generate reservation agreements and approval letters." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar bg="light" className={styles.navbar}>
        <Navbar.Brand>Generate with Ginny</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button
            variant="outline-primary"
            size="sm"
            className={styles.feedbackButton}
            href="mailto:hello@meetginny.com">Feedback?</Button>
          <UserButton />
        </Navbar.Collapse>
      </Navbar>

      <main className={styles.main}>
        <Properties />
        <h4>Generate documents for your property in seconds.</h4>
        <Tab.Container defaultActiveKey="reservation">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="reservation">Reservation Agreements</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="approval" disabled>Approval Letters <Badge variant="light">Coming Soon</Badge></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="moveout" disabled>Move-out Packets <Badge variant="light">Coming Soon</Badge></Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="reservation">
                  <GenerateReservationAgreement />
                </Tab.Pane>
                <Tab.Pane eventKey="approval">
                </Tab.Pane>
                <Tab.Pane eventKey="moveout">
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </main>
    </div>
  )
}
