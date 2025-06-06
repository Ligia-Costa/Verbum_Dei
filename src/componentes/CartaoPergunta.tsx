// src/componentes/CartaoPergunta.tsx
import React from 'react';

interface CartaoPerguntaProps {
    pergunta: string;
    alternativas: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    numeroPergunta: number;
    aoSelecionarAlternativa: (perguntaIndex: number, alternativaSelecionada: string) => void;
    alternativaSelecionada?: string | null;
    questionarioFinalizado: boolean; // Novo
    isCorreta?: boolean; // Novo
    respostaCorretaVisivel?: string; // Novo
}

export default function CartaoPergunta({
    pergunta,
    alternativas,
    numeroPergunta,
    aoSelecionarAlternativa,
    alternativaSelecionada,
    questionarioFinalizado, // Desestruturar a nova prop
    isCorreta, // Desestruturar a nova prop
    respostaCorretaVisivel // Desestruturar a nova prop
}: CartaoPerguntaProps) {
    const letrasAlternativas = ['A', 'B', 'C', 'D'];

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <p className="text-lg font-semibold text-gray-800 mb-4">
                {numeroPergunta}. {pergunta}
            </p>
            <div className="flex flex-col gap-3">
                {letrasAlternativas.map((letra) => {
                    const isSelecionada = alternativaSelecionada === letra;
                    const isRespostaCorreta = respostaCorretaVisivel === letra;

                    let buttonClasses = `
                        w-full text-left p-3 rounded-md border
                        transition-all duration-200 ease-in-out
                    `;

                    if (questionarioFinalizado) {
                        if (isRespostaCorreta) {
                            buttonClasses += ' bg-green-200 text-green-900 border-green-500 font-bold'; // Correta
                        } else if (isSelecionada && !isCorreta) {
                            buttonClasses += ' bg-red-200 text-red-900 border-red-500 line-through'; // Errada selecionada
                        } else {
                            buttonClasses += ' bg-white text-gray-800 border-gray-300'; // Não selecionada e não é a correta
                        }
                    } else {
                        // Estilos antes do envio do questionário
                        buttonClasses += isSelecionada
                            ? ' bg-blue-600 text-white border-blue-600 shadow-md' // Selecionado
                            : ' bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:border-blue-400'; // Não selecionado
                    }

                    return (
                        <button
                            key={letra}
                            onClick={() => !questionarioFinalizado && aoSelecionarAlternativa(numeroPergunta - 1, letra)}
                            className={buttonClasses}
                            disabled={questionarioFinalizado} // Desabilita botões após o envio
                        >
                            <span className="font-bold mr-2">{letra}:</span> {alternativas[letra as keyof typeof alternativas]}
                            {questionarioFinalizado && isRespostaCorreta && (
                                <span className="ml-2 text-green-700"> (Correta)</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}