function fixNumber(tempInput,reverse) { 
    let input = tempInput;   
    if (!reverse) {
        if (input.indexOf(".")==-1
            && input.indexOf(",")==-1) {
                input +=".00"
        } else {
            if (input.indexOf(",")>-1) {
                input=input.replace(",",".")
            }
            if (input.split(".")[1].length<2) {
                input+="0"
            }
        }
    } else {
        input=parseFloat(tempInput).toFixed(2)
    }
    return input;
}
