import React, { ReactNode } from 'react';

interface LayoutInicialProps {
    children: ReactNode;
}

export default function LayoutInicial({ children }: LayoutInicialProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 p-4"> 
            <main className="w-full max-w-md bg-stone-50 p-8 rounded-lg shadow-xl border border-stone-200"> 
                {children}
            </main>
        </div>
    );
}