let perguntas = document.querySelectorAll('.pergunta');
let numerosPerguntas = document.querySelectorAll('.nump li');
let perguntaAtual = 0;
let pontuacao = 0;

function mostrarPontuacao() {
    const container = document.querySelector('.container');
    const endGame = document.querySelector('.endGame');
    const pontuacaoValor = document.getElementById('pontuacao-valor');

    if (container && endGame && pontuacaoValor) {
        container.style.display = 'none';
        endGame.style.display = 'block';
        pontuacaoValor.textContent = pontuacao;

        // 🚀 Salva automaticamente no backend
        salvarResultado(pontuacao);

        // Mostra também o nome do quiz para o usuário
        const tituloQuiz = document.createElement("h2");
        tituloQuiz.textContent = `Quiz concluído: ${quizN}`;
        endGame.insertBefore(tituloQuiz, endGame.firstChild);
    } else {
        console.error('Elementos necessários não encontrados no DOM.');
    }
}

function recomecarQuiz() {
    perguntaAtual = 0;
    pontuacao = 0;
    mostrarPerguntas(perguntaAtual);

    const container = document.querySelector('.container');
    const endGame = document.querySelector('.endGame');

    if (container && endGame) {
        container.style.display = 'block';
        endGame.style.display = 'none';

        document.querySelectorAll('.pergunta input[type="button"]').forEach(botao => {
        botao.style.background = '';
        botao.classList.remove('correta', 'errada');
        botao.disabled = false;
    });
    } else {
        console.error('Elementos necessários não encontrados no DOM.');
    }
}

function mostrarPerguntas(numero) {
    if (numero >= perguntas.length) {
        mostrarPontuacao();
        return;
    }

    perguntas.forEach((pergunta, index) => {
        if (index === numero) {
            pergunta.style.display = 'block';
            numerosPerguntas[index].classList.add('atual');
        } else {
            pergunta.style.display = 'none';
            if (numerosPerguntas[index].classList.contains('atual')) {
                numerosPerguntas[index].classList.remove('atual');
                numerosPerguntas[index].classList.add('anterior');
            }
        }
    });
}

function verificarResposta(respostaSelecionada) {
    let perguntaAtualElement = perguntas[perguntaAtual];
    let botoesResposta = perguntaAtualElement.querySelectorAll('.botoes input[type="button"]');

    // Desabilita todos os botões e aplica cores
    botoesResposta.forEach(botao => {
        botao.disabled = true;

        if (botao.classList.contains('c')) {
            botao.style.background = 'green';
            if (botao.value === respostaSelecionada) {
                pontuacao++;
            }
        } else if (botao.classList.contains('e')) {
            botao.style.background = 'red';
        }
    });

    // Avança para a próxima pergunta depois de 1,5s
    setTimeout(() => {
        mostrarPerguntas(++perguntaAtual);
    }, 1500);
}

perguntas.forEach(pergunta => {
    pergunta.addEventListener('click', (evento) => {
        if (evento.target.tagName === 'INPUT') {
            const respostaSelecionada = evento.target.value;
            verificarResposta(respostaSelecionada);
        }
    });
});

mostrarPerguntas(perguntaAtual);

function salvarResultado(score) {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token não encontrado. Usuário não está logado.");
        return;
    }

    fetch("http://localhost:3000/result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            quizId: quizId,       // id técnico do quiz
            quizNome: quizNome,   // nome amigável do quiz
            score: score
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Resultado salvo:", data);
    })
    .catch(err => {
        console.error("Erro ao salvar resultado:", err);
    });
}
