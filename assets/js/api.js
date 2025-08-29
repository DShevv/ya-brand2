async function getPartners() {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/public/partners"
    );
    const data = await response.json();

    // Находим оба слайдера
    const firstSwiper = document.querySelector(
      ".partners__swiper .swiper-wrapper"
    );
    const secondSwiper = document.querySelector(
      ".partners__swiper-reverse .swiper-wrapper"
    );

    if (!firstSwiper || !secondSwiper) return;

    // Очищаем содержимое слайдеров
    firstSwiper.innerHTML = "";
    secondSwiper.innerHTML = "";

    // Функция для создания слайда с партнером
    const createPartnerSlide = (partner) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      const link = document.createElement("a");
      link.href = partner.link ?? "#";
      link.className = "partners__link";
      link.target = "_blank";

      const img = document.createElement("img");
      img.src = "https://api2.posmotri.by/storage/" + partner.logo_path;
      img.alt = partner.name;
      img.className = "partners__item";
      img.loading = "lazy";

      link.appendChild(img);
      slide.appendChild(link);

      return slide;
    };

    // Добавляем партнеров в оба слайдера
    data.partners.forEach((partner) => {
      firstSwiper.appendChild(createPartnerSlide(partner));
      secondSwiper.appendChild(createPartnerSlide(partner));
    });
  } catch (error) {
    console.error("Ошибка при загрузке партнеров:", error);
  }
}

async function getSpeakers() {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/public/speakers"
    );
    const data = await response.json();

    const speakersList = document.querySelector(".speakers__list");
    if (!speakersList) return;

    speakersList.innerHTML = "";

    data.speakers.forEach((speaker) => {
      const speakerItem = document.createElement("div");
      speakerItem.className = "speakers__item";

      // Добавляем тег хэдлайнера если спикер является хэдлайнером
      if (speaker.is_headliner) {
        const tagDiv = document.createElement("div");
        tagDiv.className = "speakers__item-tag";
        tagDiv.textContent = "🔥 Хэдлайнер";
        speakerItem.appendChild(tagDiv);
      }

      // Создаем блок с изображением
      const imgDiv = document.createElement("div");
      imgDiv.className = "speakers__item-img";

      const speakerImg = document.createElement("img");
      speakerImg.src = "https://api2.posmotri.by/storage/" + speaker.photo_path;
      speakerImg.alt = speaker.name;
      speakerImg.loading = "lazy";

      imgDiv.appendChild(speakerImg);
      speakerItem.appendChild(imgDiv);

      // Создаем блок информации о спикере
      const infoDiv = document.createElement("div");
      infoDiv.className = "speakers__item-info";

      const titleH3 = document.createElement("h3");
      titleH3.className = "speakers__item-title";
      titleH3.textContent = speaker.name;

      const textP = document.createElement("p");
      textP.className = "speakers__item-text";
      textP.textContent = speaker.position;

      infoDiv.appendChild(titleH3);
      infoDiv.appendChild(textP);
      speakerItem.appendChild(infoDiv);

      // Добавляем социальные сети только если они есть
      const hasSocialLinks =
        speaker.instagram_link || speaker.telegram_link || speaker.website_link;

      if (hasSocialLinks) {
        const socialsDiv = document.createElement("div");
        socialsDiv.className = "speakers__item-social";

        if (speaker.instagram_link) {
          const instaLink = document.createElement("a");
          instaLink.href = speaker.instagram_link;
          instaLink.target = "_blank";
          instaLink.className = "speakers__item-social-link";

          const instaImg = document.createElement("img");
          instaImg.src = "./assets/images/inst.svg";
          instaImg.alt = "Instagram";
          instaLink.appendChild(instaImg);

          socialsDiv.appendChild(instaLink);
        }

        if (speaker.telegram_link) {
          const telegramLink = document.createElement("a");
          telegramLink.href = speaker.telegram_link;
          telegramLink.target = "_blank";
          telegramLink.className = "speakers__item-social-link";

          const tgImg = document.createElement("img");
          tgImg.src = "./assets/images/tg.svg";
          tgImg.alt = "Telegram";
          telegramLink.appendChild(tgImg);

          socialsDiv.appendChild(telegramLink);
        }

        if (speaker.website_link) {
          const websiteLink = document.createElement("a");
          websiteLink.href = speaker.website_link;
          websiteLink.target = "_blank";
          websiteLink.className = "speakers__item-social-link";

          const siteImg = document.createElement("img");
          siteImg.src = "./assets/images/site.svg";
          siteImg.alt = "Website";
          websiteLink.appendChild(siteImg);

          socialsDiv.appendChild(websiteLink);
        }

        speakerItem.appendChild(socialsDiv);
      }

      speakersList.appendChild(speakerItem);
    });
  } catch (error) {
    console.error("Ошибка при загрузке спикеров:", error);
  }
}

