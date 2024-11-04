let obj = []; // Arreglo que se llenará de objetos JSON
let indexProductosSeleccionados; // Índice del arreglo
let path = "http://localhost:8080/Proyecto1/modulos/modulosProductos_omar/";

fetch(path + "datoSucursal.json")
        .then((response) => response.json())
        .then((jsondata) => {
            obj = jsondata;
            console.log(obj);
            actualizaTabla();
        })
        .catch((error) => {
            console.error('Error al cargar el JSON:', error);
        });

let map;
 function validarCampos() {
    let nombre = document.getElementById("txtNombre").value.trim();
     let descripcion = document.getElementById("txtDescripcion").value.trim();
    let precio = document.getElementById("txtPrecio").value.trim();
    let precio1 = document.getElementById("txtPrecio1").value.trim();
    let precio2 =  document.getElementById("txtPrecio2").value.trim();
    let categoria =  document.getElementById("txtTipo").value.trim();
    let fotoRuta = document.getElementById("txtFotoRuta").value.trim();
    // Verificar si algún campo está vacío
    if (!nombre || !descripcion || !precio || !categoria || !fotoRuta  || !precio1 || !precio2 ) {
        alert("Todos los campos son obligatorios. Por favor, completa todos los campos.");
        return false;
    }
    if (isNaN(precio) || parseFloat(precio) <= 0) {
        alert("Por favor, ingresa un precio válido.");
        return false;
    }
    return true;
}


function initMap() {
    const initialLat = 19.432608;
    const initialLng = -99.133209;

    map = L.map('mi_mapa').setView([initialLat, initialLng], 16);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([initialLat, initialLng]).addTo(map).bindPopup("Zócalo de la Ciudad de México");
}

function datos(index) {
    if (obj.length > 0) {
        actualizarMapa(index);
    } else {
        console.error('El arreglo está vacío');
    }
}

function actualizarMapa(index) {
    if (index >= 0 && index < obj.length) {
        const lati = parseFloat(obj[index].latitud);
        const long = parseFloat(obj[index].longitud);
        const ubiFisica = obj[index].ubi_fisica;

        document.getElementById("txtPrecio1").value = lati;
        document.getElementById("txtPrecio2").value = long;

        map.setView([lati, long], 16);

        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        L.marker([lati, long]).addTo(map).bindPopup(ubiFisica);
    } else {
        console.error('Índice fuera de rango');
    }
}
document.addEventListener("DOMContentLoaded", function () {
    initMap();
});

function actualizaTabla() {
    let cuerpo = "";
    obj.forEach(function (elemento) {
        let registro = '<tr>' +
                '<tr onclick="selectProducto(' + obj.indexOf(elemento) + ');">' +
                '<td>' + obj.indexOf(elemento) + '</td>' +
                '<td>' + elemento.nombre + '</td>' +
                '<td>' + elemento.url + '</td>' +
                '<td>' + elemento.ubi_fisica + '</td>' +
                '<td> <img src="' + elemento.foto + '" width="100"> </td>' +
                '<td>' + elemento.horario + '</td>' +
                '<td>' + elemento.estatus + '</td>' +
                '<td>' + elemento.latitud + '</td>' +
                '<td>' + elemento.longitud + '</td>' +
                '</tr>';
        cuerpo += registro;
    });
    document.getElementById("tblProductos").innerHTML = cuerpo;
}

function selectProducto(index) {
    document.getElementById("txtNombre").value = obj[index].nombre;
    document.getElementById("txtDescripcion").value = obj[index].url;
    document.getElementById("txtPrecio").value = obj[index].ubi_fisica;
    document.getElementById("txtPrecio1").value = obj[index].latitud;
    document.getElementById("txtPrecio2").value = obj[index].longitud;
    document.getElementById("txtTipo").value = obj[index].horario;
    document.getElementById("txtFoto").src = obj[index].foto;
    document.getElementById("txtFotoRuta").value = "";
    indexProductosSeleccionados = index;
    document.getElementById("btnAgregar").classList.remove("disabled");
    document.getElementById("btnEliminar").classList.remove("disabled");
    document.getElementById("btnLimpiar").classList.remove("disabled");
    document.getElementById("btnModificar").classList.remove("disabled");

    datos(index); // Llamar a la función datos para actualizar el mapa
}

function limpiar() {
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtPrecio").value = "";
    document.getElementById("txtPrecio1").value = "";
    document.getElementById("txtPrecio2").value = "";
    document.getElementById("txtTipo").value = "";
    document.getElementById("txtFoto").src = "img/nada.jpg";

    document.getElementById("txtFotoRuta").value = "";
    document.getElementById("btnAgregar").classList.remove("disabled");
    document.getElementById("btnEliminar").classList.add("disabled");
    document.getElementById("btnLimpiar").classList.add("disabled");
    document.getElementById("btnModificar").classList.add("disabled");
    indexProductosSeleccionados = 0;
}

