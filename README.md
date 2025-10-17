# API de Logística de FHL

Codificadora: Maria Almeira

API REST desarrollada con Node.js, Express, TypeScript, docker, y Sequelize (PostgreSQL) para gestionar el ciclo de vida de las órdenes de entrega de la empresa FHL.

Siga estos pasos para configurar la aplicación:

1. Requisitos previos

Asegúrese de tener instalados los siguientes componentes:

Node.js (v18 o superior)

npm

Docker && docker compose

2. Configuración y dependencias

Clonar el repositorio:

git clone [https://github.com/Almeiram/Ordenes-de-entrega.git](https://github.com/Almeiram/Ordenes-de-entrega.git)
cd fhl-logistics-api

Instalar dependencias:

npm install

Configurar variables de entorno:
Crear un archivo llamado .env en la raíz del proyecto y copiar el contenido de .env.example, ajustando los valores de conexión a la base de datos PostgreSQL.

Contenido de .env (Ejemplo):

PUERTO=3000
HOST_DB=localhost
PUERTO_DB=5432
USUARIO_DB=fhluser
CONTRASEÑA_DB=fhlpassword
NOMBRE_DB=fhldb
SECRETO_JWT=your_secure_secret_here_for_jwt
EXPIRACIÓN_JWT=1d

3. Inicializar contenedores con docker

Iniciar el servidor:
Esto sincronizará los modelos de Sequelize con la base de datos (creando las tablas).

docker compose -warn (para eliminar contenido existente para que no haya error)
docker compose up --build (para levantar el contenedor y crear las tablas con los modelos)

