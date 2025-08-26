const API_URL = 'http://localhost:3000';

async function carregarTarefas(feito) {
    try {
        let url = `${API_URL}/tarefas`;
        if (feito !== undefined) {
            url += `?feito=${feito}`;
        }
        const response = await fetch(url);
        const tarefas = await response.json();
        exibirTarefas(tarefas);
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}

function exibirTarefas(tarefas) {
    const lista = document.getElementById('listaTarefas');
    lista.innerHTML = '';

    tarefas.forEach(tarefa => {
        const div = document.createElement('div');
        div.className = 'task-item';
        
        const titulo = document.createElement('span');
        titulo.className = 'task-title' + (tarefa.feito ? ' completed' : '');
        titulo.textContent = tarefa.titulo;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarefa.feito;
        checkbox.onchange = () => alterarTarefa(tarefa.id, { feito: checkbox.checked });
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => editarTarefa(tarefa);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deletarTarefa(tarefa.id);
        
        div.appendChild(checkbox);
        div.appendChild(titulo);
        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
        
        lista.appendChild(div);
    });
}

async function adicionarTarefa() {
    const input = document.getElementById('novaTarefa');
    const titulo = input.value.trim();
    
    if (!titulo) return;
    
    try {
        const response = await fetch(`${API_URL}/tarefas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                feito: false
            })
        });
        
        if (response.ok) {
            input.value = '';
            carregarTarefas();
        }
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
    }
}

async function editarTarefa(tarefa) {
    const novoTitulo = prompt('Digite o novo título da tarefa:', tarefa.titulo);
    
    if (novoTitulo === null || novoTitulo.trim() === '') return;
    
    try {
        const response = await fetch(`${API_URL}/tarefas/${tarefa.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: novoTitulo,
                feito: tarefa.feito
            })
        });
        
        if (response.ok) {
            carregarTarefas();
        }
    } catch (error) {
        console.error('Erro ao editar tarefa:', error);
    }
}

async function alterarTarefa(id, dados) {
    try {
        const response = await fetch(`${API_URL}/tarefas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        if (response.ok) {
            carregarTarefas();
        }
    } catch (error) {
        console.error('Erro ao alterar tarefa:', error);
    }
}

async function deletarTarefa(id) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    try {
        const response = await fetch(`${API_URL}/tarefas/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            carregarTarefas();
        }
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
    }
}

window.onload = () => carregarTarefas();
