
// está função "fetchProducts" é assíncrona e busca os produtos da API.
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3005/list-roupas');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return [];
    }
}


// A Função renderProducts recebe uma lista de produtos.
//A const container seleciona o elemento HTML com a classe "".containerProdutos", onde os produtos serão exibidos. 
function renderProducts(products) {
    const container = document.querySelector('.containerProdutos');
    container.innerHTML = '';

    products.forEach(product => {
        const { id, descricao, valor, url_img, tamanhos } = product;

        const productElement = document.createElement('div');
        productElement.classList.add('produtos');

        productElement.innerHTML = `
            <ul>
                <li><img src="${url_img}" alt="${descricao}" width="200" height="250"></li>
                <li><h3>${descricao}</h3></li>
                <li><p class="preco">R$ ${valor.toFixed(2)}</p></li>
            </ul>
        `;

        const tamanhoSelect = document.createElement('select');
        tamanhoSelect.classList.add('selectTamanho');

        for (let tamanho in tamanhos) {
            const quantidadeDisponivel = tamanhos[tamanho];
            if (quantidadeDisponivel > 0) { // Verifica se há estoque desse tamanho
                const option = document.createElement('option');
                option.value = tamanho;
                option.textContent = `Tamanho ${tamanho}`;
                tamanhoSelect.appendChild(option);
            }
        }

        const quantidadeSelect = document.createElement('input');
        quantidadeSelect.classList.add('selectQuantidade');
        quantidadeSelect.type = 'number';
        quantidadeSelect.min = 1;
        quantidadeSelect.value = 1;

        const selectsContainer = document.createElement('div');
        selectsContainer.classList.add('selectsContainer');

        selectsContainer.appendChild(tamanhoSelect);
        selectsContainer.appendChild(quantidadeSelect);

        productElement.appendChild(selectsContainer);

        const button = document.createElement('button');
        button.classList.add('botaoSkatesComprar');
        button.textContent = 'Adicionar ao Carrinho';

        button.addEventListener('click', async () => {
            const selectedTamanho = tamanhoSelect.value;
            const selectedQuantidade = parseInt(quantidadeSelect.value);
            console.log('Button click:', { id, tamanho: selectedTamanho, quantidade: selectedQuantidade });

            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            const existingProductIndex = carrinho.findIndex(item => item.id === id && item.tamanho === selectedTamanho);

            if (existingProductIndex > -1) {
                carrinho[existingProductIndex].quantidade += selectedQuantidade;
            } else {
                carrinho.push({
                    id: id,
                    descricao: descricao,
                    valor: valor,
                    url_img: url_img,
                    tamanho: selectedTamanho,
                    quantidade: selectedQuantidade
                });
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            alert('Produto adicionado ao carrinho com sucesso!');
            await updateProductQuantity(id, selectedTamanho, selectedQuantidade);
        });

        productElement.appendChild(button);
        container.appendChild(productElement);
    });
}





// O restante é responsavel por atualizar a quantidade 



async function init() {
    const products = await fetchProducts();
    renderProducts(products);
}

window.addEventListener('DOMContentLoaded', init);
