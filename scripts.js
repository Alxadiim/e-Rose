document.addEventListener('DOMContentLoaded', function() {
    const riskForm = document.getElementById('riskForm');
    const progressBar = document.getElementById('progressBar');
    let currentScore = 0;
    let previousAnswers = new Map(); // Pour stocker les réponses précédentes

    // Fonction pour calculer le score de risque
    function calculateAndDisplayScore() {
        let score = 0;
        const answers = document.querySelectorAll('input[type="radio"]:checked');
        
        answers.forEach(answer => {
            score += parseInt(answer.value);
        });

        // Afficher le résultat
        const resultDiv = document.getElementById('risk-result');
        let riskLevel = '';
        let riskColor = '';
        let recommendations = '';
        
        if (score <= 5) {
            riskLevel = 'Faible';
            riskColor = '#28a745';
            recommendations = 'Continuez les examens de routine et maintenez de bonnes habitudes de santé.';
        } else if (score <= 10) {
            riskLevel = 'Modéré';
            riskColor = '#ffc107';
            recommendations = 'Nous vous conseillons de planifier une consultation préventive avec un professionnel de santé.';
        } else {
            riskLevel = 'Élevé';
            riskColor = '#dc3545';
            recommendations = 'Il est fortement recommandé de consulter rapidement un professionnel de santé pour un examen approfondi.';
        }

        resultDiv.innerHTML = `
            <div class="alert" style="background-color: ${riskColor}; color: white;">
                <h4 class="alert-heading">Niveau de risque : ${riskLevel}</h4>
                <p>Score total : ${score} sur 15</p>
                <hr>
                <p class="mb-0">${recommendations}</p>
                <div class="mt-3">
                    <a href="dashboard.html" class="btn btn-light">Accéder à votre espace personnel</a>
                </div>
            </div>
        `;

        currentScore = score;
    }

    // Mise à jour de la barre de progression
    function updateProgress() {
        const totalQuestions = 5;
        const answered = document.querySelectorAll('input[type="radio"]:checked').length;
        const progress = (answered / totalQuestions) * 100;
        progressBar.style.width = progress + '%';
    }

    // Gérer les changements de réponses
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function(e) {
            const questionName = this.name;
            const newValue = parseInt(this.value);

            // Mettre à jour la progression
            updateProgress();
            
            // Recalculer le score immédiatement
            calculateAndDisplayScore();
        });
    });

    // Gérer la soumission du formulaire
    if (riskForm) {
        riskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateAndDisplayScore();
        });
    }
});