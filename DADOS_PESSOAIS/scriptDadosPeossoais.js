document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#form-cadastro-usuario');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Obter os valores dos campos de senha
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        // Verificar se as senhas são iguais
        if (senha !== confirmarSenha) {
            alert('As senhas não correspondem! Por favor, verifique e tente novamente.');
            return; // Abortar o envio do formulário se as senhas não forem iguais
        }

        // Se as senhas forem iguais, prosseguir com o envio do formulário
        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:3005/dados_pessoais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const data = await response.text(); // Extrair o corpo de texto da resposta

            if (response.status === 200 || response.status === 204) {
                alert(data); // Exibir o texto retornado pelo servidor
                form.reset(); // Limpa o formulário após o envio bem-sucedido
            } else {
                throw new Error('Erro ao cadastrar dados');
            }
        } catch (error) {
            console.error('Erro:', error.message);
            alert('Erro ao cadastrar dados');
        }
    });
});


//buscar cep 
document.getElementById('cep').addEventListener('blur', function() {
    const cep = document.getElementById('cep').value;
    buscarCEP(cep);
  });
  
  async function buscarCEP(cep) {
    cep = cep.replace(/\D/g, '');
  
    if (cep.length !== 8) {
      exibirMensagemErro('CEP inválido.');
      return;
    }
  
    const url = `https://viacep.com.br/ws/${cep}/json/`;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error('Erro ao buscar informações do CEP.');
      }
  
      const data = await response.json();
  
      if (data.erro) {
        exibirMensagemErro('CEP não encontrado.');
      } else {
        preencherFormulario(data);
      }
    } catch (error) {
      exibirMensagemErro('Erro na requisição: ' + error.message);
    }
  }
  
  function preencherFormulario(data) {
    document.getElementById('endereco').value = data.logradouro || '';
    document.getElementById('bairro').value = data.bairro || '';
    document.getElementById('cidade').value = data.localidade || '';
    document.getElementById('estado').value = data.uf || '';
  }
  
  function exibirMensagemErro(mensagem) {
    alert(mensagem);
  }
  
