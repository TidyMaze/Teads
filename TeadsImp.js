/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var debug = false;

/**
 * Output policy
 * @param message message to output
 * @param force force output
 */
function output(message, force){
    if(debug || ((force != undefined) && force)) {
        printErr(message);
    }
}

function Color(id){
    this.id = id;
}

/**
 * Constructs an edge with 2 Vertex and the cost of transition
 * @param from starting vertex
 * @param to destination vertex
 * @param cost cost of transition (number)
 */
function Edge(from, to, cost) {
    this.from = from;
    this.to = to;
    this.cost = cost;
    this.toString = function () {
        return this.from + ' --'+this.cost+'-> ' + this.to;
    };
}

/**
 * Constructs an edge using a constant cost (1)
 * @param from starting vertex
 * @param to destination vertex
 */
Edge.withConstantCost = function(from, to){
    return new Edge(from, to, 1);
};

/**
 * Constructs a vertex using a label and an id
 * @param label label shown (String)
 * @param id unique ID of the vertex (Number/String)
 */
function Vertex(label, id){
    this.label = label;
    this.id = id;
    this.toString = function(){
        return '(' + this.label  + ')';
    };
}

/**
 * Constructs a vertex with the same label as id
 * @param id unique ID of the vertex (Number/String)
 */
Vertex.fromId = function(id){
    return new Vertex(id,id);
};

/**
 * Utility function to look for an element in an array
 * @param element element to look for
 * @param array array in which we look for the element
 */
function arrayContains(element, array) {
    return (array.indexOf(element) > -1);
}

/**
 * Represents an oriented graph made of edges.
 */
function Graph() {
    this.edges = [];
    this.mapNeighbors = {};

    /**
     * Adds an edge to the graph from to vertices
     * @param from starting vertex
     * @param to destination vertex
     */
    this.addEdge = function (from, to) {

        if(this.mapNeighbors[from.id] == undefined){
            this.mapNeighbors[from.id] = {};
        }
        if(this.mapNeighbors[from.id][to.id] == undefined){
            this.mapNeighbors[from.id][to.id] = to;
        }

        var newEdge = Edge.withConstantCost(from, to);
        this.edges.push(newEdge);
    };

    /**
     * Return a string representing the graph.
     * Format : "edges : [<edge>, <edge>, ...]"
     */
    this.toString = function () { return 'edges : [' + this.edges.join(', ') + ']'; };

    /**
     * Finds all reachable neighbors of a vertex in the graph
     * @param v vertex from which we look for neighbors
     */
    this.findReachableNeighbors = function(v){
        var neighbor = this.mapNeighbors[v.id];
        output('voisins de ' + v + ' : ');
        printNeighbors(neighbor);
        return neighbor;
    };

    function printNeighbors(mapNeighbors) {
        if(!debug) return;
        for(var id in mapNeighbors){
            if(mapNeighbors.hasOwnProperty(id)) {
                output(mapNeighbors[id]);
            }
        }
    }

    /**
     * Finds the cost of transition between two vertices (if exists)
     * @param from starting vertex
     * @param to destination vertex
     * @return the cost {Number} or Number.POSITIVE_INFINITY
     */
    this.findCost = function (from, to) {
        var filtered = this.edges.filter(function(e){
            return (e.from.id == from.id) && (e.to.id == to.id);
        });
        if(filtered.length <= 0) return Number.POSITIVE_INFINITY;
        return filtered[0].cost;
    };

    /**
     * Returns a GraphViz description of the graph
     */
    this.toGraphViz = function(){
        function formatGraphVizEdge(e) {
            return e.from.label + ' -> ' + e.to.label + ' [ label="' + e.cost + '" ];';
        }
        return 'digraph g{' + this.edges.map(formatGraphVizEdge).join('\n') + '}';
    };

    /**
     * Find all vertices included in edges of this graph
     */
    this.findAllVertices = function () {
        var allVerticesId = [];
        var allVertices = [];

        this.edges.forEach(function(curE, idCur, array){
            if (!arrayContains(curE.from.id, allVerticesId)) {
                allVerticesId.push(curE.from.id);
                allVertices.push(curE.from);
            }
            if (!arrayContains(curE.to.id, allVerticesId)) {
                allVerticesId.push(curE.to.id);
                allVertices.push(curE.to);
            }
        });
        return allVertices;
    };

    

}

/**
 * Constructs a graph in circle (n -> n+1 and final->first)
 * @param nbVertices number of vertices to use
 * @returns {Graph}
 */
Graph.generateCircle = function(nbVertices) {
    var graph = new Graph();
    for (var numVertex = 0; numVertex < nbVertices; numVertex++) {
        var v1 = Vertex.fromId(numVertex);
        var v2 = Vertex.fromId((numVertex + 1) % nbVertices);

        graph.addEdge(v1, v2);
    }
    return graph;
};

/**
 * Returns a random integer number in range [0;max]
 * @param max maximum number (included)
 * @returns {number}
 */
function random(max) {
    return Math.floor(Math.random() * (max+1));
}

/**
 * Picks a random value in an array
 * @param array array to pick value
 * @returns {*}
 */
function randomInArray(array) {
    return array[random(array.length - 1)];
}

/**
 * Generates a random graph using vertices and edges
 * @param nbVertices number of vertices of the generated graph
 * @param nbEdges number of edges of the generated graph
 * @returns {Graph}
 */
