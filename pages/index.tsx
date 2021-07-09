import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Nav, Row, Spinner, Tab } from 'react-bootstrap';
import styles from '../styles/Home.module.css';
import GenerateReservationAgreement from '../components/generate';
import Properties from '../components/properties';
import { useRouter } from 'next/dist/client/router';
import { PlusLg } from 'react-bootstrap-icons';


export default function Home() {
  const router = useRouter();
  const [properties, setProperties] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/getProperties").then(res => res.json()).then(parsed => {
      setProperties(parsed);
      setLoading(false);
    });
  }, [])
  return (
    <div className={styles.container}>
      <main className={styles.main}>

        <h4>Properties</h4>
        {loading && <Spinner animation="grow" />}
        {!loading && <div className={styles.grid}>
          {properties.map((p: any) =>
            <Button key={p.id} variant="outline-primary" onClick={() => router.push(`/property/${p.id}`)}>
              {p.address}
            </Button>)}
          <Button onClick={() => router.push("/property/new")}><PlusLg /></Button>
        </div>}

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
                  <GenerateReservationAgreement properties={properties} />
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
