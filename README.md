# Test Compara Online

## requirement

- Node v6.10.2

## instructions

- exec normal `node test.js`
- exec test `node test.js test`
- exec test and create log file (log.txt) `node test.js test logfile`


# Mejoras

- Se crea clase complementaria para logear la aplicación:
  - esto debido a la importancia de un modulo como es login de usuario
- Se crean 3 maneras de ejecutar el codigo que son:
  - test: un set de pruebas para validar que el funcionamiento del modulos es consistente en el tiempo
  - produccion: el codigo con las mismas funcionalidades originales
  - test con archivo de log adjunto: se crea un archivo los donde se hace un `append` al archivo por cada log de error nuevo
- Se documenta el codigo siguiento los estandares de JSDOC para ES2015:
  - esto es importante a la hora de compartir el codigo y mantenerlo para entender que hace cada metodo y la funcionalidad de la clase.

- se quita del constructor el algoritmo que genera los 2 arreglos, se mueve a un metodo `init` para que la funcion del contructor sea solo inicializar atributos por defecto y no ensociar el codigo.
- se refactoriza algoritmo que genera el listado de usuarios y contraseñas haciendolo mas conciso y optimo
- se delega la creacion de usuarios a un metodo que recibe un objeto del tipo `userData` para que a futuro si se decea implementar mas funcionalidades para agregar usuario, se pueda utilizar una unica forma
- en `registerUser` primero se verifica si el usuario ya fue registrado, en tal caso genera un log, de esta manera se evita tocar los arreglos `users` y `passwords` se vuelve a utilizar el metodo `addUser` de manera consistente
- en el metodo `removeUser` primero se valida que el usuario a eliminar exista, en caso contrario genera un log, por ultimo se optimiza la eliminacion y el elemeto a eliminar efectivamente se quita de las listas, en vez de solo dejar nulo los elementos
- 
