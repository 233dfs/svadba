document.addEventListener('DOMContentLoaded', function() {
    console.log('Свадебный сайт Екатерины и Сергея загружен!');
    
    // 1. Анимация появления элементов при скролле
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми секциями
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Наблюдаем за элементами таймлайна отдельно
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // 2. Обработка формы RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Собираем данные формы
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());
            
            // Валидация
            if (!data.name || !data.name.trim()) {
                alert('Пожалуйста, введите ваше имя и фамилию');
                return;
            }
            
            if (!document.querySelector('input[name="walk"]:checked')) {
                alert('Пожалуйста, укажите, будете ли вы на прогулке');
                return;
            }
            
            if (!document.querySelector('input[name="banquet"]:checked')) {
                alert('Пожалуйста, укажите, будете ли вы на банкете');
                return;
            }
            
            // Показываем сообщение об успехе
            const submitBtn = rsvpForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
            submitBtn.disabled = true;
            
            // Имитация отправки (в реальности здесь будет отправка на сервер)
            setTimeout(() => {
                // В реальном сайте здесь должен быть код отправки на Formspree, EmailJS или ваш бэкенд
                // Например, для Formspree:
                // fetch('https://formspree.io/f/your-form-id', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // })
                
                // Показываем сообщение об успехе
                alert(`Спасибо, ${data.name.split(' ')[0]}! Ваш ответ успешно сохранён.\n\nМы свяжемся с вами для подтверждения. Ожидайте приглашение в Telegram-канал!`);
                
                // Очистка формы
                rsvpForm.reset();
                
                // Возвращаем кнопку в исходное состояние
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Плавный скролл к телеграм-кнопке
                document.querySelector('.telegram-invite').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
            }, 1500);
        });
    }

    // 3. Анимация для плавающих фото
    const floatingPhotos = document.querySelectorAll('.floating');
    floatingPhotos.forEach(photo => {
        photo.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.35)';
        });
        
        photo.addEventListener('mouseleave', function() {
            this.style.zIndex = '2';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.25)';
        });
    });

    // 4. Добавляем текущую дату в форму (опционально)
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ru-RU');
    const dateField = document.createElement('input');
    dateField.type = 'hidden';
    dateField.name = 'submission_date';
    dateField.value = formattedDate;
    if (rsvpForm) {
        rsvpForm.appendChild(dateField);
    }

    // 5. Плавный скролл для всех внутренних ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Добавляем эффект параллакса для некоторых секций (опционально)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.childhood-section, .wishes-section');
        
        parallaxElements.forEach(element => {
            const rate = scrolled * 0.1;
            element.style.backgroundPosition = center ${rate}px;
        });
    });

    // 7. Консоль-приветствие для любопытных гостей
    console.log('%c❤️ Дорогой гость! ❤️', 'color: #b86d6d; font-size: 18px; font-weight: bold;');
    console.log('%cСпасибо, что заглянули в код нашего свадебного сайта!', 'color: #2d5a4a; font-size: 14px;');
    console.log('%cМы с Катей очень ждём этого дня и вашего присутствия!', 'color: #2d5a4a; font-size: 14px;');
    console.log('%cС любовью, Сергей', 'color: #b86d6d; font-size: 14px; font-style: italic;');
});

// 8. Функция для отправки данных на почту (упрощенный вариант)
function sendEmail(data) {
    // В реальном сайте используйте EmailJS, Formspree или другой сервис
    // Пример для EmailJS:
    /*
    emailjs.send('service_id', 'template_id', {
        to_name: 'Екатерина и Сергей',
        from_name: data.name,
        message: `Новый ответ от гостя!
        Имя: ${data.name}
        Email: ${data.email || 'не указан'}
        Телефон: ${data.phone || 'не указан'}
        Прогулка: ${data.walk}
        Банкет: ${data.banquet}
        Аллергии: ${data.allergy || 'нет'}
        Пожелания: ${data.message || 'нет'}`
    })
    .then(() => console.log('Email отправлен!'))
    .catch(error => console.error('Ошибка отправки:', error));
    */
}
