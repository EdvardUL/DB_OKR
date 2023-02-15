const mysql = require("mysql2");
const express = require("express");
 
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
 
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "user",
  database: "db",
  password: "password"
});
 
app.set("view engine", "hbs");

app.get("/", function(req, res){
    pool.query("SELECT * FROM Metalls",function(err, data) {
      if(err) return console.log(err);
      res.render("metals.hbs", {
        metalls: data
      });
    });
});

app.get("/create", function(req, res){
  res.render("add.hbs");
});

app.post("/create", function (req, res) {
  if(!req.body) return res.sendStatus(400);
  const name = req.body.mark;
  const thermo = req.body.thermo;
  const fluid = req.body.fluid;
  const strenght = req.body.strenght;
  pool.query("INSERT INTO Metalls (Mark, Thermo, Fluid, Strenght) VALUES (?,?,?,?)", [name, thermo,fluid,strenght], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});

app.post("/delete/:id", function(req, res){
  const id = req.params.id;
  pool.query("DELETE FROM Metalls WHERE id=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});

app.post("/therm",function(req, res){
  const therm = req.params.therm;
  pool.query("SELECT * FROM Metalls WHERE thermo=?", [therm], function(err, data) {
    if(err) return console.log(err);
    res.render("select.hbs", {
      characters: data
    });
  });
});

app.post("/min_fluid",function(req, res){
  pool.query("SELECT * FROM Metalls WHERE Fluid =  (SELECT MIN(Fluid) FROM Metalls)", function(err, data) {
    if(err) return console.log(err);
    res.render("select.hbs", {
      metalls: data
    });
  });
});

app.post("/more_avg_fluid",function(req, res){
  pool.query("SELECT Mark,Fluid FROM Metalls WHERE Fluid > (SELECT AVG(Fluid) FROM Metalls)", function(err, data) {
    if(err) return console.log(err);
    res.render("select.hbs", {
      metalls: data
    });
  });
});

app.post("/otchet",function(req, res){
  pool.query("SELECT Mark,Thermo,Strenght FROM Metalls WHERE Fluid > 300 ORDER BY Fluid DESC", function(err, data) {
    if(err) return console.log(err);
    res.render("otchet.hbs", {
      metalls: data
    });
  });
});

app.post("/itog",function(req, res){
  pool.query("SELECT COUNT(*) as count,Thermo,AVG(Fluid) as avg FROM Metalls GROUP BY Thermo", function(err, data) {
    if(err) return console.log(err);
    res.render("itog.hbs", {
      metalls: data
    });
  });
});
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});