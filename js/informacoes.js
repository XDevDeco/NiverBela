let ingredientesSelecionados = [];
let ingredientesDesfeitos = [];
let finalizado = false;

const userNome = localStorage.getItem("user_nome");
const userFoto = localStorage.getItem("user_foto");

console.log(userNome + " user " +userFoto)

const categorias = {
    queijo: ["queijo-mussarela.png", "queijo-cheddar.png"],
    molho: ["ketchup.png", "mostarda.png", "maionese.png", "maionese-verde.png", "molho-bigmac.png"],
    carne: ["carne.png"],
    pao: ["pao-australiano-base.png", "pao-brioche-base.png"]
};

//checkpoint

// ADICIONAR INGREDIENTE
function selecionarIngrediente(img) {

    if (finalizado) return alert("Hambúrguer já finalizado! Não é possível alterar.");
    const categoria = getCategoria(img);

    if (categoria === "pao" || categoria === "carne") {
        ingredientesSelecionados = ingredientesSelecionados.filter(item =>
            getCategoria(item) !== categoria
        );
    }
    ingredientesSelecionados.push(img);
    atualizarPreview();

    // sempre que adiciona algo novo, limpa o histórico
    ingredientesDesfeitos = [];

    console.log(ingredientesSelecionados.length)
}

// DESFAZER 
function desfazerIngrediente() {
    if (finalizado) return;
    if (ingredientesSelecionados.length === 0) return;

    const ultimo = ingredientesSelecionados.pop();
    ingredientesDesfeitos.push(ultimo);

    atualizarPreview();
}

// REFAZER 
function refazerIngrediente() {
    if (finalizado) return;
    if (ingredientesDesfeitos.length === 0) return;

    const restaurado = ingredientesDesfeitos.pop();
    ingredientesSelecionados.push(restaurado);

    atualizarPreview();
}

// CONSTRÓI O HAMBÚRGUER VISUALMENTE
function atualizarPreview() {
    const area = document.getElementById("preview-area");
    area.innerHTML = "";

    // contador individual das camadas por categoria
    const contagem = {
        queijo: 0,
        molho: 0,
        carne: 0,
        pao: 0
    };

    empilharIngredientes(contagem, area);
}

function empilharIngredientes(contagem, area){
     ingredientesSelecionados.forEach((img) => {

        const categoria = getCategoria(img);

        const ingredienteImg = document.createElement("img");
        ingredienteImg.src = "img/ingredientes/" + img;
        ingredienteImg.classList.add("ingrediente-layer");

        let offset = 0;

        if (categoria === "molho") 
            {
            offset = contagem.molho * 5;
            contagem.molho++;
            } 

        else if(categoria === "queijo")
            {
            offset = contagem.queijo * 5;
            contagem.queijo++;
            }
            
        else if (categoria === "carne")
            {
            ingredienteImg.id = "carne-layer";
            contagem.carne = 1;
            }
        else if (categoria === "pao") {
            ingredienteImg.id = "pao-layer"; 
            contagem.pao = 1;
        }

        if(contagem.molho > 2){
            const carne = document.getElementById("carne-layer");
            if (carne) 
                carne.style.bottom = (contagem.molho * 5) + "px";
        }
        
        ingredienteImg.style.bottom = offset + "px";
        console.log("ingrediente" + ingredienteImg)
        area.appendChild(ingredienteImg);
    })
}


function getCategoria(img) {
    for (const categoria in categorias) {
        if (categorias[categoria].includes(img)) {
            return categoria;
        }
    }
    return null;
}


document.getElementById("nomeCriacao").addEventListener("focus", function () {
    if (!finalizado) {
        alert("Finalize seu hambúrguer antes de dar um nome!");
        this.blur();
    }
});

document.getElementById("btnFinalizar").addEventListener("click", function () {
    if (ingredientesSelecionados.length === 0) {
        alert("Você precisa montar algo antes de finalizar!");
        return;
    }
    finalizado = true;

    document.getElementById("nomeCriacao").disabled = false;

    const basePao = ingredientesSelecionados.find(i =>
        i.includes("pao-brioche") || i.includes("pao-australiano")
    );

    if (!basePao) {
        alert("Você precisa escolher um pão para finalizar.");
        finalizado = false;
        return;
    }

    let topo = "";
    if (basePao.includes("brioche")) {
        topo = "pao-brioche-topo.png";
    } else {
        topo = "pao-australiano-topo.png";
    }

    ingredientesSelecionados.push(topo);

    atualizarPreview();

    alert("Hambúrguer finalizado! Agora você pode dar um nome.");
});



// BOTÕES
document.getElementById("btnUndo").addEventListener("click", desfazerIngrediente);
document.getElementById("btnRedo").addEventListener("click", refazerIngrediente);


// ENVIO DO FORMULÁRIO
document.getElementById("formCriacao").addEventListener("submit", async function(e) {
    e.preventDefault();

    const nomeCriacao = document.getElementById("nomeCriacao").value;

    // Coleta dados da tela inicial
    const nomeUsuario = localStorage.getItem("user_nome") || "";
    const fotoUsuario = localStorage.getItem("user_foto") || "";

    const form = new FormData();
    form.append("nomeCriacao", nomeCriacao);
    form.append("ingredientes", JSON.stringify(ingredientesSelecionados));

    // IMPORTANTE: novos campos
    form.append("usuario_nome", nomeUsuario);
    form.append("usuario_foto", fotoUsuario);

    await fetch("https://script.google.com/macros/s/AKfycbz7yVXfIygwCpPt-bQftz7pRgQktqthccllgwzpjI0VmslNY511z0AIi0rXwq3TylUz/exec", { 
        method: "POST",
        mode: "cors",
        body: form
    });

    alert("Criação enviada! 🎉");
});






