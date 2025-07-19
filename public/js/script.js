// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


// prevent the the looping of bootstrap carousel
  const Carousel = document.querySelector('#carouselExampleDark');
  const carousel = new bootstrap.Carousel(Carousel, {
    interval: false,
    wrap: false // disables looping back to the first item
  });

  // it will apper and disapper navigating arrow of slider accordingly
  const carouselElement = document.querySelector('#carouselExampleDark');
  const prevBtn = carouselElement.querySelector('.carousel-control-prev');
  const nextBtn = carouselElement.querySelector('.carousel-control-next');

  const updateButtons = () => {
    const items = carouselElement.querySelectorAll('.carousel-item');
    const activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));

    // Hide prev if on first item
    if (activeIndex === 0) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'block';
    }

    // Hide next if on last item
    if (activeIndex === items.length - 1) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'block';
    }
  };

  // Initialize carousel without wrapping
  const myCarousel = new bootstrap.Carousel(carouselElement, {
    interval: false,
    wrap: false
  });

  // Update buttons on load
  updateButtons();

  // Update buttons after each slide transition
  carouselElement.addEventListener('slid.bs.carousel', updateButtons);