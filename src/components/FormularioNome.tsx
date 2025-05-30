'use client'; 

import React, { useState, FormEvent } from 'react';

interface FormularioNomeProps {
    aoEnviarNome: (nome: string) => void;
}

export default function FormularioNome({ aoEnviarNome }: FormularioNomeProps) {
    const [nome, setNome] = useState<string>('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault(); // Previne o recarregamento da página
        if (nome.trim()) { // Verifica se o nome não está vazio
            aoEnviarNome(nome);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <input
                type="text"
                placeholder="Digite seu nome para começar..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
                Iniciar Questionário
            </button>
        </form>
    );
}