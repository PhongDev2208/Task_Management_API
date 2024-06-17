const express = require('express');
const router = express.Router();

const controller = require('../controllers/task.controller');
const validate = require('../validates/task.validate');

router.get('/',controller.index);
router.get('/detail/:id',controller.detail);
router.patch('/change-status/:id',controller.changeStatus);
router.patch('/change-multi/',controller.changeMulti);
router.patch('/edit/:id',validate.create,controller.edit);
router.post('/create',validate.create,controller.create);
router.delete('/delete/:id',controller.delete);

module.exports = router;