function obtenerNombreFoto(nombreFoto) {
    nombreFoto = document.getElementById("txtFotoRuta").value;
    nombreFoto = 'img/' + nombreFoto.substring(nombreFoto.lastIndexOf("\\") + 1);
    return nombreFoto;
    actualizaTabla();
    limpiar();
}

async function despliegaFoto() {
    imageUrl = obtenerNombreFoto(document.getElementById("txtFotoRuta").value);
    imageUrl = path + imageUrl;

    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob); // codificar
    reader.onloadend = function () { // proyectar o decodificar
        const imageElement = new Image();
        imageElement.src = reader.result;
        imageElement.width = 400;
        document.getElementById('txtFoto').src = imageElement.src;
    };

}

function agregarProducto() {
     if (!validarCampos()) return;
    let nombre, url, ubi_fisica, foto, horario, estatus, latitud, longitud;
    nombre = document.getElementById("txtNombre").value;
    horario = document.getElementById("txtTipo").value;
    url = document.getElementById("txtDescripcion").value;
    foto = obtenerNombreFoto();
    ubi_fisica = document.getElementById("txtPrecio").value;
    latitud = document.getElementById("txtPrecio1").value;
    longitud = document.getElementById("txtPrecio2").value;
    fotoNueva = obtenerNombreFoto();

    let newProd = {};
    newProd.nombre = nombre;
    newProd.url = url;
    newProd.latitud = latitud;
    newProd.longitud = longitud;
    newProd.ubi_fisica = ubi_fisica;
    newProd.foto = fotoNueva;
    newProd.horario = horario;
    newProd.estatus = "Activo";
    obj.push(newProd);

    let jsonData = JSON.stringify(obj);
    console.log(jsonData);
    console.log(typeof (jsonData));
    actualizaTabla();
    limpiar();
    document.getElementById("btnAgregar").classList.add("disabled");
    document.getElementById("btnEliminar").classList.remove("disabled");
    document.getElementById("btnLimpiar").classList.remove("disabled");
    document.getElementById("btnModificar").classList.remove("disabled");
    indexProductosSeleccionados = 0;

}

function modificaProducto(index) {
    index = indexProductosSeleccionados;
    if (index !== undefined && index !== null) {
        let nombre = document.getElementById("txtNombre").value;
        let url = document.getElementById("txtDescripcion").value;
        let ubi_fisica = document.getElementById("txtPrecio").value;
        let lat = document.getElementById("txtPrecio1").value;
        let lng = document.getElementById("txtPrecio2").value;
        let horario = document.getElementById("txtTipo").value;
        if (confirm("¿Cambias la foto?")) {
            let foto = obtenerNombreFoto();
            obj[index].foto = obtenerNombreFoto();
            obj[index].nombre = nombre;
            obj[index].url = url;
            obj[index].latitud = lat;
            obj[index].longitud = lng;
            obj[index].ubi_fisica = ubi_fisica;
            obj[index].horario = horario;
            obj[index].foto = foto;
        } else {
            obj[index].nombre = nombre;
            obj[index].nombre = nombre;
            obj[index].url = url;
            obj[index].ubi_fisica = ubi_fisica;
            obj[index].horario = horario;
            obj[index].latitud = lat;
            obj[index].longitud = lng;
        }
    }
    actualizaTabla();
    limpiar();
}

function eliminarProducto() {
    let index = indexProductosSeleccionados;
    console.log('Índice seleccionado:', index);
    
    if (index !== undefined && index !== null && index >= 0 && index < obj.length) {
        let producto = obj[index];
        
        console.log('Producto seleccionado:', producto);
            if (confirm("¿Estás seguro de eliminar este producto?")) {
                obj.splice(index, 1);  
            }
    } else {
        alert("Selecciona un producto antes de intentar eliminarlo.");
    }
     actualizaTabla();
                limpiar();
}
function activarProducto(index) {
  index = indexProductosSeleccionados;
  if (index !== undefined && index !== null) {
    if (confirm("¿Desea Activar el Producto?")) {
      obj[index].estatus = "Activo";
    } else {
      obj[index].estatus = "Desactivo";
    }
  }
  actualizaTabla();
  limpiar();
}
function desactivarProducto() {
  index = indexProductosSeleccionados;
  if (index !== undefined && index !== null) {
    if (confirm("¿Desea eliminar el Producto?")) {
      obj[index].estatus = "Desactivo";
    } else {
      obj[index].estatus = "Activo";
    }
  }
  actualizaTabla();
  limpiar();
}


function search() {
    var num_cols, display, input, filter, table_body, tr, td, i, txtValue;
    num_cols = 7;
    input = document.getElementById("inputBusqueda");
    filter = input.value.toUpperCase();
    table_body = document.getElementById("tblProductos");
    tr = table_body.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        display = "none";
        for (j = 0; j < num_cols; j++) {
            td = tr[i].getElementsByTagName("td")[j];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    display = "";
                }
            }
        }
        tr[i].style.display = display;
      
    }
}