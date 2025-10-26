// Configuration de l'application
const CONFIG = {
    appName: 'e-Rose',
    version: '1.0.0',
    apiUrl: '/api',
    defaultLanguage: 'fr',
    supportedLanguages: ['fr', 'en'],
    cacheName: 'erose-cache-v1',
    enableOffline: true,
    enableAnalytics: false,
    reminderNotificationTime: 9, // 9h du matin
};

// État de l'application
const AppState = {
    currentLanguage: 'fr',
    isOnline: navigator.onLine,
    isAudioEnabled: false,
    user: null,
    reminders: [],
    content: {},
    speechSynthesis: window.speechSynthesis,
    speechSynthesisUtterance: window.SpeechSynthesisUtterance || null,
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
    loadContent();
    checkConnectivity();
    checkServiceWorker();
    checkInstallPrompt();
    checkNotificationPermission();
    initAudio();
    loadReminders();
});

// Initialisation de l'application
function initApp() {
    console.log(`${CONFIG.appName} v${CONFIG.version} initializing...`);
    
    // Vérifier si l'application est installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Running in standalone mode');
        document.documentElement.setAttribute('data-mode', 'standalone');
    }
    
    // Mettre à jour l'état en ligne/hors ligne
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initialiser le thème
    initTheme();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Bouton d'ajout de rappel
    const addReminderBtn = document.getElementById('addReminderBtn');
    if (addReminderBtn) {
        addReminderBtn.addEventListener('click', showReminderModal);
    }
    
    // Bouton de bascule de langue
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
    }
    
    // Bouton de bascule audio
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', toggleAudio);
    }
    
    // Écouteurs pour les liens internes (pour le mode SPA)
    document.body.addEventListener('click', handleInternalLinks);
}

// Gestion des liens internes pour une expérience SPA
function handleInternalLinks(event) {
    const link = event.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Ignorer les liens externes, les liens avec target="_blank" ou les ancres
    if (link.target === '_blank' || 
        link.hostname !== window.location.hostname || 
        href.startsWith('#') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('http')) {
        return;
    }
    
    event.preventDefault();
    navigateTo(href);
}

// Navigation entre les vues (SPA-like)
function navigateTo(url) {
    // Si c'est la même URL, on ne fait rien
    if (window.location.pathname === url) return;
    
    // Animation de transition (à implémenter)
    document.body.classList.add('page-transition');
    
    // Charger le contenu de la page
    fetch(url)
        .then(response => response.text())
        .then(html => {
            // Extraire le contenu de la balise main
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('main');
            const currentContent = document.querySelector('main');
            
            if (newContent && currentContent) {
                // Mettre à jour le contenu
                currentContent.innerHTML = newContent.innerHTML;
                
                // Mettre à jour le titre de la page
                document.title = doc.title;
                
                // Mettre à jour l'URL sans recharger la page
                window.history.pushState({}, '', url);
                
                // Recharger les scripts et les écouteurs
                loadPageScripts();
                setupEventListeners();
            } else {
                // Si quelque chose ne va pas, recharger la page normalement
                window.location.href = url;
            }
        })
        .catch(() => {
            // En cas d'erreur, recharger la page normalement
            window.location.href = url;
        })
        .finally(() => {
            document.body.classList.remove('page-transition');
        });
}

// Charger les scripts spécifiques à la page
function loadPageScripts() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    
    // Charger les scripts en fonction de la page
    switch (page) {
        case 'cancer-sein.html':
            // Charger le script pour la page du cancer du sein
            import('./pages/cancer-sein.js')
                .then(module => module.init())
                .catch(console.error);
            break;
        case 'cancer-col.html':
            // Charger le script pour la page du cancer du col de l'utérus
            import('./pages/cancer-col.js')
                .then(module => module.init())
                .catch(console.error);
            break;
        // Ajouter d'autres pages au besoin
    }
}

// Vérifier la connectivité
function checkConnectivity() {
    const statusElement = document.getElementById('connectionStatus');
    if (!statusElement) return;
    
    if (AppState.isOnline) {
        statusElement.innerHTML = '<i class="fas fa-wifi"></i> En ligne';
        statusElement.className = 'text-success';
    } else {
        statusElement.innerHTML = '<i class="fas fa-wifi-slash"></i> Hors ligne';
        statusElement.className = 'text-danger';
    }
}

