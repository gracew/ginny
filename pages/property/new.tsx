import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import PropertyForm, { Property } from '../../components/propertyForm';
import styles from '../../styles/Home.module.css';

export default function NewProperty(){
  const router = useRouter();

  const [property, setProperty] = useState({});

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setLoading(true);
      await fetch("/api/addProperty", {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(property),
      });
      setLoading(false);
      router.push("/");
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3>Add Property</h3>

        <PropertyForm
          property={property}
          update={(u: Partial<Property>) => setProperty({ ...property, ...u })}
          loading={loading}
          validated={validated}
          handleSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
