document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('adminLoginBtn').addEventListener('click', async function (event) {
        event.preventDefault();

        const form = document.getElementById('adminLoginForm');
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch('http://localhost:3005/v1/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('Resposta da API de login:', result); // Log da resposta da API

            if (response.ok) {
                console.log('Login bem-sucedido:', result);
                sessionStorage.setItem('adminName', result.adminName);
                sessionStorage.setItem('adminEmail', result.adminEmail);
                console.log('adminName salvo no sessionStorage:', sessionStorage.getItem('adminName'));
                console.log('adminEmail salvo no sessionStorage:', sessionStorage.getItem('adminEmail'));
                window.location.href = '/CADASTRO DE PRODUTOS/cadastroProdutos.html';
            } else {
                const messageContainer = document.getElementById('adminMessageContainer');
                messageContainer.innerHTML = `<div style="color: red;">${result.error || 'Erro ao fazer login'}</div>`;
            }
        } catch (error) {
            const messageContainer = document.getElementById('adminMessageContainer');
            messageContainer.innerHTML = `<div style="color: red;">Erro ao enviar a solicitação</div>`;
        }
    });

    document.getElementById('newAdminBtn').addEventListener('click', function() {
        const newAdminFields = document.getElementById('newAdminFields');
        if (newAdminFields.style.display === 'none') {
            newAdminFields.style.display = 'block';
        } else {
            newAdminFields.style.display = 'none';
        }
    });

    document.getElementById('adminRegisterBtn').addEventListener('click', async function (event) {
        event.preventDefault();

        const form = document.getElementById('adminRegisterForm');
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        if (data.senha !== data.confirmarSenha) {
            const messageContainer = document.getElementById('registerMessageContainer');
            messageContainer.innerHTML = `<div style="color: red;">As senhas não coincidem</div>`;
            return;
        }

        try {
            const response = await fetch('http://localhost:3005/v1/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                window.alert(result.message);
            } else {
                const messageContainer = document.getElementById('registerMessageContainer');
                messageContainer.innerHTML = `<div style="color: red;">${result.error || 'Erro ao cadastrar administrador'}</div>`;
            }
        } catch (error) {
            const messageContainer = document.getElementById('registerMessageContainer');
            messageContainer.innerHTML = `<div style="color: red;">Erro ao enviar a solicitação</div>`;
        }
    });
});
