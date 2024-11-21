const sliders = document.querySelectorAll('.linear-slider');

sliders.forEach((slider) => {
  slider.addEventListener('input', (e) => {
    const value = e.target.value;
    const max = e.target.max;

    const percentage = (value / max) * 100;
    e.target.style.background = `linear-gradient(to right, rgb(18, 211, 18) ${percentage}%, #444 ${percentage}%)`;
  });
});
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', function () {
    const Automatico = this.textContent;
    document.getElementById('dropdownButton').textContent = Automatico;
  });
});