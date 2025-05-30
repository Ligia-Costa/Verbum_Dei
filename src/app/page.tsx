'use client';

import React, { useState } from 'react';
import LayoutInicial from '../components/LayoutInicial';
import FormularioNome from '../components/FormularioNome';

export default function PaginaInicial() {
    const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);

    const handleNomeEnviado = (nome: string) => {
        setNomeUsuario(nome);
        console.log('Nome do usuário:', nome);
        // Futuramente: aqui iniciaremos o questionário
    };

    return (
        <LayoutInicial>
            <h1 className="text-2xl font-bold text-center mb-6 text-yellow-800"> 
                Bem-vindo ao Questionário Bíblico Verbum Dei!
            </h1>
            <p className="text-center text-gray-700 mb-4">
                Prepare-se para testar seus conhecimentos sobre a Bíblia e a religião católica.
            </p>
            <p className="text-center text-gray-700">
                Para começar, por favor, digite seu nome abaixo.
            </p>

            {/* Renderiza o formulário se o nome ainda não foi enviado */}
            {!nomeUsuario ? (
                <FormularioNome aoEnviarNome={handleNomeEnviado} />
            ) : (
                <div className="text-center mt-6">
                    <p className="text-xl font-semibold text-gray-800">
                        Olá, {nomeUsuario}!
                    </p>
                    <p className="text-gray-600">
                        Pronto para começar? Aguarde o questionário ser gerado!
                    </p>
                    {/* Futuramente: aqui exibiremos o questionário */}
                </div>
            )}
        </LayoutInicial>
    );
}