async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3005/list-tenis');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return [];
    }
}

function renderProducts(products) {
    const container = document.querySelector('.containerProdutos');
    container.innerHTML = '';
    //const seenIds = new Set();

    products.forEach(product => {
        // Ajuste para acessar os dados como array
        const { id_estoque, descricao, valor, url_img, tamanhos } = product;

        //if (!seenIds.has(id_estoque)) {
        //   seenIds.add(id_estoque);
//
        //     Verifica se todas as propriedades necessárias existem
       //  if (!url_img || !descricao || valor === undefined || !tamanho) {
       // console.warn('Produto com dados incompletos:', product);
       // return;
       // }

            const productElement = document.createElement('div');
            productElement.classList.add('produtos');

            productElement.innerHTML = `
                <ul>
                    <li><img src="${url_img}" alt="${descricao}" width=200 height= 250></li>
                    <li><h3>${descricao}</h3></li>
                    <li><p class="preco">R$ ${valor.toFixed(2)}</p></li>
                </ul>
            `;

            const tamanhoSelect = document.createElement('select');
            tamanhoSelect.classList.add('selectTamanho');

            // Adiciona as opções de tamanhos disponíveis
            for (let tamanho in tamanhos) {
                const quantidadeDisponivel = tamanhos[tamanho];
                if (quantidadeDisponivel > 0) { // Verifica se há estoque desse tamanho
                    const option = document.createElement('option');
                    option.value = tamanho;
                    option.textContent = `Tamanho ${tamanho} `;
                    tamanhoSelect.appendChild(option);
                }
        }

           /// if (product.tamanhos) {
           ///     product.tamanhos.forEach(tamanho => {
           ///         const option = document.createElement('option');
           ///         option.value = tamanho.tamanho;
           ///         option.textContent = `Tamanho ${tamanho.tamanho}`;
           ///         tamanhoSelect.appendChild(option);
           ///     });
           /// }

            const quantidadeSelect = document.createElement('input');
            quantidadeSelect.classList.add('selectQuantidade');
            quantidadeSelect.type = 'number';
            quantidadeSelect.min = 1;
            quantidadeSelect.value = 1;

            // Cria um container para os seletores e adiciona ao produto
            const selectsContainer = document.createElement('div');
            selectsContainer.classList.add('selectsContainer');

            selectsContainer.appendChild(tamanhoSelect);
            selectsContainer.appendChild(quantidadeSelect);

            productElement.appendChild(selectsContainer);

            // Cria e configura o botão com o texto "Adicionar ao Carrinho" e adiciona a classe 'botaoSkatesComprar'.
            const button = document.createElement('button');
            button.classList.add('botaoSkatesComprar');
            button.textContent = 'Adicionar ao Carrinho';

            // Evento de clique para configurar o clique no botão.
            // - coleta o tamanho
            // - atualiza a quantidade
            // - adiciona o produto ao carrinho no localStorage  
            button.addEventListener('click', async () => {
                const selectedTamanho = tamanhoSelect.value;
                const selectedQuantidade = parseInt(quantidadeSelect.value);
                console.log('Button click:', { id_estoque, tamanho: selectedTamanho, quantidade: selectedQuantidade });
            
                let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                const existingProductIndex = carrinho.findIndex(item => item.id_estoque === id_estoque && item.tamanho === selectedTamanho);
            
                if (existingProductIndex > -1) {
                    // Se o produto já existe no carrinho, atualiza a quantidade
                    carrinho[existingProductIndex].quantidade += selectedQuantidade;
                } else {
                    // Caso contrário, adiciona um novo produto ao carrinho
                    carrinho.push({
                        id_estoque,
                        descricao,
                        valor,
                        url_img,
                        tamanho: selectedTamanho,
                        quantidade: selectedQuantidade
                    });
                }
            
                // Atualiza o localStorage com o carrinho atualizado
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                alert('Produto adicionado ao carrinho com sucesso!');
            
                try {
                    // Chama a função para atualizar a quantidade no backend
                    await updateProductQuantity(id_estoque, selectedTamanho, selectedQuantidade);
            
                    // Atualiza a lista de produtos após a atualização
                    const updatedProducts = await fetchProducts();
                    renderProducts(updatedProducts);
                } catch (error) {
                    console.error('Erro ao atualizar quantidade:', error);
                    alert('Erro ao atualizar quantidade. Por favor, tente novamente mais tarde.');
                }
            });
            

            productElement.appendChild(button);
            container.appendChild(productElement);
        
        });
    }
    

async function updateProductQuantity(id_estoque, tamanho, quantidade) {
    console.log('Updating quantity for product:', { id_estoque, tamanho, quantidade });
    try {
        const response = await fetch('http://localhost:3005/update-quantidade', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_estoque, tamanho, quantidade })
        });

       // if (response.ok) {
       //     alert('Quantidade atualizada com sucesso!');
       //     const products = await fetchProducts();
       //     renderProducts(products);
       if (!response.ok) {
        throw new Error('Erro ao atualizar a quantidade do produto');
    }
        //} else {
        //    const error = await response.json();
        //    alert('Erro ao atualizar quantidade: ' + error.message);
        //}
    } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3005/list-tenis');
        if (!response.ok) {
            throw new Error('Erro ao buscar os produtos');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        alert('Erro ao buscar os produtos');
        return [];
    }
}
async function init() {
    try {
        const products = await fetchProducts();
        renderProducts(products);
    } catch (error) {
        console.error('Erro ao inicializar:', error);
        alert('Erro ao carregar os produtos');
    }
}

window.addEventListener('DOMContentLoaded', init);