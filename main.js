let listaDeItens = []
let itemAEditar

const form = document.getElementById("form-itens")
const itensInput = document.getElementById("receber-item")
const ulItens = document.getElementById("lista-de-itens")
const ulItensComprados = document.getElementById("itens-comprados")
const listaRecuperada = localStorage.getItem('listaDeItens')

function atualizaLocalStorage(){
    //transforma elementos em dados do tipo String
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens))
}

//valores que retornam false
//(valores omitidos, 0, null, NaN, undefined, "", false)

if(listaRecuperada){
    //transforma elementos em dados do tipo Java Script.
    listaDeItens = JSON.parse(listaRecuperada)
    mostrarItem()
}else{
    listaDeItens = []
}

form.addEventListener("submit", function (evento) {
    evento.preventDefault() //serve para manter o dado digitado no campo.
    salvarItem()
    mostrarItem()
    itensInput.focus()
  })

function salvarItem() {
    const comprasItem = itensInput.value
    //some serve para percorrer a lista.
    const checarDuplicado = listaDeItens.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase())

    if(checarDuplicado){
        alert("Item já existe")
    }else{
        listaDeItens.push({
            valor: comprasItem,
            checar: false
        })
    }

    itensInput.value = ''
}

function mostrarItem(){
    ulItens.innerHTML = ''
    ulItensComprados.innerHTML = ''

    listaDeItens.forEach((elemento, index)=>{
        if(elemento.checar){
            ulItensComprados.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                <div>
                    <input type="checkbox" checked class="is-clickable" />
                    <input type="text" class="is-size-5" value="${elemento.valor}"></input>
                </div>
                <div>
                    <i class="fa-solid fa-trash is-clickable deletar"></i>
                </div>
            </li>
            `
        }else{
            ulItens.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                <div>
                    <input type="checkbox" class="is-clickable" />
                    <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? 'disabled' : ''}></input>
                </div>
                <div>
                    ${ index === Number(itemAEditar) ?'<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                    <i class="fa-solid fa-trash is-clickable deletar"></i>
                </div>
            </li>
            `
        }

    })
    
    //document.querySelectorAll() que selecionará todos os inputs do tipo checkbox
    //Dica: A função anônima possui menos caracteres e por isso é a função mais utilizada em situações onde sua reutilização não é necessária.
    const inputsCheck = document.querySelectorAll('input[type="checkbox"]')

    inputsCheck.forEach(i => {
        i.addEventListener('click', (evento) => {
            //parentElement retorna o elemento pai que está sendo clicado
            //O pai do checkbox é a <div> e o pai da <div> é a <li>
            valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
            // Para alterarmos a chave de false para true, adicionaremos o sinal = seguido de evento.target.checked, 
            //onde checked é um método próprio do <input> checkbox.
            listaDeItens[valorDoElemento].checar = evento.target.checked
            mostrarItem()

        })
    })

    //Vamos referenciar essa classe, porque não podemos repetir IDs no HTML, mas classes sim. Portanto, vamos referenciar pela classe.
    const deletarObjetos = document.querySelectorAll('.deletar')

    /*Para deletar os objetos, usamos o splice(), que é um método multifuncional, porque com ele conseguimos:

     - Deletar objetos
     - Substituir um objeto por outro
     - Adicionar novos objetos*/

    deletarObjetos.forEach(i => {
        i.addEventListener('click', (evento) => {            
            valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');            
            listaDeItens.splice(valorDoElemento,1)
            mostrarItem()

        });
    });

    const editarItens = document.querySelectorAll(".editar")

    editarItens.forEach(i => {
        i.addEventListener('click', (evento) => {            
            itemAEditar = evento.target.parentElement.parentElement.getAttribute('data-value');            
            mostrarItem()

        });
    });

    atualizaLocalStorage()

}

function salvarEdicao() {
    //Como obteremos esses valores através de tags HTML, usaremos as crases ( ``) 
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`)
    listaDeItens[itemAEditar].valor = itemEditado.value
    itemAEditar = -1
    mostrarItem()
 }