import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';
import styles from '../styles/Properties.module.css';


export default function Properties() {
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
    <div>
      <h4>Properties</h4>
      {loading && <Spinner animation="grow" />}
      {!loading && <div className={styles.grid}>
        {properties.map((p: any) =>
          <Button key={p.id} variant="outline-primary" onClick={() => router.push(`/property/${p.id}`)}>
            {p.address}
          </Button>)}
        <Button onClick={() => router.push("/property/new")}><PlusLg /></Button>
      </div>}
    </div>
  )
}
