 

async function buscarProdutos() {
    try {
        const response = await fetch('http://localhost:3005/list-skate');
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
    const seenIds = new Set();

    products.forEach(product => {
        // Ajuste para acessar os dados como array
        const {id, descricao, valor, url_img} = product;

        if (!seenIds.has(id)) {
            seenIds.add(id);
        
            

            // Verifica se todas as propriedades necessárias existem
            if (!url_img || !descricao || valor === undefined) {
               console.warn('Produto com dados incompletos:', product);
              return;
            }

           // Cria um elemento div para representar o produto e adiciona a classe 'produtos' a ele.
           const productElement = document.createElement('div');
           productElement.classList.add('produtos');

            // Define o conteúdo HTML interno do elemento do produto, incluindo a imagem, descrição e preço do produto.
            productElement.innerHTML = `
                <ul>
                    <li><img src="${url_img}" alt="${descricao}" width=200 height= 250></li>
                    <li><h3>${descricao}</h3></li>
                    <li><p class="preco">R$ ${valor.toFixed(2)}</p></li>
                </ul>
            `;

            
            const quantidadeSelect = document.createElement('input');
            quantidadeSelect.classList.add('selectQuantidade');
            quantidadeSelect.type = 'number';
            quantidadeSelect.min = 1;
            quantidadeSelect.value = 1;

            const selectsContainer = document.createElement('div');
            selectsContainer.classList.add('selectsContainer');

            selectsContainer.appendChild(quantidadeSelect);
            productElement.appendChild(selectsContainer);

            const button = document.createElement('button');
            button.classList.add('botaoSkatesComprar');
            button.textContent = 'Adicionar ao Carrinho';

            // Evento de clique para configurar o clique no botão.            
            // - atualiza a quantidade
            // - adiciona o produto ao carrinho no localStorage  
            button.addEventListener('click', () => {
                const selectedQuantidade = parseInt(quantidadeSelect.value);
                console.log('Button click:', { id, quantidade: selectedQuantidade });

                console.log('Adicionando novo produto ao carrinho:', { id, quantidade: selectedQuantidade });
               
                let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                const existingProductIndex = carrinho.findIndex(item => item.id === product.id);

                if (existingProductIndex > -1) {
                    // Se o produto já existe no carrinho, atualiza a quantidade
                    carrinho[existingProductIndex].quantidade += selectedQuantidade;
                    console.log('Atualizando a quantidade do produto no carrinho:', { id, quantidade: carrinho[existingProductIndex].quantidade });
                    updateProductQuantity(id, carrinho[existingProductIndex].quantidade);
                } else {
                carrinho.push({
                    id,
                    descricao,
                    valor,
                    url_img,
                    quantidade: selectedQuantidade
                });
                
                
            }
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            alert('Produto adicionado ao carrinho com sucesso!');
                       
           
         });
         productElement.appendChild(button);
         container.appendChild(productElement);
}
     });
}



async function updateProductQuantity(id, quantidade) {
    console.log('Atualizando quantidade do produto:', { id, quantidade });
    try {
        const response = await fetch('http://localhost:3005/update-quantidade', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, quantidade })
        });
//
//        if (response.ok) {
//            alert('Quantidade atualizada com sucesso!');
//            const products = await buscarProdutos();
//            renderProducts(products);
//        
        
    } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
  };
}
//
async function init() {
    const products = await buscarProdutos();
    renderProducts(products);
}

window.addEventListener('DOMContentLoaded', init);