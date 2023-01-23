import Navbar from '@components/Navbar/Navbar';
import { Suspense } from 'react';
import Providers from './provider';
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head />
            <body>
                <Providers>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Navbar />
                        {children}
                    </Suspense>
                </Providers>
            </body>
        </html>
    );
}