Graph.generateRandom = function(nbVertices, nbEdges){

    if(nbEdges > Math.pow(nbVertices,2)){
        throw 'too many edges ! ('+ nbEdges + '>' + Math.pow(nbVertices,2);
    }

    var allEdges = [];

    var graph = new Graph();
    for (var i = 0; i < nbVertices; i++) {
        for (var j = 0; j < nbVertices; j++) {
            var v1 = Vertex.fromId(i);
            var v2 = Vertex.fromId(j);
            allEdges.push(Edge.withConstantCost(v1, v2));
        }
    }

    for (var i = 0; i < nbEdges; i++) {
        var id = random(allEdges.length - 1);
        graph.addEdge(allEdges[id].from, allEdges[id].to);
        allEdges.splice(id, 1);
    }
    return graph;
};

/**
 * Generates a fancy representation of a path.
 * @param path the path to represent
 * @returns {*}
 */
function prettyPath(path) {
    return path==null ? 'no path found! ' : path.join(" -> ");
}

/**
 * Show a graph in <mydiv> of the webpage
 * @param gr graph to show
 */
function showGraphViz(gr) {
    var element = document.getElementById("shownGraphDiv");
    element.innerHTML = Viz(gr.toGraphViz(), "svg");
}

function a_toutes_les_couleurs(N, ensC, colorsState){
    for(var i=0;i<ensC.length;i++){
        var C = ensC[i];
        if(colorsState[N.id][C.id] == undefined){
            return false;
        }
    }
    return true;
}

function couleur_max(N, colorsState){
    var idCouleur_maximale = undefined;
    var couleursN = colorsState[N.id];
    for(var idC in couleursN){
        if(couleursN.hasOwnProperty(idC)){
            if(idCouleur_maximale == undefined || (couleursN[idC] > couleursN[idCouleur_maximale])){
                idCouleur_maximale = idC;
            }
        }
    }
    return {'id':idCouleur_maximale, 'dist' : couleursN[idCouleur_maximale]};
}

function feuilles_de(G){
    return G.findAllVertices().filter(function(vertex){
        return Object.keys(G.findReachableNeighbors(vertex)).length == 1;
    });
}

function trouver_voisin_couleur(G, N, C, colorsState){
    var neighbors = G.findReachableNeighbors(N);
    for(var idNeighbor in neighbors){
        var curNeighbor = neighbors[idNeighbor];
        if (colorsState[idNeighbor][C.id] != undefined) {
            return curNeighbor;
        }
    }
    return undefined;
}

function initialiser_feuilles(G, ensC, colorsState){
    var feuilles = feuilles_de(G);
    output('feuilles : ' + feuilles);
    feuilles.forEach(function(f, index){
        var color = new Color(index);
        ensC.push(color);
        colorsState[f.id][color.id] = 0;
        //printErr('colorsState[' + f.id + '][' + color.id + '] = 0');
    });
}
function etendre_les_couleurs_voisines(G, N, ensc, colorsState){
    ensc.forEach(function(C){
        if(colorsState[N.id][C.id] == undefined){
            var V = trouver_voisin_couleur(G, N, C, colorsState);
            if(V != undefined){
                colorsState[N.id][C.id] = (colorsState[V.id][C.id]+1);
            }
        }
    });
}

function printColorsStates(colorsState, N) {
    if(!debug) return;
    for(var colorId in colorsState[N.id]){
        if(colorsState[N.id].hasOwnProperty(colorId)) {
            output('color ' + colorId + ' : ' + colorsState[N.id][colorId]);
        }
    }
}

function etendre_et_trouver_toutes_les_couleurs(G, ensC, colorsState) {
    var allVertices = G.findAllVertices();
    for (var etape = 1; etape <= allVertices.length - 1; etape++) {
        for (var i = 0; i < allVertices.length; i++) {
            var N = allVertices[i];
            output('avant etendre ' + N + ' : ');
            printColorsStates(colorsState, N);
            etendre_les_couleurs_voisines(G, N, ensC, colorsState);
            output('après etendre ' + N + ' : ');
            printColorsStates(colorsState, N);
            if (a_toutes_les_couleurs(N, ensC, colorsState)) {
                output(N + ' a toutes les couleurs', true);
                var couleurMax = couleur_max(N, colorsState);
                return {'noeud': N, 'couleur': couleurMax};
            }
        }
    }
    return undefined;
}

function initialiserColorsState(colorsState, G) {
    G.findAllVertices().forEach(function(V){
        colorsState[V.id]={};
    });
}

function trouver_centre(G){
    var ensC = [];
    var colorsState = [];
    initialiserColorsState(colorsState, G);
    initialiser_feuilles(G, ensC, colorsState);
    return etendre_et_trouver_toutes_les_couleurs(G,ensC,colorsState);
}

var graph = new Graph();

var n = parseInt(readline()); // the number of adjacency relations
for (var i = 0; i < n; i++) {
    var inputs = readline().split(' ');
    var xi = parseInt(inputs[0]); // the ID of a person which is adjacent to yi
    var yi = parseInt(inputs[1]); // the ID of a person which is adjacent to xi

    var vx = Vertex.fromId(xi);
    var vy = Vertex.fromId(yi);
    graph.addEdge(vx, vy);
    graph.addEdge(vy, vx);
}

output(graph.toGraphViz());

// Write an action using print()
// To debug: printErr('Debug messages...');
var centre = trouver_centre(graph);
output('id centre : ' + centre.couleur.id, true);
output('dist centre : ' + centre.couleur.dist, true);
output('noeud centre : ' + centre.noeud, true);
print(centre.couleur.dist); // The minimal amount of steps required to completely propagate the advertisement