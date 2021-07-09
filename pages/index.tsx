import { UserButton } from '@clerk/clerk-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import React from 'react';
import styles from '../styles/Home.module.css';
import Generate from './generate';
import Properties from './properties';


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Generate with Ginny</title>
        <meta name="description" content="The easiest way to generate reservation agreements and approval letters." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UserButton />

      <main className={styles.main}>
        <Properties />
        <Generate />
      </main>
    </div>
  )
}
