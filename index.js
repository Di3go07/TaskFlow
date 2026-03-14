import {Produto, ListaProdutos} from './models.js';

async function index() {
    const produto1 = new Produto('Notebook Dell', 10, 2500);
    const produto2 = new Produto('Celular Motorola', 15, 930);
    const produto3 = new Produto('Fone bluetooth', 12, 150);

    const meusProdutos = new ListaProdutos();
    meusProdutos.lista = [produto1, produto2, produto3];

    await meusProdutos.salvarProdutos();
    await meusProdutos.lerTabela()
}

index()