async function getEvents() {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/public/events"
    );
    const data = await response.json();

    const planList = document.querySelector(".plan__list");
    if (!planList) return;

    planList.innerHTML = "";

    data.events.forEach((event, index) => {
      const planItem = document.createElement("div");
      planItem.className = "plan__item";

      // Создаем контент блок
      const planContent = document.createElement("div");
      planContent.className = "plan__item-content";

      // Создаем номер
      const planNumber = document.createElement("div");
      planNumber.className = "plan__item-number";
      planNumber.textContent = index + 1;

      // Создаем блок с заголовком и текстом
      const planCaption = document.createElement("div");
      planCaption.className = "plan__item-caption";

      // Создаем заголовок
      const planTitle = document.createElement("h3");
      planTitle.className = "plan__item-title";
      planTitle.textContent = event.title;

      // Создаем описание
      const planText = document.createElement("p");
      planText.className = "plan__item-text";
      planText.innerHTML = event.content;

      // Собираем структуру caption
      planCaption.appendChild(planTitle);
      planCaption.appendChild(planText);

      // Собираем структуру content
      planContent.appendChild(planNumber);
      planContent.appendChild(planCaption);

      // Добавляем content в item
      planItem.appendChild(planContent);

      // Создаем изображение если есть
      if (event.icon_path) {
        const planImg = document.createElement("img");
        planImg.src = "https://api2.posmotri.by/storage/" + event.icon_path;
        planImg.alt = event.title;
        planImg.loading = "lazy";
        planItem.appendChild(planImg);
      }

      planList.appendChild(planItem);
    });
  } catch (error) {
    console.error("Ошибка при загрузке событий:", error);
  }
}

let tarifsData = null; // Глобальная переменная для хранения данных тарифов

async function getTariffs() {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/public/tariffs"
    );
    const data = await response.json();
    tarifsData = data; // Сохраняем данные глобально

    // Создаем вкладки из тарифов
    createTariffTabs(data.tariffs);

    // Создаем общий список преимуществ из первого тарифа
    createFeaturesList(data.tariffs);

    // Устанавливаем активную вкладку (первую по умолчанию)
    if (data.tariffs.length > 0) {
      setActiveTariff(data.tariffs[0]);
    }

    // Добавляем обработчики событий для вкладок
    setupTabHandlers();
  } catch (error) {
    console.error("Ошибка при загрузке тарифов:", error);
  }
}

function createTariffTabs(tariffs) {
  const tabsContainer = document.querySelector(".prices__tabs");
  if (!tabsContainer) return;

  // Очищаем существующие вкладки
  tabsContainer.innerHTML = "";

  tariffs.forEach((tariff, index) => {
    const tabDiv = document.createElement("div");
    tabDiv.className = `prices__tabs-item${index === 0 ? " active" : ""}`;
    tabDiv.setAttribute("data-tab", tariff.name);
    tabDiv.setAttribute("data-tariff-id", tariff.id);
    tabDiv.textContent = tariff.name;
    tabsContainer.appendChild(tabDiv);
  });
}

function createFeaturesList(tariffs) {
  const featuresList = document.querySelector(".prices__item-list");
  if (!featuresList || tariffs.length === 0) return;

  // Берем список всех возможных преимуществ из первого тарифа
  const allFeatures = tariffs[0].features;

  // Очищаем существующий список
  featuresList.innerHTML = "";

  allFeatures.forEach((feature) => {
    const featureItem = document.createElement("li");
    featureItem.className = "prices__item-item";
    featureItem.setAttribute("data-feature-id", feature.id);

    // Создаем SVG иконку (звездочка)
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("fill", "none");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M9.88555 0.0308105C9.85163 0.0477695 9.78381 0.437826 9.68207 1.16706C9.40229 3.31237 9.18186 4.47406 8.85121 5.4492C8.34252 6.96703 7.58796 7.87434 6.31624 8.50182C5.29038 9.01059 3.89996 9.32433 1.16999 9.68047C0.0763035 9.8331 0 9.85006 0 10.0027C0 10.1553 0.0763036 10.1808 0.856295 10.274C4.94277 10.7913 6.4858 11.2746 7.60492 12.3939C8.6986 13.4878 9.18186 14.9886 9.68207 18.8298C9.8262 19.9237 9.84316 20 9.99576 20C10.1484 20 10.1738 19.9237 10.2925 18.974C10.8012 15.0056 11.2844 13.4962 12.3951 12.3939C13.5142 11.2746 15.0572 10.7913 19.1437 10.274C19.9237 10.1723 20 10.1468 20 10.0027C20 9.85006 19.9237 9.8331 18.83 9.68895C16.7105 9.4176 15.5744 9.18866 14.6248 8.8834C13.0564 8.37463 12.1407 7.62843 11.5134 6.36499C10.9792 5.28809 10.674 3.94833 10.2925 1.03139C10.2077 0.395429 10.1484 0.0647285 10.1145 0.03929C10.0466 -0.0115869 9.96185 -0.0115869 9.88555 0.0308105Z"
    );
    path.setAttribute("fill", "#BC0E0E");

    svg.appendChild(path);

    // Создаем span с текстом
    const span = document.createElement("span");
    span.textContent = feature.name;

    featureItem.appendChild(svg);
    featureItem.appendChild(span);
    featuresList.appendChild(featureItem);
  });
}

