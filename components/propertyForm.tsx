import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { Button, ButtonToolbar, Form, Spinner } from 'react-bootstrap';
import DollarInput from './dollarInput';

export interface Property {
  id?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  application_fee?: number;
  reservation_fee?: number;
  admin_fee?: number;
  parking_fee?: number;
  pet_fee?: number;
  custom_text?: string;
}

interface PropertyFormProps {
  property: Property;
  update: (u: Partial<Property>) => void;
  loading: boolean;
  validated: boolean;
  handleSubmit: (e: any) => void;
}

export default function PropertyForm(props: PropertyFormProps) {
  const router = useRouter();

  return (
    <Form noValidate validated={props.validated} onSubmit={props.handleSubmit}>
      <h4>Location</h4>
      <Form.Group>
        <Form.Label>Street Address</Form.Label>
        <Form.Control
          required
          value={props.property.address}
          onChange={e => props.update({ address: e.target.value })}
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>City</Form.Label>
        <Form.Control
          required
          value={props.property.city}
          onChange={e => props.update({ city: e.target.value })}
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>State</Form.Label>
        <Form.Control
          required
          value={props.property.state}
          onChange={e => props.update({ state: e.target.value })}
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Zip Code</Form.Label>
        <Form.Control
          required
          value={props.property.zip}
          onChange={e => props.update({ zip: e.target.value })}
        ></Form.Control>
      </Form.Group>

      <h4>Fees</h4>
      <Form.Group>
        <Form.Label>Application Fee</Form.Label>
        <DollarInput value={props.property.application_fee} setValue={v => props.update({ application_fee: Number(v) })} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Reservation Fee</Form.Label>
        <DollarInput value={props.property.reservation_fee} setValue={v => props.update({ reservation_fee: Number(v) })} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Admin/amenity Fee</Form.Label>
        <DollarInput value={props.property.admin_fee} setValue={v => props.update({ admin_fee: Number(v) })} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Parking Fee</Form.Label>
        <DollarInput value={props.property.parking_fee} setValue={v => props.update({ parking_fee: Number(v) })} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Pet Fee</Form.Label>
        <DollarInput value={props.property.pet_fee} setValue={v => props.update({ pet_fee: Number(v) })} />
      </Form.Group>

      <h4>Customizations</h4>
      <Form.Group>
        <Form.Label>Custom Text</Form.Label>
        <Form.Control
          value={props.property.custom_text}
          as="textarea"
          rows={6}
          onChange={e => props.update({ custom_text: e.target.value })}
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        Need more customizations? Contact us at <a href="mailto:hello@meetginny.com">hello@meetginny.com</a>.
      </Form.Group>

      <Button type="submit">
        Save
        {props.loading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
      </Button>

    </Form>
  );
}
