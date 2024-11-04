let obj = []; // Arreglo que se llenará de objetos JSON
let indexProductosSeleccionados; // Índice del arreglo
let path = "DatosUsuario.json";
fetch(path)
    .then(response => response.json())
    .then(jsondata => {
        obj = jsondata;
        console.log(obj);
        actualizaTabla();
    })
    .catch(error => {
        console.error('Error al cargar el JSON:', error);
    });
function validarCampos() {
    let nombre = document.getElementById("txtNombres").value.trim();
    let contrasena = document.getElementById("txtContrasenas").value.trim();
    if (!nombre || !contrasena) {
        alert("Todos los campos son obligatorios. Por favor, completa todos los campos.");
        return false;
    }
    if (!validarContrasena(contrasena)) return false;
    return true;
}
function validarContrasena(contrasena) {
    const longitudMinima = 6;
    const tieneLetra = /[a-zA-Z]/.test(contrasena);
    const tieneNumero = /[0-9]/.test(contrasena);
    if (contrasena.length < longitudMinima || !tieneLetra || !tieneNumero) {
        alert("La contraseña debe tener al menos 6 caracteres, contener al menos una letra y un número.");
        return false;
    }
    return true;
}
function actualizaTabla() {
    let cuerpo = "";
    obj.forEach(function (elemento, index) {
        let registro = `<tr onclick="selectProducto(${index});">` +
                       `<td>${index}</td>` +
                       `<td>${elemento.nomProd}</td>` +
                       `<td>${elemento.contrasena}</td>` +
                       `<td>${elemento.Estatus}</td>` +
                       `</tr>`;
        cuerpo += registro;
    });
    document.getElementById("tblProductos").innerHTML = cuerpo;
}
function selectProducto(index) {
    document.getElementById("txtNombre").value = obj[index].nomProd;
    document.getElementById("txtContrasena").value = obj[index].contrasena;
    indexProductosSeleccionados = index;

    var myModal = new bootstrap.Modal(document.getElementById('formModal'));
    myModal.show();
}
function limpiar() {
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtContrasena").value = "";
    
    indexProductosSeleccionados = null; // Usar null en lugar de 0 para indicar que no hay selección
}
function limpiare() {
    document.getElementById("txtNombres").value = "";
    document.getElementById("txtContrasenas").value = "";
    indexProductosSeleccionados = null; // Usar null en lugar de 0 para indicar que no hay selección
}
function search() {
    var num_cols = 4; // Cambiado a 4 ya que la tabla tiene 4 columnas
    var input = document.getElementById("inputBusqueda");
    var filter = input.value.toUpperCase();
    var table_body = document.getElementById("tblProductos");
    var tr = table_body.getElementsByTagName("tr");
    for (var i = 0; i < tr.length; i++) {
        var display = "none";
        var td = tr[i].getElementsByTagName("td");
        for (var j = 0; j < num_cols; j++) {
            if (td[j]) {
                var txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    display = "";
                    break; // Salir del bucle si se encuentra una coincidencia
                }
            }
        }
        tr[i].style.display = display;
    }
}
function agregarProducto() {
    if (!validarCampos()) return; 
    let nombre = document.getElementById("txtNombres").value;
    let contrasena = document.getElementById("txtContrasenas").value;

    let newProd = {
        nomProd: nombre,
        contrasena: contrasena,
        Estatus: "Activo"
    };
    obj.push(newProd);
    let jsonData = JSON.stringify(obj);
    console.log(jsonData);
    console.log(typeof (jsonData));
    actualizaTabla();
    limpiare();
}
function modificaProducto() {
    if (indexProductosSeleccionados === undefined || indexProductosSeleccionados === null) {
        alert("No hay ningún producto seleccionado para modificar.");
        return;
    }
    let nombre = document.getElementById("txtNombre").value.trim();
    let contrasena = document.getElementById("txtContrasena").value.trim();
    if (!nombre || !contrasena) {
        alert("Todos los campos son obligatorios. Por favor, completa todos los campos.");
        return;
    }
    if (confirm("¿Desea cambiar el Usuario?")) {
        obj[indexProductosSeleccionados] = {
            nomProd: nombre,
            contrasena: contrasena,
            Estatus: obj[indexProductosSeleccionados].Estatus // Mantener el estatus actual
        };
    }
    actualizaTabla();
    limpiar();
}
function eliminarProducto() {
    if (indexProductosSeleccionados === undefined || indexProductosSeleccionados === null) {
        alert("No hay ningún producto seleccionado para eliminar.");
        return;
    }
    if (confirm("¿Desea eliminar el Usuario?")) {
        obj[indexProductosSeleccionados].Estatus = "Desactivo";
    }
    actualizaTabla();
    limpiar();
}
function activarProducto() {
    if (indexProductosSeleccionados === undefined || indexProductosSeleccionados === null) {
        alert("No hay ningún producto seleccionado para activar.");
        return;
    }
    if (confirm("¿Desea activar el Usuario?")) {
        obj[indexProductosSeleccionados].Estatus = "Activo";
    }
    actualizaTabla();
    limpiar();
}