function setActiveTariff(tariff) {
  // Убираем класс active со всех элементов списка
  const featureItems = document.querySelectorAll(".prices__item-item");
  featureItems.forEach((item) => {
    item.classList.remove("active");
  });

  // Добавляем класс active для активных преимуществ выбранного тарифа
  tariff.features.forEach((feature) => {
    console.log(feature);

    if (feature.pivot.is_enabled === "1") {
      const featureItem = document.querySelector(
        `[data-feature-id="${feature.id}"]`
      );

      if (featureItem) {
        featureItem.classList.add("active");
      }
    }
  });

  // Обновляем кнопку покупки
  updateBuyButton(tariff);
}

function updateBuyButton(tariff) {
  const buyButton = document.querySelector(".prices__control .button-wide");
  if (!buyButton) return;

  // Обновляем ссылку
  buyButton.href = tariff.payment_link || "#";
  buyButton.setAttribute("data-seats", tariff.available_seats || "100");

  // Обновляем количество мест
  const placesText = buyButton.querySelector(
    ".content-places .button-wide__text"
  );
  if (placesText) {
    placesText.textContent = `Осталось ${tariff.available_seats || 100} мест!`;
  }
}

function setupTabHandlers() {
  const tabItems = document.querySelectorAll(".prices__tabs-item");

  tabItems.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Убираем активный класс со всех вкладок
      tabItems.forEach((t) => t.classList.remove("active"));

      // Добавляем активный класс к выбранной вкладке
      tab.classList.add("active");

      // Находим соответствующий тариф
      const tariffId = tab.getAttribute("data-tariff-id");
      const selectedTariff = tarifsData.tariffs.find(
        (t) => t.id.toString() === tariffId
      );

      console.log(selectedTariff, tariffId);

      if (selectedTariff) {
        setActiveTariff(selectedTariff);
      }
    });
  });
}

