// Инициализация сайта
document.addEventListener('DOMContentLoaded', function() {
    console.log('💍 Свадебный сайт Екатерины и Сергея загружен');
    
    // Плавный скролл вниз
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
    
    // Наблюдатель для анимации таймлайна
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 200);
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => observer.observe(item));
    
    // Создание плавающих декоративных элементов
    function createFloatingElements() {
        const elements = ['❤️', '✨', '💍', '🌸', '🌿', '🌟', '💫', '🍃'];
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            if (section.id === 'hero') return;
            
            for (let i = 0; i < 4; i++) {
                const el = document.createElement('div');
                el.className = 'floating-element';
                el.innerHTML = elements[Math.floor(Math.random() * elements.length)];
                
                el.style.top = Math.random() * 80 + 10 + '%';
                el.style.left = Math.random() * 90 + 5 + '%';
                el.style.fontSize = Math.random() * 25 + 15 + 'px';
                el.style.opacity = Math.random() * 0.2 + 0.1;
                el.style.animationDuration = Math.random() * 25 + 15 + 's';
                el.style.animationDelay = Math.random() * 5 + 's';
                
                section.appendChild(el);
            }
        });
    }
    
    createFloatingElements();
    
    // Консоль-приветствие
    console.log('%c❤️💚💛 ДОБРО ПОЖАЛОВАТЬ НА НАШУ СВАДЬБУ! 💛💚❤️', 
        'color: #d4af37; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px #000;');
    console.log('%c"Лучшая любовь — та, которая пробуждает душу"', 
        'color: #0d5c46; font-size: 16px; font-style: italic; margin: 10px 0;');
    console.log('%c— Николас Спар克斯', 
        'color: #b86d6d; font-size: 14px; margin-left: 40px;');
    console.log('%cСайт создан с любовью и заботой о каждом госте', 
        'color: #666; font-size: 14px; margin-top: 20px;');
    console.log('%cС нетерпением ждём 07.08.2026 года!', 
        'color: #d4af37; font-size: 14px; font-weight: bold;');
    console.log('%cС любовью, Екатерина и Сергей 💍', 
        'color: #0d5c46; font-size: 14px; font-style: italic;');
});

// Добавление CSS анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes floatElement {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.2;
        }
        25% {
            transform: translate(20px, -30px) rotate(90deg);
            opacity: 0.4;
        }
        50% {
            transform: translate(-15px, 20px) rotate(180deg);
            opacity: 0.2;
        }
        75% {
            transform: translate(30px, 15px) rotate(270deg);
            opacity: 0.4;
        }
    }
    
    .floating-element {
        position: absolute;
        font-size: 20px;
        opacity: 0.3;
        z-index: 0;
        pointer-events: none;
        animation: floatElement 20s linear infinite;
    }
`;
document.head.appendChild(style);