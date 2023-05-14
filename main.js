const readline = require('readline');

// Función para crear un nuevo directorio
const crearDirectorio = (nombre, directorioPadre) => ({
  nombre,
  directorioPadre,
  archivos: [],
  directorios: [],
});

// Función para crear un nuevo archivo
const crearArchivo = (nombre) => ({
  nombre,
});

// Función para buscar un directorio por nombre
const buscarDirectorio = (directorio, nombre) =>
  directorio.directorios.find((dir) => dir.nombre === nombre);

// Función para cambiar de directorio
const cambiarDirectorio = (directorioActual, ruta) => {
    if (ruta === '..') {
      if (directorioActual.directorioPadre) {
        return directorioActual.directorioPadre;
      } else {
        return directorioActual;
      }
    } else if (ruta.startsWith('/')) {
      return buscarDirectorio(directorioRaiz, ruta.substring(1));
    } else {
      const nuevaRuta =
        directorioActual.nombre === '/'
          ? `/${ruta}`
          : `${directorioActual.nombre}/${ruta}`;
      return buscarDirectorio(directorioRaiz, nuevaRuta);
    }
};

// Función para agregar un archivo al directorio actual
const agregarArchivo = (directorio, archivo) => ({
  ...directorio,
  archivos: [...directorio.archivos, archivo],
});

// Función para agregar un directorio al directorio actual
const agregarDirectorio = (directorio, nuevoDirectorio) => {
    const directorioActualizado = {
      ...directorio,
      directorios: [...directorio.directorios, nuevoDirectorio],
    };
  
    return directorioActualizado;
};
  
// Función para imprimir los archivos y directorios del directorio actual
const listarDirectorio = (directorio) => {
    directorio.archivos.forEach((archivo) => console.log(archivo.nombre));
    if (directorio.directorios) {
      directorio.directorios.forEach((subDirectorio) =>
        console.log(`${subDirectorio.nombre}/`)
      );
    }
};  
  

// Función para obtener la ruta actual
const obtenerRutaActual = (directorioActual) => {
    //if (!directorioActual) return '/';
    if (typeof directorioActual === 'string') {
        return directorioActual;
    }
    if (directorioActual.directorioPadre) {
      const rutaPadre = obtenerRutaActual(directorioActual.directorioPadre);
      return `${rutaPadre}${rutaPadre === '/' ? '' : '/'}${directorioActual.nombre}/`;
    } else {
      return '/';
    }
};
  

// Función para ejecutar los comandos
const ejecutarComando = (comando) => {
    const [nombreComando, ...argumentos] = comando.trim().split(' ');
  
    switch (nombreComando) {
      case 'cd':
        directorioActual = cambiarDirectorio(directorioActual, argumentos[0]);
        break;
      case 'touch':
        directorioActual = agregarArchivo(
          directorioActual,
          crearArchivo(argumentos[0])
        );
        break;
      case 'ls':
        listarDirectorio(directorioActual);
        break;
      case 'mkdir':
        const nuevoDirectorio = crearDirectorio(argumentos[0]);
        directorioActual = agregarDirectorio(directorioActual, nuevoDirectorio);
        break;
      case 'pwd':
        console.log(obtenerRutaActual(directorioActual));
        break;
      default:
        console.log('Comando no encontrado.');
    }
  };
  

// Directorio raíz
const directorioRaiz = crearDirectorio('/', null);

// Directorio actual
let directorioActual = crearDirectorio('/', null);

// Inicializar la interfaz readline
const rl = readline.createInterface({
  input:
  process.stdin,
  output: process.stdout,
  });
  
  rl.on('line', (input) => {
  ejecutarComando(input);
  });
  
  console.log('¡Bienvenido al Sistema de Archivos Funcional!');