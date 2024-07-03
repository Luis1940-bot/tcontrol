function configPHP(user, SERVER) {
  try {
    const idiomaPreferido = navigator.language || navigator.languages[0]
    const partesIdioma = idiomaPreferido.split('-')
    const idioma = partesIdioma[0]
    const { developer, content, by, rutaDeveloper, logo } = user
    const metaDescription = document.querySelector('meta[name="description"]')
    metaDescription.setAttribute('content', content)
    const faviconLink = document.querySelector('link[rel="shortcut icon"]')
    faviconLink.href = `${SERVER}/assets/img/favicon.ico`
    document.title = developer
    const logoi = document.getElementById('logo_factum')
    const srcValue = `${SERVER}/assets/img/${logo}.png`
    const altValue = 'Tenki Web'
    logoi.src = srcValue
    logoi.alt = altValue
    logoi.width = 100
    logoi.height = 40
    const footer = document.getElementById('footer')
    footer.innerText = by
    footer.href = rutaDeveloper
    const linkInstitucional = document.getElementById('linkInstitucional')
    linkInstitucional.href = rutaDeveloper
  } catch (error) {
    console.log(error)
  }
}

export { configPHP }
