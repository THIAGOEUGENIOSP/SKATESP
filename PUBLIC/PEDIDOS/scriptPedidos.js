document.addEventListener('DOMContentLoaded', renderOrders);

function renderOrders() {
    const ordersContainer = document.querySelector('.ordersTable tbody');
    ordersContainer.innerHTML = '';

    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<tr><td colspan="7">Nenhum pedido encontrado.</td></tr>';
        return;
    }

    orders.forEach(order => {
        const orderRow = document.createElement('tr');

        orderRow.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.address.street}</td>
            <td>${order.address.number}</td>
            <td>${order.address.city}</td>
            <td>${order.address.state}</td>
            <td>${order.address.zip}</td>
        `;

        ordersContainer.appendChild(orderRow);
    });
}
