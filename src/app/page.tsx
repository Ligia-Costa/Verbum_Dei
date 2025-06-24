'use client'; // Necessário para usar hooks como useState

import React, { useState } from 'react';
import LayoutInicial from '../componentes/LayoutInicial';
import FormularioNome from '../componentes/FormularioNome';
import CartaoPergunta from '../componentes/CartaoPergunta'; // Importa o componente CartaoPergunta
import { gerarQuestionario } from '../servicos/geminiService'; // Importa o serviço Gemini

// Define a interface para a estrutura de uma pergunta (importante para tipagem)
interface Pergunta {
    pergunta: string;
    alternativas: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    respostaCorreta: string; // A letra da alternativa correta (A, B, C ou D)
}

export default function PaginaInicial() {
    const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
    const [perguntas, setPerguntas] = useState<Pergunta[] | null>(null);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [respostasUsuario, setRespostasUsuario] = useState<string[]>([]); // Guarda as respostas selecionadas pelo usuário
    const [questionarioFinalizado, setQuestionarioFinalizado] = useState<boolean>(false); // Indica se o questionário foi enviado
    const [pontuacao, setPontuacao] = useState<number>(0); // Armazena a pontuação do usuário
    const [feedbackRespostas, setFeedbackRespostas] = useState<boolean[] | null>(null); // Feedback individual por pergunta (correta/incorreta)

    // Função assíncrona que é chamada quando o nome do usuário é enviado
    const handleNomeEnviado = async (nome: string) => {
        setNomeUsuario(nome);
        setCarregando(true); // Inicia o estado de carregamento
        setErro(null); // Limpa qualquer erro anterior
        setPerguntas(null); // Limpa perguntas anteriores, caso haja
        setQuestionarioFinalizado(false); // Reseta o estado de finalização
        setPontuacao(0); // Reseta a pontuação
        setFeedbackRespostas(null); // Reseta o feedback

        try {
    console.log(`Gerando questionário para: ${nome}`);
    const jsonString = await gerarQuestionario(nome);
    const questionarioGerado: Pergunta[] = JSON.parse(jsonString);
    setPerguntas(questionarioGerado);
    // Inicializa o array de respostas do usuário com null para cada pergunta
    setRespostasUsuario(new Array(questionarioGerado.length).fill(null));
    console.log('Questionário gerado:', questionarioGerado);
} catch (error: unknown) { // Agora tipado como 'unknown'
    console.error('Erro ao gerar questionário:', error);

    let errorMessage = 'Ocorreu um erro ao gerar o questionário. Tente novamente mais tarde.';

    // Verifica se o erro é uma instância de Error para acessar 'message'
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        // Se o erro for uma string simples
        errorMessage = error;
    }
    // Você pode adicionar mais verificações aqui se esperar outros tipos de erro

    setErro(errorMessage);
    setNomeUsuario(null); // Volta para o formulário de nome em caso de erro
} finally {
    setCarregando(false); // Finaliza o estado de carregamento
}
    };

    // Função para lidar com a seleção de uma alternativa em uma pergunta
    const handleSelecionarAlternativa = (perguntaIndex: number, alternativaSelecionada: string) => {
        // Só permite seleção se o questionário ainda não foi finalizado
        if (!questionarioFinalizado) {
            setRespostasUsuario((prevRespostas) => {
                const novasRespostas = [...prevRespostas]; // Cria uma cópia do array anterior
                novasRespostas[perguntaIndex] = alternativaSelecionada; // Atualiza a resposta na posição correta
                return novasRespostas;
            });
        }
    };

    // Função para lidar com o envio final do questionário
    const handleEnviarRespostas = () => {
        if (!perguntas) return; // Garante que há perguntas para verificar

        let pontuacaoAtual = 0;
        const feedback: boolean[] = [];

        perguntas.forEach((pergunta, index) => {
            const respostaDada = respostasUsuario[index];
            const respostaCorreta = pergunta.respostaCorreta;

            if (respostaDada && respostaDada === respostaCorreta) {
                pontuacaoAtual++;
                feedback[index] = true; // Resposta correta
            } else {
                feedback[index] = false; // Resposta incorreta ou não respondida
            }
        });

        setPontuacao(pontuacaoAtual);
        setFeedbackRespostas(feedback);
        setQuestionarioFinalizado(true); // Marca o questionário como finalizado
    };

    // Função para recomeçar o questionário
    const handleRecomecarQuestionario = () => {
        setNomeUsuario(null);
        setPerguntas(null);
        setCarregando(false);
        setErro(null);
        setRespostasUsuario([]);
        setQuestionarioFinalizado(false);
        setPontuacao(0);
        setFeedbackRespostas(null);
    };

    return (
        <LayoutInicial>
            <h1 className="text-2xl font-bold text-center mb-6 text-yellow-800">
                Bem-vindo ao Questionário Bíblico Verbum Dei!
            </h1>

            {/* Renderiza o formulário de nome se o usuário ainda não tiver um nome e não estiver carregando/erro */}
            {!nomeUsuario && !carregando && !erro && (
                <>
                    <p className="text-center text-gray-700 mb-4">
                        Prepare-se para testar seus conhecimentos sobre a Bíblia e a religião católica.
                    </p>
                    <p className="text-center text-gray-700">
                        Para começar, por favor, digite seu nome abaixo.
                    </p>
                    <FormularioNome aoEnviarNome={handleNomeEnviado} />
                </>
            )}

            {/* Exibe mensagem de carregamento enquanto o questionário é gerado */}
            {carregando && (
                <div className="text-center mt-6">
                    <p className="text-xl font-semibold text-gray-800">
                        Olá, {nomeUsuario}!
                    </p>
                    <p className="text-gray-600 animate-pulse">
                        Gerando seu questionário... por favor, aguarde a inspiração divina!
                    </p>
                </div>
            )}

            {/* Exibe mensagem de erro, se houver */}
            {erro && (
                <div className="text-center mt-6 text-red-600">
                    <p className="text-xl font-semibold">Opa! Algo deu errado:</p>
                    <p>{erro}</p>
                    <p className="mt-2">Por favor, tente novamente.</p>
                </div>
            )}

            {/* Exibe o questionário quando as perguntas estiverem carregadas */}
            {perguntas && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
                        Questionário Bíblico: {nomeUsuario}
                    </h2>
                    <div className="space-y-6"> {/* Adiciona espaço entre as perguntas */}
                        {perguntas.map((pergunta, index) => (
                            <CartaoPergunta
                                key={index} // Chave única para cada item na lista (essencial para o React)
                                numeroPergunta={index + 1} // Número da pergunta (1 a 10)
                                pergunta={pergunta.pergunta}
                                alternativas={pergunta.alternativas}
                                aoSelecionarAlternativa={handleSelecionarAlternativa}
                                alternativaSelecionada={respostasUsuario[index]} // Passa a alternativa já selecionada para estilização
                                questionarioFinalizado={questionarioFinalizado} // Passa o estado de finalização
                                isCorreta={feedbackRespostas ? feedbackRespostas[index] : undefined} // Passa o feedback individual para esta pergunta
                                respostaCorretaVisivel={questionarioFinalizado ? pergunta.respostaCorreta : undefined} // Passa a resposta correta se o questionário foi finalizado
                            />
                        ))}
                    </div>

                    {!questionarioFinalizado && ( // Mostra o botão Enviar apenas se o questionário não foi finalizado
                        <button
                            onClick={handleEnviarRespostas}
                            className="w-full bg-green-700 text-white p-3 rounded-md mt-6 hover:bg-green-800 transition-colors duration-200"
                        >
                            Enviar Respostas
                        </button>
                    )}

                    {questionarioFinalizado && ( // Exibe os resultados após o envio
                        <div className="text-center mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold text-yellow-800 mb-4">
                                Resultados para {nomeUsuario}!
                            </h3>
                            <p className="text-xl text-gray-800 mb-2">
                                Sua pontuação: <span className="font-extrabold text-green-700">{pontuacao}</span> de {perguntas.length}
                            </p>
                            <p className="text-gray-600">
                                Você se saiu muito bem! Continue a aprofundar seus conhecimentos.
                            </p>
                            <button
                                onClick={handleRecomecarQuestionario}
                                className="bg-blue-600 text-white p-2 px-4 rounded-md mt-4 hover:bg-blue-700 transition-colors"
                            >
                                Recomeçar Questionário
                            </button>
                        </div>
                    )}
                </div>
            )}
        </LayoutInicial>
    );
}