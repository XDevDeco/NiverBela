document.getElementById("btnSubmit").addEventListener("click", () => {
    const nome = document.getElementById("nome").value.trim();
    const fotoFile = document.getElementById("foto").files[0];

    if (!nome || !fotoFile) {
        alert("Preencha o nome e selecione uma foto.");
        return;
    }

    // Ler imagem como Base64
    const reader = new FileReader();
    reader.onload = () => {
        const fotoBase64 = reader.result; 

        // Salvar no localStorage
        localStorage.setItem("user_nome", nome);
        localStorage.setItem("user_foto", fotoBase64);

        // Redirecionar para a página do hambúrguer
        window.location.href = "informacoes.html";
    };

    reader.readAsDataURL(fotoFile);
});
