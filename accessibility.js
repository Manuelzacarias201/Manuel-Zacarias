document.addEventListener('DOMContentLoaded', function() {
    const accessibilityButton = document.querySelector('.accessibility-button');
    const panel = document.querySelector('.accessibility-panel');
    const options = document.querySelectorAll('.accessibility-option');
    const closeBtn = document.querySelector('.accessibility-close');
    
    if (!accessibilityButton || !panel) {
        return;
    }
    
    let fontSize = 100;
    let isReading = false;
    let currentUtterance = null;

    // Toggle panel
    function togglePanel(e) {
        if (e) {
            e.stopPropagation();
        }
        
        const isActive = panel.classList.toggle('active');
        panel.setAttribute('aria-hidden', String(!isActive));
        panel.setAttribute('aria-modal', isActive ? 'true' : 'false');
        
        if (isActive) {
            document.body.style.overflow = 'hidden';
            const firstBtn = panel.querySelector('.accessibility-option');
            if (firstBtn) firstBtn.focus();
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Exponer función globalmente para onclick
    window.toggleAccessibilityPanel = function() {
        togglePanel();
    };

    // Event listeners: centralizar en click + teclado
    function handleAccessibilityToggle(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        togglePanel(e);
    }
    
    // Click estándar
    accessibilityButton.addEventListener('click', handleAccessibilityToggle);
    // Teclado: Enter/Espacio
    accessibilityButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            handleAccessibilityToggle(e);
        }
    });
    
    if (closeBtn) {
        function handleClosePanel(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('aria-modal', 'false');
            document.body.style.overflow = '';
            accessibilityButton.focus();
        }
        
        // Click estándar
        closeBtn.addEventListener('click', handleClosePanel);
        // Teclado: Enter/Espacio
        closeBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                handleClosePanel(e);
            }
        });
    }

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (panel.classList.contains('active') && 
            !panel.contains(e.target) && 
            !accessibilityButton.contains(e.target)) {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('aria-modal', 'false');
            document.body.style.overflow = '';
        }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('aria-modal', 'false');
            document.body.style.overflow = '';
            accessibilityButton.focus();
        }
    });

    // Funcionalidad para ejecutar acciones
    function executeAction(option) {
        const action = option.dataset.action;
        const change = option.dataset.change;
        
        // Actualizar estado visual del botón
        if (action !== 'fontSize' && action !== 'reset') {
            option.classList.toggle('active');
        }
        
        switch(action) {
            case 'fontSize':
                if (change === 'increase' && fontSize < 200) {
                    fontSize += 10;
                } else if (change === 'decrease' && fontSize > 70) {
                    fontSize -= 10;
                }
                document.documentElement.style.fontSize = fontSize + '%';
                localStorage.setItem('accessibility-fontSize', fontSize);
                break;
                
            case 'contrast':
                document.body.classList.toggle('high-contrast');
                const hasContrast = document.body.classList.contains('high-contrast');
                localStorage.setItem('accessibility-contrast', hasContrast);
                break;
                
            case 'dyslexic':
                document.body.classList.toggle('dyslexic-font');
                const hasDyslexic = document.body.classList.contains('dyslexic-font');
                localStorage.setItem('accessibility-dyslexic', hasDyslexic);
                break;
                
            case 'stop-animations':
                document.body.classList.toggle('stop-animations');
                const hasNoAnimations = document.body.classList.contains('stop-animations');
                localStorage.setItem('accessibility-no-animations', hasNoAnimations);
                break;
                
            case 'reset':
                fontSize = 100;
                document.documentElement.style.fontSize = '100%';
                document.body.classList.remove('high-contrast', 'dyslexic-font', 'stop-animations');
                options.forEach(opt => opt.classList.remove('active'));
                // Limpiar solo llaves de accesibilidad
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('accessibility-')) localStorage.removeItem(key);
                });
                break;
        }
    }

    // Funcionalidades de accesibilidad - Click estándar
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            executeAction(option);
        });
    });

    // Cargar preferencias guardadas
    function loadPreferences() {
        const savedFontSize = localStorage.getItem('accessibility-fontSize');
        if (savedFontSize) {
            fontSize = parseInt(savedFontSize);
            document.documentElement.style.fontSize = fontSize + '%';
        }
        
        if (localStorage.getItem('accessibility-contrast') === 'true') {
            document.body.classList.add('high-contrast');
            document.querySelector('[data-action="contrast"]')?.classList.add('active');
        }
        
        if (localStorage.getItem('accessibility-dyslexic') === 'true') {
            document.body.classList.add('dyslexic-font');
            document.querySelector('[data-action="dyslexic"]')?.classList.add('active');
        }
        
        if (localStorage.getItem('accessibility-no-animations') === 'true') {
            document.body.classList.add('stop-animations');
            document.querySelector('[data-action="stop-animations"]')?.classList.add('active');
        }
    }
    
    loadPreferences();
});
