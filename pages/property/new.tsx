import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import * as uuid from "uuid";
import PropertyForm, { Property } from '../../components/propertyForm';
import styles from '../../styles/Home.module.css';

export default function NewProperty() {
  const router = useRouter();

  const [property, setProperty] = useState({});

  const [image, setImage] = useState<File>();

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
      let logo_url;
      if (image) {
        // upload file to GCS: https://cloud.google.com/storage/docs/json_api/v1/objects/insert
        logo_url = `logos/${uuid.v4()}`;
        const res = await fetch("https://storage.googleapis.com/upload/storage/v1/b/bmi-templates/o?uploadType=media&name=" + logo_url, {
          method: 'post',
          body: image
        });
      }
      await fetch("/api/addProperty", {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...property, logo_url }),
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
          logoHandler={setImage}
          validated={validated}
          handleSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
