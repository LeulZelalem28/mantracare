const express = require('express');
const router = express.Router();
const CusCriSupSessionController = require('../controller/cusCriSupSessionController');
const ROLES_LIST = require('../config/roles_list');

const cusCriSupSessionRouter = (db) => {
    const cusCriSupSessionController = new CusCriSupSessionController(db);

     router.route('/')
        .get(cusCriSupSessionController.getSupport);

    router.route('/create/:supportType')
        .post(cusCriSupSessionController.createSupport);
    
    router.route('/type/:supportType') 
        .get(cusCriSupSessionController.getSupportBySessionType);
    
    router.route('/user')
        .get(cusCriSupSessionController.getSupportByUserId);

    router.route('/:id')
        .get(cusCriSupSessionController.getSupportById)
        .delete(cusCriSupSessionController.deleteSupport);

    return router
}

module.exports = cusCriSupSessionRouter;