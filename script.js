
const formulario = document.getElementById("form-busca");
const campoNome = document.getElementById("nome-pokemon");
const resultado = document.getElementById("resultado");
const mensagem = document.getElementById("mensagem");

const traducaoTipos = {
    normal: "Normal",
    fire: "Fogo",
    water: "Água",
    electric: "Elétrico",
    grass: "Planta",
    ice: "Gelo",
    fighting: "Lutador",
    poison: "Venenoso",
    ground: "Terra",
    flying: "Voador",
    psychic: "Psíquico",
    bug: "Inseto",
    rock: "Pedra",
    ghost: "Fantasma",
    dragon: "Dragão",
    dark: "Sombrio",
    steel: "Aço",
    fairy: "Fada"
};

async function buscarPokemon(nome) {
    const resposta = await fetch(
        "https://pokeapi.co/api/v2/pokemon/" + nome
    );

    if (!resposta.ok) {
        throw new Error("Pokémon não encontrado!");
    }

    return await resposta.json();
}

function mostrarCarta(pokemon) {
    const nome = pokemon.name.charAt(0).toUpperCase()
        + pokemon.name.slice(1);

    const imagem = pokemon.sprites.other["official-artwork"].front_default
        || pokemon.sprites.front_default;

    const tipos = pokemon.types.map(function(item) {
        const tipo = item.type.name;
        return '<span class="tipo">' + traducaoTipos[tipo] + '</span>';
    }).join("");

    const nomesAtributos = {
        hp: "HP",
        attack: "Ataque",
        defense: "Defesa",
        "special-attack": "Ataque especial",
        "special-defense": "Defesa especial",
        speed: "Velocidade"
    };

    const atributos = pokemon.stats.filter(function(item) {
        return ["hp", "attack", "defense", "speed"]
            .includes(item.stat.name);
    }).map(function(item) {
        const valor = item.base_stat;
        const porcentagem = Math.min(valor / 150 * 100, 100);

        return `
            <div class="atributo">
                <div class="atributo-topo">
                    <span>${nomesAtributos[item.stat.name]}</span>
                    <span>${valor}</span>
                </div>
                <div class="barra">
                    <div class="barra-preenchida"
                        style="width: ${porcentagem}%">
                    </div>
                </div>
            </div>
        `;
    }).join("");

    resultado.innerHTML = `
        <article class="carta">
            <p>Número: #${pokemon.id}</p>

            <img src="${imagem}" alt="${nome}">

            <h2>${nome}</h2>

            <div class="tipos">${tipos}</div>

            <p class="detalhes">
                Altura: ${(pokemon.height / 10).toFixed(1)} m<br>
                Peso: ${(pokemon.weight / 10).toFixed(1)} kg
            </p>

            <h3>Atributos</h3>

            ${atributos}
        </article>
    `;
}

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = campoNome.value.trim().toLowerCase();

    resultado.innerHTML = "";

    if (nome === "") {
        mensagem.textContent = "Digite o nome de um Pokémon!";
        campoNome.focus();
        return;
    }

    mensagem.textContent = "Carregando...";

    try {
        const pokemon = await buscarPokemon(nome);

        mostrarCarta(pokemon);
        mensagem.textContent = "";
    } catch (erro) {
        mensagem.textContent =
            "Pokémon não encontrado ou erro de conexão.";
    }

    campoNome.focus();
});
