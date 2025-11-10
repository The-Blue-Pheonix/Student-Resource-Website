const swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
});


// Example GSAP animation on page load
gsap.from("#text h1", {
  opacity: 0,
  y: 100,
  duration: 1,
  ease: "power3.out"
});

gsap.from("#text p", {
  opacity: 0,
  y: 50,
  duration: 1,
  delay: 0.3,
  ease: "power3.out"
});

// login and register js

// Intro animation then show auth
    window.addEventListener("load", () => {
      setTimeout(() => {
        gsap.to("#introScreen", { duration: 1, opacity: 0, y: -100, onComplete: () => {
          document.getElementById("introScreen").style.display = "none";
          const auth = document.getElementById("authContainer");
          auth.style.display = "block";
          gsap.to(auth, { duration: 1, opacity: 1, y: 0, ease: "power3.out" });
        }});
      }, 2500);
    });
