"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
};

const closeModal = function () {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape" && !modal.classList.contains("hidden")) {
		closeModal();
	}
});

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function (e) {
	section1.scrollIntoView({ behavior: "smooth" });
});

// document.querySelectorAll(".nav__link").forEach(function (el) {
// 	el.addEventListener("click", function (e) {
// 		e.preventDefault();
// 		const id = this.getAttribute("href");
// 		document.querySelector(id).scrollIntoView({ behavior: "smooth" });
// 	});
// });

// page navigation
document.querySelector(".nav__links").addEventListener("click", function (e) {
	e.preventDefault();

	// matching strategy
	if (e.target.classList.contains("nav__link")) {
		const id = e.target.getAttribute("href");
		document.querySelector(id).scrollIntoView({ behavior: "smooth" });
	}
});

// tab components
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", function (e) {
	e.preventDefault();

	const clicked = e.target.closest(".operations__tab");

	// guard clause
	if (!clicked) return;

	// removing active classes
	tabs.forEach((t) => t.classList.remove("operations__tab--active"));
	tabsContent.forEach((c) =>
		c.classList.remove("operations__content--active")
	);

	// active tab
	clicked.classList.add("operations__tab--active");

	// active content area
	document
		.querySelector(`.operations__content--${clicked.dataset.tab}`)
		.classList.add("operations__content--active");
});

// menu fade animation
const nav = document.querySelector(".nav");

const handleOver = function (e, opacity) {
	if (e.target.classList.contains("nav__link")) {
		const link = e.target;
		const sibling = link.closest(".nav").querySelectorAll(".nav__link");
		const logo = link.closest(".nav").querySelector("img");

		sibling.forEach((el) => {
			if (el !== link) el.style.opacity = opacity;
		});
		logo.style.opacity = opacity;
	}
};

nav.addEventListener("mouseover", function (e) {
	handleOver(e, 0.5);
});

nav.addEventListener("mouseout", function (e) {
	handleOver(e, 1);
});

// const obsCallBack = function (entries, observer) {
// 	entries.forEach((entry) => {
// 		console.log(entry);
// 	});
// };

// const obsOption = {
// 	root: null,
// 	threshhold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOption);
// observer.observe(section1);

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
	const [entry] = entries;
	// console.log(entry);
	if (!entry.isIntersecting) nav.classList.add("sticky");
	else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// reveal sections
const allSection = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	entry.target.classList.remove("section--hidden");
	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

allSection.forEach((section) => {
	sectionObserver.observe(section);
	section.classList.add("section--hidden");
});

// lazy loading images
const imgTarget = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	entry.target.src = entry.target.dataset.src;

	entry.target.addEventListener("load", function () {
		entry.target.classList.remove("lazy-img");
	});

	observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
});

imgTarget.forEach((img) => {
	imgObserver.observe(img);
});

// slider
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
let currentSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
	slides.forEach((_, i) => {
		dotContainer.insertAdjacentHTML(
			"beforeend",
			`<button class="dots__dot" data-slide="${i}"></button>`
		);
	});
};

createDots();

const activateDots = function (slide) {
	document
		.querySelectorAll(".dots__dot")
		.forEach((dot) => dot.classList.remove("dots__dot--active"));

	document
		.querySelector(`.dots__dot[data-slide="${slide}"]`)
		.classList.add("dots__dot--active");
};
activateDots(0);

const goToSlide = function (slide) {
	slides.forEach((s, i) => {
		s.style.transform = `translateX(${100 * (i - slide)}%)`;
	});
};

goToSlide(0);

const nextSlide = function () {
	if (currentSlide === maxSlide - 1) {
		currentSlide = 0;
	} else {
		currentSlide++;
	}
	goToSlide(currentSlide);
	activateDots(currentSlide);
};

const prevSlide = function () {
	if (currentSlide === 0) {
		currentSlide = maxSlide - 1;
	} else {
		currentSlide--;
	}

	goToSlide(currentSlide);
	activateDots(currentSlide);
};

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
	if (e.key === "Arrowleft") prevSlide();
	if (e.key === "Arrowright") nextSlide();
});

dotContainer.addEventListener("click", function (e) {
	if (e.target.classList.contains("dots__dot")) {
		const { slide } = e.target.dataset;
		goToSlide(slide);
	}
});
