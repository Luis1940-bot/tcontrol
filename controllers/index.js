document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.querySelector('.spinner');
  spinner.style.visibility = 'visible';
  setTimeout(() => {
    window.location.href = './Pages/Landing/';
  }, 1000);
});
