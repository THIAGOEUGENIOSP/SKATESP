// scriptPedidos.js
document.addEventListener('DOMContentLoaded', renderOrders);

function renderOrders() {
    const ordersContainer = document.querySelector('.pedidos-container');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>Nenhum pedido encontrado.</p>';
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('card');
        orderElement.innerHTML = `
            <div class="background">
                <h2>${new Date(order.date).toLocaleDateString('pt-BR')} | Valor Total: R$ ${order.total.toFixed(2)}</h2>
                <h6>Pedido #${order.id}</h6>
            </div>
            <div class="pedido">
                ${order.items.map(item => `
                    <ul class="ul">
                        <li class="card-img"><img src="${item.url_img}" alt="${item.descricao}" class="card-image"></li>
                        <div class="li">
                            <li class="card-title"><h3>${item.descricao}</h3></li>
                            <li class="card-descricao"><p>${item.descricao}</p></li>
                            <li><p>R$ ${item.valor.toFixed(2)}</p></li>
                        </div>
                    </ul>
                `).join('')}
                <li class="card-title">${order.status}</li>
            </div>
        `;
        ordersContainer.appendChild(orderElement);
    });
}
