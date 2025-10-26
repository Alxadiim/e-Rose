/*
    scripts.js
    - Gestion simple côté client (localStorage)
    - Inscription / Connexion (stockage demo)
    - Évaluation (calcul du score, sauvegarde par utilisateur)
    - Dashboard (affichage du dernier score)
*/

// --- Notification System ---
function showNotification(message, type = 'info', duration = 5000) {
    const types = {
        success: { icon: 'check-circle', class: 'notification-success' },
        error: { icon: 'exclamation-circle', class: 'notification-error' },
        warning: { icon: 'exclamation-triangle', class: 'notification-warning' },
        info: { icon: 'info-circle', class: 'notification-info' }
    };

    const notificationType = types[type] || types.info;
    const notificationId = 'notification-' + Date.now();
    
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = `notification ${notificationType.class}`;
    notification.innerHTML = `
        <i class="fas fa-${notificationType.icon}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Ajouter la notification au conteneur
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    container.appendChild(notification);

    // Afficher la notification avec une animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Fermeture au clic sur le bouton
    const closeBtn = notification.querySelector('.notification-close');
    const closeNotification = () => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    };
    closeBtn.addEventListener('click', closeNotification);

    // Fermeture automatique
    if (duration > 0) {
        setTimeout(closeNotification, duration);
    }

    return notificationId;
}

// Fonction utilitaire pour afficher un indicateur de chargement
function showLoading(button, show = true) {
    if (show) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Traitement...';
    } else {
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text');
        button.textContent = originalText || 'Valider';
    }
}

// --- Storage helpers ---
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('erose_users') || '[]');
    } catch (e) { return []; }
}

function saveUsers(users) {
    localStorage.setItem('erose_users', JSON.stringify(users));
}

function addUser(user) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
}

function findUser(email) {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
}

function setSession(email) { localStorage.setItem('erose_session', email); }
function getSession() { return localStorage.getItem('erose_session'); }
function clearSession() { localStorage.removeItem('erose_session'); }

function saveEvaluationForUser(email, evaluation) {
    try {
        const all = JSON.parse(localStorage.getItem('erose_evaluations') || '{}');
        all[email] = evaluation;
        localStorage.setItem('erose_evaluations', JSON.stringify(all));
    } catch (e) { /* ignore */ }
}

function getEvaluationForUser(email) {
    try { return JSON.parse(localStorage.getItem('erose_evaluations') || '{}')[email]; }
    catch (e) { return null; }
}

// --- Page-specific behavior ---
document.addEventListener('DOMContentLoaded', function() {
    // Registration page
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.setAttribute('data-original-text', submitBtn.textContent);
            showLoading(submitBtn, true);

            const name = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirmPassword').value;

            // Validation des champs
            if (!name || !email || !password) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'warning');
                return;
            }
            if (password.length < 8) {
                showNotification('Le mot de passe doit contenir au moins 8 caractères.', 'warning');
                return;
            }
            if (password !== confirm) {
                showNotification('Les mots de passe ne correspondent pas.', 'error');
                return;
            }
            if (findUser(email)) {
                showNotification('Un compte existe déjà pour cet email. Veuillez vous connecter.', 'warning');
                setTimeout(() => window.location.href = 'index.html', 2000);
                return;
            }

            addUser({ name, email, phone, password });
            setSession(email);
            showLoading(submitBtn, false);
            window.location.href = 'evaluation.html';
        });
    }

    // Login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.setAttribute('data-original-text', submitBtn.textContent);
            showLoading(submitBtn, true);

            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const user = findUser(email);
            if (!user) {
                showNotification('Aucun compte trouvé avec cet email.', 'error');
                return;
            }
            if (user.password !== password) {
                showNotification('Mot de passe incorrect. Veuillez réessayer.', 'error');
                return;
            }
            setSession(email);
            const evalData = getEvaluationForUser(email);
            showLoading(submitBtn, false);
            if (evalData) window.location.href = 'dashboard.html';
            else window.location.href = 'evaluation.html';
        });
    }

    // Evaluation page
    const riskForm = document.getElementById('riskForm');
    const progressBar = document.getElementById('progressBar');
    if (riskForm) {
        function updateProgress() {
            const totalQuestions = 5;
            const answered = document.querySelectorAll('input[type="radio"]:checked').length;
            const progress = (answered / totalQuestions) * 100;
            if (progressBar) progressBar.style.width = progress + '%';
        }

        function computeScore() {
            let score = 0;
            const answers = document.querySelectorAll('input[type="radio"]:checked');
            answers.forEach(a => { score += parseInt(a.value || '0'); });
            return score;
        }

        function scoreToLevel(score) {
            if (score <= 5) return { level: 'Faible', color: '#28a745', rec: 'Continuez les examens de routine et maintenez de bonnes habitudes de santé.' };
            if (score <= 10) return { level: 'Modéré', color: '#ffc107', rec: 'Planifiez une consultation préventive avec un professionnel de santé.' };
            return { level: 'Élevé', color: '#dc3545', rec: 'Consultez rapidement un professionnel de santé pour un examen approfondi.' };
        }

        // live update
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() { updateProgress(); displayLiveScore(); });
        });

        function displayLiveScore() {
            const resultDiv = document.getElementById('risk-result');
            if (!resultDiv) return;
            const score = computeScore();
            const info = scoreToLevel(score);
            resultDiv.innerHTML = `\\
                <div class="alert" style="background-color: ${info.color}; color: white;">\\
                    <h4 class="alert-heading">Niveau de risque : ${info.level}</h4>\\
                    <p>Score total : ${score} sur 15</p>\\
                    <hr>\\
                    <p class="mb-0">${info.rec}</p>\\
                </div>`;
        }

        // on submit, save evaluation for current user
        riskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const score = computeScore();
            const info = scoreToLevel(score);
            const sessionEmail = getSession();
            const now = new Date().toISOString();
            if (sessionEmail) {
                saveEvaluationForUser(sessionEmail, { score, level: info.level, date: now });
                showNotification('Votre évaluation a été enregistrée avec succès !', 'success');
            }
            displayLiveScore();
            // show link to dashboard
            const resultDiv = document.getElementById('risk-result');
            if (resultDiv) {
                resultDiv.innerHTML += `\\
                    <div class="mt-3">\\
                        <a href="dashboard.html" class="btn btn-light">Accéder à votre espace personnel</a>\\
                    </div>`;
            }
        });
    }

    // Dashboard page
    const currentRiskSpan = document.getElementById('currentRisk');
    const userNameElt = document.getElementById('userName');
    const lastEvalElt = document.getElementById('lastEval');
    const logoutBtn = document.getElementById('logoutBtn');
    if (currentRiskSpan || userNameElt || lastEvalElt || logoutBtn) {
        const sessionEmail = getSession();
        if (!sessionEmail) {
            // not logged in
            window.location.href = 'index.html';
            return;
        }
        const user = findUser(sessionEmail) || { name: sessionEmail };
        if (userNameElt) userNameElt.textContent = user.name || '';
        const evalData = getEvaluationForUser(sessionEmail);
        if (evalData) {
            if (currentRiskSpan) currentRiskSpan.textContent = evalData.level;
            if (lastEvalElt) lastEvalElt.textContent = new Date(evalData.date).toLocaleString();
        } else {
            if (currentRiskSpan) currentRiskSpan.textContent = 'Aucune évaluation';
            if (lastEvalElt) lastEvalElt.textContent = '—';
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() { clearSession(); window.location.href = 'index.html'; });
        }
    }
});