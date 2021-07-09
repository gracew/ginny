import { UserButton } from '@clerk/clerk-react';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import React from 'react';
import { Button, Navbar } from 'react-bootstrap';
import styles from '../styles/Navbar.module.css';


export default function GNavbar() {
  const router = useRouter();
  return (
    <Navbar bg="light" className={styles.navbar}>
      <Navbar.Brand>
        <Button variant="link" onClick={() => router.push("/")} className={styles.logoButton}>
          <Image src="/g.png" alt="Ginny Logo" width={35} height={35} />
        </Button>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Button
          variant="outline-primary"
          size="sm"
          className={styles.feedbackButton}
          href="mailto:hello@meetginny.com">Feedback?</Button>
        <UserButton />
      </Navbar.Collapse>
    </Navbar>
  )
}
