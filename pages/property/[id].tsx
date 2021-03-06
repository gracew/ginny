import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import * as uuid from "uuid";
import PropertyForm, { Property } from '../../components/propertyForm';
import styles from '../../styles/Home.module.css';

export default function EditProperty() {
  const router = useRouter();
  const { id } = router.query;

  const [image, setImage] = useState<File>();
  const [property, setProperty] = useState<Property>();

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/getProperties").then(res => res.json()).then(parsed => {
      setProperty(parsed.find((p: Property) => p.id === id));
      setLoading(false);
    });
  }, [id])

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
      await fetch("/api/editProperty", {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...property, logo_url }),
      });
      setLoading(false);
      router.push("/");
    }
  }

  async function deleteProperty() {
    await fetch("/api/deleteProperty", {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    router.push("/");
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3>Edit Property</h3>

        {loading && <Spinner animation="grow" />}
        {!loading && property && <div>
          <PropertyForm
            property={property}
            update={(u: Partial<Property>) => setProperty({ ...property, ...u })}
            logoHandler={setImage}
            loading={loading}
            validated={validated}
            handleSubmit={handleSubmit}
          />
          
          <div>
            <Button className={styles.deleteButton} onClick={() => setShowDeleteModal(true)} variant="outline-danger">
              Delete
            </Button>
          </div>

          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
            <Modal.Body>Are you sure you want to delete property {property.address}?</Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={deleteProperty}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>}
      </main>
    </div>
  );
}
