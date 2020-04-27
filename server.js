express = require("express");
mysql = require("mysql");
exphbs = require("express-handlebars");


app = express();

var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine","handlebars");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "todo_db"
})

connection.connect();

app.get("/", function(req, res) {
    connection.query("SELECT * FROM todos;", function(err, data) {
        if (err) {
            return res.status(500).end();
        }
        console.log(data);
        res.render("index", {todos : data});
    });
});

app.post("/api/todos", function(req, res) {
    connection.query("INSERT INTO todos (todo) VALUES (?)", [req.body.todo], function(err, result) {
        if (err) {
            return res.status(500).end();
        }
        console.log(req.body.todo);
        res.json({ id : result.insertID});
    });
});

app.delete("/api/todos:id", function(req, res) {
    connection.query("DELETE FROM todos WHERE id = ?", [req.params.id], function(err, result) {
        if (err) {
            return res.status(500).end();
        } else if (result.affectedRows === 0) {
            return res.status(404).end();
        } 
        res.status(200).end();
    })
})

app.listen(PORT, function() {
    console.log("server listening on http://localhost:" + PORT);
});
