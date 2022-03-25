# Entendendo a API

## O que caracteriza uma API?

o package.json, controla os cripts e as dependencias do projeto (Express, body-parser, etc)

Nesse caso, usaremos Express / Nodemon / Mongoose (tudo vai pro node_modules, que parece ter mto mais dependencias do que baixamos, mas é apenas o necessário)

Dentro do package.json podemos configurar scripts, como para rodar o Nodemon (que a cada save no projeto atualiza o servidor automaticamente)

## Configurações iniciais no index.js

Importamos as dependencias conforme precisaremos de suas funções

Configuramos a forma da api ler JSON, que é o padrao RESTful

Criamos uma rota inicial (ou endpoint inicial) para que possamos, através do Postman acessar e testar a API

E dpois entregar uma porta para que eu possa executar a API, para que o postman ou o navegador pegue o código. app.listen()

### Middlewares

Executados entre req e res. app.use() é como dizemos que vamos usar um middleware.

O próprio express oferece recursos, como o .urlencoded(), que lê JSON e seu complemento express.json(), que devolve json tmb (acho).

### Definindo a rota inicial (endpoint)

Determinamos primeiro, qual a rota base da aplicação, no nosso caso /

Dpois usamos 2 argumentos (req e res) para poder lidar com o que lidaremos com o que virá da nossa rota.

res.json(), dentro da arrow function da rota inicial, informa que vamos devolver algo no formato json (objeto js), que dpois pode ser tratado de qlq forma.

## Criando variaveis no Postman

Em Collections posso criar um conjunto de variaveis, pastas e comandos padrões para testar minha API

## Usando Mongoose

Configura-se um novo projeto no mongodb.com, de graça para sempre (demora cerca de 3 a 5 min). Coloco um ip publico como permitido de acesso (0.0.0.0/0), um user com meu nome e uso uma senha sugeriad pelo próprio site (9c3aPAtsEQQGq1Ta).

Ao clicar em conectar, seleciono 'Através da aplicação' e ele me devolve uma string complexa:

>mongodb+srv://pedro:<password>@apicluster.1rgec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

Devo colocar a senha onde está password e posso mudar o 'myFirstDatabase' para o nome que eu quiser

mongodb+srv://pedro:9c3aPAtsEQQGq1Ta@apicluster.1rgec.mongodb.net/bancoDaApi?retryWrites=true&w=majority

Dentro do index.js eu instancio o mongoose e o chamo com o método .connect() passando o que o MongoDB forneceu. Dpois uso o método .then() para caso a conexão dê certo (poddo colocar uma arrow function com um console log). E por ultimo uso .catch() caso de algum erro, com uma arrow func. mostrando o erro no console.

Crio uma nova pasta no projeto com o nome 'models' com a primeira formatação de um banco de dados, o arquivo Person.js

(O nome começando com maiúscula é uma convenção)

Dentro do Person.js, vou criar métodos para ler, salvar e manipular dados no BD.

Crio uma const Person (nome do arquivo e o nome da planilha no Mongo) passando pra ela mongoose.model('NomeDaTabela', {
    campo1: tipoDoDadoDeEntrada,
    campo2: tipoDoDado,
    .
    .
    .
})

No final dou um module.exports = Person e a chamo dentro do index.js

### Criando dados para dpois manipulá-los

No index.js, logo em cima da rota inicial, posso definir as rotas da API. Crio com app.post('/person', async (req, res) => {

    // Usando destructuring, para criar 3 variaveis e receber os valores correspondentes ao seus nomes
    const {name, salary, approved } = req.body

    const person = {
        name, 
        salary, 
        approved
    }

    try{

        await Person.create(person)

    } catch (erro) {
        res.status(500).json({erro: erro})
    }

})

Obs: usamos async pq não podemos garantir quanto tempo o banco vai dar o ok de ter inserido os dados.

É uma boa prática também, fazer uma verificação, antes de criar const person, saber se o nome veio vazio. Basta criar um if dando um status(422) e exibir um json de erro.

### Externalizando as rotas do Person

Criaremso uma nova pasta routes, e nela vamos instanciar o .router, método do express. Ele permite criar um arquivo de rotas, para tirar essas regras do index.js  

Exportamos o personRoutes para o index e damos um app.use('/person', personRoutes), indicando que quando tiver /person na url a API deve usar o que estiver na pasta routes  

Podemos refatorar o código dpois dessas ações, enxugando o index.js

Criamos agora uma rota para imprimir todos os dados que estão salvos no MangoDB. Usamos o router mas usamos o verbo .get(), com o mesmo tratamento try/catch do método post, mas usamos o .find() da mongoose para pegar todos os dados da tabela  

Criamos agora uma rota para dar GET em elementos específicos do banco de dados, mas usando o id que o Mongo fornece.

Quando colocamos informações na url, dpois da /, essas informações são chamadas de 'params' e são acessadas atraves da req.params

É importante, sempre, pensar em como tratar os casos em que a API não tem uma resposta. Por exemplo, quando se busca uma pessoa por um ID errado.

## Update (Atualização de dados) PUT e PATCH

PUT espera todos os dados para fazer uma atualização o que não ocorre com frequencia, o mais comum é usarmos PATCH para atualizar parcialmente algum objeto do nosso bd.

Fazemos isso de uma maneira mto similar ao que já fizemos antes. A url vem com a id do usuario e mandaremos as infos a serem alteradas no body da req.

Para termos ctz de que houve uma alteração, podemos fazer uma validação usando a constante que recebeu o updatedOne(), ela tem o método .matchedCount, que se igualda a zero, indica que não houve mudanças realizadas

## Delete

Vai receber o id pela URL, fazemos uma validação se existe ou não e usamos, dentro do trycatch, .deleteOne()   