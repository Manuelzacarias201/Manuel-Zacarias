document.addEventListener('DOMContentLoaded', function() {
    const accessibilityButton = document.querySelector('.accessibility-button');
    const panel = document.querySelector('.accessibility-panel');
    const options = document.querySelectorAll('.accessibility-option');
<<<<<<< HEAD
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

    // Event listeners - Mejorado para móvil
    accessibilityButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        togglePanel(e);
    }, true);
    
    accessibilityButton.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    }, { passive: true });
    
    accessibilityButton.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        togglePanel(e);
    }, { passive: false });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('aria-modal', 'false');
            document.body.style.overflow = '';
            accessibilityButton.focus();
        });
        
        closeBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('aria-modal', 'false');
            document.body.style.overflow = '';
        }, { passive: false });
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
=======
    const profiles = document.querySelectorAll('.profile-btn');
    // Debug: registrar elementos encontrados
    console.log('[accessibility] DOM loaded. button=', accessibilityButton, 'panel=', panel);
    if (!accessibilityButton || !panel) {
        console.warn('[accessibility] Elementos faltantes: no se encontró botón o panel. Abortar inicialización.');
        return; // nothing to do if elements missing
    }
    let fontSize = 100;

    // Mostrar/ocultar panel (función reutilizable para click/pointer)
    // Usamos una pequeña ventana de bloqueo para evitar que el listener global lo cierre inmediatamente
    let suppressCloseUntil = 0;
    // Evitar doble-toggle por múltiples eventos (click + pointerdown + touchstart)
    let lastToggleAt = 0;
    function togglePanel(e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();
            // evitar que otros handlers globales procesen este evento
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        }
        // Debounce rápido para prevenir doble-toggle (destello)
        const now = Date.now();
        if (now - lastToggleAt < 350) {
            console.log('[accessibility] togglePanel ignored due to debounce');
            return;
        }
        lastToggleAt = now;
        console.log('[accessibility] togglePanel triggered by', e && e.type, 'target=', e && e.target);
        const isActive = panel.classList.toggle('active');
        panel.setAttribute('aria-hidden', String(!isActive));
        panel.setAttribute('aria-modal', isActive ? 'true' : 'false');
        // set suppression window so global pointerdown doesn't immediately close it
        suppressCloseUntil = Date.now() + 300; // 300ms
        // lock scroll when active (mobile modal)
        if (isActive) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.documentElement.classList.add('accessibility-open');
            // focus management: focus first button
            const firstBtn = panel.querySelector('.accessibility-option, .profile-btn');
            if (firstBtn) firstBtn.focus();
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.documentElement.classList.remove('accessibility-open');
        }
    }

    // Usar click como primaria y touchstart como fallback en móviles. Evitamos pointerdown para prevenir doble disparo.
    accessibilityButton.addEventListener('click', togglePanel);
    // Agregar touchstart para compatibilidad táctil / móviles antiguos (no preventDefault)
    accessibilityButton.addEventListener('touchstart', function(e){
        togglePanel(e);
    }, {passive: true});
    // prevent clicks inside panel from bubbling to document
    panel.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Cerrar panel al hacer clic fuera (pointerdown para compatibilidad táctil)
    document.addEventListener('pointerdown', (e) => {
        // Debug: registrar pointerdown global
        console.log('[accessibility] document.pointerdown target=', e.target, 'time=', Date.now());
        // Si estamos dentro de la ventana de supresión, ignorar (evita el 'destello')
        if (Date.now() < suppressCloseUntil) {
            console.log('[accessibility] pointerdown ignorado por suppressCloseUntil');
            return;
        }
        if (!e.target.closest('.accessibility-button') && !e.target.closest('.accessibility-panel')) {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('aria-modal', 'false');
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.documentElement.classList.remove('accessibility-open');
        }
    });

    // También escuchar touchend como fallback en algunos navegadores móviles
    document.addEventListener('touchend', (e) => {
        if (Date.now() < suppressCloseUntil) return;
        if (!e.target.closest('.accessibility-button') && !e.target.closest('.accessibility-panel')) {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('aria-modal', 'false');
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.documentElement.classList.remove('accessibility-open');
        }
    }, {passive: true});

    // Cerrar con tecla Escape
>>>>>>> origin/main
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('aria-modal', 'false');
<<<<<<< HEAD
            document.body.style.overflow = '';
=======
            document.documentElement.classList.remove('accessibility-open');
>>>>>>> origin/main
            accessibilityButton.focus();
        }
    });

