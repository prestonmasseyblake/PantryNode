var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

var { Sequelize } = require( 'sequelize');
var { initModels, item, stock, trans_items } = require( "../models/init-models");

const sequelize = new Sequelize(require('../config/keys').PostgresURI);

initModels(sequelize);


/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        let errors = [];
        res.render('index', { errors });
    } else {
        res.redirect('/home', { title: 'Home' });

    }

});

router.get('/home', ensureAuthenticated, function(req, res) {
  if (!req.isAuthenticated()) {
    const errors = [];
    res.redirect('index');
  } else {
    item.findAll().then( async (allItems) => {
      if (allItems == null) {
        console.log("THIS IS ERROR " + item);
      } else {
        console.log("Check");
        // console.log(allItems);
        const oneDay = 24 * 60 * 60 * 1000;
        for (let i = 0; i < allItems.length; i++) {
          const id=allItems[i].item_id;
          const item=await trans_items.findOne({ where: { trans_item_id: id }});
          if(item)
          {
            const diff = Math.round(Math.abs((new Date().getTime() - new Date(item.get('expiration')).getTime()) / oneDay));
            console.log('Days to expire: '+ diff);
          }
          else
          {
            console.log('No transaction is found')
          }
          //const currentDate = new Date();
          //console.log("current date: " + currentDate);
          //const expire_date =new Date(allItems[i] );
          //console.log("expire date: " + expire_date);
          //const id=allItems
          //console.log("id:"+ id);
          //console.log("Days:" + diff);
          // if (diff <= 2) {
          //   ids.push(allItems[i]);
          // }
          // console.log(allItems[i]);
          // console.log("item_id :" +allItems[i].item_id);
          
          //const trans_item=await trans_items.findOne({ where: { trans_item_id: id }});
          // console.log("trans item: "+trans_item.get({ plain: true }));
          // if (trans_item) {
          //   // const trans = await trans_items.findAll();
          //   // console.log('trans items:', trans.map(item => item.get({ plain: true })));
          //   console.log('trans item:'+ trans_item.get('expiration'));

          // } else {
          //   console.log('trans item is null');
          // }
          
        }
        //console.log(ids);
        if (allItems.length > 0) {
          res.render('dashboard', {
            data: { name: req.user, allItems }
          })
        } else {
          res.render('dashboard', {
            data: { name: req.user }
          })
        }
      }
    }
    );
  }
});




module.exports = router;