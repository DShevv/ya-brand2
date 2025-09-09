const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu__close");
const mobileMenuBuy = document.querySelector(".mobile-menu__buy");
const burger = document.querySelector(".burger");
const compare = document.querySelector(".compare");
const places = document.querySelector(".places");
const ticketsForm = document.querySelector(".tickets-form");

let address = "ул. Пушкинская 7, Брест";

let speakers = [];
let prices = [];
let programs = [];
let pros = [];

function handleScroll() {
  const windowHeight = window.innerHeight;
  const centerPosition = windowHeight / 2;

  const allElements = [...speakers, ...prices, ...programs, ...pros];

  allElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;

    if (Math.abs(elementCenter - centerPosition) < rect.height / 2) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
  });
}

document.addEventListener("click", (e) => {
  if (burger.contains(e.target)) {
    mobileMenu.classList.toggle("active");
  }

  if (mobileMenuClose.contains(e.target)) {
    mobileMenu.classList.remove("active");
  }

  if (e.target.classList.contains("mobile-menu__list-item")) {
    mobileMenu.classList.remove("active");
  }

  if (e.target.classList.contains("mobile-menu__info-button")) {
    mobileMenu.classList.remove("active");
  }

  if (e.target.classList.contains("mobile-menu")) {
    mobileMenu.classList.remove("active");
  }

  if (mobileMenuBuy.contains(e.target)) {
    mobileMenu.classList.remove("active");
  }

  if (e.target.classList.contains("mobile-menu__container")) {
    e.stopPropagation();
  }

  if (e.target.classList.contains("table-btn")) {
    compare.classList.add("active");
  }

  if (e.target.classList.contains("compare__img")) {
    e.stopPropagation();
  }

  if (e.target.classList.contains("places__img")) {
    e.stopPropagation();
  }

  if (e.target.classList.contains("compare__container")) {
    compare.classList.remove("active");
  }

  if (e.target.classList.contains("places-btn")) {
    places.classList.add("active");
  }

  if (e.target.classList.contains("places__container")) {
    places.classList.remove("active");
  }

  // Обработка кнопок "Купить билет" - только внутри блока prices открывают форму
  if (
    e.target.closest(".button-wide") &&
    e.target.closest(".button-wide").textContent.includes("Купить билет") &&
    e.target.closest(".prices")
  ) {
    e.preventDefault();
    ticketsForm.classList.add("active");
  }

  // Закрытие формы tickets-form при клике на фон
  if (e.target.classList.contains("tickets-form")) {
    ticketsForm.classList.remove("active");
  }

  // Предотвращение закрытия при клике на контейнер формы
  if (e.target.classList.contains("tickets-form__container")) {
    e.stopPropagation();
  }
});

function formatPhoneNumber(phone) {
  // Убираем все символы кроме цифр
  const cleaned = phone.replace(/[^\d]/g, "");

  // Проверяем длину и формат номера
  if (cleaned.length === 12 && cleaned.startsWith("375")) {
    return `+${cleaned.slice(0, 3)} (${cleaned.slice(3, 5)}) ${cleaned.slice(
      5,
      8
    )}-${cleaned.slice(8, 10)}-${cleaned.slice(10)}`;
  }

  // Если формат не соответствует, возвращаем исходный номер
  return phone;
}

