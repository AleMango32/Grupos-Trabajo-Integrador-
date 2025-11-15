
document.addEventListener('DOMContentLoaded', function () {
 
  const images = [
    'images/img1.jpg',
    'images/img2.jpg',
    'images/img3.jpg'
  ];
  let currentIndex = 0;
  const carouselImage = document.getElementById('carouselImage');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  let intervalId = null;
  const AUTOPLAY_MS = 3000;

  function renderDots() {
    if(!dotsContainer) return;
    dotsContainer.innerHTML = '';
    images.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.classList.toggle('active', i === currentIndex);
      btn.setAttribute('aria-label', 'Ir a imagen ' + (i+1));
      btn.addEventListener('click', () => {
        goTo(i);
        resetAutoplay();
      });
      dotsContainer.appendChild(btn);
    });
  }

  function show(index) {
    currentIndex = (index + images.length) % images.length;
    if (carouselImage) {
      carouselImage.src = images[currentIndex];
      carouselImage.alt = `Imagen ${currentIndex+1}`;
    }
    renderDots();
  }

  function next() { show(currentIndex + 1); }
  function prev() { show(currentIndex - 1); }
  function goTo(i) { show(i); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() { if (intervalId) clearInterval(intervalId); }
  function resetAutoplay(){ startAutoplay(); }

 
  const carouselEl = document.getElementById('carousel');
  if (carouselEl) {
    carouselEl.addEventListener('mouseenter', stopAutoplay);
    carouselEl.addEventListener('mouseleave', startAutoplay);
  }

  if (images.length && carouselImage) {
    show(0);
    startAutoplay();
  }

 
  const form = document.getElementById('contactForm');
  if (form) {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    const mensaje = document.getElementById('mensaje');
    const result = document.getElementById('result');

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const telefonoRegex = /^[+\d\s().-]{7,20}$/;

    function clearErrors() {
      ['error-nombre','error-email','error-telefono','error-mensaje'].forEach(id=>{
        const el = document.getElementById(id);
        if(el) el.textContent = '';
      });
    }

    function validate() {
      clearErrors();
      let ok = true;

      if (!nombre.value.trim()) {
        document.getElementById('error-nombre').textContent = 'El nombre es obligatorio.';
        ok = false;
      } else if (nombre.value.trim().length > 50) {
        document.getElementById('error-nombre').textContent = 'Máx 50 caracteres.';
        ok = false;
      }

      if (!email.value.trim()) {
        document.getElementById('error-email').textContent = 'El email es obligatorio.';
        ok = false;
      } else if (email.value.trim().length > 80) {
        document.getElementById('error-email').textContent = 'Máx 80 caracteres.';
        ok = false;
      } else if (!emailRegex.test(email.value.trim())) {
        document.getElementById('error-email').textContent = 'Formato de email inválido.';
        ok = false;
      }

      if (!telefono.value.trim()) {
        document.getElementById('error-telefono').textContent = 'El teléfono es obligatorio.';
        ok = false;
      } else if (telefono.value.trim().length > 20) {
        document.getElementById('error-telefono').textContent = 'Máx 20 caracteres.';
        ok = false;
      } else if (!telefonoRegex.test(telefono.value.trim())) {
        document.getElementById('error-telefono').textContent = 'Formato de teléfono inválido.';
        ok = false;
      }

      if (mensaje.value.trim().length > 500) {
        document.getElementById('error-mensaje').textContent = 'Máx 500 caracteres.';
        ok = false;
      }

      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      result.innerHTML = ''; // limpiar
      if (validate()) {
        
        const container = document.createElement('div');
        container.className = 'submitted';

        const heading = document.createElement('h2');
        heading.textContent = 'Datos enviados';
        container.appendChild(heading);

        const ul = document.createElement('ul');
        [['Nombre', nombre.value.trim()], ['Email', email.value.trim()], ['Teléfono', telefono.value.trim()], ['Mensaje', mensaje.value.trim() || '(sin mensaje)']].forEach(([k,v])=>{
          const li = document.createElement('li');
          li.innerHTML = `<strong>${k}:</strong> ${escapeHtml(v)}`;
          ul.appendChild(li);
        });
        container.appendChild(ul);

        result.appendChild(container);

        form.reset();
      } else {
        
        const firstError = document.querySelector('.error:not(:empty)');
        if(firstError) firstError.scrollIntoView({behavior:'smooth', block:'center'});
      }
    });

    
    form.addEventListener('invalid', (e)=> { e.preventDefault(); }, true);
  }

  function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function(m){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]);
    });
  }
});
