const pdf = new jsPDF('p', 'pt', 'a4');

pdf.addHTML(document.body, () => {
  const string = pdf.output('datauristring');
  $('.preview-pane').attr('src', string);
});
