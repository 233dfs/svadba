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
    
    // Обработка формы RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация обязательных полей
            const requiredInputs = this.querySelectorAll('input[required]');
            let isValid = true;
            
            // Проверка текстовых полей
            requiredInputs.forEach(input => {
                if (input.type !== 'radio' && !input.value.trim()) {
                    input.style.borderColor = '#ff6b6b';
                    input.style.animation = 'shake 0.5s ease';
                    isValid = false;
                    
                    setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.animation = '';
                    }, 500);
                }
            });
            
            // Проверка радиокнопок (отдельные группы)
            const radioGroups = [
                { name: 'guests', message: 'Укажите количество гостей' },
                { name: 'walk', message: 'Выберите вариант прогулки' },
                { name: 'banquet', message: 'Подтвердите участие в банкете' }
            ];
            
            radioGroups.forEach(group => {
                const radios = this.querySelectorAll(`input[name="${group.name}"]`);
                const isChecked = this.querySelector(`input[name="${group.name}"]:checked`);
                
                if (!isChecked) {
                    // Найдём родительский контейнер радиокнопок
                    const radioContainer = radios[0]?.closest('.radio-group');
                    if (radioContainer) {
                        radioContainer.style.border = '2px solid #ff6b6b';
                        radioContainer.style.borderRadius = '10px';
                        radioContainer.style.padding = '15px';
                        radioContainer.style.marginTop = '10px';
                        
                        setTimeout(() => {
                            radioContainer.style.border = '';
                            radioContainer.style.padding = '';
                            radioContainer.style.marginTop = '';
                        }, 2000);
                    }
                    isValid = false;
                }
            });
            
            if (!isValid) {
                showMessage('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            // Анимация отправки
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            const originalWidth = submitBtn.offsetWidth;
            
            submitBtn.style.width = ${originalWidth}px;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Прогресс бар
            const progress = document.createElement('div');
            progress.style.position = 'absolute';progress.style.bottom = '0';
            progress.style.left = '0';
            progress.style.height = '4px';
            progress.style.background = 'linear-gradient(90deg, #d4af37, #0d5c46)';
            progress.style.width = '0%';
            progress.style.transition = 'width 1.5s ease';
            progress.style.borderRadius = '0 0 15px 15px';
            submitBtn.appendChild(progress);
            
            setTimeout(() => {
                progress.style.width = '100%';
            }, 100);
            
            // Получаем данные формы для персонализации
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());
            const firstName = data.name ? data.name.split(' ')[0] : 'друг';
            
            // ОТПРАВКА ЧЕРЕЗ EMAILJS С ВАШИМИ КЛЮЧАМИ
            emailjs.sendForm('Wedding RSVP', 'template_nnbwq7d', this)
                .then((response) => {
                    console.log('✅ Письмо отправлено успешно!', response.status, response.text);
                    
                    // Успешная отправка
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Успешно отправлено!';
                    submitBtn.style.background = 'linear-gradient(135deg, #0a4a38, #0d5c46)';
                    
                    // Конфетти
                    createConfetti();
                    
                    // Показ красивого сообщения
                    showMessage(`
                        💖 Спасибо, ${firstName}!
                        
                        Ваш ответ сохранён и отправлен нам.
                        Мы уже заносим вас в список самых дорогих гостей!
                        
                        <small>Ожидайте приглашение в Telegram-канал в ближайшее время</small>
                    `, 'success');
                    
                    // Очистка формы с анимацией
                    setTimeout(() => {
                        this.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.width = '';
                        submitBtn.style.background = 'linear-gradient(135deg, var(--emerald), #0a4a38)';
                        submitBtn.disabled = false;
                        
                        if (progress.parentNode) {
                            progress.parentNode.removeChild(progress);
                        }
                        
                        // Обновляем скрытое поле с датой
                        document.getElementById('currentDate').value = new Date().toLocaleDateString('ru-RU');
                    }, 2000);
                    
                    // Скролл к телеграм-секции
                    setTimeout(() => {
                        const telegramSection = document.querySelector('.telegram-section');
                        if (telegramSection) {
                            telegramSection.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        }
                    }, 2500);
                    
                })
                .catch((error) => {
                    console.error('❌ Ошибка EmailJS:', error);
                    
                    // Откат к имитации если EmailJS не настроен
                    if (error.text && (error.text.includes('Public Key')  error.text.includes('Invalid template')  error.text.includes('Invalid service'))) {
                        console.warn('EmailJS не настроен, используем тестовый режим');
                        
                        // Тестовый режим - сохранение в localStorage
                        submitBtn.innerHTML = '<i class="fas fa-check"></i> Успешно (тест)!';
                        submitBtn.style.background = 'linear-gradient(135deg, #0a4a38, #0d5c46)';
                        
                        createConfetti();
                        
                        showMessage(`💖 Спасибо, ${firstName}!
                            
                            Ваш ответ сохранён (тестовый режим).
                            На реальном сайте он будет отправлен нам.
                        `, 'warning');
                        
                        // Сохраняем в localStorage для тестирования
                        saveToLocalStorage(data);
                        
                        setTimeout(() => {
                            this.reset();
                            submitBtn.innerHTML = originalText;
                            submitBtn.style.width = '';
                            submitBtn.style.background = 'linear-gradient(135deg, var(--emerald), #0a4a38)';
                            submitBtn.disabled = false;
                            
                            if (progress.parentNode) {
                                progress.parentNode.removeChild(progress);
                            }
                            
                            // Обновляем скрытое поле с датой
                            document.getElementById('currentDate').value = new Date().toLocaleDateString('ru-RU');
                        }, 2000);
                        
                    } else {
                        // Реальная ошибка отправки
                        submitBtn.innerHTML = '<i class="fas fa-times"></i> Ошибка';
                        submitBtn.style.background = 'linear-gradient(135deg, #b86d6d, #a55a5a)';
                        
                        showMessage('❌ Ошибка отправки. Пожалуйста, позвоните нам: +7 (900) 515-29-94', 'error');
                        
                        setTimeout(() => {
                            submitBtn.innerHTML = originalText;
                            submitBtn.style.background = 'linear-gradient(135deg, var(--emerald), #0a4a38)';
                            submitBtn.disabled = false;
                            
                            if (progress.parentNode) {
                                progress.parentNode.removeChild(progress);
                            }
                        }, 3000);
                    }
                });
        });
    }
    
    // Анимация при наведении на поля формы
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    formInputs.forEach(input => {
        const parent = input.closest('.form-group');
        
        input.addEventListener('focus', function() {
            if (parent) {
                parent.style.transform = 'translateY(-5px)';
                parent.style.transition = 'transform 0.3s ease';
            }
        });
        
        input.addEventListener('blur', function() {
            if (parent) {
                parent.style.transform = '';
            }
        });
    });
    
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
    
    // Показываем количество ответов из localStorage
    showResponseCount();
