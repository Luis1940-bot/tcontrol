class ElementGenerator {
  static generateInputDate(date, width) {
    const inputDate = document.createElement('input');
    inputDate.setAttribute('type', 'date');
    date ? inputDate.value = date : null;
    width ? inputDate.style.width = width : null;
    return inputDate;
  }

  static generateInputHora(hora, width) {
    const inputHora = document.createElement('input');
    inputHora.setAttribute('type', 'time');
    hora ? inputHora.value = hora : null;
    width ? inputHora.style.width = width : null;
    return inputHora;
  }

  static generateInputText(width) {
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    width ? inputText.style.width = width : null;
    return inputText;
  }

  static generateInputCheckBox(checked) {
    const inputCheckBox = document.createElement('input');
    inputCheckBox.setAttribute('type', 'checkbox');
    inputCheckBox.setAttribute('checked', checked);
    return inputCheckBox;
  }

  static generateInputNumber(width) {
    const inputNumber = document.createElement('input');
    inputNumber.setAttribute('type', 'text');
    inputNumber.setAttribute('inputmode', 'decimal');
    inputNumber.setAttribute('pattern', '^[0-9]*[.]?[0-9]*$');
    width ? inputNumber.style.width = width : null;
    inputNumber.addEventListener('input', function handleInput() {
      this.value = this.value.replace(/[^\d.]/g, '');
    });
    inputNumber.addEventListener('blur', function handleBlur() {
      this.value = parseFloat(this.value).toLocaleString();
    });
    return inputNumber;
  }

  static generateTextArea() {
    const textArea = document.createElement('textarea');
    return textArea;
  }

  static generateSelectDinamic() {
    const selectDinamic = document.createElement('select');
    return selectDinamic;
  }

  static generateSelect(array) {
    const select = document.createElement('select');
    if (array.length > 0) {
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.text = '';
      select.appendChild(emptyOption);
      array.forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.text = text;
        select.appendChild(option);
      });
    }
    return select;
  }

  static generateOptions(array, select) {
    if (array.length > 0) {
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.text = '';
      select.appendChild(emptyOption);
      array.forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.text = text;
        select.appendChild(option);
      });
    }
  }

  static generateImg() {
    const img = document.createElement('img');
    return img;
  }

  static generateInputButton(text) {
    const div = document.createElement('div');
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    div.appendChild(inputText);
    const button = document.createElement('button');
    button.textContent = text;
    button.style.background = '#97B7E8';
    div.appendChild(button);
    return div;
  }

  static generateButtonQuery(text) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.background = '#97B7E8';
    return button;
  }

  static generateSelectedRadioButton(checked, name) {
    const radioButton = document.createElement('input');
    radioButton.setAttribute('type', 'radio');
    radioButton.checked = checked;
    name !== '0' ? radioButton.name = name : null;
    return radioButton;
  }
}

// Exporta la clase para que pueda ser utilizada desde otros archivos
export default ElementGenerator;
