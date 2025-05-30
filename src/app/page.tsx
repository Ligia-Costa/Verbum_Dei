import LayoutInicial from '../components/LayoutInicial';

export default function PaginaInicial() {
    return (
        <LayoutInicial>
            <h1 className="text-2xl font-bold text-amber-800 text-center mb-6"> 
                Bem-vindo ao Questionário Bíblico Verbum Dei!
            </h1>
            <p className="text-center text-stone-700 mb-4">
                Prepare-se para testar seus conhecimentos sobre a Bíblia e a religião católica.
            </p>
            <p className="text-center text-stone-700">
                Para começar, por favor, digite seu nome abaixo.
            </p>
            {/* Aqui será adicionado o formulário de nome do usuário mais tarde */}
        </LayoutInicial>
    );
}