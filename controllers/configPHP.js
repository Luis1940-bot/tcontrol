const getLogoSrc = async (plant, SERVER) => {
  const customLogoUrl = `${SERVER}/assets/Logos/${String(plant)}/logo.png`;
  const defaultLogoUrl = `${SERVER}/assets/Logos/tenki.png`;

  try {
    if (!plant) {
      return defaultLogoUrl;
    }
    const response = await fetch(customLogoUrl, { method: 'HEAD' });
    if (response.ok) {
      return customLogoUrl;
    }
    return defaultLogoUrl;
  } catch (error) {
    console.error('Error al verificar el logo:', error);
    return defaultLogoUrl;
  }
};

async function configPHP(user, SERVER) {
  try {
    // const idiomaPreferido = navigator.language || navigator.languages[0];
    // const partesIdioma = idiomaPreferido.split('-');
    // const idioma = partesIdioma[0];
    const { developer, content, by, rutaDeveloper, plant } = user;
    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription.setAttribute('content', content);
    const faviconLink = document.querySelector('link[rel="shortcut icon"]');
    faviconLink.href = `${SERVER}/assets/img/favicon.ico`;
    document.title = developer;
    const logoi = document.getElementById('logo_factum');
    // const srcValue =
    //   `${SERVER}/assets/Logos/${String(plant)}/logo.png` ||
    //   `${SERVER}/assets/img/logo.png`;
    const srcValue = await getLogoSrc(plant, SERVER);
    const altValue = 'Tenki Web';
    logoi.src = srcValue;
    logoi.alt = altValue;
    logoi.width = 100;
    logoi.height = 40;
    const footer = document.getElementById('footer');
    footer.innerText = by;
    footer.href = rutaDeveloper;
    const linkInstitucional = document.getElementById('linkInstitucional');
    linkInstitucional.href = rutaDeveloper;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warm(error);
  }
}

export { configPHP };
