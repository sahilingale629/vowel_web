import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./CSS/PaymentForm.css"; // Import your CSS file

const PaymentForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    billingAddress: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (result.error) {
      setPaymentError(result.error.message);
      setPaymentSuccess(null);
    } else {
      // Send payment method to server for further processing
      console.log(result.paymentMethod);
      console.log("User Info:", formData); // Display user info
      setPaymentSuccess("Payment successful!");
      setPaymentError(null);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="billingAddress"
        placeholder="Billing Address"
        value={formData.billingAddress}
        onChange={handleChange}
        required
      />
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      {paymentError && <div className="error-message">{paymentError}</div>}
      {paymentSuccess && (
        <div className="success-message">{paymentSuccess}</div>
      )}
    </form>
  );
};

export default PaymentForm;
