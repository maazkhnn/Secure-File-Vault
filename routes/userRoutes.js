const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    
});


/*
router.get('/', (req, res) => {
    res.json([{ id: 1, name: 'John Smith'}]); //res.send sends the same because of the nature of the content itself(its in JSON)
});
*/

module.exports = router;