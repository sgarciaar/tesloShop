<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

#Teslo API
1. Clonar proyecto
2. ````yarn install````
3. Clonar el archivo ```.env.template```y renobrarlo a ````.env````
4. Cambiar las variables de entorno
5. Levantar la Base de Datos
````
docker compose up -d
````
6. Levantar modeo desarrollo
````
yarn start:dev
`````

7. ejecutar Seed de tipo GET
 ````
 http://localhost:3000/api/seed
````