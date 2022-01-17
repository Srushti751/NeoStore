const express = require('express')
const { protect } = require('../middleware/authMiddleware.js')
const router = express.Router()
const orderModel = require('../models/orderModel.js')



router.post("/saveOrder",async (req, res) => {
    console.log("Body:", req.body)
    const data = req.body;
    const user = req.body.user;
    const product_name = req.body.product_name;
    const productExists = await orderModel.findOne({ user, product_name});
    
    if (productExists) {
        // throw new Error(" already added");

        productExists.updateOne(
            { $inc: { quantity: 1 }}).then(res => console.log("Incremented"))
              
        res.status(400).json("ALready added");
            
    }
    else{
    const newblog = await new orderModel(data);
    newblog.save((error) => {
        if (error) {
            return ((500), res.send("Something went wrong"))
        }
        res.send("Your data is saved in database!!!")
    })
}
})

router.get("/getCartData/:name",(req,res)=>{
// router.get("/getCartData/:name", protect, (req, res) => {
    const user = req.params.name
    orderModel.find({ user: user })
        .then((data) => {
            console.log(data)
            res.json(data)

        })
        .catch((error) => {
            console.log(error)
        })
})

router.put("/Loginuser/:name",(req,res)=>{
    let name = req.params.name

    orderModel.updateMany({user:"guest"},{$set:{user:name}}).then((res)=>{
        // console.log("user updated",name)
    })
   
})

router.get("/getLocalData/guest",(req,res)=>{
    // router.get("/getCartData/:name", protect, (req, res) => {
        orderModel.find({ user: "guest" })
            .then((data) => {
                console.log(data)
                res.json(data)
    
            })
            .catch((error) => {
                console.log(error)
            })
    })



router.delete("/delete/:id", (req, res) => {
    // router.delete("/delete/:id",protect,(req,res)=>{
    let id = req.params.id;
    orderModel.deleteOne({ _id: id }, (err) => {
        if (err) throw err
        res.send("Order deleted")
    })
})

router.delete("/deleteAll/:user", (req, res) => {
    let user = req.params.user;
    orderModel.deleteMany({ user: user }, (err) => {
        if (err) throw err
        res.send("Order deleted")
    })
})

router.get("/checkout_by_id", async (req, res) => {
    // let type = req.query.type
    let orderId = req.query.id

    // console.log("req.query.id", req.query.id)

    // console.log("productIds", productIds)
    //we need to find the product information that belong to product Id 
    try {
        const orders = await orderModel.find({ _id: orderId })

        res.send(orders)
        console.log(orders[0])
    } catch (error) {
        res.json({ message: error })
    }

});

router.put("/updateQty/:prod_id/:scope", (req, res) => {
    let id = req.params.prod_id;
    let scope = req.params.scope;

    // db.cart.update(
    //     {_id: ObjectId('5b2a3da1f4fd65265c8ab477'), 'items.item._id': ObjectId('5b28d30888afb703508409bb')},
    //     {$inc: {"items.$.qty": value}} // Pass your increase value here
    // )
    if (scope == 'inc') {
        orderModel.findByIdAndUpdate(id,

            { $inc: { quantity: 1 }}).then(res => console.log("Incremented"))
            // { $inc: { quantity: 1 }},{ $mul:{product_total:5} }).then(res => console.log("Incremented"))
    }
    else {
        orderModel.findByIdAndUpdate(id,
            { $inc: { quantity: -1 } }).then(res => console.log("Decremented"))
    }
})



module.exports = router