async function getVenue() {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/public/venues"
    );
    const data = await response.json();

    const placeContainer = document.querySelector(".place__container");
    if (!placeContainer || !data.venues.length) return;

    const venue = data.venues[0];

    // Очищаем контейнер
    placeContainer.innerHTML = "";

    // Создаем блок с описанием места
    const placeCaption = document.createElement("div");
    placeCaption.className = "place__caption";

    // Создаем блок с изображением
    const placeImg = document.createElement("div");
    placeImg.className = "place__img";

    // Добавляем SVG иконку
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "110");
    svg.setAttribute("height", "110");
    svg.setAttribute("viewBox", "0 0 110 110");
    svg.setAttribute("fill", "none");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("clip-rule", "evenodd");
    path.setAttribute(
      "d",
      "M57.6314 100.002C56.0515 101.11 53.945 101.109 52.3656 100.001L52.3542 99.9928L52.3285 99.9749L52.2433 99.9139C52.1713 99.8626 52.0696 99.7893 51.9403 99.6953C51.6823 99.5069 51.3128 99.2342 50.8486 98.8813C49.92 98.1764 48.6096 97.1493 47.0435 95.838C43.9184 93.22 39.7423 89.4387 35.5522 84.7862C27.3332 75.6598 18.333 62.3815 18.333 47.4998C18.333 37.4062 22.1426 27.682 28.9915 20.4773C35.8478 13.2648 45.198 9.16669 54.9997 9.16669C64.8011 9.16669 74.1516 13.2648 81.0078 20.4773C87.8567 27.682 91.6663 37.4062 91.6663 47.4998C91.6663 62.3815 82.666 75.6598 74.4472 84.7862C70.2571 89.4387 66.0808 93.22 62.9559 95.838C61.3898 97.1493 60.0794 98.1764 59.1508 98.8813C58.6865 99.2342 58.3171 99.5069 58.059 99.6953C57.9298 99.7893 57.8281 99.8626 57.7561 99.9139L57.6708 99.9749L57.6452 99.9928L57.6369 99.9987L57.6314 100.002ZM41.2497 45.8333C41.2497 38.2395 47.4056 32.0833 54.9997 32.0833C62.5938 32.0833 68.7497 38.2395 68.7497 45.8333C68.7497 53.4275 62.5938 59.5833 54.9997 59.5833C47.4056 59.5833 41.2497 53.4275 41.2497 45.8333Z"
    );
    path.setAttribute("fill", "#BC0E0E");

    svg.appendChild(path);

    // Добавляем изображение места
    const img = document.createElement("img");
    img.src = venue.photo_path
      ? `https://api2.posmotri.by${venue.photo_path}`
      : "./assets/images/place.png";
    img.alt = venue.name || "";
    img.loading = "lazy";

    placeImg.appendChild(svg);
    placeImg.appendChild(img);

    // Создаем блок с информацией
    const placeInfo = document.createElement("div");
    placeInfo.className = "place__info";

    const placeTitle = document.createElement("div");
    placeTitle.className = "place__info-title";
    placeTitle.textContent = venue.name || 'Кинотеатр "Мир"';

    const placeAddress = document.createElement("div");
    placeAddress.className = "place__info-address address";
    placeAddress.textContent =
      venue.address ||
      "ул. Пушкинская 7, Брест, Брестская область 224005, Республика Беларусь";

    placeInfo.appendChild(placeTitle);
    placeInfo.appendChild(placeAddress);

    // Собираем блок caption
    placeCaption.appendChild(placeImg);
    placeCaption.appendChild(placeInfo);

    // Создаем блок карты
    const placeMap = document.createElement("div");
    placeMap.className = "place__map";
    placeMap.id = "place__map";

    placeContainer.appendChild(placeCaption);

    placeContainer.appendChild(placeMap);
  } catch (error) {
    console.error("Ошибка при загрузке информации о месте проведения:", error);
  }
}

async function getSchedule() {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/public/schedule"
    );
    const data = await response.json();

    const programList = document.querySelector(".program__list");
    if (!programList) {
      console.error("Не найден элемент .program__list");
      return;
    }

    programList.innerHTML = "";

    if (!data.schedules || !data.schedules.length) {
      console.error("Нет данных о расписании");
      return;
    }

    data.schedules.forEach((item, index) => {
      const programItem = document.createElement("div");
      programItem.className = `program__item${
        item.is_headliner ? " headliner" : ""
      }`;

      // Создаем wrapper
      const wrapper = document.createElement("div");
      wrapper.className = "program__item-wrapper";

      // Создаем блок времени
      const timeBlock = document.createElement("div");
      timeBlock.className = "program__item-time";
      timeBlock.textContent = item.time_range;

      // Создаем блок с заголовком/описанием
      const titleBlock = document.createElement("div");
      titleBlock.className = "program__item-title";
      titleBlock.innerHTML = item.description;

      // Создаем блок спикера если есть данные о спикере
      if (item.speakers) {
        const speakerBlock = document.createElement("div");
        speakerBlock.className = "program__item-speaker";

        // Добавляем фото спикера если есть
        if (item.photo_path) {
          const speakerImg = document.createElement("img");
          speakerImg.className = "program__item-img";
          speakerImg.src = "https://api2.posmotri.by/" + item.photo_path;
          speakerImg.alt = "";
          speakerBlock.appendChild(speakerImg);
        }

        // Создаем блок с информацией о спикере
        const speakerInfo = document.createElement("div");
        speakerInfo.className = "program__item-info";

        // Разбираем имя и должность спикера
        const speakers = item.speakers.split(",").map((s) => s.trim());
        const speakerName = speakers[0];

        const nameDiv = document.createElement("div");
        nameDiv.className = "program__item-name";
        nameDiv.textContent = speakerName;

        const positionDiv = document.createElement("div");
        positionDiv.className = "program__item-position";
        positionDiv.textContent = item.speaker_position || "Спикер";

        speakerInfo.appendChild(nameDiv);
        speakerInfo.appendChild(positionDiv);
        speakerBlock.appendChild(speakerInfo);

        wrapper.appendChild(timeBlock);
        wrapper.appendChild(titleBlock);
        wrapper.appendChild(speakerBlock);
      } else {
        wrapper.appendChild(timeBlock);
        wrapper.appendChild(titleBlock);
      }

      programItem.appendChild(wrapper);
      programList.appendChild(programItem);
    });
  } catch (error) {
    console.error("Ошибка при загрузке программы:", error);
  }
}

