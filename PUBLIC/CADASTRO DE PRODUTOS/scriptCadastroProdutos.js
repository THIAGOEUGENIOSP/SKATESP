document.addEventListener('DOMContentLoaded', async () => {
    const adminName = sessionStorage.getItem('adminName');
    const adminEmail = sessionStorage.getItem('adminEmail');

    console.log('adminName recuperado do sessionStorage:', adminName);
    console.log('adminEmail recuperado do sessionStorage:', adminEmail);

    if (!adminName || !adminEmail) {
        window.location.href = '/CADASTRO DE PRODUTOS/cadastroProdutos.html'; // Redireciona para a página de login se as informações do administrador não estiverem disponíveis
        return;
    }

    document.getElementById('adminName').textContent = adminName;
    document.getElementById('adminEmail').textContent = adminEmail;

    console.log('DOM completamente carregado e analisado.');

    let tipoProduto = ''; // Variável global para armazenar o tipo de produto selecionado

    const toggleForm = () => {
        const formCadastro = document.getElementById('formCadastro');
        if (formCadastro) {
            formCadastro.classList.toggle('hidden');
        } else {
            console.error('Elemento formCadastro não encontrado.');
        }
    };

    const btnCadastrarProdutos = document.getElementById('btnCadastrarProdutos');
    if (btnCadastrarProdutos) {
        btnCadastrarProdutos.addEventListener('click', () => {
            toggleForm();
        });
    } else {
        console.error('Elemento btnCadastrarProdutos não encontrado.');
    }

    // Seleção dos botões de categorias de produtos
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');

    const btnSkate = document.createElement('button');
    btnSkate.textContent = 'Produtos Skate';
    btnSkate.classList.add('btnSkate');
    btnSkate.addEventListener('click', () => {
        tipoProduto = 'skate';
        carregarProdutos('skate');
    });
    btnContainer.appendChild(btnSkate);

    const btnRoupa = document.createElement('button');
    btnRoupa.textContent = 'Produtos Roupa';
    btnRoupa.classList.add('btnRoupa');
    btnRoupa.addEventListener('click', () => {
        tipoProduto = 'roupas';
        carregarProdutos('roupas');
    });
    btnContainer.appendChild(btnRoupa);

    const btnTenis = document.createElement('button');
    btnTenis.textContent = 'Produtos Tênis';
    btnTenis.classList.add('btnTenis');
    btnTenis.addEventListener('click', () => {
        tipoProduto = 'tenis';
        carregarProdutos('tenis');
    });
    btnContainer.appendChild(btnTenis);

    // Adiciona o container de botões à seção principal
    const section = document.querySelector('section');
    section.appendChild(btnContainer);

    // Event listener para o formulário de cadastro de produtos
    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (event) => {
            event.preventDefault();
            const descricao = document.getElementById('descricao').value;
            const valor = parseFloat(document.getElementById('valor').value);
            const url_img = document.getElementById('url_img').value;

            let apiUrl = '';
            switch(tipoProduto) {
                case 'skate':
                    apiUrl = 'http://localhost:3005/skate';
                    break;
                case 'roupas':
                    apiUrl = 'http://localhost:3005/roupas';
                    break;
                case 'tenis':
                    apiUrl = 'http://localhost:3005/tenis';
                    break;
                default:
                    console.error('Tipo de produto não reconhecido:', tipoProduto);
                    alert('Escolha uma das opções de produtos que deseja cadastrar:');
                    return;
            }

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ descricao, valor, url_img })
                });
                if (response.ok) {
                    console.log('Produto cadastrado com sucesso');
                    formCadastro.reset();
                    toggleForm();
                    carregarProdutos(tipoProduto);
                } else {
                    console.error('Erro ao cadastrar produto:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao cadastrar produto:', error);
            }
        });
    } else {
        console.error('Elemento formCadastro não encontrado.');
    }

    // Função para carregar produtos de uma categoria específica
    const carregarProdutos = async (produtoTipo) => {
        let apiUrl = '';
        switch(produtoTipo) {
            case 'skate':
                apiUrl = 'http://localhost:3005/list-skate';
                break;
            case 'roupas':
                apiUrl = 'http://localhost:3005/list-roupas';
                break;
            case 'tenis':
                apiUrl = 'http://localhost:3005/list-tenis';
                break;
            default:
                console.error('Tipo de produto não reconhecido:', produtoTipo);
                return;
        }

        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const produtos = await response.json();
                const container = document.querySelector('.container');
                if (container) {
                    container.innerHTML = ''; // Limpar o container antes de adicionar os produtos

                    produtos.forEach(produto => {
                        if (produto && produto.descricao && produto.valor !== null && produto.url_img) {
                            const card = document.createElement('div');
                            card.classList.add('card');

                            const img = document.createElement('img');
                            img.classList.add('card-image');
                            img.src = produto.url_img;
                            img.alt = produto.descricao;
                            img.width = 270;
                            img.height = 250;
                            card.appendChild(img);

                           
                            const id = document.createElement('p');
                            id.textContent =  "ID = " + produto.id;
                            card.appendChild(id);

                            const descricao = document.createElement('p');
                            descricao.textContent =  produto.descricao;
                            card.appendChild(descricao);

                            const valor = document.createElement('p');
                            valor.textContent = `R$ ${produto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                            card.appendChild(valor);

                            const botoesContainer = document.createElement('div');
                            botoesContainer.classList.add('botoes-container');

                            const editarButton = document.createElement('button');
                            editarButton.textContent = 'Editar';
                            editarButton.dataset.id = produto.id; // Definir o ID do produto no dataset
                            editarButton.classList.add('btnEditar'); // Adicionar classe para identificação
                            botoesContainer.appendChild(editarButton);

                            const excluirButton = document.createElement('button');
                            excluirButton.textContent = 'Excluir';
                            excluirButton.dataset.id = produto.id; // Definir o ID do produto no dataset
                            excluirButton.classList.add('btnExcluir'); // Adicionar classe para identificação
                            excluirButton.addEventListener('click', () => excluirProduto(produto.id, tipoProduto)); // Passando tipoProduto
                            botoesContainer.appendChild(excluirButton);

                            card.appendChild(botoesContainer);
                            container.appendChild(card);
                        } else {
                            console.error('Produto inválido:', produto);
                        }
                    });
                }
            } else {
                console.error('Erro ao carregar produtos:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    };

    // Event listeners para botões de editar e excluir (delegados)
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('btnEditar')) {
            editarProduto(event.target.dataset.id);
        } else if (event.target.classList.contains('btnExcluir')) {
            excluirProduto(event.target.dataset.id, tipoProduto);
        }
    });

    // Função para editar um produto existente
    const editarProduto = async (produtoId) => {
        try {
            const response = await fetch(`http://localhost:3005/${tipoProduto}/${produtoId}`);
            const produto = await response.json();
            openEditModal(produto, produtoId);
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
        }
    };

    const openEditModal = (produto, produtoId) => {
        const modal = document.getElementById('editModal');
        modal.style.display = 'block';

        document.getElementById('editId').textContent = produtoId; 
        document.getElementById('editDescricao').value = produto.descricao || '';
        document.getElementById('editValor').value = produto.valor || '';
        document.getElementById('editUrlImg').value = produto.url_img || '';

        const formEditar = document.getElementById('formEditar');
        formEditar.onsubmit = async (event) => {
            event.preventDefault();
            const descricao = document.getElementById('editDescricao').value;
            const valor = parseFloat(document.getElementById('editValor').value);
            const url_img = document.getElementById('editUrlImg').value;

            const produtoEditado = { descricao, valor, url_img };

            try {
                const response = await fetch(`http://localhost:3005/${tipoProduto}/${produtoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(produtoEditado)
                });

                if (response.ok) {
                    modal.style.display = 'none';
                    carregarProdutos(tipoProduto);
                } else {
                    console.error('Erro ao editar produto:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao editar produto:', error);
            }
        };
    };

    // Event listener para fechar o modal quando o usuário clica no botão de fechar
    const closeModalButton = document.querySelector('.close');
    closeModalButton.addEventListener('click', () => {
        const modal = document.getElementById('editModal');
        modal.style.display = 'none';
    });

    // Event listener para fechar o modal quando o usuário clica fora dele
    window.onclick = function(event) {
        const modal = document.getElementById('editModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Função para excluir um produto existente
    const excluirProduto = async (produtoId, tipoProduto) => {
        try {
            const response = await fetch(`http://localhost:3005/${tipoProduto}/${produtoId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('Produto excluído com sucesso');
                // Atualizar a lista de produtos após exclusão
                carregarProdutos(tipoProduto);
            } else {
                console.error('Erro ao excluir produto:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    };
});
