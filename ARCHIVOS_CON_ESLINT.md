# Archivos JavaScript con comentarios de ESLint

## 📋 Lista completa de archivos:

### Pages/Sadmin/

- sadmin.js (10 comentarios eslint)
- Routes/usuarios/update_usuario.js (3 comentarios eslint)
- api/reloadWatcher.js (1 comentario eslint)

### Pages/RegisterUser/

- verify.js (2 comentarios eslint)
- register.js (2 comentarios eslint)
- Controllers/traerRegistros.js (2 comentarios eslint)

### Pages/RegisterPlant/

- plant.js (3 comentarios eslint)
- Controllers/nuevaCompania.js (2 comentarios eslint)

### Pages/RecoveryPass/

- recovery.js (2 comentarios eslint)
- Controllers/traerRegistros.js (2 comentarios eslint)

### Pages/Menu/

- menu.js (10 comentarios eslint)

### Pages/Login/

- login.js (10+ comentarios eslint)

### Pages/Home/

- home.js (comentarios eslint detectados)

### controllers/

- Varios archivos con comentarios eslint

## 🔍 Tipos de comentarios ESLint encontrados:

- `// eslint-disable-next-line no-unused-vars`
- `// eslint-disable-next-line import/extensions`
- `// eslint-disable-next-line no-console`
- `// eslint-disable-next-line no-plusplus`
- `/* eslint-disable no-use-before-define */`
- `/* eslint-enable no-use-before-define */`
- `// eslint-disable-next-line no-param-reassign`
- `// eslint-disable-next-line no-prototype-builtins`

## 📝 Nota:

Estos comentarios están ahí para suprimir warnings/errores específicos de ESLint.
Son útiles para el desarrollo pero podrían removerse si no usas ESLint en producción.

## 🔧 Para ver comentarios específicos en un archivo:

Usa: grep -n "eslint" nombre_archivo.js
