// encontrar o botão adicionar tarefa

const btnAdicionarTarefa = document.querySelector('.app__button--add-task')
const formAdicionarTarefa = document.querySelector('.app__form-add-task')
const textarea = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list')
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')


let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [] // Atualiza tarefas no localStorage para criar array vazio!!
let tarefaSelecionada = null
let liTarefaSelecionada = null

// Atualiza as tarefas no localStorage
function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li') // Cria o elemento (LI)
    li.classList.add('app__section-task-list-item') 

    const svg = document.createElement('svg') // Icone de check para tarefa completa
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `
    const paragrafo = document.createElement('p') // Texto da tarefa
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')
    // Editar tarefa
    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    // Ao clicar no botão ele atera a descrição da tarefa, atualizando o texto na tela e no LocalStorage
    botao.onclick = () => {
        // debugger
        const novaDescricao = prompt("Qual é o novo nome da tarefa?")
        // console.log('Nova descrição da tarefa: ', novaDescricao)
        if (novaDescricao) {            
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas()
        }
    }

    // Adiciona o icone de editar
    const imagemBotao = document.createElement('img')
    imagemBotao.setAttribute('src', '/imagens/edit.png')
    botao.append(imagemBotao)
    // Monta estrutura
    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete') // Marca como tarefa completa
        botao.setAttribute('disabled', 'disabled') // Desabilita o botão editar
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active') // Remove a seleção anterior
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })
            if (tarefaSelecionada == tarefa) {  // Se clicar na mesma tarefa --> desmarca
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }
            //Marca como selecionada
            tarefaSelecionada = tarefa 
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
    
            li.classList.add('app__section-task-list-item-active')
        }
    }


    return li
}   
// Mostrar e esconder formulário
btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden')
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = { // cria um elemento tarefa 
        descricao: textarea.value
    }
    tarefas.push(tarefa) // cria o elemento visual
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    textarea.value = '' // limpa o campo
    formAdicionarTarefa.classList.add('hidden')
})
// Rederiza as tarefas salvas
tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
});
// Quando o foco termina(Integra com o timer)
document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        //Marca como concluida 
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        // Desativar edição
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

const removerTarefas  = (somenteCompletas) => {
    // const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    let seletor =  ".app__section-task-list-item"
    if (somenteCompletas) {
        seletor = ".app__section-task-list-item-complete"
    }
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)