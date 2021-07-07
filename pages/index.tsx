import { UserButton, useSession } from '@clerk/clerk-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import styles from '../styles/Home.module.css';
import Generate from './generate';

export default function Home() {
  const [properties, setProperties] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const session = useSession();

  useEffect(() => {
    setLoading(true);
    fetch("/api/getProperties").then(res => res.json()).then(parsed => {
      setProperties(parsed);
      console.log(parsed);
      setLoading(false);
    });
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Generate with Ginny</title>
        <meta name="description" content="The easiest way to generate reservation agreements and approval letters." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UserButton />

      <main className={styles.main}>
        <h3>Properties</h3>
        {loading && <Spinner animation="grow" />}
        {!loading && properties.length === 0 && <div>No properties yet</div>}
        {!loading && properties.length > 0 && <div>
          {properties.map(p => <div key={p.id}>{p.address}</div>)}
        </div>}

        <Link href="/property/new">New Property</Link>
        <Generate />
      </main>
    </div>
  )
}
