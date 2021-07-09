import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Badge, Spinner } from 'react-bootstrap';


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

  return (
    <div>
      <h3>Properties</h3>
      {loading && <Spinner animation="grow" />}
      {!loading && properties.length === 0 && <div>No properties yet</div>}
      {!loading && properties.length > 0 && <div>
        {properties.map((p: any) => <Badge className="property-badge" variant="primary" key={p.id}>{p.address}</Badge>)}
      </div>}

      <Link href="/property/new">New Property</Link>
    </div>
  )
}
