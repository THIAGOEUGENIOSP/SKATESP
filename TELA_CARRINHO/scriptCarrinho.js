let users = JSON.parse(localStorage.getItem('users')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

function saveUser(user) {
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

function saveOrder(order) {
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function processPayment(cart, paymentDetails) {
    // Simulate payment processing
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate payment success
            resolve({ success: true, transactionId: Date.now() });
        }, 1000);
    });
}

async function generatePixPayment() {
    try {
        const response = await fetch('https://api.ficticia.com.br/pix', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer seu_token_de_api'
            },
            body: JSON.stringify({
                valor: 100, // Substitua pelo valor real
                descricao: 'Pagamento de pedido'
            })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Código Pix gerado: ' + data.copiaCola);
        } else {
            throw new Error(data.mensagem || 'Erro ao gerar Pix');
        }
    } catch (error) {
        alert('Erro ao gerar Pix: ' + error.message);
    }
}

document.querySelector('.btn-finalizar').addEventListener('click', async () => {
    const paymentMethod = document.getElementById('payment-method').value;
    const paymentDetails = {};
    const customerName = document.getElementById('card-name').value;
    const address = {
        street: document.getElementById('street').value,
        number: document.getElementById('number').value,
        city: document.getElementById('city').value, // Adicionei o campo city
        state: document.getElementById('state').value, // Adicionei o campo state
        zip: document.getElementById('cep').value
    };

    if (paymentMethod === 'credit-card') {
        paymentDetails.method = 'Credit Card';
        paymentDetails.cardName = document.getElementById('card-name').value;
        paymentDetails.cardNumber = document.getElementById('card-number').value;
        paymentDetails.expiry = document.getElementById('expiry-date').value;
        paymentDetails.cvv = document.getElementById('cvv').value;
    } else if (paymentMethod === 'paypal') {
        paymentDetails.method = 'PayPal';
    } else if (paymentMethod === 'pix') {
        paymentDetails.method = 'Pix';
        await generatePixPayment();
    }

    const paymentResult = await processPayment(carrinho, paymentDetails);

    if (paymentResult.success) {
        const order = {
            id: Date.now(),
            customerName: customerName,
            address: address,
            items: [...carrinho],
            total: carrinho.reduce((sum, item) => sum + (item.valor * item.quantidade), 0) + calculateFrete(),
            date: new Date(),
            transactionId: paymentResult.transactionId,
            status: 'Aguardando Empresa'
        };

        saveOrder(order);
        localStorage.removeItem('carrinho');
        carrinho = [];
        renderCart();
        alert('Compra finalizada com sucesso!');
        window.location.href = '/PEDIDOS/pedidos.html';
    } else {
        alert('Erro no processamento do pagamento. Tente novamente.');
    }
});

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function removeFromCart(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    renderCart();
}

function calculateFrete() {
    // Simulate a frete calculation based on the provided CEP
    const frete = parseFloat(document.querySelector('.frete-total').textContent.replace('R$', '').replace(',', '.')) || 20;
    document.querySelector('.frete-total').textContent = frete.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    return frete;
}

function updateSummary() {
    const quantidadeTotal = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    const valorTotal = carrinho.reduce((sum, item) => sum + (item.valor * item.quantidade), 0);
    const freteTotal = parseFloat(document.querySelector('.frete-total').textContent.replace('R$', '').replace(',', '.')) || 0;
    const valorFinal = valorTotal + freteTotal;

    document.querySelector('.quantidade-total').textContent = quantidadeTotal;
    document.querySelector('.valor-total').textContent = valorFinal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

async function renderCart() {
    const cartContainer = document.querySelector('.cartContainer');
    cartContainer.innerHTML = '';

    if (carrinho.length === 0) {
        cartContainer.innerHTML = '<p>O carrinho está vazio.</p>';
        updateSummary(); // Atualiza o resumo mesmo se o carrinho estiver vazio
        return;
    }

    carrinho.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cartItem');

        const precoTotal = item.valor * item.quantidade;
        const precoFormatado = precoTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        cartItem.innerHTML = `
            <div class="card">
                <img src="${item.url_img}" alt="${item.descricao}" class="card-img" width="200" height="250">
                <div class="card-content">
                    <p class="card-descricao">${item.descricao}</p>
                    <p class="card-tamanho">Tamanho: ${item.tamanho}</p>
                    <div class="quantity-control">
                        <button class="btn-decrease" data-index="${index}">-</button>
                        <input type="text" value="${item.quantidade}" readonly>
                        <button class="btn-increase" data-index="${index}">+</button>
                    </div>
                    <p class="card-preco">Preço: ${precoFormatado}</p>
                    <button class="removeButton" data-index="${index}">Remover</button>
                </div>
            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    document.querySelectorAll('.btn-decrease').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            if (carrinho[index].quantidade > 1) {
                carrinho[index].quantidade -= 1;
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderCart();
            }
        });
    });

    document.querySelectorAll('.btn-increase').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            carrinho[index].quantidade += 1;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderCart();
        });
    });

    document.querySelectorAll('.removeButton').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            removeFromCart(index);
        });
    });

    updateSummary();
}

document.addEventListener('DOMContentLoaded', renderCart);

document.getElementById('payment-method').addEventListener('change', (event) => {
    const selectedMethod = event.target.value;
    document.querySelectorAll('.payment-info').forEach(info => {
        info.classList.remove('active');
    });
    if (selectedMethod === 'credit-card') {
        document.getElementById('credit-card-info').classList.add('active');
    } else if (selectedMethod === 'paypal') {
        document.getElementById('paypal-info').classList.add('active');
    } else if (selectedMethod === 'pix') {
        document.getElementById('pix-info').classList.add('active');
    }
});

document.getElementById('calculate-frete').addEventListener('click', async () => {
    const cep = document.getElementById('cep').value;
    if (cep) {
        try {
            // Fetch street name based on the provided CEP using ViaCEP API
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error('Erro ao buscar endereço');
            const data = await response.json();
            if (data.erro) throw new Error('CEP inválido');

            const street = data.logradouro;
            const city = data.localidade; // Captura a cidade
            const state = data.uf; // Captura o estado

            document.getElementById('street').value = street;
            document.getElementById('city').value = city; // Define o valor da cidade
            document.getElementById('state').value = state; // Define o valor do estado

            // Simulate a frete calculation based on the provided CEP
            const frete = 20; // Replace this with the actual calculation or API call
            document.querySelector('.frete-total').textContent = frete.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            updateSummary();
        } catch (error) {
            alert('Erro ao buscar endereço: ' + error.message);
        }
    } else {
        alert('Por favor, insira um CEP válido.');
    }
});