<<<<<<< HEAD
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
                document.body.className = '';
                options.forEach(opt => opt.classList.remove('active'));
                localStorage.clear();
                break;
        }
    }

    // Funcionalidades de accesibilidad - Mejorado para móvil
    options.forEach(option => {
        // Click event
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            executeAction(option);
        });
        
        // Touch event para móvil
        option.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            executeAction(option);
        }, { passive: false });
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
=======
    // Estado para lectura
    let isReading = false;
    let currentUtterance = null;

    // Opciones de accesibilidad
    options.forEach(option => {
        option.addEventListener('click', () => {
            const action = option.dataset.action;
            switch(action) {
                case 'read':
                    if (isReading) {
                        window.speechSynthesis.cancel();
                        isReading = false;
                        currentUtterance = null;
                        return;
                    }
                    let text = '';
                    if (window.getSelection && window.getSelection().toString().trim()) {
                        text = window.getSelection().toString();
                    } else {
                        text = document.body.innerText;
                    }
                    currentUtterance = new SpeechSynthesisUtterance(text);
                    currentUtterance.lang = 'es-ES';
                    currentUtterance.onend = function() { isReading = false; };
                    window.speechSynthesis.speak(currentUtterance);
                    isReading = true;
                    break;
                case 'contrast':
                    document.body.classList.toggle('high-contrast');
                    break;
                case 'smart-contrast':
                    document.body.classList.toggle('smart-contrast');
                    break;
                case 'fontSize':
                    const change = option.dataset.change;
                    if (change === 'increase' && fontSize < 200) fontSize += 10;
                    if (change === 'decrease' && fontSize > 70) fontSize -= 10;
                    document.documentElement.style.fontSize = fontSize + '%';
                    break;
                case 'lineSpacing':
                    document.body.classList.toggle('increased-spacing');
                    break;
                case 'dyslexic':
                    document.body.classList.toggle('dyslexic-font');
                    break;
                case 'highlight-links':
                    document.body.classList.toggle('highlight-links');
                    break;
                case 'stop-animations':
                    document.body.classList.toggle('stop-animations');
                    break;
                case 'hide-images':
                    document.body.classList.toggle('hide-images');
                    break;
                case 'cursor':
                    document.body.classList.toggle('big-cursor');
                    break;
                case 'structure':
                    document.body.classList.toggle('show-structure');
                    break;
                case 'lineHeight':
                    document.body.classList.toggle('line-height');
                    break;
                case 'align-text':
                    document.body.classList.toggle('align-text');
                    break;
                case 'saturation':
                    document.body.classList.toggle('low-saturation');
                    break;
                case 'info':
                    showInfoTooltip('Este es un ejemplo de información de accesibilidad.');
                    break;
                case 'reset':
                    fontSize = 100;
                    document.documentElement.style.fontSize = '100%';
                    document.body.className = '';
                    removeInfoTooltip();
                    break;
            }
        });
        // Compatibilidad táctil: activar en touchend (evitar doble ejecución si click ya se dispara)
        option.addEventListener('touchend', (e) => {
            // si el click ya ocurrió por el touch, esto puede duplicar; usar small debounce
            e.stopPropagation();
            e.preventDefault && e.preventDefault();
            console.log('[accessibility] touchend on option', option.dataset.action);
            option.click();
        }, {passive: false});
    });

    // Perfiles de accesibilidad (solo ejemplo visual)
    profiles.forEach(profile => {
        profile.addEventListener('click', () => {
            alert('Perfil seleccionado: ' + profile.textContent.trim());
        });
        profile.addEventListener('touchend', (e) => {
            e.stopPropagation();
            e.preventDefault && e.preventDefault();
            console.log('[accessibility] touchend on profile', profile.dataset.profile);
            profile.click();
        }, {passive: false});
    });

    // Evitar que toques dentro del panel cierren la ventana (captura adicional para móviles)
    panel.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    }, {passive: true});

    // Listener en captura para depuración avanzada: quién recibe el primer touchstart
    document.addEventListener('touchstart', (e) => {
        // esto sólo registra para diagnóstico si todavía hay interferencias
        console.log('[accessibility][capture] document touchstart target=', e.target);
    }, {passive: true, capture: true});

    // Botón cerrar dentro del panel
    const closeBtn = document.querySelector('.accessibility-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('aria-modal', 'false');
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.documentElement.classList.remove('accessibility-open');
            accessibilityButton.focus();
        });
    }

    // Tooltip de información
    function showInfoTooltip(text) {
        removeInfoTooltip();
        const tooltip = document.createElement('div');
        tooltip.className = 'info-tooltip';
        tooltip.innerText = text;
        document.body.appendChild(tooltip);
        setTimeout(removeInfoTooltip, 4000);
    }
    function removeInfoTooltip() {
        const tooltip = document.querySelector('.info-tooltip');
        if (tooltip) tooltip.remove();
    }
});
>>>>>>> origin/main
