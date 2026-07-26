document.addEventListener('DOMContentLoaded', () => {
  // Sempre limpar token ao abrir tela de login
  localStorage.removeItem("token");

  // Limpa todos os formulários ao carregar a página
  document.querySelectorAll("form").forEach(form => form.reset());
  document.querySelectorAll("input").forEach(input => {
    input.value = "";
  });


  const entrarBtn = document.getElementById('entrar-js');
  const inscreverBtn = document.getElementById('inscrever-js');
  const container = document.querySelector('.container');

  // Alternar para tela de login
  if (entrarBtn) {
    entrarBtn.addEventListener('click', () => {
      container.classList.add('entrar-js');
      container.classList.remove('inscrever-js');
    });
  }

  if (inscreverBtn) {
    inscreverBtn.addEventListener('click', () => {
      container.classList.add('inscrever-js');
      container.classList.remove('entrar-js');
    });
  }

  // --- LOGIN ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#email').value;
      const password = loginForm.querySelector('#password').value;

      console.log("📩 Tentando login com:", email);

      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          alert("Erro ao fazer login. Verifique suas credenciais.");
          return;
        }

        const data = await response.json();
        console.log("📩 Dados recebidos do backend:", data);

        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "../../pages/login-user/home2.html";
        } else {;
          alert("Login falhou. Tente novamente.");
        }
      } catch (error) {
        alert("Erro inesperado ao tentar login. Tente novamente.");
      }
    });
  }

  // --- REGISTRO ---
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = registerForm.querySelector('#email').value;
      const password = registerForm.querySelector('#password').value;

      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
          alert("Erro ao registrar usuário. Tente novamente.");
          return;
        }

        const data = await response.json();
        // Alterna automaticamente para tela de login
        container.classList.add('entrar-js');
        container.classList.remove('inscrever-js');
      } catch (error) {
        alert("Erro inesperado ao tentar registrar usuário. Tente novamente.");
      }
    });
  }
});