// Mettre à jour le statut de connexion
function updateOnlineStatus() {
    AppState.isOnline = navigator.onLine;
    checkConnectivity();
    
    // Afficher une notification de changement d'état
    if (AppState.isOnline) {
        showNotification('Vous êtes de nouveau en ligne', 'success');
    } else {
        showNotification('Mode hors ligne activé', 'warning');
    }
}

// Vérifier le Service Worker
function checkServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            console.log('Service Worker est prêt');
            
            // Vérifier les mises à jour
            registration.update().then(() => {
                console.log('Vérification des mises à jour du Service Worker');
            });
        }).catch(error => {
            console.error('Erreur du Service Worker:', error);
        });
    }
}

// Vérifier la permission de notification
function checkNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            return true;
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                return permission === 'granted';
            });
        }
    }
    return false;
}

// Afficher une notification
function showNotification(title, options = {}) {
    // Si les notifications sont supportées et autorisées
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-96x96.png',
            ...options
        });
        
        // Gérer le clic sur la notification
        notification.onclick = function(event) {
            event.preventDefault();
            window.focus();
            notification.close();
            
            // Navigation si une URL est fournie
            if (options.url) {
                window.location.href = options.url;
            }
        };
        
        return notification;
    }
    
    // Fallback pour les navigateurs qui ne supportent pas les notifications
    console.log('Notification:', title, options);
    return null;
}

// Gérer l'installation de l'application
function checkInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // Empêcher le mini-infobar d'apparaître sur mobile
        e.preventDefault();
        // Stocker l'événement pour qu'il puisse être déclenché plus tard
        deferredPrompt = e;
        
        // Afficher un bouton d'installation personnalisé
        showInstallButton();
    });
    
    // Fonction pour afficher le bouton d'installation
    function showInstallButton() {
        // Créer ou afficher le bouton d'installation
        let installButton = document.getElementById('installButton');
        
        if (!installButton) {
            installButton = document.createElement('button');
            installButton.id = 'installButton';
            installButton.className = 'btn btn-pink fixed-bottom m-3 d-flex align-items-center';
            installButton.style = 'z-index: 1000; left: 50%; transform: translateX(-50%);';
            installButton.innerHTML = '<i class="fas fa-download me-2"></i>Installer l\'application';
            document.body.appendChild(installButton);
            
            installButton.addEventListener('click', () => {
                // Masquer le bouton d'installation
                installButton.style.display = 'none';
                
                // Afficher l'invite d'installation
                deferredPrompt.prompt();
                
                // Attendre que l'utilisateur réponde à l'invite
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('L\'utilisateur a accepté l\'installation');
                    } else {
                        console.log('L\'utilisateur a refusé l\'installation');
                    }
                    deferredPrompt = null;
                });
            });
        } else {
            installButton.style.display = 'flex';
        }
    }
}

// Gestion des rappels
function loadReminders() {
    // Charger les rappels depuis le stockage local
    const savedReminders = localStorage.getItem('erose_reminders');
    
    if (savedReminders) {
        try {
            AppState.reminders = JSON.parse(savedReminders);
            updateRemindersList();
            scheduleReminders();
        } catch (e) {
            console.error('Erreur lors du chargement des rappels:', e);
        }
    }
}

function saveReminders() {
    localStorage.setItem('erose_reminders', JSON.stringify(AppState.reminders));
}

function addReminder(reminder) {
    const newReminder = {
        id: Date.now(),
        title: reminder.title || 'Rappel de dépistage',
        date: reminder.date,
        type: reminder.type || 'general',
        notified: false,
        createdAt: new Date().toISOString()
    };
    
    AppState.reminders.push(newReminder);
    saveReminders();
    updateRemindersList();
    scheduleReminders();
    
    return newReminder;
}

function removeReminder(reminderId) {
    AppState.reminders = AppState.reminders.filter(r => r.id !== reminderId);
    saveReminders();
    updateRemindersList();
}

