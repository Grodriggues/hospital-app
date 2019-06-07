// loading modules//
    const express = require("express");
    const handlebars = require("express-handlebars");
    const bodyParser = require("body-parser");
    const app = express();
    const path = require("path");
    const mongoose = require("mongoose");
    const session = require("express-session");
    const flash = require("connect-flash");
    require("./models/Cadastro");
    const Cadastro = mongoose.model("cadastro");

// settings

    //session
        app.use(session({
            secret:"cursodenode",
            resave:true,
            saveUninitialized:true

        }));

        app.use(flash());

    //Middlewares
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            next();
        });

    //body-paser set
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(bodyParser.json());

    //Handlebars
        app.engine("handlebars",handlebars({defaultLayout:"main"}));
        app.set("view engine","handlebars");
    //mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/hospitalapp",{
            useNewUrlParser: true
        }).then(()=>{
            console.log("Conectado ao banco!")
        }).catch((err)=>{
            console.log("Error: ",err);
        });
    // Public
        app.use(express.static(path.join(__dirname,"public")));

//Routes
    app.get("/",(req,res)=>{
        res.render("layouts/main");
    });

    app.get("/home",(req,res)=>{
        res.render("cadastro/cadastros")
    });

    app.get("/novocadastro",(req,res)=>{
        res.render("cadastro/novocadastro");
    });

    app.post("/editarcadastro",(req,res)=>{
        Cadastro.findOne({_id:req.body.id}).then((dados)=>{
            dados.nome = req.body.nome;
            dados.nascimento = req.body.nascimento;
            dados.cpf = req.body.cpf;
            dados.rg = req.body.rg;
            dados.cidade = req.body.cidade;
            dados.estado = req.body.estado;
            dados.email = req.body.email;
            dados.save().then(()=>{
                res.redirect("/tabela");
            })
            
        })
    });

    app.get("/tabela",(req,res)=>{
        Cadastro.find().then((cadastros)=>{
            res.render("cadastro/tabelas",{cadastros:cadastros});
        })
    });

    app.get("/excluir/:id",(req,res)=>{
        Cadastro.deleteOne({_id:req.params.id}).then(()=>{
            res.redirect("/tabela");
        });
    });

    app.get("/:id",(req,res)=>{
        Cadastro.findOne({_id:req.params.id}).then((dados)=>{
            res.render("cadastro/editcadastro",{dados:dados});
        })
    });

    

    app.post("/cadastros",(req,res)=>{
        let novoCadastro = {
            nome : req.body.nome,
            nascimento : req.body.nascimento,
            cpf:req.body.cpf,
            rg:req.body.rg,
            cidade:req.body.cidade,
            estado:req.body.estado,
            email:req.body.email
            }

        new Cadastro(novoCadastro).save().then(()=>{
            res.redirect("/tabela");
        })
    });

    

    


// setting server//
    const port = 8081;
    app.listen(port,()=>{
        console.log("Servidor rodando!");
    });
