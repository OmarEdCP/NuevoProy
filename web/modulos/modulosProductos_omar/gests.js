let obj = []; // Arreglo que se llenará de objetos JSON
let indexProductosSeleccionados; // Índice del arreglo
const path = "datoSucursal.json";

// Cargar datos del archivo JSON
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
let map;
function validarCampos() {
    const nombre = document.getElementById("txtNombre").value.trim();
    const descripcion = document.getElementById("txtDescripcion").value.trim();
    const precio1 = document.getElementById("txtPrecio1").value.trim();
    const precio2 = document.getElementById("txtPrecio2").value.trim();
    const categoria = document.getElementById("txtTipo").value.trim();
    const fotoRuta = document.getElementById("txtFotoRuta").value.trim();

    // Verificar si algún campo está vacío
    if (!nombre || !descripcion || !categoria || !fotoRuta || !precio1 || !precio2) {
        alert("Todos los campos son obligatorios. Por favor, completa todos los campos.");
        return false;
    }

    // Verificar que los precios sean números válidos
    
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
    obj.forEach((elemento, index) => {
        const registro = `
            <tr onclick="selectProducto(${index});">
                <td>${index}</td>
                <td>${elemento.nombre}</td>
                <td>${elemento.url}</td>
                <td>${elemento.ubi_fisica}</td>
                <td><img src="${elemento.foto}" width="100"></td>
                <td>${elemento.horario}</td>
                <td>${elemento.estatus}</td>
                <td>${elemento.latitud}</td>
                <td>${elemento.longitud}</td>
            </tr>
        `;
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
    indexProductosSeleccionados = null;
}
function obtenerNombreFoto() {
    let nombreFoto = document.getElementById("txtFotoRuta").value;
    nombreFoto = 'img/' + nombreFoto.substring(nombreFoto.lastIndexOf("\\") + 1);
    return nombreFoto;
}
async function despliegaFoto() {
    const imageUrl = obtenerNombreFoto();

    const response = await fetch(imageUrl);
    if (!response.ok) {
        console.error('Error al obtener la imagen:', response.statusText);
        return;
    }
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = function () {
        document.getElementById('txtFoto').src = reader.result;
    };
}
function agregarProducto() {
    if (!validarCampos()) return;
    const nombre = document.getElementById("txtNombre").value;
    const url = document.getElementById("txtDescripcion").value;
    const ubi_fisica = document.getElementById("txtPrecio").value;
    const latitud = document.getElementById("txtPrecio1").value;
    const longitud = document.getElementById("txtPrecio2").value;
    const horario = document.getElementById("txtTipo").value;
    const foto = obtenerNombreFoto();
    const newProd = {
        nombre,
        url,
        latitud,
        longitud,
        ubi_fisica,
        foto,
        horario,
        estatus: "Activo"
    };
    obj.push(newProd);
    let jsonData = JSON.stringify(obj);
    console.log(jsonData);
    console.log(typeof(jsonData));
    actualizaTabla();
    limpiar();
}
function modificaProducto() {
    const index = indexProductosSeleccionados;
    if (index !== undefined && index !== null) {
        const nombre = document.getElementById("txtNombre").value;
        const url = document.getElementById("txtDescripcion").value;
        const ubi_fisica = document.getElementById("txtPrecio").value;
        const lat = document.getElementById("txtPrecio1").value;
        const lng = document.getElementById("txtPrecio2").value;
        const horario = document.getElementById("txtTipo").value;
        let foto = obtenerNombreFoto();
        if (confirm("¿Deseas cambiar la foto?")) {
            obj[index].foto = foto; // Cambiar la foto solo si el usuario confirma
        }
        obj[index] = {
            ...obj[index],
            nombre,
            url,
            latitud: lat,
            longitud: lng,
            ubi_fisica,
            horario
        };
        if (confirm("¿Deseas cambiar la foto?")) {
            obj[index].foto = foto;
        }
        actualizaTabla();
        limpiar();
    } else {
        alert("Selecciona un producto antes de intentar modificarlo.");
    }
}
function eliminarProducto() {
    const index = indexProductosSeleccionados;
    if (index !== undefined && index !== null && index >= 0 && index < obj.length) {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            obj.splice(index, 1);
            actualizaTabla();
            limpiar();
        }
    } else {
        alert("Selecciona un producto antes de intentar eliminarlo.");
    }
}
function activarProducto() {
    const index = indexProductosSeleccionados;
    if (index !== undefined && index !== null) {
        if (confirm("¿Desea Activar el Producto?")) {
            obj[index].estatus = "Activo";
        } else {
            obj[index].estatus = "Desactivo";
        }
        actualizaTabla();
        limpiar();
    }
}
function desactivarProducto() {
    const index = indexProductosSeleccionados;
    if (index !== undefined && index !== null) {
        if (confirm("¿Desea Desactivar el Producto?")) {
            obj[index].estatus = "Desactivo";
        } else {
            obj[index].estatus = "Activo";
        }
        actualizaTabla();
        limpiar();
    }
}
function search() {
    const input = document.getElementById("inputBusqueda");
    const filter = input.value.toUpperCase();
    const table_body = document.getElementById("tblProductos");
    const tr = table_body.getElementsByTagName("tr");
    Array.from(tr).forEach(row => {
        const td = row.getElementsByTagName("td");
        let display = "none";
        Array.from(td).forEach(cell => {
            const txtValue = cell.textContent || cell.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                display = "";
            }
        });
        row.style.display = display;
    });
}
