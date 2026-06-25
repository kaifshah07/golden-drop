import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "../../config/prisma";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});


export class PaymentService {


  // CREATE RAZORPAY ORDER
  static async createPaymentOrder(orderId: bigint) {

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });


    if (!order) {
      throw new Error("Order not found");
    }


    const paymentOrder =
      await razorpay.orders.create({

        amount:
          Math.round(
            Number(order.totalAmount) * 100
          ),

        currency: "INR",

        receipt:
          order.orderNumber,
      });



    await prisma.payment.create({

      data: {

        orderId: order.id,

        paymentGateway:
          "RAZORPAY",

        amount:
          order.totalAmount,

        paymentStatus:
          "PENDING",

        transactionId:
          paymentOrder.id,
      },

    });



    return paymentOrder;
  }





  // VERIFY PAYMENT FROM FRONTEND
  static async verifyPayment(
    orderId: bigint,
    paymentId: string
  ) {


    const payment =
      await prisma.payment.findFirst({

        where:{
          orderId,
        },

      });



    if(!payment){

      throw new Error(
        "Payment not found"
      );

    }




    const updatedPayment =
      await prisma.payment.update({

        where:{
          id:payment.id,
        },


        data:{

          paymentId,

          paymentStatus:
            "PAID",

        },

      });





    await prisma.order.update({

      where:{
        id:orderId,
      },


      data:{

        paymentStatus:
          "PAID",

        orderStatus:
          "CONFIRMED",

      },

    });



    return updatedPayment;

  }





  // RAZORPAY WEBHOOK
  static async handleWebhook(
    payload:any,
    signature:string
  ){



    const generatedSignature =
      crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET!
      )
      .update(
        JSON.stringify(payload)
      )
      .digest("hex");




    if(
      generatedSignature !== signature
    ){

      throw new Error(
        "Invalid webhook signature"
      );

    }




    const event =
      payload.event;




    // PAYMENT SUCCESS

    if(
      event === "payment.captured"
    ){


      const paymentEntity =
        payload.payload.payment.entity;



      const razorpayPaymentId =
        paymentEntity.id;



      const razorpayOrderId =
        paymentEntity.order_id;




      const payment =
        await prisma.payment.findFirst({

          where:{

            transactionId:
              razorpayOrderId,

          },

        });




      if(!payment){

        throw new Error(
          "Payment record not found"
        );

      }





      await prisma.payment.update({

        where:{
          id:payment.id,
        },


        data:{

          paymentId:
            razorpayPaymentId,

          paymentStatus:
            "PAID",

        },

      });





      await prisma.order.update({

        where:{
          id:payment.orderId,
        },


        data:{

          paymentStatus:
            "PAID",

          orderStatus:
            "CONFIRMED",

        },

      });



    }





    // PAYMENT FAILED

    if(
      event === "payment.failed"
    ){


      const paymentEntity =
        payload.payload.payment.entity;



      const razorpayOrderId =
        paymentEntity.order_id;




      const payment =
        await prisma.payment.findFirst({

          where:{
            transactionId:
              razorpayOrderId,
          },

        });




      if(payment){


        await prisma.payment.update({

          where:{
            id:payment.id,
          },


          data:{

            paymentStatus:
              "FAILED",

          },

        });




        await prisma.order.update({

          where:{
            id:payment.orderId,
          },


          data:{

            paymentStatus:
              "FAILED",

          },

        });


      }


    }



    return true;

  }


}