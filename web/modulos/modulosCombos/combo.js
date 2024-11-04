let combos = [];
let productos = [];
let indexComboSeleccionado;
const comboPath = "combo.json";
const productoPath = "productos.json";
fetch(comboPath)
  .then(response => response.json())
  .then(jsondata => {
    combos = jsondata;
    actualizarCombos();
  });

fetch(productoPath)
  .then(response => response.json())
  .then(jsondata => {
    productos = jsondata;
    cargarProductos();
  });
function cargarProductos() {
  let productosHtml = "";
  productos.forEach(producto => {
    productosHtml += `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="${producto.nombre}" id="producto_${producto.nombre}" onchange="actualizarProductosSeleccionados()">
        <label class="form-check-label" for="producto_${producto.nombre}">
          ${producto.nombre}
        </label>
      </div>`;
  });
  document.getElementById("productosContainer").innerHTML = productosHtml;
  document.getElementById("productosContaineragregar").innerHTML = productosHtml; // Para el modal de agregar
}
function despliegaFoto() {
  const file = document.getElementById("txtFotoComboRuta").files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("txtFotoCombo").src = e.target.result;
  };
  if (file) {
    reader.readAsDataURL(file);
  } else {
    document.getElementById("txtFotoCombo").src = "img/nada.jpg";
  }
}
function actualizarProductosSeleccionados() {
  const productosSeleccionados = Array.from(document.querySelectorAll("#productosContainer input[type='checkbox']:checked")).map(cb => cb.value);
  document.getElementById("productosSeleccionados").innerHTML = productosSeleccionados.length > 0 
    ? `<ul>${productosSeleccionados.map(producto => `<li>${producto}</li>`).join('')}</ul>`
    : 'No hay productos seleccionados.';

  if (indexComboSeleccionado !== undefined) {
    combos[indexComboSeleccionado].productos = productosSeleccionados;
  }
}
function guardarCombo() {
  const nombre = document.getElementById("txtNombreCombo").value;
  const descripcion = document.getElementById("txtDescripcionCombo").value;
  const precio = document.getElementById("txtPrecioCombo").value;
  const productosSeleccionados = Array.from(document.querySelectorAll("#productosContainer input[type='checkbox']:checked")).map(cb => cb.value);
  const fotoInput = document.getElementById("txtFotoComboRuta").files[0];
  const foto = fotoInput 
    ? URL.createObjectURL(fotoInput) 
    : (indexComboSeleccionado !== undefined ? combos[indexComboSeleccionado].foto : "img/nada.jpg");
  if (nombre && descripcion && precio) {
    const combo = {
      id: indexComboSeleccionado === undefined ? combos.length + 1 : combos[indexComboSeleccionado].id,
      nombre,
      descripcion,
      precio: parseFloat(precio),
      estado: "Activo",
      foto,
      productos: productosSeleccionados
    };
    if (indexComboSeleccionado === undefined) {
      combos.push(combo);
    } else {
      combos[indexComboSeleccionado] = combo;
    }
    actualizarCombos();
    limpiar();
    const modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
    modal.hide();
  } else {
    alert("Por favor, completa todos los campos.");
  }
}
function limpiar() {
  document.getElementById("txtNombreCombo").value = "";
  document.getElementById("txtDescripcionCombo").value = "";
  document.getElementById("txtPrecioCombo").value = "";
  document.querySelectorAll("#productosContainer input[type='checkbox']").forEach(cb => cb.checked = false);
  document.getElementById("txtFotoComboRuta").value = "";
  document.getElementById("txtFotoCombo").src = "img/nada.jpg";
  document.getElementById("productosSeleccionados").innerHTML = 'No hay productos seleccionados.';
  indexComboSeleccionado = undefined;
}
function actualizarCombos() {
  let cuerpo = "";
  combos.forEach((combo, index) => {
    let productosHtml = combo.productos.length > 0
      ? `<ul>${combo.productos.map(producto => `<li>${producto}</li>`).join('')}</ul>`
      : 'No hay productos seleccionados.';
    let registro = `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100" onclick="selectCombo(${index});">
          <img src="${combo.foto}" class="card-img-top" alt="${combo.nombre}">
          <div class="card-body">
            <h4 class="card-title">${combo.nombre}</h4>
            <p class="card-text">${combo.descripcion}</p>
            <p class="card-text">Precio: ${combo.precio}</p>
            <p class="card-text">Estado: ${combo.estado}</p>
            <div class="mt-2">
              <strong>Productos:</strong>
              ${productosHtml}
            </div>
          </div>
        </div>
      </div>`;
    cuerpo += registro;
  });
  document.getElementById("tblCombos").innerHTML = cuerpo;
}
function search() {
  const input = document.getElementById("inputBusqueda").value.toUpperCase();
  const combosDiv = document.getElementById("tblCombos").getElementsByClassName("card");
  Array.from(combosDiv).forEach(card => {
    const h4 = card.getElementsByTagName("h4")[0];
    const p = card.getElementsByTagName("p");
    let found = false;
    if (h4 && h4.textContent.toUpperCase().includes(input)) {
      found = true;
    }
    Array.from(p).forEach(pTag => {
      if (pTag.textContent.toUpperCase().includes(input)) {
        found = true;
      }
    });
    card.style.display = found ? "" : "none";
  });
}
function selectCombo(index) {
  const combo = combos[index];
  document.getElementById("txtNombreCombo").value = combo.nombre;
  document.getElementById("txtDescripcionCombo").value = combo.descripcion;
  document.getElementById("txtPrecioCombo").value = combo.precio;
  document.querySelectorAll("#productosContainer input[type='checkbox']").forEach(cb => {
    cb.checked = combo.productos.includes(cb.value);
  });
  document.getElementById("txtFotoCombo").src = combo.foto;
  indexComboSeleccionado = index;
  actualizarProductosSeleccionados();
  new bootstrap.Modal(document.getElementById('formModal')).show();
}
function eliminarCombo() {
  if (indexComboSeleccionado === undefined) {
    alert("Selecciona un combo para eliminar.");
    return;
  }
  if (confirm("¿Estás seguro de que deseas eliminar este combo?")) {
    combos.splice(indexComboSeleccionado, 1);
    actualizarCombos();
    limpiar();
  }
}
function activarCombo() {
  if (indexComboSeleccionado === undefined) {
    alert("Selecciona un combo para activar.");
    return;
  }
  combos[indexComboSeleccionado].estado = "Activo";
  actualizarCombos();
  limpiar();
}
function desactivarCombo() {
  if (indexComboSeleccionado === undefined) {
    alert("Selecciona un combo para desactivar.");
    return;
  }
  combos[indexComboSeleccionado].estado = "Inactivo";
  actualizarCombos();
  limpiar();
}
function limpiarFormularioPlatillo() {
  document.getElementById("txtNombrePlatillo").value = "";
  document.getElementById("txtDescripcionPlatillo").value = "";
  document.getElementById("txtPrecioPlatillo").value = "";
  document.getElementById("txtFotoPlatilloRuta").value = "";
  document.getElementById("txtFotoPlatillo").src = "img/nada.jpg";
  document.querySelectorAll("#productosContaineragregar input[type='checkbox']").forEach(cb => cb.checked = false);
}
function despliegaFotoPlatillo() {
  const file = document.getElementById("txtFotoPlatilloRuta").files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("txtFotoPlatillo").src = e.target.result;
  };
  if (file) {
    reader.readAsDataURL(file);
  } else {
    document.getElementById("txtFotoPlatillo").src = "img/nada.jpg";
  }
}
function agregarPlatillo() {
  const nombre = document.getElementById("txtNombrePlatillo").value.trim();
  const descripcion = document.getElementById("txtDescripcionPlatillo").value.trim();
  const precio = document.getElementById("txtPrecioPlatillo").value.trim();
  const fotoInput = document.getElementById("txtFotoPlatilloRuta").files[0];
  const foto = fotoInput ? URL.createObjectURL(fotoInput) : "img/nada.jpg"; // Foto por defecto si no se sube una nueva
  let errorMessage = "";
  if (!nombre) {
    errorMessage += "El nombre del platillo es obligatorio.\n";
  }
  if (!descripcion) {
    errorMessage += "La descripción del platillo es obligatoria.\n";
  }
  if (!precio || isNaN(precio) || parseFloat(precio) <= 0) {
    errorMessage += "El precio del platillo debe ser un número positivo.\n";
  }
  if (!fotoInput && foto === "img/nada.jpg") {
    errorMessage += "Debes proporcionar una foto del platillo.\n";
  }
  if (errorMessage) {
    alert(errorMessage);
    return; // No continuar si hay errores
  }
  const productosSeleccionados = Array.from(document.querySelectorAll("#productosContaineragregar input[type='checkbox']:checked"))
    .map(cb => cb.value);
  const combo = {
    id: indexComboSeleccionado === undefined ? combos.length + 1 : combos[indexComboSeleccionado].id,
    nombre,
    descripcion,
    precio: parseFloat(precio),
    estado: "Activo",
    foto,
    productos: productosSeleccionados
  };
  if (indexComboSeleccionado === undefined) {
    combos.push(combo);
  } else {
    combos[indexComboSeleccionado] = combo;
  }
  actualizarCombos();
  limpiarFormularioPlatillo();
  const modal = bootstrap.Modal.getInstance(document.getElementById('addPlatilloModal'));
  modal.hide();
}
document.addEventListener('DOMContentLoaded', cargarProductos);
