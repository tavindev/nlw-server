# nlw-server

Após clonar o repo, utilize `yarn install` para instalar as dependências e `yarn start` para iniciar o app.

#Algumas informações sobre esse repo
Algumas partes desse código são um pouco diferentes do código proposto na aula #2,
porém possuem a **mesma** funcionalidade

Exemplo:
  Na pasta `src` existe uma pasta chamada routes, que é equivalente à pasta `controllers`
  da aula #2

  O arquivo `server.js` utiliza essas routes
  ```
  app.use("/nome_da_rota", objeto da rota)
  ```

  Exemplo:
    ```javascript
    const app = express();

    const classes = require("./routes/classes")

    // Definindo Rotas
    app.use("/classes", classes)
    ```
