import { Router } from 'express';
import asyncWrap from 'express-async-wrapper';
import Movie from './../models/movie';

export default () => {
    // express.Router
    const api = Router();

    /**
     Provide Api for Model

     Model list  GET /api/v1/models

     @header
        Authorization: Bearer {token}
     @optionalQueryParameters
        param1 {String} - description
        param2 {String} - description

     Model create  POST /api/v1/models
     @header
        Authorization: Bearer {token}
     @params
         param1 {string}
         param2 {boolean}
     **/

    /************************************************************************
     * RESOURCE 01 - /livros                                                *
     * URI para busca (GET) e cadastro (POST) de livros                     *
     * @author: deise.ca@gmail.com                                          *
     * *********************************************************************/
    api.route('/livros')
        .get(function(req,res) {

            //validation
            req.assert('name','Name is required').notEmpty();
            req.assert('email','A valid email is required').isEmail();
            req.assert('password','Enter a password 6 - 20').len(6,20);

            var errors = req.validationErrors();

            if(errors){
                res.status(422).json(errors);
                return;
            }

            // recupera todos (verbo:GET)
            Movie.find(function(err,livros) {
                if(err) {
                    res.status(500).send(err);
                }else {
                    res.json(livros);
                }
            });
        })
        .post(function(req,res) {
            // salvar um livro (verbo:POST)
            var livro = new Movie(req.body);
            livro.save(livro);
            res.status(201).send(livro);
        });

    /*------------------------------------------------------
    route.all is extremely useful. you can use it to do
    stuffs for specific routes. for example you need to do
    a validation everytime route /api/user/:user_id it hit.

    remove api.all() if you dont want it
    ------------------------------------------------------*/
    //api.all(function(req,res,next){
    //    console.log("You need to do something about api Route? Do it here");
    //    console.log(req.params);
    //    next();
    //});

    /************************************************************************
     * RESOURCE 02 INTERNO - /livros/:livroId                               *
     * URI para busca de um livro pelo ID (findById) para ser utilizado     *
     * como premissa para a operação PUT e PATCH. Seu uso é interno dentro  *
     * da API e não é exposto para o público externo!                       *
     * @author: deise.ca@gmail.com                                          *
     * *********************************************************************/
    api.use('/livros/:livroId', function(req,res,next) {
        Movie.findById(req.params.livroId, function(err,livro) {
            if(err) {
                // se houve um erro genérico lança o erro 500
                res.status(500).send(err);
            }else if(livro) {
                // se localizou o livro pelo ID, injeta os dados recuperados do livro dentro da req
                req.livro = livro;
                next(); // comando para dar prosseguimento (por ser de uso interno)
            }else {
                // se não localizou, retorna uma mensagem de erro 404
                res.status(404).send('Nenhum livro localizado!');
            }
        });
    });

    /************************************************************************
     * RESOURCE 02 - /livros/:livroId                                       *
     * URI para busca c/ alteração (PUT) e remoção (PATCH) de livros        *
     * @author: deise.ca@gmail.com                                          *
     * *********************************************************************/
    api.route('/livros/:livroId')
        .get(function(req,res) {
            // busca um livro pelo ID apenas
            res.json(req.livro);
        })
        .put(function(req,res) {
            // alterar um livro (verbo: PUT)
            req.livro.titulo = req.body.titulo;
            req.livro.autor = req.body.autor;
            req.livro.descricao = req.body.descricao;
            req.livro.genero = req.body.genero;
            req.livro.paginas = req.body.paginas;
            req.livro.anoEdicao = req.body.anoEdicao;
            req.livro.isbn = req.body.isbn;
            req.livro.save();
            res.json(req.livro);
        });

    /*
    import asyncWrap from 'express-async-wrapper';
    api.get('/livros', asyncWrap(async (req, res) => {
        ...
    }));
    */

    return api;
};