async function getContacts() {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/public/contacts"
    );
    const data = await response.json();

    if (!data.contact) {
      console.error("Нет данных о контактах");
      return;
    }

    const contact = data.contact;

    address = contact.address;

    // Обновляем все элементы с адресом
    document.querySelectorAll(".address").forEach((element) => {
      element.textContent = contact.address;
    });

    // Обновляем все элементы с телефоном
    document.querySelectorAll(".phone").forEach((element) => {
      const formattedPhone = formatPhoneNumber(contact.phone);
      element.textContent = formattedPhone;
      if (element.tagName.toLowerCase() === "a") {
        element.href = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;
      }
    });

    // Обновляем все элементы с email
    document.querySelectorAll(".email").forEach((element) => {
      element.textContent = contact.email;
      if (element.tagName.toLowerCase() === "a") {
        element.href = `mailto:${contact.email}`;
      }
    });

    // Обновляем социальные сети
    const instagramLink = document.querySelectorAll('a[href="instagram"]');
    if (instagramLink && contact.instagram) {
      instagramLink.forEach((link) => {
        link.href = `${contact.instagram}`;
        link.target = "_blank";
      });
    }

    const telegramLink = document.querySelector(
      '.contacts__info-social-link[href="telegram"]'
    );
    if (telegramLink && contact.telegram) {
      telegramLink.href = `https://t.me/${contact.telegram}`;
      telegramLink.target = "_blank";
    }

    // Инициализируем карту после получения адреса
    initMap();
  } catch (error) {
    console.error("Ошибка при загрузке контактов:", error);
  }
}

// Функция инициализации main.js
function initializeMain() {
  speakers = document.querySelectorAll(".speakers__item");
  prices = document.querySelectorAll(".prices__item");
  programs = document.querySelectorAll(".program__item");
  pros = document.querySelectorAll(".pros__item");
  getContacts();

  window.addEventListener("scroll", handleScroll);
  handleScroll();
}

// Ждем загрузки API данных перед инициализацией main.js
if (window.apiDataLoaded) {
  initializeMain();
} else {
  window.addEventListener("apiDataLoaded", initializeMain);
}

