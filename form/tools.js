// === ФЕЄРВЕРК ===
function launchConfetti(particleCount, scalar, origin) {
  confetti({
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#007aff', '#ff3b30', '#c70039', '#ffcc00', '#ffffff'],
    particleCount,
    scalar,
    origin
  });
}

function fireSmallConfetti() {
  launchConfetti(80, 0.8, { x: 0.2, y: 0.3 });
  launchConfetti(80, 0.8, { x: 0.8, y: 0.3 });
  setTimeout(() => launchConfetti(100, 1, { x: 0.5, y: 0.5 }), 100);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(fireSmallConfetti, 500);
});

// === TOAST (локальний попап) ===
function createToastElement(message) {
  const div = document.createElement('div');
  div.className = 'toast-popup';
  div.textContent = message;
  div.setAttribute('role', 'status');
  div.setAttribute('aria-live', 'polite');
  document.body.appendChild(div);
  return div;
}

function showToast(message, anchorRect = null, duration = 1200) {
  const toast = createToastElement(message);

  requestAnimationFrame(() => {
    if (anchorRect) {
      const toastRect = toast.getBoundingClientRect();
      let left = anchorRect.left + (anchorRect.width / 2) - (toastRect.width / 2);
      let top = anchorRect.top - toastRect.height - 12;

      const padding = 8;
      left = Math.max(padding, Math.min(left, window.innerWidth - toastRect.width - padding));
      if (top < padding) top = anchorRect.bottom + 12;

      toast.style.left = (left + toastRect.width / 2) + 'px';
      toast.style.top = (top + toastRect.height / 2) + 'px';
      toast.style.transform = 'translate(-50%, -50%) scale(0.98)';
    } else {
      toast.style.left = '50%';
      toast.style.top = '40%';
      toast.style.transform = 'translate(-50%, -50%) scale(0.98)';
    }

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 260);
    }, duration);
  });
}

// === КОПІЮВАННЯ КАРТКИ ===
const cardNumberInput = document.getElementById('cardNumberInput');
cardNumberInput?.addEventListener('click', async () => {
  cardNumberInput.select();
  const text = cardNumberInput.value;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Номер картки скопійовано', cardNumberInput.getBoundingClientRect(), 1400);
  } catch {
    try {
      document.execCommand('copy');
      showToast('Номер картки скопійовано', cardNumberInput.getBoundingClientRect(), 1400);
    } catch {
      showToast('Скопіюйте номер вручну', cardNumberInput.getBoundingClientRect(), 2000);
    }
  }
});

// === КОПІЮВАННЯ ПРОМОКОДУ ===
const promoCodeBox = document.getElementById('promoCodeBox');
promoCodeBox?.addEventListener('click', async () => {
  const code = promoCodeBox.textContent.trim();
  try {
    await navigator.clipboard.writeText(code);
    promoCodeBox.textContent = 'Скопійовано!';
    promoCodeBox.setAttribute('aria-pressed', 'true');
    showToast('Промокод скопійовано', promoCodeBox.getBoundingClientRect(), 1200);
    setTimeout(() => {
      promoCodeBox.textContent = 'PROMO123';
      promoCodeBox.setAttribute('aria-pressed', 'false');
    }, 1000);
  } catch {
    showToast('Промокод не скопійовано — скопіюйте вручну', promoCodeBox.getBoundingClientRect(), 1800);
  }
});

// === КНОПКА КВИТАНЦІЇ ===
document.getElementById("uploadReceiptBtn")?.addEventListener('click', (e) => {
  e.preventDefault();
  fireSmallConfetti();
  showToast('Готово — завантаження відкрито', null, 1400);
  // Тут можна додати відкриття модалки/файлового діалогу
});

// === INPUTMASK ===
Inputmask({ mask: "99.99.9999", placeholder: "дд.мм.рррр" }).mask(document.getElementById('birthdate'));
Inputmask({ mask: "+38(999)999-99-99", placeholder: "+38(___)___-__-__" }).mask(document.getElementById('phone'));
Inputmask({ alias: "email", placeholder: "example@mail.com" }).mask(document.getElementById('email'));

// === JQUERY + TOASTR (форма бронювання) ===
$(function () {
  toastr.options = { "positionClass": "toast-top-left", "timeOut": "3000" };

  const problems = ['Депресія', 'Тривожно-фобiчнi розлади', 'ОКР', 'Розлади харчовоi поведiнки', 'Інше'];
  const dates = [
    { date: '2025-10-01', slots: ['10:00','15:00','20:30'] },
    { date: '2025-10-02', slots: ['10:00','15:00','20:30'] },
    { date: '2025-10-03', slots: ['10:00','15:00','20:30'] },
  ];

  // Проблеми
  const problemContainer = $('#problemButtons');
  problems.forEach(p => {
    const btn = $(`<button type="button" class="btn btn-outline-primary btn-sm">${p}</button>`);
    btn.on('click', function () {
      $('#problem').val(p);
      problemContainer.find('button').removeClass('active');
      $(this).addClass('active');
    });
    problemContainer.append(btn);
  });

  // Дати та слоти
  const datesContainer = $('#datesSlots');
  dates.forEach(d => {
    const collapseId = 'collapse_' + d.date.replace(/-/g, '');
    const card = $(`
      <div class="card mb-2 date-card">
        <div class="card-header p-2 d-flex justify-content-between align-items-center"
             data-bs-toggle="collapse" data-bs-target="#${collapseId}">
          <span class="date-text">${d.date}</span>
          <span class="toggle-icon">▸</span>
        </div>
        <div id="${collapseId}" class="collapse">
          <div class="card-body d-flex flex-wrap gap-2"></div>
        </div>
      </div>
    `);

    d.slots.forEach(slot => {
      const slotBtn = $(`<button type="button" class="btn btn-outline-success btn-sm">${slot}</button>`);
      slotBtn.on('click', function () {
        $('.date-card .card-body button').removeClass('active');
        $('#selectedDate').val(d.date);
        $('#selectedSlot').val(slot);
        $(this).addClass('active');
      });
      card.find('.card-body').append(slotBtn);
    });

    datesContainer.append(card);
  });

  // Валідація та відправка
  function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  $('#bookingForm').on('submit', function (e) {
    e.preventDefault();
    const data = {
      name: $('#name').val().trim(),
      surname: $('#surname').val().trim(),
      patronymic: $('#patronymic').val().trim(),
      birthdate: $('#birthdate').val().trim(),
      phone: $('#phone').val().trim(),
      email: $('#email').val().trim(),
      problem: $('#problem').val(),
      doctor: $('#doctorName').val(),
      date: $('#selectedDate').val(),
      slot: $('#selectedSlot').val(),
      promo: 'PROMO123'
    };

    if (!data.name) return toastr.error("Вкажіть ім'я.");
    if (!data.surname) return toastr.error("Вкажіть прізвище.");
    if (!data.birthdate || data.birthdate.includes('_')) return toastr.error("Вкажіть коректну дату народження.");
    if (!data.phone || data.phone.includes('_')) return toastr.error("Вкажіть коректний телефон.");
    if (!data.email || !validateEmail(data.email)) return toastr.error("Вкажіть коректний Email.");
    if (!data.problem) return toastr.warning("Оберіть тему консультації.");
    if (!data.date || !data.slot) return toastr.warning("Оберіть дату та час.");

    toastr.success("Ваше бронювання успішно прийнято! Знижку застосовано.");
    console.log("Booking data:", data);

    this.reset();
    $('#problem, #selectedDate, #selectedSlot').val('');
    $('.btn.active').removeClass('active');
  });
});
