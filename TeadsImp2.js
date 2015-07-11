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

/**
 * Utility function to look for an element in an array
 * @param element element to look for
 * @param array array in which we look for the element
 */
function arrayContains(element, array) {
    return (array.indexOf(element) > -1);
}

var nodes = [];
var mapNeighbors = {};

var n = parseInt(readline()); // the number of adjacency relations
for (var i = 0; i < n; i++) {
    var inputs = readline().split(' ');
    var xi = parseInt(inputs[0]); // the ID of a person which is adjacent to yi
    var yi = parseInt(inputs[1]); // the ID of a person which is adjacent to xi

    if(!arrayContains(xi,nodes)){
        nodes.push(xi);
        mapNeighbors[xi] = [];
    }

    if(!arrayContains(yi,nodes)){
        nodes.push(yi);
        mapNeighbors[yi] = [];
    }

    mapNeighbors[xi].push(yi);
    mapNeighbors[yi].push(xi);
}

output(JSON.stringify(nodes));
output(JSON.stringify(mapNeighbors));

function neighbors(node, edges){
    return edges.filter(function(e){
        return e.from == node;
    }).map(function(e){
        return e.to;
    });
}

var count=0;
while(nodes.length > 1){
    var leafs = (function(mapNeighbors) {
        return nodes.filter(function (n) {
            var curN = mapNeighbors[n];
            output(n + ' neighbors : ' + JSON.stringify(curN));
            return curN.length <= 1;
        });
    })(mapNeighbors);
    output('leafs : ' + JSON.stringify(leafs));

    nodes = (function(leafs){
        return nodes.filter(function(n){
            return !arrayContains(n,leafs);
        });
    })(leafs);

    leafs.forEach(function(l){
       delete mapNeighbors[l];
    });

    nodes.forEach(function(n){
        mapNeighbors[n] = (function(leafs){
            return mapNeighbors[n].filter(function(ne){
                return !arrayContains(ne,leafs);
        })})(leafs);
    });

    count++;
}

print(count);
