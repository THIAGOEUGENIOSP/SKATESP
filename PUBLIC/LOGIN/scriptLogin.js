// scriptLogin.js
function loginUser(email) {
    const user = users.find(user => user.email === email);
    if (user) {
        localStorage.setItem('activeUser', JSON.stringify(user));
        window.location.href = '/carrinho.html';
    } else {
        alert('Usuário não encontrado!');
    }
}

document.querySelector('.login-button').addEventListener('click', () => {
    const email = document.querySelector('.email-input').value;
    loginUser(email);
});