function updateRemindersList() {
    const remindersList = document.getElementById('remindersList');
    if (!remindersList) return;
    
    if (AppState.reminders.length === 0) {
        remindersList.innerHTML = `
            <p class="text-muted text-center py-4">
                <i class="far fa-calendar-plus d-block mb-2" style="font-size: 2rem;"></i>
                Aucun rappel programmé
            </p>
        `;
        return;
    }
    
    // Trier les rappels par date
    const sortedReminders = [...AppState.reminders].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    // Générer le HTML des rappels
    remindersList.innerHTML = `
        <div class="list-group">
            ${sortedReminders.map(reminder => `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${reminder.title}</h6>
                        <small class="text-muted">
                            <i class="far fa-calendar-alt me-1"></i>
                            ${new Date(reminder.date).toLocaleDateString('fr-FR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="app.removeReminder(${reminder.id})">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function scheduleReminders() {
    // Annuler toutes les notifications planifiées
    if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.showNotification) {
                // Planifier chaque rappel
                AppState.reminders.forEach(reminder => {
                    const reminderTime = new Date(reminder.date).getTime();
                    const now = new Date().getTime();
                    const delay = reminderTime - now;
                    
                    // Ne planifier que les rappels futurs
                    if (delay > 0 && !reminder.notified) {
                        setTimeout(() => {
                            // Envoyer une notification
                            showNotification(reminder.title, {
                                body: `Rappel : ${reminder.title}`,
                                icon: '/icons/icon-192x192.png',
                                vibrate: [200, 100, 200, 100, 200, 100, 200],
                                data: { url: '/' }
                            });
                            
                            // Marquer comme notifié
                            reminder.notified = true;
                            saveReminders();
                            updateRemindersList();
                            
                        }, delay);
                    }
                });
            }
        });
    }
}

// Afficher la modale d'ajout de rappel
function showReminderModal() {
    // Créer la modale
    const modalHTML = `
        <div class="modal fade" id="reminderModal" tabindex="-1" aria-labelledby="reminderModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="reminderModalLabel">Ajouter un rappel</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                    </div>
                    <div class="modal-body">
                        <form id="reminderForm">
                            <div class="mb-3">
                                <label for="reminderTitle" class="form-label">Titre du rappel</label>
                                <input type="text" class="form-control" id="reminderTitle" 
                                       value="Rappel de dépistage" required>
                            </div>
                            <div class="mb-3">
                                <label for="reminderDate" class="form-label">Date et heure</label>
                                <input type="datetime-local" class="form-control" id="reminderDate" required>
                            </div>
                            <div class="mb-3">
                                <label for="reminderType" class="form-label">Type de dépistage</label>
                                <select class="form-select" id="reminderType">
                                    <option value="mammography">Mammographie</option>
                                    <option value="pap_test">Frottis cervico-utérin</option>
                                    <option value="consultation">Consultation médicale</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-pink" id="saveReminderBtn">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter la modale au DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Initialiser la modale Bootstrap
    const modalElement = document.getElementById('reminderModal');
    const modal = new bootstrap.Modal(modalElement);
    
    // Définir la date minimale à aujourd'hui
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000; // en millisecondes
    const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
    document.getElementById('reminderDate').min = localISOTime;
    
    // Définir une date par défaut (demain à 9h)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const tomorrowISOTime = new Date(tomorrow - timezoneOffset).toISOString().slice(0, 16);
    document.getElementById('reminderDate').value = tomorrowISOTime;
    
    // Gérer l'enregistrement du rappel
    document.getElementById('saveReminderBtn').addEventListener('click', () => {
        const title = document.getElementById('reminderTitle').value;
        const date = document.getElementById('reminderDate').value;
        const type = document.getElementById('reminderType').value;
        
        if (!title || !date) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        // Ajouter le rappel
        addReminder({
            title,
            date: new Date(date).toISOString(),
            type
        });
        
        // Fermer la modale
        modal.hide();
        
        // Nettoyer
        setTimeout(() => {
            document.body.removeChild(modalContainer);
        }, 500);
    });
    
    // Afficher la modale
    modal.show();
    
    // Nettoyer après la fermeture
    modalElement.addEventListener('hidden.bs.modal', function () {
        document.body.removeChild(modalContainer);
    });
}

// Gestion de l'audio
function initAudio() {
    // Vérifier si la synthèse vocale est disponible
    if (!AppState.speechSynthesis) {
        console.warn('La synthèse vocale n\'est pas supportée par ce navigateur');
        const audioToggle = document.getElementById('audioToggle');
        if (audioToggle) {
            audioToggle.disabled = true;
            audioToggle.title = 'Synthèse vocale non supportée';
        }
        return false;
    }
    
    // Charger l'état audio depuis le stockage local
    const savedAudioState = localStorage.getItem('erose_audio_enabled');
    if (savedAudioState !== null) {
        AppState.isAudioEnabled = savedAudioState === 'true';
        updateAudioButton();
    }
    
    return true;
}

function toggleAudio() {
    AppState.isAudioEnabled = !AppState.isAudioEnabled;
    localStorage.setItem('erose_audio_enabled', AppState.isAudioEnabled);
    updateAudioButton();
    
    if (AppState.isAudioEnabled) {
        // Lire un message de bienvenue
        speak('Bienvenue sur e-Rose, votre application de suivi de dépistage.');
    }
}

function updateAudioButton() {
    const audioToggle = document.getElementById('audioToggle');
    if (!audioToggle) return;
    
    if (AppState.isAudioEnabled) {
        audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        audioToggle.title = 'Désactiver la lecture vocale';
    } else {
        audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        audioToggle.title = 'Activer la lecture vocale';
    }
}

function speak(text, lang = 'fr-FR') {
    if (!AppState.isAudioEnabled || !AppState.speechSynthesis) return;
    
    // Arrêter toute lecture en cours
    AppState.speechSynthesis.cancel();
    
    // Créer un nouvel énoncé
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Gérer les erreurs
    utterance.onerror = (event) => {
        console.error('Erreur de synthèse vocale:', event);
    };
    
    // Lire le texte
    AppState.speechSynthesis.speak(utterance);
}

// Gestion du thème
function initTheme() {
    // Vérifier le thème du système
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Appliquer le thème initial
    updateTheme(prefersDarkScheme.matches);
    
    // Écouter les changements de thème
    prefersDarkScheme.addListener((e) => {
        updateTheme(e.matches);
    });
}

function updateTheme(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
}

// Gestion des langues
function toggleLanguage() {
    const newLang = AppState.currentLanguage === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
}

function setLanguage(lang) {
    if (!CONFIG.supportedLanguages.includes(lang)) {
        console.warn(`Langue non supportée: ${lang}`);
        return;
    }
    
    AppState.currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Mettre à jour le bouton de langue
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.innerHTML = `<i class="fas fa-language"></i> ${lang.toUpperCase()}`;
    }
    
    // Charger les traductions si nécessaire
    if (!AppState.content[lang]) {
        loadTranslations(lang);
    } else {
        updateContentLanguage();
    }
    
    // Sauvegarder la préférence
    localStorage.setItem('erose_language', lang);
}

function loadTranslations(lang) {
    // Charger les traductions depuis un fichier JSON
    fetch(`/locales/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Traductions non trouvées');
            }
            return response.json();
        })
        .then(translations => {
            AppState.content[lang] = translations;
            updateContentLanguage();
        })
        .catch(error => {
            console.error('Erreur lors du chargement des traductions:', error);
            // Utiliser les traductions par défaut si disponibles
            if (lang !== CONFIG.defaultLanguage) {
                setLanguage(CONFIG.defaultLanguage);
            }
        });
}

