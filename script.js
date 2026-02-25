// Seleção dos elementos do DOM
const html = document.querySelector('html')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iniciarOuPausarBtIcone = document.querySelector(".app__card-primary-butto-icon") 
const tempoNaTela = document.querySelector('#timer')

//Criar audios e variaveis para controle do tempo
const musica = new Audio('/sons/luna-rise-part-one.mp3')
const audioPlay = new Audio('/sons/play.wav');
const audioPausa = new Audio('/sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3')

// Variáveis para controle das tarefas! Tempo inicial de 30 minutos
let tempoDecorridoEmSegundos = 1800
let intervaloId = null
// lop de repetição da música
musica.loop = true

//Liga ou pausa a musica de fundo
musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})
// Função para criar os elementos de tarefa
focoBt.addEventListener('click', () => { //Botão de foco
    tempoDecorridoEmSegundos = 1800
    alterarContexto('foco') //altera o contexto para foco
    focoBt.classList.add('active') //adiciona a classe actove para o botão de foco
})

curtoBt.addEventListener('click', () => { // Botão de descanso curto
    tempoDecorridoEmSegundos = 300
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
})

// Função para criar os elementos de alterar o contexto
function alterarContexto(contexto) {
    mostrarTempo() // Atualiza o tempo na tela
    botoes.forEach(function (contexto){ // Remove a classe "active" de todos os botões
        contexto.classList.remove('active') 
    })
    // Define atributo no HTML para mudar tema
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`) //Troca a imagem do banner
    switch (contexto) {  //Altera o texto conforme o modo
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
            ` 
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `
        default:
            break;
    }
}
// Executa a cada 1 segundo a funcão de contagem regressiva 
const contagemRegressiva = () => {
    // Se o tempo acabou, toca o alarme, mostra um alerta
    if(tempoDecorridoEmSegundos <= 0){
        audioTempoFinalizado.play()
        alert('Tempo finalizado!')
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'// Verefica se estava no modo foco
        if (focoAtivo) { // Dispara evento personalizado
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        return
    }
    tempoDecorridoEmSegundos -= 1 // Diminue -1 segundo
    mostrarTempo() // Atualiza o tempo na Tela
}
// Ao clicar, chama a função de iniciar ou pausar o timer
startPauseBt.addEventListener('click', iniciarOuPausar)
// Função iniciar ou pausar o timer
function iniciarOuPausar() {
    if(intervaloId){ // Se o timer já estiver rodando,pausa!
        audioPausa.play() // Toca o som de pausa
        zerar()
        return
    }
    audioPlay.play() // Se não estiver rodando --> Iniciar!
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBt.textContent = "Pausar"
    iniciarOuPausarBtIcone.setAttribute('src', `/imagens/pause.png`)
}
// Função que zera o timer
function zerar() {
    clearInterval(intervaloId) // Para o timer
    iniciarOuPausarBt.textContent = "Começar"
    iniciarOuPausarBtIcone.setAttribute('src', `/imagens/play_arrow.png`)
    intervaloId = null
}
// Função que mostra o tempo na tela
function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}
// Chama a função mostrarTempo para exibir o tempo inicial
mostrarTempo()