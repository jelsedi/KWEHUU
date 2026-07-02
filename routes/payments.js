const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');
const supabase = require("../services/supabase");


// ===============================
// FORMAT PHONE NUMBER
// ===============================
function formatPhone(phone) {

  if (!phone) return "";

  phone = phone.toString().trim();

  if (phone.startsWith("+")) {
    phone = phone.substring(1);
  }

  if (phone.startsWith("0")) {
    phone = "254" + phone.substring(1);
  }

  return phone;
}

// ===============================
// GET MPESA ACCESS TOKEN
// ===============================
async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`
      }
    }
  );

  return response.data.access_token;
}

// ===============================
// TEST ROUTE
// ===============================
router.get('/test', (req, res) => {
  res.json({
    message: 'Payments route working'
  });
});

// ===============================
// CALLBACK TEST ROUTE
// ===============================
router.get('/callback', (req, res) => {
  res.json({
    message: 'MPESA callback working'
  });
});

// ===============================
// MPESA CALLBACK
// ===============================
router.post('/callback', async (req, res) => {
  try {

    console.log(
      '========== MPESA CALLBACK =========='
    );

    console.log(
      JSON.stringify(req.body, null, 2)
    );

    const callback = req.body.Body.stkCallback;

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;
    

    // -------------------------------
    // PAYMENT SUCCESS
    // -------------------------------
    if (resultCode === 0) {

      let receipt = null;

      if (callback.CallbackMetadata) {

        callback.CallbackMetadata.Item.forEach(item => {

          if (item.Name === 'MpesaReceiptNumber') {
            receipt = item.Value;
          }

        });

      }

      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'pending',
          mpesa_receipt: receipt,
          updated_at: new Date()
        })
        .eq(
          'mpesa_checkout_request_id',
          checkoutRequestId
        );

      if (error) {
        console.error(error);
      } else {
        console.log('✅ Order marked as PAID');
      }

    }

    // -------------------------------
    // PAYMENT FAILED / CANCELLED
    // -------------------------------
    else {

      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          updated_at: new Date()
        })
        .eq(
          'mpesa_checkout_request_id',
          checkoutRequestId
        );

      if (error) {
        console.error(error);
      } else {
        console.log(
          `❌ Payment failed. ResultCode: ${resultCode}`
        );
      }

    }

    return res.json({
      ResultCode: 0,
      ResultDesc: 'Accepted'
    });

  } catch (err) {

    console.error(
      'CALLBACK ERROR:',
      err
    );

    return res.json({
      ResultCode: 0,
      ResultDesc: 'Accepted'
    });

  }
});

// ===============================
// STK PUSH
// ===============================
router.post('/mpesa/stk-push', async (req, res) => {

  try {

    const { order_id, phone } = req.body;

    const formattedPhone = formatPhone(phone);

    console.log("================================");
    console.log("PHONE RECEIVED:", phone);
    console.log("TYPE:", typeof phone);
    console.log("================================");


    if (!order_id) {
      return res.status(400).json({
        error: 'Order ID is required'
      });
    }

    if (!phone) {
      return res.status(400).json({
        error: 'Phone number is required'
      });
    }

    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('total')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    const token = await getAccessToken();

    const timestamp = moment().format('YYYYMMDDHHmmss');

    const password = Buffer.from(
      process.env.MPESA_BUSINESS_SHORTCODE +
      process.env.MPESA_PASSKEY +
      timestamp
    ).toString('base64');

  const payload = {
    BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: 1,
    PartyA: formattedPhone,
    PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: `ORDER-${order_id}`,
    TransactionDesc: 'KWEHU Order Payment'
};

    console.log('========== STK REQUEST ==========');
    console.log(payload);

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('========== STK RESPONSE ==========');
    console.log(response.data);

    const { error } = await supabase
      .from('orders')
      .update({
        mpesa_checkout_request_id:
          response.data.CheckoutRequestID,
        updated_at: new Date()
      })
      .eq('id', order_id);

    if (error) {
      console.error(
        'Failed to save CheckoutRequestID',
        error
      );
    }

    return res.json(response.data);

  } catch (err) {

    console.error(
      'STK ERROR:',
      err.response?.data || err.message
    );

    return res.status(500).json(
      err.response?.data || {
        error: 'STK Push failed'
      }
    );

  }

});

module.exports = router;