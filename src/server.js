const express = require("express");
const server = express();

// Pegar o banco de dados
const db = require("./database/db");

// configurar pasta publica
server.use(express.static("public"));

server.use(express.urlencoded({ extended: true }));
// ultilizando template engine 
const nunjuck = require("nunjucks");
nunjuck.configure("src/views", {
    express: server,
    noCache: true
})

// configurar caminhos da minha aplicação
//pagina inicial
// req = requisição
// res = resposta
server.get("/", (req, res) => {
    return res.render("index.html");
});
server.get("/search", (req, res) => {

    const search = req.query.search;

    // pegar dados do banco
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if (err) {
            return console.log(err)
        }

        // mostrar pagina html com os dados do db

        const total = rows.length;
        return res.render("search-results.html", { places: rows, total });
    })

});
server.get("/create-point", (req, res) => {

    //console.log(req.query);
    return res.render("create-point.html");
});

server.post("/save-point", (req, res) => {


    // req.body
    //console.log(req.body);
    // inserir dados no banco de dados

    const query = `
                INSERT INTO places (
                image,
                name,
                address,
                address2,
                state,
                city,
                items
               ) VALUES (?,?,?,?,?,?,?);`

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ];

    function afterInsertData(err) {
        if (err) {
            return console.log(err);
            return res.send("Erro no cadastro")
        }

        console.log("Cadastrado com sucesso");
        console.log(this);
        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData);


});

// ligar servidor  

server.listen(3000);