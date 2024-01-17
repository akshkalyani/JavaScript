// Importing Packages
const os = require('os')

const user = os.userInfo()
console.log(user.username)
if(user.username == "Admin"){
    for(var i = 1; i <= 5; i++){
        console.log("\n\nCycle Number", i , "***************\n\n");
        console.log("CPU Information:", os.cpus());
        console.log("Memory status:", os.freemem());
    }
}

