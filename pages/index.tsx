import React from 'react';
import { Badge, Col, Nav, Row, Tab } from 'react-bootstrap';
import styles from '../styles/Home.module.css';
import GenerateReservationAgreement from './generate';
import Properties from './properties';


export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Properties />
        <h4 className={styles.generateHeader}>Generate documents for your property in seconds.</h4>
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
