import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import styles from '../styles/Generate.module.css';
import DollarInput from './dollarInput';
import { Property } from './propertyForm';

interface GenerateReservationAgreeementProps {
  properties: Property[];
}

export default function GenerateReservationAgreement(props: GenerateReservationAgreeementProps) {
  const [property, setProperty] = useState<Property>();
  const [aptNo, setAptNo] = useState("");
  const [leaseTermMonths, setLeaseTermMonths] = useState<number | undefined>(12);
  const [moveInDate, setMoveInDate] = useState(moment().format("yyyy-MM-DD"));

  const [monthlyRent, setMonthlyRent] = useState("");
  const [parking, setParking] = useState("");
  const [storage, setStorage] = useState("");
  const [petRent, setPetRent] = useState("");
  const [petFee, setPetFee] = useState("");
  const [concessions, setConcessions] = useState("");

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [downloadUrl, setDownloadUrl] = useState();

  useEffect(() => {
    if (props.properties.length > 0) {
      setProperty(props.properties[0]);
    }
  })

  async function handleSubmit(e: any) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          property, aptNo, leaseTermMonths, moveInDate, monthlyRent, parking, storage, petRent, petFee, concessions
        }),
      })
      const parsed = await res.json();
      setDownloadUrl(parsed.downloadUrl);
      setLoading(false);
    }
  }

  return (
    <div className={styles.generateContainer}>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Property</Form.Label>
          <Form.Control as="select" value={property?.id} onChange={setProperty}>
            {props.properties.map(p => <option value={p}>{p.address}</option>)}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Apartment #</Form.Label>
          <Form.Control
            required
            value={aptNo}
            onChange={e => setAptNo(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Move-in Date</Form.Label>
          <Form.Control
            required
            type="date"
            value={moveInDate}
            onChange={e => setMoveInDate(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Lease Term (months)</Form.Label>
          <Form.Control
            required
            type="number"
            value={leaseTermMonths}
            onChange={e => setLeaseTermMonths(e.target.value ? Number(e.target.value) : undefined)}
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Monthly Rent</Form.Label>
          <DollarInput value={monthlyRent} setValue={setMonthlyRent} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Monthly Parking</Form.Label>
          <DollarInput value={parking} setValue={setParking} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Monthly Storage</Form.Label>
          <DollarInput value={storage} setValue={setStorage} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Monthly Pet Rent</Form.Label>
          <DollarInput value={petRent} setValue={setPetRent} />
        </Form.Group>

        <Form.Group>
          <Form.Label>One-time Pet Fee</Form.Label>
          <DollarInput value={petFee} setValue={setPetFee} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Concessions</Form.Label>
          <Form.Control
            value={concessions}
            as="textarea"
            rows={3}
            onChange={e => setConcessions(e.target.value)}
          />
        </Form.Group>

        <Button type="submit">
          Generate!
          {loading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
        </Button>
      </Form>

      {downloadUrl && <Button href={downloadUrl}>Download</Button>}
    </div>
  )
}
