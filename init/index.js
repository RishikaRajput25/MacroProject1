const { default: mongoose } = require("mongoose");

//const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const Mongo_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(Mongo_URL);

}

const initDB=async ()=>{
 await Listing.deleteMany({})

initData.data=initData.data.map((obj)=>({ ...obj,owner:"687e09b9a3588e1fcf16d36e"}));

  await Listing.insertMany(initData.data);
 console.log("Data was initialized");
}
initDB();