// Консоль-приветствие
    console.log('%c❤️💚💛 ДОБРО ПОЖАЛОВАТЬ НА НАШУ СВАДЬБУ! 💛💚❤️', 
        'color: #d4af37; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px #000;');
    console.log('%c"Лучшая любовь — та, которая пробуждает душу"', 
        'color: #0d5c46; font-size: 16px; font-style: italic; margin: 10px 0;');
    console.log('%c— Николас Спаркс', 
        'color: #b86d6d; font-size: 14px; margin-left: 40px;');
    console.log('%cСайт создан с любовью и заботой о каждом госте', 
        'color: #666; font-size: 14px; margin-top: 20px;');
    console.log('%cС нетерпением ждём 07.08.2026 года!', 
        'color: #d4af37; font-size: 14px; font-weight: bold;');
    console.log('%cС любовью, Екатерина и Сергей 💍', 
        'color: #0d5c46; font-size: 14px; font-style: italic;');
});

// Сохранение в localStorage для тестирования
function saveToLocalStorage(data) {
    try {
        let responses = JSON.parse(localStorage.getItem('wedding_responses')) || [];
        data.timestamp = new Date().toISOString();
        responses.push(data);
        localStorage.setItem('wedding_responses', JSON.stringify(responses));
        
        console.log('✅ Ответ сохранён в localStorage:', data);
        console.log(`📊 Всего ответов: ${responses.length}`);
        
        // Показываем в консоли все ответы
        responses.forEach((response, index) => {
            console.log(`${index + 1}. ${response.name} - ${response.timestamp}`);
        });
    } catch (e) {
        console.error('❌ Ошибка сохранения в localStorage:', e);
    }
}

// Показать количество ответов
function showResponseCount() {
    try {
        const responses = JSON.parse(localStorage.getItem('wedding_responses')) || [];
        if (responses.length > 0) {
            console.log(`📊 Всего тестовых ответов: ${responses.length}`);
            
            // Можно добавить отображение на странице (опционально)
            const responseInfo = document.createElement('div');
            responseInfo.id = 'test-response-counter';
            responseInfo.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(13, 92, 70, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
                font-size: 12px;
                z-index: 1000;
                font-family: 'Montserrat', sans-serif;
                border: 1px solid #d4af37;
                display: none; /* Скрыто по умолчанию */
            `;
            responseInfo.innerHTML = Тестовых ответов: ${responses.length};
            document.body.appendChild(responseInfo);
            
            // Показать только если есть ответы и в тестовом режиме
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('test') || responses.length > 0) {
                responseInfo.style.display = 'block';
                setTimeout(() => {
                    responseInfo.style.display = 'none';
                }, 5000);
            }
        }
    } catch (e) {
        console.error('❌ Ошибка чтения localStorage:', e);
    }
}

// Анимация конфетти
function createConfetti() {
    const colors = ['#d4af37', '#ffd166', '#0d5c46', '#b86d6d', '#ffffff'];
    const confettiCount = 120;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 12px;
            height: 12px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            top: -20px;
            left: ${Math.random() * 100}vw;
            opacity: 0.9;
            z-index: 9999;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            {
                transform: translate(0, 0) rotate(0deg),
                opacity: 1},
            {
                transform: translate(${Math.random() * 100 - 50}px, 100vh) rotate(${Math.random() * 360}deg),
                opacity: 0
            }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Показ всплывающих сообщений
function showMessage(text, type) {
    const message = document.createElement('div');
    message.innerHTML = text;
    message.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: ${type === 'success' ? '#0d5c46' : 
                     type === 'error' ? '#b86d6d' : 
                     type === 'warning' ? '#d4af37' : '#0d5c46'};
        color: white;
        padding: 25px 40px;
        border-radius: 15px;
        box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        font-size: 1.2rem;
        line-height: 1.6;
        border: 2px solid ${type === 'success' ? '#d4af37' : 
                          type === 'error' ? '#ff6b6b' : 
                          type === 'warning' ? '#ffd166' : '#d4af37'};
        max-width: 500px;
        width: 90vw;
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        font-family: 'Montserrat', sans-serif;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    setTimeout(() => {
        message.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => message.remove(), 500);
    }, 4000);
}

// Добавление CSS анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
    
    @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .floating-element {
        position: absolute;
        font-size: 20px;
        opacity: 0.3;
        z-index: 0;
        pointer-events: none;
        animation: floatElement 20s linear infinite;
    }
    
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
`;
document.head.appendChild(style);