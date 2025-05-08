import Payment from "../models/Payment.js";
const upiRegex = /^[\w.-]+@[\w.-]+$/;

export const createPayment = async (req, res, next) => {
  try {
    const { cardNumber, expiry, cvv, upiId, amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    let paymentData = { amount, status: "success" };

    if (cardNumber && expiry && cvv) {
      paymentData.card = { cardNumber, expiry, cvv };
    } else if (upiId) {
      if (!upiRegex.test(upiId)) {
        return res.status(400).json({ message: "Valid UPI ID required" });
      }
      paymentData.upi = { upiId };
    } else {
      return res.status(400).json({ message: "Card or UPI details required" });
    }

    const payment = new Payment(paymentData);
    await payment.save();
    res.status(201).json({ message: "Payment successful", payment });
  } catch (err) {
    next(err);
  }
};

// Get payment details by ID
export const getPaymentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (err) {
    next(err);
  }
};
