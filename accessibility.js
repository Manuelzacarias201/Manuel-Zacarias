document.addEventListener('DOMContentLoaded', function() {
    const accessibilityButton = document.querySelector('.accessibility-button');
    const panel = document.querySelector('.accessibility-panel');
    const options = document.querySelectorAll('.accessibility-option');
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
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('aria-modal', 'false');
            document.documentElement.classList.remove('accessibility-open');
            accessibilityButton.focus();
        }
    });

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