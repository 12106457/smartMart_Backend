const {addFaqRecord,getActiveFaqs,updateFaqRecord}=require("../controllers/faqController")
const express = require("express");
const router = express.Router();

router.post("/add", addFaqRecord);

router.put("/update/:id",updateFaqRecord );

router.get('/get',getActiveFaqs);

module.exports = router;