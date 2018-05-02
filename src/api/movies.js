import { Router } from 'express';
import asyncWrap from 'express-async-wrapper';
import Movie from './../models/movie';

export default () => {
    // express.Router
    const api = Router();

    /************************************************************************
     * RESOURCE 01 - /livros                                                *
     * URI para busca (GET) e cadastro (POST) de livros                     *
     * @author: deise.ca@gmail.com                                          *
     * *********************************************************************/
    api.route('/livros')
        .get(function(req,res) {
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