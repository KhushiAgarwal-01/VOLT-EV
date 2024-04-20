const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//login and signup
const  userRoutes = require('./api/routes/user');

//middleware
const app = express();

// mongoose connection (gyanesh9875@gmail.com // Gyanesh75*)
const DB = "mongodb+srv://volt:volt@gyanesh9875.1xgzmm9.mongodb.net/?retryWrites=true&w=majority&appName=gyanesh9875";
 mongoose.connect(DB);

// sripe paymenyt gateway api key (//gyanesh9875@hmail.com // Gyanesh75#);
const stripe = require('stripe')("sk_test_51OVUHuSF5ZUXC1WFtMkrXYKg2xd9RvRgiqX1Fsm21nPPuzOdMD89jRDrq4xVDjy1q4h5hG4MNU1kDGHNw2kQPJWQ00CljUp7wV");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/user",userRoutes);


app.use('/user', (req,res,next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
}); 

app.post('/checkout', async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
          payment_method_types:["card"],
          mode:"payment",
          line_items:req.body.items.map(item => {
              return {
                  price_data: {
                      currency: "usd",
                      product_data: {
                          name:item.name
                      },
                      unit_amount: (item.price)*100,
                  },
                  quantity:item.quantity
              }
          }),success_url:"http://localhost:8765/success",
             cancel_url:"http://localhost:8765/cancel"
      });
      res.json({url:session.url});
    }
    catch(error) {
     
      res.status(500).json({error:error.message});
  
    }
  });
  

module.exports = app;
