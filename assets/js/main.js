const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu__close");
const mobileMenuBuy = document.querySelector(".mobile-menu__buy");
const burger = document.querySelector(".burger");
const compare = document.querySelector(".compare");
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

  if (e.target.classList.contains("compare__container")) {
    compare.classList.remove("active");
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
