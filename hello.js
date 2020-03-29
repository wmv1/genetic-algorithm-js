// https://burakkanber.com/blog/machine-learning-genetic-algorithms-part-1-javascript/

/**
 * @param {Codigo ASCII} code 
 */
var Gene = function(code) {
    if (code) this.code = code;
    this.cost = 9999;
};
//Atributo code vazio
Gene.prototype.code = '';
/**
 * Preenche o campo code 
 * @param {length = 13 == tamanho da frase neste exemplo} length 
 */
Gene.prototype.random = function(length) { 
    while (length--) {
        this.code += String.fromCharCode(Math.floor(Math.random() * 255)); //preenche aleatoriamente a frase
    }
};

/*gera a probabilidade aleatória de 0 a 1 e verifica se é maior que 0.5 (chance) e retorna
  Mutação troca sempre uma letra aleatóriamente para não acabar repetindo filhos
*/

/**
 * 
 * @param {configurado em 50% (0.5)} chance 
 */
Gene.prototype.mutate = function(chance) {
    if (Math.random() > chance) return;
//se não
    var index = Math.floor(Math.random() * this.code.length); //random(0..1) * code.length
    var upOrDown = Math.random() <= 0.5 ? -1 : 1; // se <= 0.5 então -1,  ou 1
    var newChar = String.fromCharCode(this.code.charCodeAt(index) + upOrDown); // seleciiona o cód ascii +1 ou -1
    var newString = ''; 

    for (i = 0; i < this.code.length; i++) {
        if (i == index) newString += newChar;// troca a letra 
        else newString += this.code[i];
    }

    this.code = newString;

};
/**
 * A função de acasalamento usa outro
 *  cromossomo como argumento, 
 * localiza o ponto central e retorna uma matriz de dois novos filhos.
 * @param {*} gene 
 */
Gene.prototype.mate = function(gene) {
    //debugger;
    //Arredonde this.code.length (13)/ 2) - 1; (pegando a metade da string)
    var pivot = Math.round(this.code.length / 2) - 1;
    
    //filho 1 primeira metade de um + 
    var child1 = this.code.substr(0, pivot) + gene.code.substr(pivot);
    var child2 = gene.code.substr(0, pivot) + this.code.substr(pivot);
    var child3 = gene.code.substr(3, pivot) + this.code.substr(pivot);
    var child4 = this.code.substr(3, pivot) + gene.code.substr(pivot);

    return [new Gene(child1), new Gene(child2), new Gene(child3), new Gene(child4)];
};
/**
 * Para cada caractere na string,
 *  descubra a diferença na representação ASCII
 *  entre o caractere candidato e o caractere de destino e,
 *  em seguida, faça o quadrado de forma que o "custo" seja sempre positivo.
 * Por exemplo, se temos um capital "A" (ASCII 65), mas é suposto ser um "C" maiúsculo 
 * (ASCII 67), então nosso custo para esse personagem é 4 (67 - 65 = 2 e 2 ^ 2 = 4).
 * @param {Population.goal} compareTo 
 * @function
 */
Gene.prototype.calcCost = function(compareTo) { 
    var total = 0;
    for (i = 0; i < this.code.length; i++) {
        total += (this.code.charCodeAt(i) - compareTo.charCodeAt(i)) * (this.code.charCodeAt(i) - compareTo.charCodeAt(i));
    }
    this.cost = total;
};
/**
 * @typedef Population
 * @param { String alvo } goal 
 * @param { Tamamnho da população } size 
 */
var Population = function(goal, size) {
    this.members = []; //  array de genes
    this.goal = goal; // 
    this.generationNumber = 0; // gerações passadas
    while (size--) { // tamanho da população
        var gene = new Gene();
        gene.random(this.goal.length); 
        this.members.push(gene);
    }
};
Population.prototype.display = function() {
    document.body.innerHTML = ''; //limpa o corpo do html
    document.body.innerHTML += ("<h2>Generation: " + this.generationNumber + "</h2>");
    document.body.innerHTML += ("<ul>");
    for (var i = 0; i < this.members.length; i++) {
        document.body.innerHTML += ("<li>" + this.members[i].code + " (" + this.members[i].cost + ")");
    }
    document.body.innerHTML += ("</ul>");
};

Population.prototype.sort = function() {
    this.members.sort(function(a, b) {
        return a.cost - b.cost;
    });
}
Population.prototype.generation = function() {
    for (var i = 0; i < this.members.length; i++) {
        this.members[i].calcCost(this.goal);

    }

    this.sort();
    this.display();
    //debugger;
    /*
    var children = this.members[0].mate(this.members[1]);
    this.members.splice(this.members.length - 2, 2, children[0], children[1]);
    */
    /**
     * Note que neste exemplo eu estou apenas acasalando os dois primeiros cromossomos. Isso não tem que ser sua abordagem.
     * 
     * Filho de uma geração @var {}
     */
    var children = this.members[0].mate(this.members[1]);
    var children2 = this.members[2].mate(this.members[3]);
    //Remove children[0] e children[1]
    this.members.splice(this.members.length - 8, 8, children[0], children[1], children[2], children[3], children2[0], children2[1], children2[2], children2[3]);
    
    /**
     * Loop para mutar de acordo com a chance de 50% reorganizar e atualizar a tela
     */
    for (var i = 0; i < this.members.length; i++) {
        this.members[i].mutate(0.5);
        this.members[i].calcCost(this.goal);
        if (this.members[i].code == this.goal) {
            this.sort();
            this.display();
            return true;
        }
    }
    this.generationNumber++;
    var scope = this;
    setTimeout(function() {
        scope.generation();
    }, 10);
};



function geneticFunciont() {
  var population = new Population(document.getElementById("input").value, 50); // inicia a população
  population.generation();
}