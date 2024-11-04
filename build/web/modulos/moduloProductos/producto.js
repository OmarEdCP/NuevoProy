let obj = [];
let indexProductoSeleccionado;
const path = "datoProductos.json";
fetch(path)
  .then(response => response.json())
  .then(jsondata => {
    obj = jsondata;
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
  obj.forEach(function (elemento, index) {
    let registro = `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100" onclick="selectPlatillo(${index});">
          <img src="${elemento.foto}" class="card-img-top" alt="${elemento.nomProd}">
          <div class="card-body">
            <h4 class="card-title">${elemento.nomProd}</h4>
            <p class="card-text">${elemento.Descripcion}</p>
            <p class="card-text">Precio: ${elemento.Precio}</p>
            <p class="card-text">Categoría: ${elemento.Categoria}</p>
            <p class="card-text">Estatus: ${elemento.Estatus}</p>
          </div>
        </div>
      </div>`;
    cuerpo += registro;
  });
  document.getElementById("tblProductos").innerHTML = cuerpo;
}
function selectPlatillo(index) {
  document.getElementById("txtnomProd").value = obj[index].nomProd;
  document.getElementById("txtdescripcion").value = obj[index].Descripcion;
  document.getElementById("txtprecio").value = obj[index].Precio;
  document.getElementById("txtTipo").value = obj[index].Categoria;
  document.getElementById("txtFoto").src = obj[index].foto || 'img/nada.jpg'; // Asegúrate de tener una imagen predeterminada
  document.getElementById("txtFotoRuta").value = "";
  indexProductoSeleccionado = index;
  var myModal = new bootstrap.Modal(document.getElementById('formModal'));
  myModal.show();
}
function limpiar() {
  document.getElementById("txtnomProd").value = "";
  document.getElementById("txtdescripcion").value = "";
  document.getElementById("txtprecio").value = "";
  document.getElementById("txtTipo").value = "";
  document.getElementById("txtFoto").src = "img/nada.jpg";
  document.getElementById('txtFotoRuta').value = "";
}
function limpiarf() {
  document.getElementById("addNomProd").value = "";
  document.getElementById("addDescripcion").value = "";
  document.getElementById("addPrecio").value = "";
  document.getElementById("addTipo").value = "";
  document.getElementById("addFoto").src = "img/nada.jpg";
  document.getElementById('addFotoRuta').value = "";
}
function obtenerNombreFoto(campoId) {
  let nombreFoto = document.getElementById(campoId).value;
  nombreFoto = 'img/' + nombreFoto.substring(nombreFoto.lastIndexOf("\\") + 1);
  return nombreFoto;
}
async function despliegaFoto() {
  let imageURL = obtenerNombreFoto("txtFotoRuta");
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
async function despliegaFotof() {
  let imageURL = obtenerNombreFoto("addFotoRuta");
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
  let nombre = document.getElementById("addNomProd").value;
  let descripcion = document.getElementById("addDescripcion").value;
  let precio = document.getElementById("addPrecio").value;
  let Categoria = document.getElementById("addTipo").value;
  let fotoNueva = obtenerNombreFoto("addFotoRuta");
  let newProd = {
    nomProd: nombre,
    Descripcion: descripcion,
    Precio: precio,
    foto: fotoNueva,
    Categoria: Categoria,
    Estatus: "Activo"
  };
  obj.push(newProd);
  actuaLizaTabla();
  limpiarf();
  var myModal = bootstrap.Modal.getInstance(document.getElementById('btnAgregar'));
  if (myModal) myModal.hide(); // Cerrar el modal
}
function modificaPlatillo() {
  if (indexProductoSeleccionado !== undefined && indexProductoSeleccionado !== null) {
    let nombre = document.getElementById("txtnomProd").value;
    let descripcion = document.getElementById("txtdescripcion").value;
    let precio = document.getElementById("txtprecio").value;
    let Categoria = document.getElementById("txtTipo").value;
    let foto;
    if (document.getElementById("txtFotoRuta").files.length > 0) {
      foto = obtenerNombreFoto("txtFotoRuta");
    } else {
      foto = obj[indexProductoSeleccionado].foto; // Mantener la foto actual si no se selecciona una nueva
    }
    obj[indexProductoSeleccionado] = {
      nomProd: nombre,
      Descripcion: descripcion,
      Precio: precio,
      Categoria: Categoria,
      foto: foto,
      Estatus: obj[indexProductoSeleccionado].Estatus // Mantener el estatus actual
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
      obj[index].Estatus = "Desactivo";
    } else {
      obj[index].Estatus = "Activo";
    }
  }
  actuaLizaTabla();
  limpiar();
}
function search() {
  let num_cols = 3;
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
      obj[index].Estatus = "Activo";
    } else {
      obj[index].Estatus = "Desactivo";
    }
  }
  actuaLizaTabla();
  limpiar();
}
