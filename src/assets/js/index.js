import '../styles/recet.scss';
import '../styles/mixins.scss';
import '../styles/styles.scss';
import 'swiper/css';

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { languages } from './languages';
Swiper.use([Navigation]);

const checkboxes = {
  requirements: ['minimum', 'recommended'],
  versions: ['standard', 'limited'],
};

let isPlay = false;

const classes = {
  opened: 'opened',
  hidden: 'hidden',
  active: 'active',
};

const values = [
  {
    price: 19.99,
    title: 'Standard Edition',
  },
  {
    price: 18.99,
    title: 'Standard Edition',
  },
  {
    price: 29.99,
    title: 'Deluxe Edition',
  },
];

const checkbox = document.querySelectorAll('.checkbox');
const menuLink = document.querySelectorAll('.menu-link');
const header = document.querySelector('.header');
const menuButton = document.querySelector('.header-menu__button');
const video = document.getElementById('video');
const videoButton = document.querySelector('.video-btn');
const fagItem = document.querySelectorAll('.faq-item');
const section = document.querySelectorAll('.section');
const language = document.querySelectorAll('.language');
const buyButton = document.querySelectorAll('.buy-button');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalTitle = document.querySelector('.modal-version');
const modalPrice = document.querySelector('.modal-total__price');
const modalClose = document.querySelector('.modal-close');

const toggleMenu = () => {
  header.classList.toggle(classes.opened);
};

const scrollToSection = (e) => {
  e.preventDefault();
  const targetId = e.currentTarget.getAttribute('href');
  const targetSection = document.querySelector(targetId);

  if (targetSection) {
    const headerHeight = header.offsetHeight;
    const targetOffsetTop = targetSection.offsetTop - headerHeight;

    window.scrollTo({
      top: targetOffsetTop,
      behavior: 'smooth',
    });
  }
};

const formatvalue = (value) => (value < 10 ? `0${value}` : value);

const getTimerValues = (diff) => {
  return {
    seconds: (diff / 1000) % 60,
    minutes: (diff / (1000 * 60)) % 60,
    hours: (diff / (1000 * 60 * 60)) % 24,
    days: (diff / (1000 * 3600 * 24)) % 30,
  };
};

const setTimerValues = (values) => {
  Object.entries(values).forEach(([key, value]) => {
    const timerValue = document.getElementById(key);
    timerValue.innerHTML = formatvalue(Math.floor(value));
  });
};

const startTimer = (data) => {
  const id = setInterval(() => {
    const diff = new Date(data).getTime() - new Date().getTime();

    if (diff < 0) {
      clearInterval(id);
      return;
    }

    setTimerValues(getTimerValues(diff));
  }, 1000);
};

const handleVideo = ({ target }) => {
  const info = target.parentElement;
  isPlay = !isPlay;
  info.classList.toggle(classes.hidden, isPlay);
  target.innerText = isPlay ? 'Pause' : 'Play';
  isPlay ? video.play() : video.pause();
};

const handleCheckbox = ({ currentTarget: { checked, name } }) => {
  const { active } = classes;
  const value = checkboxes[name][Number(checked)];
  const list = document.getElementById(value);
  const tabs = document.querySelectorAll(`[data-${name}]`);
  const siblings = list.parentElement.children;

  for (const item of siblings) item.classList.remove(active);
  for (const tab of tabs) {
    tab.classList.remove(active);
    tab.dataset[name] === value && tab.classList.add(active);
  }

  list.classList.add(active);
};

const initSlider = () => {
  const swiper = new Swiper('.swiper', {
    loop: true,
    spaceBetween: 20,
    slidesPerView: 3,
    initialSlide: 0,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};

const handleItemFaq = ({ currentTarget: target }) => {
  target.classList.toggle(classes.opened);
  const isOpened = target.classList.contains(classes.opened);
  const height = target.querySelector('p').clientHeight;
  const content = target.querySelector('.faq-item__content');
  console.log(content);
  content.style.height = `${isOpened ? height : 0}px`;
};

const handleScroll = () => {
  const { scrollY: y, innerHeight: h } = window;
  section.forEach((sec) => {
    if (y > sec.offsetTop - h / 1.5) sec.classList.remove(classes.hidden);
  });
};

const setTexts = () => {
  const lang = localStorage.getItem('lang') || 'en';
  const content = languages[lang];
  Object.entries(content).forEach(([key, value]) => {
    const items = document.querySelectorAll(`[data-text='${key}']`);
    items.forEach((item) => (item.innerText = value));
  });
};

function toggleLanguage({ target }) {
  const { lang } = target.dataset;
  if (!lang) return;
  localStorage.setItem('lang', lang);
  setTexts();
}

const handleBuyButton = ({ currentTarget: target }) => {
  const { value } = target.dataset;
  if (!value) return;
  const { price, title } = values[value];
  modalTitle.innerText = title;
  modalPrice.innerText = `${price}$`;
  modal.classList.add(classes.opened);
  overlay.classList.add(classes.opened);
};

const closeModal = () => {
  modal.classList.remove(classes.opened);
  overlay.classList.remove(classes.opened);
};

setTexts();
initSlider();
startTimer('November 11, 2023 00:00:00');
window.addEventListener('scroll', handleScroll);
menuButton.addEventListener('click', toggleMenu);
videoButton.addEventListener('click', handleVideo);
menuLink.forEach((link) => link.addEventListener('click', scrollToSection));
checkbox.forEach((box) => box.addEventListener('click', handleCheckbox));
fagItem.forEach((item) => item.addEventListener('click', handleItemFaq));
language.forEach((lang) => lang.addEventListener('click', toggleLanguage));
buyButton.forEach((btn) => btn.addEventListener('click', handleBuyButton));
modalClose.addEventListener('click', closeModal);
