function add(a,b){
    if(a==b){
        return a+b;
    }
    else if(a>=b){
        return a-b;
    }
    else if(b !== 0) {
        return a/b;
    }
    else if(a>=0){
        return a*b;
    }
}
module.exports = add;

