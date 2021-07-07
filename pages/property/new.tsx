import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import styles from '../../styles/Home.module.css';

export default function Home() {
  const router = useRouter();

  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<string>("");

  const [applicationFee, setApplicationFee] = useState<number>();
  const [reservationFee, setReservationFee] = useState<number>();
  const [adminFee, setAdminFee] = useState<number>();
  const [parkingFee, setParkingFee] = useState<number>();
  const [petFee, setPetFee] = useState<number>();

  const [customText, setCustomText] = useState<string>("");

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
        body: JSON.stringify({
          address,
          city,
          state,
          zip,
          applicationFee,
          reservationFee,
          adminFee,
          parkingFee,
          petFee,
          customText,
        }),
      });
      setLoading(false);
      router.push("/");
    }
  }

  return (
    <div className={styles.container}>
      <h3>Add Property</h3>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group>
          <h4>Location</h4>
          <Form.Label>Street Address</Form.Label>
          <Form.Control
            required
            value={address}
            onChange={e => setAddress(e.target.value)}
          ></Form.Control>

          <Form.Label>City</Form.Label>
          <Form.Control
            required
            value={city}
            onChange={e => setCity(e.target.value)}
          ></Form.Control>

          <Form.Label>State</Form.Label>
          <Form.Control
            required
            value={state}
            onChange={e => setState(e.target.value)}
          ></Form.Control>

          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            required
            value={zip}
            onChange={e => setZip(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <h4>Fees</h4>
          <Form.Label>Application Fee</Form.Label>
          <Form.Control
            type="number"
            value={applicationFee}
            onChange={e => setApplicationFee(Number(e.target.value))}
          ></Form.Control>

          <Form.Label>Reservation Fee</Form.Label>
          <Form.Control
            type="number"
            value={reservationFee}
            onChange={e => setReservationFee(Number(e.target.value))}
          ></Form.Control>

          <Form.Label>Admin/amenity Fee</Form.Label>
          <Form.Control
            type="number"
            value={adminFee}
            onChange={e => setAdminFee(Number(e.target.value))}
          ></Form.Control>

          <Form.Label>Parking Fee</Form.Label>
          <Form.Control
            type="number"
            value={parkingFee}
            onChange={e => setParkingFee(Number(e.target.value))}
          ></Form.Control>

          <Form.Label>Pet Fee</Form.Label>
          <Form.Control
            type="number"
            value={petFee}
            onChange={e => setPetFee(Number(e.target.value))}
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <h4>Customizations</h4>

          <Form.Label>Custom Text</Form.Label>
          <Form.Control
            value={customText}
            as="textarea"
            onChange={e => setCustomText(e.target.value)}
          ></Form.Control>
          Need more customizations? Contact us at <a href="mailto:hello@meetginny.com">hello@meetginny.com</a>.
        </Form.Group>

        <Button type="submit">
          Save
          {loading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
        </Button>
      </Form>


    </div>
  );
}