function updateContentLanguage() {
    const lang = AppState.currentLanguage;
    const content = AppState.content[lang] || {};
    
    // Mettre à jour le contenu de la page avec les traductions
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedValue(content, key);
        
        if (translation !== undefined) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Mettre à jour les attributs de traduction
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
        const [attr, key] = element.getAttribute('data-i18n-attr').split(':');
        const translation = getNestedValue(content, key);
        
        if (translation !== undefined) {
            element.setAttribute(attr, translation);
        }
    });
    
    // Mettre à jour le titre de la page
    if (content.page_title) {
        document.title = content.page_title;
    }
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((o, p) => o && o[p], obj);
}

// Charger le contenu initial
function loadContent() {
    // Charger la langue sauvegardée ou détecter la langue du navigateur
    const savedLang = localStorage.getItem('erose_language');
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = CONFIG.supportedLanguages.includes(browserLang) ? browserLang : CONFIG.defaultLanguage;
    
    setLanguage(savedLang || defaultLang);
    
    // Charger d'autres contenus initiaux si nécessaire
    // ...
}

// Exposer les fonctions globales
window.app = {
    initApp,
    showNotification,
    addReminder,
    removeReminder,
    toggleAudio,
    speak,
    setLanguage,
    toggleLanguage,
    // ... autres fonctions à exposer
};

// Initialisation des composants après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les tooltips Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialiser les popovers Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});
