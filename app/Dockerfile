
# Imagen base de Node.js
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias antes del codigo
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente (src, tsconfig.json, etc.)
# COPY . .

# Exponer el puerto 
EXPOSE 3000

# Compila el código TypeScript a JavaScript
# RUN npm run build


# Comando para ejecutar la aplicación
# CMD ["npm", "start"]
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]