const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* GET ALL CATEGORIES */
router.get('/', function (req, res) {       // Sending Page Query Parameter is mandatory http://localhost:3636/api/categories?page=1
    
    database.table('categories as c')
        .withFields(['c.title as title','c.id'])
        .sort({id: .1})
        .getAll()
        .then(categ => {
            if (categ.length > 0) {
                res.status(200).json({
                    count: categ.length,
                    categories: categ
                });
            } else {
                res.json({message: "No categories found"});
            }
        })
        .catch(err => console.log(err));
});

/* GET ALL PRODUCTS FROM ONE CATEGORY */
router.get('/:catName', (req, res) => { // Sending Page Query Parameter is mandatory http://localhost:3636/api/categories/categoryName?page=1
    // Get category title value from param
    const cat_title = req.params.catName;

    database.table('products as p')
        .join([
            {
                table: "categories as c",
                on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id'
        ])
        .slice(startValue, endValue)
        .sort({id: 1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({message: `No products found matching the category ${cat_title}`});
            }
        }).catch(err => res.json(err));

});


module.exports = router;