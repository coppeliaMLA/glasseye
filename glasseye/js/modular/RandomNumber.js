function random_gamma(alpha, beta){

    //Create d3 random number generator functions

    var random_normal = d3.random.normal()

    var d = alpha - 1/3;
    var c = 1/Math.sqrt(9*d);

    var closure = function() {

        while (!(con_1 & con_2)) {

            var z = random_normal();
            var u = Math.random();
            var v = Math.pow(1 + c * z, 3);

            //Conditions

            var con_1 = z > -1 / c;
            var con_2 = Math.log(u) < (0.5 * Math.pow(z, 2) + d - d * v + d * Math.log(v));
        }

        return (d * v) / beta;

    }

    return closure;
}


function random_dirichlet(alphas){

    //Create gamma distributions

    var gammas = alphas.map(function(d){
        return random_gamma(d,1);
    })

    var closure = function() {

        var k = gammas.map(function(g) {
            return g();
        });

        var k_sum  =  d3.sum(k);

        var x = k.map(function(d) {return d/k_sum;})


    return x;

    }

    return closure;

}