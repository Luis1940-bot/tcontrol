function trO(palabra, objTranslate) {
  try {
    if (!palabra || !objTranslate) {
      return palabra || '';
    }
    const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
    const index = objTranslate.operativoES.findIndex(
      (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
    );

    if (index !== -1) {
      return objTranslate.operativoTR[index];
    }
    return palabra;
  } catch (error) {
    // eslint-disable-next-line indent, no-console
    console.log(error);
    return palabra;
  }
}

function trA(palabra, objTranslate) {
  try {
    if (!palabra || !objTranslate) {
      return palabra || '';
    }
    const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
    const index = objTranslate.archivosES.findIndex(
      (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
    );
    if (index !== -1) {
      return objTranslate.archivosTR[index];
    }
    return palabra;
  } catch (error) {
    // eslint-disable-next-line indent, no-console
    console.log(error);
    return palabra;
  }
}

export { trO, trA };
