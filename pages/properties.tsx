import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
import { PencilFill, PlusCircleFill, PlusLg } from 'react-bootstrap-icons';
import styles from '../styles/Properties.module.css';


export default function Properties() {
  const [properties, setProperties] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/getProperties").then(res => res.json()).then(parsed => {
      setProperties(parsed);
      setLoading(false);
    });
  }, [])

  async function deleteProperty(id: string) {
    fetch("/api/deleteProperties").then(res => res.json()).then(parsed => {
      setProperties(parsed);
      setLoading(false);
    });
  }

  return (
    <div>
      <h4>Properties</h4>
      {loading && <Spinner animation="grow" />}
      {!loading && properties.length === 0 && <div>No properties yet</div>}
      {!loading && properties.length > 0 && <div className={styles.grid}>
        {properties.map((p: any) =>
          <Button key={p.id} variant="outline-primary">
            {p.address}
          </Button>)}
        <Button href="/property/new"><PlusLg /></Button>
      </div>}
    </div>
  )
}
