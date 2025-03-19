const faqModel = require("../models/FAQModel");

exports.addFaqRecord = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).send({ status: false, message: "Question and answer are required." });
    }

    const newFaqRecord = new faqModel({
      question,
      answer,
    });

    await newFaqRecord.save(); // ✅ Await the save operation

    res.status(201).send({
      status: true,
      message: "FAQ added successfully",
      data: newFaqRecord,
    });

  } catch (error) {
    console.error("Error adding FAQ:", error);
    res.status(500).send({ status: false, message: "Something went wrong." });
  }
};


exports.updateFaqRecord = async (req, res) => {
    try {
      const { id } = req.params; // Get FAQ ID from URL
      const { question, answer, active } = req.body; // Get data to update
  
      // Find and update FAQ
      const updatedFaq = await faqModel.findByIdAndUpdate(
        id,
        { question, answer, active },
        { new: true, runValidators: true } // Return updated record
      );
  
      if (!updatedFaq) {
        return res.status(404).send({ status: false, message: "FAQ not found" });
      }
  
      res.status(200).send({
        status: true,
        message: "FAQ updated successfully",
        data: updatedFaq,
      });
  
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(500).send({ status: false, message: "Something went wrong." });
    }
  };

  
  exports.getActiveFaqs = async (req, res) => {
    try {
        const activeFaqs = await faqModel.find({ active: true }).select("question answer");
  
      res.status(200).send({
        status: true,
        message: "FAQs fetched successfully",
        data: activeFaqs,
      });
  
    } catch (error) {
      console.error("Error fetching active FAQs:", error);
      res.status(500).send({ status: false, message: "Something went wrong." });
    }
  };
  