async function getGallery() {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/public/gallery"
    );
    const data = await response.json();

    const gallerySection = document.querySelector(".gallery");
    if (!gallerySection) {
      console.error("Не найден элемент .gallery");
      return;
    }

    // Очищаем галерею от статических изображений
    gallerySection.innerHTML = "";

    if (!data.images || !data.images.length) {
      console.error("Нет данных о галерее");
      return;
    }

    // Добавляем изображения из API
    data.images.forEach((image) => {
      const img = document.createElement("img");
      img.src = "https://api2.posmotri.by" + image.image_path;
      img.alt = image.title || "Фотография галереи";
      img.loading = "lazy";

      gallerySection.appendChild(img);
    });
  } catch (error) {
    console.error("Ошибка при загрузке галереи:", error);
  }
}

async function getMainScreen() {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/public/main-screen"
    );
    const data = await response.json();

    // Обновляем дату события
    const dateElement = document.querySelector(".hero__info-date");
    if (dateElement && data.mainScreen.event_date) {
      dateElement.textContent = data.mainScreen.event_date;
    }

    // Парсим дату в формате дд.мм.гггг
    const dateParts = data.mainScreen.event_date.split(".");
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // год, месяц (0-индекс), день

    $(".flipTimer").flipTimer({
      direction: "down",

      date: date
        .toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace("at ", ""),
    });

    // Очищаем адрес (оставляем пустой блок)
    const addressElement = document.querySelector(
      ".hero__info-location.address"
    );
    if (addressElement) {
      addressElement.textContent = "";
    }

    // Обновляем заголовок
    const title = document.querySelector(".hero__title");
    if (title && data.title) {
      // Убираем span из заголовка и добавляем только текст
      const titleText = title.querySelector("span")
        ? title.childNodes[0].textContent.trim()
        : title.textContent;
      title.innerHTML = data.title;
    }

    // Обновляем подзаголовок в span
    const subtitle = document.createElement("span");
    subtitle.className = "hero__title-span";
    subtitle.textContent = data.subtitle;

    title.appendChild(subtitle);

    // Обновляем описание спикеров
    const speakersText = document.querySelector(".hero__speakers-text");
    if (speakersText && data.description) {
      speakersText.textContent = data.description;
    }

    // Обновляем список спикеров
    await updateHeroSpeakers();
  } catch (error) {
    console.error("Ошибка при загрузке информации главного экрана:", error);
  }
}

async function updateHeroSpeakers() {
  try {
    const response = await fetch(
      "https://api2.posmotri.by/api/v1/public/speakers"
    );
    const data = await response.json();

    const speakersList = document.querySelector(".hero__speakers-list");
    if (!speakersList || !data.speakers) return;

    // Очищаем текущий список
    speakersList.innerHTML = "";

    // Берем первых 4 спикеров
    const firstFourSpeakers = data.speakers.slice(0, 4);

    firstFourSpeakers.forEach((speaker) => {
      const speakerImg = document.createElement("img");
      speakerImg.src = "https://api2.posmotri.by/storage/" + speaker.photo_path;
      speakerImg.alt = speaker.name;
      speakerImg.className = "hero__speakers-item";
      speakerImg.loading = "lazy";
      speakersList.appendChild(speakerImg);
    });

    // Добавляем секретного спикера (5-й элемент)
    const secretSpeaker = document.createElement("img");
    secretSpeaker.src = "./assets/images/speakers/speaker-secret.png";
    secretSpeaker.alt = "Секретный спикер";
    secretSpeaker.className = "hero__speakers-item";
    speakersList.appendChild(secretSpeaker);
  } catch (error) {
    console.error("Ошибка при загрузке спикеров для hero:", error);
  }
}

// Функция для инициализации всех API вызовов
async function initializeAPI() {
  try {
    await getMainScreen();
    await getPartners();
    await getSpeakers();
    await getEvents();
    await getTariffs();
    await getVenue();
    await getSchedule();
    await getGallery();

    // Устанавливаем флаг и уведомляем, что API данные загружены
    window.apiDataLoaded = true;
    window.dispatchEvent(new CustomEvent("apiDataLoaded"));
    console.log("API данные успешно загружены");
  } catch (error) {
    console.error("Ошибка при инициализации API:", error);
  }
}

// Запускаем инициализацию API
initializeAPI();
