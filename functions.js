import { promises as fs } from 'fs';

export async function createFile(filename) {
	try {
	    const csvHeaders = 'name,quantity,price' 
	    await fs.writeFile(filename, csvHeaders); //(arquivo, texto)
	} catch (error) {
	    console.error(`Got an error trying to write: ${error.message}`);
	}
}

export async function addStoreItem(produto, table) {
	try {	    
		const csvLine = `\n${produto.name},${produto.quantity},${produto.price}`
	    await fs.writeFile(table, csvLine, { flag: 'a' });
	} catch (error) {
		console.error(`Got an error trying to write: ${error.message}`);
	}
}

export async function readFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return data
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    } 
}
  
export async function itemExist(novoProduto, filePath){
    const dados = await readFile(filePath);

    const linhas = dados.split('\n'); //cria uma lista separando as strings a cada espaçamento
    linhas.shift(); //remove a header

    for (let linha of linhas){
        const productInfos = linha.split(','); //cria uma lista separando as strings a cada vírgula        
        const produtoName = productInfos[0];
        
        if (novoProduto.name == produtoName){
            return true;
        }
    }

    return false;
}