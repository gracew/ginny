import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut
} from "@clerk/clerk-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React from 'react';
import '../styles/globals.css';
import GNavbar from '../components/navbar';

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return <ClerkProvider
    frontendApi={clerkFrontendApi}
    navigate={(to) => router.push(to)}
  >
    <>
      <Head>
        <title>Generate with Ginny</title>
        <meta name="description" content="The easiest way to generate reservation agreements and approval letters." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignedIn>
        <GNavbar />
        <Component {...pageProps} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  </ClerkProvider>
}
export default MyApp;
