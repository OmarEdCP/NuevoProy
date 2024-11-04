let usuarios = []; // Arreglo para almacenar los usuarios del JSON
const path = "DatosUsuarios.json";
fetch(path)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al cargar el archivo JSON');
    }
    return response.json();
  })
  .then(jsondata => {
    usuarios = jsondata; // Asignar los datos al arreglo de usuarios
    console.log('Usuarios cargados:', usuarios);
  })
  .catch(error => {
    console.error('Error al obtener usuarios:', error);
    alert('No se pudo cargar la información de usuarios');
  });
function iniciarsesion() {
  const usuario = document.getElementById('txtusuario').value.trim();
  const password = document.getElementById('txtpass').value.trim();
  if (!usuario || !password) {
    alert('Por favor, complete todos los campos');
    return;
  }
  if (usuarios.length === 0) {
    alert('Los datos de usuarios no están disponibles');
    return;
  }
  const usuarioEncontrado = usuarios.find(u => u.nomProd === usuario && u.contrasena === password);
  if (usuarioEncontrado) {
    alert('Inicio de sesión exitoso');
    window.location.href = '../../modulosUsuarios/Usuarios.html'; // Redirige al usuario
  } else {
    alert('Credenciales incorrectas');
  }
  document.getElementById('txtusuario').value = "";
  document.getElementById('txtpass').value = "";
}
