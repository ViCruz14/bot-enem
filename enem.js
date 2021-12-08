const venom = require('venom-bot')
const fs = require('fs')
const candidatos = require('./aptos.json')

venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

var contados = {}

const escolherMensagem = (posicao, titulo) => {
    if (posicao >= 1) {
        return verificarNumero(titulo)
    } else {
        return `Olá! 👋
Mande o seu número de inscrição para eu verificar seu local de prova. Por favor, utilize apenas números`
    }
}

const verificarNumero = (titulo) => {
    const taNaLista = candidatos.find((filiado) => {
        if (filiado['NºINSCRICAO'] == titulo) {
            return true
        }
    })

    if (taNaLista) {
        return `Achei!

Sua prova será no endereço:
${taNaLista['Local de prova']},

O horário de prova é das 13h às 17hs e não esqueça o RG ou qualquer outro documento oficial com foto ;)`
    } else {
        return `Não encontrei pesquisando pela inscrição. Mas nesse site você procura por nome também: https://enem.com.br/prova2022/busca-final/ 

Caso queira verificar novamente, mande um número de eleitor válido que eu pesquiso 😊`
    }
}

const contagem = (numero) => {
    if (contados.hasOwnProperty(numero)) {
        contados[numero]++
    } else {
        fs.writeFile('fizeramContato.txt', `${numero}\n`, {flag: 'a+'}, (e) => console.log(e))
        contados[numero] = 0
    }
}

const start = (client) => {
  client.onMessage((message) => {
    if (message.isGroupMsg === false) {

        contagem(message.from)

        let mensagem = escolherMensagem(contados[message.from], message.body)

        client
        .sendText(message.from, mensagem)
        .then((result) => {
        console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
        });
    }
  });
}