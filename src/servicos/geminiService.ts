import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('A variável de ambiente GEMINI_API_KEY não está configurada.');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Função para gerar o questionário
export async function gerarQuestionario(nomeUsuario: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
  Crie um questionário interativo de 10 perguntas de múltipla escolha sobre a Bíblia, os santos e a religião católica. A cada novo questionário, gere novas perguntas, tente evitar repetições.
  Cada pergunta deve ter 4 alternativas (A, B, C, D) e apenas uma resposta correta.
  As perguntas devem ser variadas em dificuldade e cobrir tópicos como personagens bíblicos, livros da Bíblia, sacramentos, dogmas, história da Igreja e ensinamentos católicos.
  Formate a saída como um array de objetos JSON, onde cada objeto tem o seguinte formato:
  {
    "pergunta": "Texto da pergunta?",
    "alternativas": {
      "A": "Alternativa A",
      "B": "Alternativa B",
      "C": "Alternativa C",
      "D": "Alternativa D"
    },
    "respostaCorreta": "Letra da alternativa correta (A, B, C ou D)"
  }
  Certifique-se de que a resposta seja APENAS o array JSON, sem texto adicional ou formatação Markdown (ex: \`\`\`json).
  O questionário é para o usuário ${nomeUsuario}.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Tenta remover qualquer formatação de bloco de código JSON que o Gemini possa adicionar
    const cleanedText = text.replace(/```json\n|\n```/g, '').trim();

    // Valida se o texto resultante é um JSON válido
    try {
      JSON.parse(cleanedText);
      return cleanedText; // Retorna o JSON como string
    } catch (jsonError) {
      console.error("Erro ao fazer parse do JSON recebido da API:", jsonError);
      console.error("Texto recebido:", cleanedText);
      throw new Error("Formato de resposta da API inválido. Não foi possível parsear o JSON.");
    }

  } catch (error) {
    console.error('Erro ao chamar a API do Gemini:', error);
    throw new Error('Não foi possível gerar o questionário. Tente novamente mais tarde.');
  }
}