async function initMap() {
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapMarker, YMapDefaultFeaturesLayer } =
    ymaps3;

  const { YMapDefaultMarker } = await ymaps3.import(
    "@yandex/ymaps3-markers@0.0.1"
  );

  // Ждем, пока адрес будет получен
  while (!address) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Создаем URL для геокодирования
  const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=e1f9579b-8502-438f-8273-6dff1fc98656&format=json&geocode=${encodeURIComponent(
    address
  )}`;

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    const coordinates =
      data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
        .split(" ")
        .map(Number); // Теперь получаем [долгота, широта]

    fetch("./assets/maps.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(coordinates, address);
        const map = new YMap(
          document.getElementById("place__map"),
          {
            location: {
              center: coordinates,
              zoom: 16,
            },
          },
          [
            new YMapDefaultSchemeLayer({
              customization: data,
            }),
            new YMapDefaultFeaturesLayer({}),
          ]
        );

        map.addChild(new YMapDefaultSchemeLayer({ customization: data }));
      });
  } catch (error) {
    console.error("Ошибка при геокодировании:", error);
  }
}

const partnersSwiper = new Swiper(".partners__swiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  slidesPerView: "auto",
  breakpoints: {
    768: {
      spaceBetween: 24,
    },
  },
  loop: true,
  speed: 3500,
  autoplay: {
    delay: 0,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
  },
});

const partnersSwiperReverse = new Swiper(".partners__swiper-reverse", {
  slidesPerView: 1,
  spaceBetween: 16,
  slidesPerView: "auto",
  breakpoints: {
    768: {
      spaceBetween: 24,
    },
  },
  loop: true,
  speed: 3500,
  autoplay: {
    delay: 0,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
    reverseDirection: true,
  },
});

// Переменная для хранения данных текущего тарифа
let currentTariff = null;

// Функция для получения текущего активного тарифа
function getCurrentTariff() {
  const activeTab = document.querySelector(".prices__tabs-item.active");
  if (activeTab && window.tarifsData) {
    const tariffId = activeTab.getAttribute("data-tariff-id");
    return window.tarifsData.tariffs.find((t) => t.id.toString() === tariffId);
  }
  return null;
}

// Функция отправки данных формы на API
async function submitTicketForm(formData) {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/tickets/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Ошибка при отправке формы:", error);
    throw error;
  }
}

// Функция валидации формы
function validateTicketsForm(form) {
  const errors = {};

  // Получаем поля формы
  const nameField = form.querySelector('input[name="FullName"]');
  const emailField = form.querySelector('input[name="Email"]');
  const phoneField = form.querySelector('input[name="Phone"]');
  const checkboxField = form.querySelector('input[name="checkbox"]');

  // Валидация имени
  if (!nameField.value.trim()) {
    errors.name = "Обязательное поле";
  } else if (nameField.value.trim().length < 2) {
    errors.name = "Минимум 2 символа";
  }

  // Валидация email
  if (!emailField.value.trim()) {
    errors.email = "Обязательное поле";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value.trim())) {
      errors.email = "Неверный формат";
    }
  }

  // Валидация телефона
  if (!phoneField.value.trim()) {
    errors.phone = "Обязательное поле";
  } else {
    const phoneRegex = /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phoneField.value.trim())) {
      errors.phone = "Неверный формат";
    }
  }

  // Валидация чекбокса
  if (!checkboxField.checked) {
    errors.checkbox = "Необходимо согласие";
  }

  return errors;
}

// Функция отображения ошибок
function showValidationErrors(form, errors) {
  // Сначала очищаем все ошибки
  clearValidationErrors(form);

  // Отображаем ошибки для каждого поля
  if (errors.name) {
    const nameInput = form
      .querySelector('input[name="FullName"]')
      .closest(".input");
    const nameTitle = nameInput.querySelector(".input__title");
    const nameField = nameInput.querySelector(".input__field");
    nameTitle.textContent = `ФИО* - ${errors.name}`;
    nameField.classList.add("error");
  }

  if (errors.email) {
    const emailInput = form
      .querySelector('input[name="Email"]')
      .closest(".input");
    const emailTitle = emailInput.querySelector(".input__title");
    const emailField = emailInput.querySelector(".input__field");
    emailTitle.textContent = `Email* - ${errors.email}`;
    emailField.classList.add("error");
  }

  if (errors.phone) {
    const phoneInput = form
      .querySelector('input[name="Phone"]')
      .closest(".input");
    const phoneTitle = phoneInput.querySelector(".input__title");
    const phoneField = phoneInput.querySelector(".input__field");
    phoneTitle.textContent = `Телефон* - ${errors.phone}`;
    phoneField.classList.add("error");
  }

  if (errors.checkbox) {
    const checkboxText = form.querySelector(".checkbox__text");
    checkboxText.innerHTML = `<span style="color: #BC0E0E;">${errors.checkbox}:</span> ${checkboxText.innerHTML}`;
  }
}

// Функция очистки ошибок
function clearValidationErrors(form) {
  // Восстанавливаем оригинальные заголовки полей и убираем класс error
  const nameInput = form
    .querySelector('input[name="FullName"]')
    .closest(".input");
  const nameTitle = nameInput.querySelector(".input__title");
  const nameField = nameInput.querySelector(".input__field");
  nameTitle.textContent = "ФИО*";
  nameField.classList.remove("error");

  const emailInput = form
    .querySelector('input[name="Email"]')
    .closest(".input");
  const emailTitle = emailInput.querySelector(".input__title");
  const emailField = emailInput.querySelector(".input__field");
  emailTitle.textContent = "Email*";
  emailField.classList.remove("error");

  const phoneInput = form
    .querySelector('input[name="Phone"]')
    .closest(".input");
  const phoneTitle = phoneInput.querySelector(".input__title");
  const phoneField = phoneInput.querySelector(".input__field");
  phoneTitle.textContent = "Телефон*";
  phoneField.classList.remove("error");

  // Восстанавливаем оригинальный текст чекбокса
  const checkboxText = form.querySelector(".checkbox__text");
  checkboxText.innerHTML =
    'Согласна(-ен) на <a href="./assets/pdf/privacy_policy_posmotri.pdf">обработку персональных данныхс</a>';
}

// Обработка отправки формы tickets-form
document.addEventListener("submit", async (e) => {
  if (e.target.classList.contains("tickets-form__form")) {
    e.preventDefault();

    const form = e.target;
    const submitButton = form.querySelector(".tickets-form__btn");
    const originalButtonText = submitButton.querySelector("span").textContent;

    // Валидация формы
    const errors = validateTicketsForm(form);

    // Если есть ошибки, показываем их и прекращаем отправку
    if (Object.keys(errors).length > 0) {
      showValidationErrors(form, errors);
      return;
    }

    // Очищаем ошибки при успешной валидации
    clearValidationErrors(form);

    // Получаем данные формы
    const formData = new FormData(form);
    const name = formData.get("FullName");
    const email = formData.get("Email");
    const phone = formData.get("Phone");
    const checkbox = formData.get("checkbox");

    // Получаем текущий тариф
    const tariff = getCurrentTariff();

    // Показываем индикатор загрузки
    submitButton.disabled = true;
    submitButton.querySelector("span").textContent = "Отправка...";

    try {
      // Подготавливаем данные для отправки
      const requestData = {
        full_name: name,
        email: email,
        phone: phone,
        tariff_id: tariff ? tariff.id : null,
        tariff_name: tariff ? tariff.name : "Не указан",
      };

      // Отправляем данные на API
      const result = await submitTicketForm(requestData);

      // Проверяем успешность ответа
      if (result.success && result.data && result.data.payment_url) {
        // Закрываем форму
        ticketsForm.classList.remove("active");

        // Сбрасываем форму
        form.reset();

        // Перенаправляем пользователя по payment_url из ответа
        window.location.href = result.data.payment_url;
      } else {
        // Если нет payment_url или ответ не успешный
        alert(
          "Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время."
        );

        // Закрываем форму и сбрасываем её
        ticketsForm.classList.remove("active");
        form.reset();
      }
    } catch (error) {
      alert("Произошла ошибка при отправке заявки. Попробуйте еще раз.");
      console.error("Ошибка отправки формы:", error);
    } finally {
      // Восстанавливаем состояние кнопки
      submitButton.disabled = false;
      submitButton.querySelector("span").textContent = originalButtonText;
    }
  }
});

// Валидация полей в реальном времени
document.addEventListener(
  "blur",
  (e) => {
    if (e.target.classList.contains("input__field")) {
      const form = e.target.closest(".tickets-form__form");
      if (form) {
        const fieldName = e.target.name;
        const errors = validateTicketsForm(form);

        // Обновляем состояние ошибок для конкретного поля
        if (fieldName === "FullName") {
          const nameInput = form
            .querySelector('input[name="FullName"]')
            .closest(".input");
          const nameTitle = nameInput.querySelector(".input__title");
          const nameField = nameInput.querySelector(".input__field");
          if (errors.name) {
            nameTitle.textContent = `ФИО* - ${errors.name}`;
            nameField.classList.add("error");
          } else {
            nameTitle.textContent = "ФИО*";
            nameField.classList.remove("error");
          }
        } else if (fieldName === "Email") {
          const emailInput = form
            .querySelector('input[name="Email"]')
            .closest(".input");
          const emailTitle = emailInput.querySelector(".input__title");
          const emailField = emailInput.querySelector(".input__field");
          if (errors.email) {
            emailTitle.textContent = `Email* - ${errors.email}`;
            emailField.classList.add("error");
          } else {
            emailTitle.textContent = "Email*";
            emailField.classList.remove("error");
          }
        } else if (fieldName === "Phone") {
          const phoneInput = form
            .querySelector('input[name="Phone"]')
            .closest(".input");
          const phoneTitle = phoneInput.querySelector(".input__title");
          const phoneField = phoneInput.querySelector(".input__field");
          if (errors.phone) {
            phoneTitle.textContent = `Телефон* - ${errors.phone}`;
            phoneField.classList.add("error");
          } else {
            phoneTitle.textContent = "Телефон*";
            phoneField.classList.remove("error");
          }
        }
      }
    }
  },
  true
);

$(document).ready(function () {
  $("#phone").inputmask("+375 (99) 999-99-99");
});
