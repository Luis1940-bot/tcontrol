function contenidoRow(clase,stylo0,stylo1,stylo2, stylo3, tag) {
  let contenidoFila = `
              <tr class=${clase} >
                    <td   ${stylo0}></td>
                    <td   ${stylo1}>${tag}</td>
                    <td   ${stylo2} ></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                    <td   ${stylo3}></td>
                </tr>
             `;
  return contenidoFila;
}

export {contenidoRow}