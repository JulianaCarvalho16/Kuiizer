const db = require("../config/firebase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registro do usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;;
    await db.collection("users").doc(email).set({ name, email, password });

    res.status(200).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await db.collection("users").doc(email).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    const userData = userDoc.data();

    if (userData.password !== password) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login realizado com sucesso!", token, redirectUrl: "/home2.html" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.status(200).json({ message: "Logout realizado com sucesso" });
};

// Middleware JWT
exports.verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) return res.status(403).json({ message: "Token não fornecido" });

  if (token.startsWith("Bearer ")) token = token.slice(7);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Token inválido" });
    }
    req.user = { email: decoded.email }; // garante que req.user.email exista
    next();
  });
};

// Salvar resultado do quiz
exports.saveResult = async (req, res) => {
  try {
    const { quizId, quizNome, score, playedAt } = req.body;
    const userEmail = req.user.email;

    if (!quizId || !quizNome) {
      return res.status(400).json({ error: "quizId e quizNome são obrigatórios" });
    }

    const resultData = {
      userEmail,
      quizId,
      quizNome,
      score: score || 0,
      playedAt: playedAt ? new Date(playedAt) : new Date()
    };

    await db.collection("results").add(resultData);

    res.status(201).json({ message: "Resultado salvo com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar resultados do usuário
exports.getUserResults = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userDoc = await db.collection("users").doc(userEmail).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    const userData = userDoc.data();

    const snapshot = await db.collection("results")
      .where("userEmail", "==", userEmail)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({
        userName: userData.name,
        quizzes: [],
        message: "Usuário ainda não jogou nenhum quiz"
      });
    }

    const quizzes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        quizNome: data.quizNome, // agora bate com o que foi salvo
        score: data.score,
        playedAt: data.playedAt instanceof Date 
          ? data.playedAt.toISOString() 
          : data.playedAt.toDate().toISOString()
      };
    });

    res.status(200).json({ userName: userData.name, quizzes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
