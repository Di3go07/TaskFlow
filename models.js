import {createFile, addStoreItem, readFile, itemExist} from './functions.js';
import { promises as fs } from 'fs';

export class Produto {
    constructor(name, quantity, price){
        if (!Number.isInteger(quantity) && quantity > 0) {
            throw new Error("quantity precisa ser um número inteiro");
        }

        if (!Number.isInteger(price) && price > 0) {
            throw new Error("price precisa ser um número inteiro");
        }

        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }
}

export class ListaProdutos{
    constructor(){
        this.lista = [];
    }

    async salvarProdutos(){
        const table = 'store.csv';
        console.log('Salvando produtos...');

        try{
            await fs.access(table);
            console.log("Adicionando novos itens à tabela...");
        } catch {
            console.log("Criando a tabela...");
            await createFile(table);
        }

        for (let produto of this.lista){
            if (!(await itemExist(produto, table))){
                console.log(`Salvando ${produto.name} na tabela...`);
                await addStoreItem(produto, table); //adiciona cada produto da lista ao CSV
            } else {
                console.log(`O ${produto.name} ja está na tabela...`);
            }
        }
    }

    async lerTabela(){
        console.log('Lendo a tabela...')
        const table = 'store.csv';
        const dados = await readFile(table);
        const linhas = dados.split('\n'); //cria uma lista separando as strings a cada espaçamento
        linhas.shift(); //remove a header

        for (let linha of linhas){
            const productInfos = linha.split(','); //cria uma lista separando as strings a cada vírgula
            
            const produto = productInfos[0];
            const quantidade = productInfos[1];
            const preco = productInfos[2]

            console.log(`O ${produto} custa ${preco} e tem ${quantidade} em estoque`)
        }
    }
}