document.addEventListener("DOMContentLoaded", function () {

  // ----------- Enquiry Form -----------

  
  
    const forms = document.querySelectorAll("form.contact-form");
  
    forms.forEach((form, index) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault(); // ⛔ Stop page refresh
  
        const name = form.querySelector("input[type='text']").value.trim();
        const email = form.querySelector("input[type='email']").value.trim();
        const phone = form.querySelector("input[type='tel']").value.trim();
        const postcode = form.querySelector("input[placeholder='Postcode']").value.trim();
        const duration = form.querySelector("select.duration").value;
        const messageElem = form.querySelector(".form-message");
  
        // Field validation
        if (!name || !email || !phone || !postcode || !duration) {
          messageElem.textContent = "⚠️ All fields are required.";
          return;
        }
  
        // Email format check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          messageElem.textContent = "⚠️ Invalid email format.";
          return;
        }
  
        // Phone format check
        const phonePattern = /^[0-9]{10,15}$/;
        if (!phonePattern.test(phone)) {
          messageElem.textContent = "⚠️ Enter a valid phone number.";
          return;
        }
  
        // reCAPTCHA check
        if (typeof grecaptcha === "undefined") {
          messageElem.textContent = "⚠️ reCAPTCHA not loaded.";
          return;
        }
  
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
          messageElem.textContent = "⚠️ Please complete reCAPTCHA.";
          return;
        }
  
        // Prepare EmailJS parameters
        const templateParams = {
          name: name,
          email: email,
          phone: phone,
          postcode: postcode,
          duration: duration,
        };
  
        // Send with EmailJS
        emailjs.send("service_9xsmiy7", "template_9hw1446", templateParams)
        .then(function(response) {
          alert("Message sent successfully!");
          console.log("✅ Email Sent:", response);
          form.reset(); // Clear the form after successful submission
          grecaptcha.reset(); // Reset reCAPTCHA
      })
          .catch((error) => {
            console.error("EmailJS Error:", error);
            messageElem.textContent = "❌ Failed to send message. Try again.";
          });
      });
    });
  });

  

  
  
  

  // ----------- Carousel Logic (Same as yours) -----------

  const testimonialTrack = document.getElementById('testimonialTrack');
  let cards = document.querySelectorAll('.slider-card');
  const testimonialPrev = document.getElementById('testimonialPrev');
  const testimonialNext = document.getElementById('testimonialNext');
  const testimonialDots = document.getElementById('testimonialDots');

  if (testimonialTrack && cards.length && testimonialPrev && testimonialNext && testimonialDots) {
    let pos = 0;
    let showCount = getVisibleCount();
    let totalCards = cards.length;
    let startX = 0;
    let endX = 0;

    function getVisibleCount() {
      const width = window.innerWidth;
      if (width <= 640) return 1;
      if (width <= 1023) return 2;
      return 3;
    }

    function cloneSlides() {
      const clonesBefore = [];
      const clonesAfter = [];
      for (let i = 0; i < showCount; i++) {
        const firstClone = cards[i].cloneNode(true);
        const lastClone = cards[cards.length - 1 - i].cloneNode(true);
        clonesAfter.push(firstClone);
        clonesBefore.unshift(lastClone);
      }
      clonesBefore.forEach(clone => testimonialTrack.prepend(clone));
      clonesAfter.forEach(clone => testimonialTrack.append(clone));
      cards = document.querySelectorAll('.slider-card');
      totalCards = cards.length;
    }

    cloneSlides();

    function updateCardWidths() {
      cards.forEach(card => {
        card.style.flex = `0 0 ${100 / showCount}%`;
        card.style.maxWidth = `${100 / showCount}%`;
      });
    }

    function refreshSlider() {
      showCount = getVisibleCount();
      updateCardWidths();
      const cardWidth = cards[0].offsetWidth;
      testimonialTrack.style.transition = 'none';
      testimonialTrack.style.transform = `translateX(-${(pos + showCount) * cardWidth}px)`;
      buildDots();
      updateActiveDot();
    }

    function buildDots() {
      testimonialDots.innerHTML = '';
      const realCards = totalCards - (2 * showCount);
      const maxPos = realCards - showCount;
      for (let i = 0; i <= maxPos; i++) {
        const dot = document.createElement('span');
        dot.className = `nav-dot${i === pos ? ' active' : ''}`;
        dot.addEventListener('click', () => {
          pos = i;
          moveToPosition();
        });
        testimonialDots.appendChild(dot);
      }
    }

    function updateActiveDot() {
      const dots = document.querySelectorAll('.nav-dot');
      const realCards = totalCards - (2 * showCount);
      let currentDot = pos;
      if (currentDot >= realCards) currentDot = 0;
      if (currentDot < 0) currentDot = realCards - 1;

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentDot);
      });
    }

    function moveToPosition() {
      const cardWidth = cards[0].offsetWidth;
      testimonialTrack.style.transition = 'transform 0.5s ease';
      testimonialTrack.style.transform = `translateX(-${(pos + showCount) * cardWidth}px)`;
      updateActiveDot();
    }

    function moveNext() {
      pos++;
      animateSlide();
    }

    function movePrev() {
      pos--;
      animateSlide();
    }

    function animateSlide() {
      const cardWidth = cards[0].offsetWidth;
      testimonialTrack.style.transition = 'transform 0.5s ease';
      testimonialTrack.style.transform = `translateX(-${(pos + showCount) * cardWidth}px)`;
      updateActiveDot();

      const realCards = totalCards - (2 * showCount);

      setTimeout(() => {
        if (pos < 0) {
          pos = realCards - 1;
          testimonialTrack.style.transition = 'none';
          testimonialTrack.style.transform = `translateX(-${(pos + showCount) * cardWidth}px)`;
        } else if (pos >= realCards) {
          pos = 0;
          testimonialTrack.style.transition = 'none';
          testimonialTrack.style.transform = `translateX(-${(pos + showCount) * cardWidth}px)`;
        }
        updateActiveDot();
      }, 500);
    }

    testimonialTrack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    testimonialTrack.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      if (startX - endX > swipeThreshold) {
        moveNext();
      } else if (endX - startX > swipeThreshold) {
        movePrev();
      }
    }

    testimonialNext.addEventListener('click', moveNext);
    testimonialPrev.addEventListener('click', movePrev);
    window.addEventListener('resize', refreshSlider);
    setInterval(moveNext, 5000);

    refreshSlider();
  

};
