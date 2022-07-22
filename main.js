'use strict';

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    limparCampos()
    document.getElementById('modal').classList.remove('active') 
}


const getLocalstorage = () => JSON.parse(localStorage.getItem('db_cliente')) ?? [ ]
const setLocalstorage = (dbCliente) => localStorage.setItem("db_cliente", JSON.stringify(dbCliente))

//CRUD - create read update delete
//---------------------------------//
//CRUD  -  create
const createCliente = (cliente) => {
    const dbCliente = getLocalstorage()
    dbCliente.push(cliente)
    setLocalstorage(dbCliente)
}
//CRUD  -  read
const readCliente = () => getLocalstorage()
//CRUD  -  update
const updateCliente = (index, cliente) => {
    const dbCliente = readCliente()
    dbCliente[index] = cliente
    setLocalstorage(dbCliente)
}
//CRUD  -  delete
const deleteCliente = (index) => {
    const dbCliente = readCliente()
    dbCliente.splice(index, 1)
    setLocalstorage(dbCliente)
}

const camposSaoValidos = () => {
    return document.getElementById('form').reportValidity()
}

const limparCampos = () => {
    const campos = document.querySelectorAll('.modal-input')
    campos.forEach(campo => campo.value = '')
}



//--------------------------------------//

//Interação com o layout

const saveCliente = () => {
    if (camposSaoValidos()) {
        const cliente = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new'){
        createCliente(cliente)
        updateTable()
        closeModal()
    }else {
        updateCliente(index, cliente)
        updateTable()
        limparCampos()
        closeModal()
    }
    }
}


// Cria linha no HTML
const createRow = (cliente, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
                    <td>${cliente.nome}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.celular}</td>
                    <td>${cliente.cidade}</td>
                    <td class="editDelete">
                        <button type="button" class="button green" id="editar-${index}">Editar</button>
                        <button type="button" class="button red" id="delete-${index}">Excluir</button>
                    </td>
                    `
    document.querySelector('#tableCliente>tbody').appendChild(newRow)
}

// Limpa a tabela antes de atualizar
const clearTable = () => {
    const rows = document.querySelectorAll('#tableCliente>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

// Atualiza a tela de clientes
const updateTable = () => {
    const dbCliente = readCliente()
    clearTable()
    dbCliente.forEach(createRow)
}

updateTable()

const preencherCampos = (cliente) => { 
    document.getElementById('nome').value = cliente.nome 
    document.getElementById('email').value = cliente.email 
    document.getElementById('celular').value = cliente.celular 
    document.getElementById('cidade').value = cliente.cidade 
    document.getElementById('nome').dataset.index = cliente.index 
}

const editarCliente = (index) => {
    const cliente = readCliente()[index]
    cliente.index = index
    preencherCampos(cliente)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const  [action, index] = event.target.id.split('-')
        if (action == 'editar') {
            editarCliente(index)  
        }else{
            const cliente = readCliente()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${cliente.nome}`)
            if(response){
                deleteCliente(index)
                updateTable()
            }
        }
    }
}
// -------------------------------------------//

//Eventos

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)


document.getElementById('salvar')
    .addEventListener('click', saveCliente)

document.querySelector('#tableCliente>tbody')
    .addEventListener('click', editDelete)