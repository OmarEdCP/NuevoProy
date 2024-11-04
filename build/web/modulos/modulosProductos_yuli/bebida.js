let productos = [];
let indexProductoSeleccionado;
const path = "producto.json";
fetch(path)
  .then(response => response.json())
  .then(jsondata => {
    productos = jsondata;
    actuaLizaTabla();
  });
function validarCampos() {
  let nombre = document.getElementById("addNomProd").value.trim();
  let descripcion = document.getElementById("addDescripcion").value.trim();
  let precio = document.getElementById("addPrecio").value.trim();
  let categoria = document.getElementById("addTipo").value.trim();
  let fotoRuta = document.getElementById("addFotoRuta").value.trim();
  if (!nombre || !descripcion || !precio || !categoria || !fotoRuta) {
    alert("Todos los campos son obligatorios. Por favor, completa todos los campos.");
    return false;
  }
  if (isNaN(precio) || parseFloat(precio) <= 0) {
    alert("Por favor, ingresa un precio válido.");
    return false;
  }
  return true;
}
function actuaLizaTabla() {
  let cuerpo = "";
  productos.forEach((elemento, index) => {
    let registro = `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100" onclick="selectPlatillo(${index});">
          <img src="${elemento.foto}" class="card-img-top" alt="${elemento.nomProd}">
          <div class="card-body">
            <h4 class="card-title">${elemento.nomProd}</h4>
            <p class="card-text">${elemento.descripcion}</p>
            <p class="card-text">Precio: ${elemento.precio}</p>
            <p class="card-text">Categoría: ${elemento.tipo}</p>
            <p class="card-text">Estatus: ${elemento.estatus}</p>
          </div>
        </div>
      </div>`;
    cuerpo += registro;
  });
  document.getElementById("tblProductos").innerHTML = cuerpo;
}
function selectPlatillo(index) {
  document.getElementById("txtNombre").value = productos[index].nomProd;
  document.getElementById("txtDescripcion").value = productos[index].descripcion;
  document.getElementById("txtPrecio").value = productos[index].precio;
  document.getElementById("txtTipo").value = productos[index].tipo;
  document.getElementById("txtFoto").src = productos[index].foto || 'img/nada.jpg'; // Asegúrate de que siempre haya una ruta de imagen válida
  document.getElementById("txtFotoRuta").value = "";
  indexProductoSeleccionado = index;
  var myModal = new bootstrap.Modal(document.getElementById('formModal'));
  myModal.show();
}
function limpiar() {
  document.getElementById("txtNombre").value = "";
  document.getElementById("txtDescripcion").value = "";
  document.getElementById("txtPrecio").value = "";
  document.getElementById("txtTipo").value = "";
  document.getElementById("txtFoto").src = "img/nada.jpg";
  document.getElementById('txtFotoRuta').value = "";
}
function obtenerNombreFoto() {
  let nombreFoto = document.getElementById("txtFotoRuta").value;
  nombreFoto = 'img/' + nombreFoto.substring(nombreFoto.lastIndexOf("\\") + 1);
  return nombreFoto;
}
async function despliegaFoto() {
  let imageURL = obtenerNombreFoto();
  try {
    const response = await fetch(imageURL);
    if (!response.ok) throw new Error('No se pudo cargar la imagen');
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = function () {
      document.getElementById('txtFoto').src = reader.result;
    };
  } catch (error) {
    console.error('Error al cargar la imagen:', error);
    alert('Error al cargar la imagen');
  }
}
function limpiarf() {
  document.getElementById("addNomProd").value = "";
  document.getElementById("addDescripcion").value = "";
  document.getElementById("addPrecio").value = "";
  document.getElementById("addTipo").value = "";
  document.getElementById("addFoto").src = "img/nada.jpg";
  document.getElementById('addFotoRuta').value = "";
}
function obtenerNombreFotof() {
  let nombreFoto = document.getElementById("addFotoRuta").value;
  nombreFoto = 'img/' + nombreFoto.substring(nombreFoto.lastIndexOf("\\") + 1);
  return nombreFoto;
}
async function despliegaFotof() {
  let imageURL = obtenerNombreFotof();
  try {
    const response = await fetch(imageURL);
    if (!response.ok) throw new Error('No se pudo cargar la imagen');
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = function () {
      document.getElementById('addFoto').src = reader.result;
    };
  } catch (error) {
    console.error('Error al cargar la imagen:', error);
    alert('Error al cargar la imagen');
  }
}
function agregarNuevoPlatillo() {
  if (!validarCampos()) return; // Si la validación falla, no continuar
  let nombre = document.getElementById("addNomProd").value.trim();
  let descripcion = document.getElementById("addDescripcion").value.trim();
  let precio = parseFloat(document.getElementById("addPrecio").value.trim());
  let categoria = document.getElementById("addTipo").value.trim();
  let fotoRuta = obtenerNombreFotof(); // Obtiene la ruta de la foto
  if (isNaN(precio) || precio <= 0) {
    alert("Por favor, ingresa un precio válido.");
    return;
  }
  let nuevoProducto = {
    nomProd: nombre,
    descripcion: descripcion,
    precio: precio,
    tipo: categoria,
    foto: fotoRuta,
    estatus: "Activo" // Establecer el estatus por defecto como Activo
  };
  productos.push(nuevoProducto);
  actuaLizaTabla();
  limpiarf();
  var modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
  if (modal) {
    modal.hide();
  }
}
function modificaPlatillo() {
  if (indexProductoSeleccionado !== undefined && indexProductoSeleccionado !== null) {
    let nombre = document.getElementById("txtNombre").value.trim();
    let descripcion = document.getElementById("txtDescripcion").value.trim();
    let precio = parseFloat(document.getElementById("txtPrecio").value.trim());
    let categoria = document.getElementById("txtTipo").value.trim();
    if (isNaN(precio) || precio <= 0) {
      alert("Por favor, ingresa un precio válido.");
      return;
    }
    let foto;
    if (document.getElementById("txtFotoRuta").files.length > 0) {
      foto = obtenerNombreFoto(); // Función para obtener el nombre de la foto cargada
    } else {
      foto = productos[indexProductoSeleccionado].foto; // Mantener la foto actual si no se carga una nueva
    }
    productos[indexProductoSeleccionado] = {
      nomProd: nombre,
      descripcion: descripcion,
      precio: precio,
      tipo: categoria,
      foto: foto,
      estatus: productos[indexProductoSeleccionado].estatus // Preservar el estatus actual
    };
    actuaLizaTabla();
    limpiar();
  } else {
    alert("Selecciona un producto antes de intentar modificarlo.");
  }
}
function eliminarPlatillo() {
    let index = indexProductoSeleccionado;
    if (index !== undefined && index !== null) {
        if (confirm("¿Desea eliminar el Producto?")) {
            productos[index].estatus = "Desactivo";
        } else {
            productos[index].estatus = "Activo";
        }
    }
    actuaLizaTabla();
    limpiar();
}
function search() {
    let input = document.getElementById("inputBusqueda");
    let filter = input.value.toUpperCase();
    let table_body = document.getElementById("tblProductos");
    let divs = table_body.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
        let display = "none";
        let p = divs[i].getElementsByTagName("p");
        let h4 = divs[i].getElementsByTagName("h4");
        for (let j = 0; j < p.length; j++) {
            let txtValue = p[j].textContent || p[j].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                display = "";
                break;
            }
        }
        for (let j = 0; j < h4.length; j++) {
            let txtValue = h4[j].textContent || h4[j].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                display = "";
                break;
            }
        }
        divs[i].style.display = display;
    }
}
function activarProducto() {
    let index = indexProductoSeleccionado;
    if (index !== undefined && index !== null) {
        if (confirm("¿Desea Activar el Producto?")) {
            productos[index].estatus = "Activo";
        } else {
            productos[index].estatus = "Desactivar";
        }
    }
    actuaLizaTabla();
    limpiar();
}
