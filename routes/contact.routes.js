const router = require('express').Router();
const contactController = require('../controllers/contact.controller');
const verifyUser = require('../middlewares/authentication')



router.post('/createContact' , contactController.createUserContact);

router.get('/getAllContacts' , verifyUser ,  contactController.getAllUserContacts);

router.get('/getContacterId/:contactId' , verifyUser ,  contactController.getContactedById);

router.delete('/deleteContacted/:contactId' , verifyUser , contactController.deleteContactedById);



module.exports = router