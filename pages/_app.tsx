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
import GNavbar from '../components/navbar';
import '../styles/globals.css';

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return <ClerkProvider
    frontendApi={clerkFrontendApi}
    navigate={(to) => router.push(to)}
  >
    <>
      <Head>
        <title>Ginny | Generate Property Management Documents</title>
        <meta name="description" content="The easiest way to generate documents for your property." />
        <link rel="icon" href="/favicon.ico" />

        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
          `,
        }}
        />
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
