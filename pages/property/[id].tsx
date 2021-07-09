import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import PropertyForm, { Property } from '../../components/propertyForm';
import styles from '../../styles/Home.module.css';

export default function EditProperty() {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState<Property>();

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/getProperties").then(res => res.json()).then(parsed => {
      setProperty(parsed.find((p: Property) => p.id === id));
      setLoading(false);
    });
  }, [])

  async function handleSubmit(e: any) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setLoading(true);
      await fetch("/api/editProperty", {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(property),
      });
      setLoading(false);
      router.push("/");
    }
  }

  function deleteProperty() {
    return fetch("/api/deleteProperty", {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3>Edit Property</h3>

        {loading && <Spinner animation="grow" />}
        {!loading && property && <PropertyForm
          property={property}
          update={(u: Partial<Property>) => setProperty({ ...property, ...u })}
          loading={loading}
          validated={validated}
          handleSubmit={handleSubmit}
        />}

        <div>
          <Button variant="danger">Delete</Button>
        </div>
      </main>
    </div>
  );
}
