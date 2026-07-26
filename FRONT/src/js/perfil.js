document.addEventListener('DOMContentLoaded', async () => {
  const quizList = document.getElementById('quizList');
  const quizNamesUl = document.getElementById('quizNames');
  const quizScoresUl = document.getElementById('quizScores');
  const userNameElement = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');

  const token = localStorage.getItem('token'); 

  // 🚀 Função de logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token'); 
      window.location.href = "../../pages/conexoes/login.html";
    });
  }

  if (!token) {
    window.location.href = "../../pages/login-user/login.html";
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/results', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      localStorage.removeItem("token");
      window.location.href = "../../pages/login-user/login.html";
      return;
    }

    const data = await response.json();

    const { userName, quizzes, message } = data;

    if (userNameElement) {
      userNameElement.textContent = `Bem-vindo, ${userName}!`;
    }

    quizNamesUl.innerHTML = '';
    quizScoresUl.innerHTML = '';

    if (!quizzes || quizzes.length === 0) {
      quizList.innerHTML = `<p>${message || "Você ainda não jogou nenhum quiz."}</p>`;
      return;
    }

    quizzes.forEach(result => {
      const liName = document.createElement('li');
      liName.textContent = result.quizNome;

      const liScore = document.createElement('li');
      liScore.textContent = `${result.score} pontos`;

      const liDate = document.createElement('li');
      let date;

      // Tratamento da data
      if (result.playedAt && result.playedAt.seconds) {
        date = new Date(result.playedAt.seconds * 1000);
      } else {
        date = new Date(result.playedAt);
      }

      liDate.textContent = `Data: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

      quizNamesUl.appendChild(liName);
      quizScoresUl.appendChild(liScore);
      quizScoresUl.appendChild(liDate);
    });

  } catch (error) {
    localStorage.removeItem("token");
    window.location.href = "../../pages/login-user/login.html";
  }
});