import { Response } from "express";
import { PaymentService } from "./payment.service";


export class PaymentController {


  static async createOrder(
    req:any,
    res:Response
  ){

    try{


      const {
        orderId
      } = req.body;



      const paymentOrder =
        await PaymentService.createPaymentOrder(
          BigInt(orderId)
        );



      return res.status(201).json({

        success:true,

        message:
          "Payment order created",

        data:
          paymentOrder,

      });



    }
    catch(err:any){


      return res.status(500).json({

        success:false,

        message:
          err.message,

      });


    }


  }





  static async verify(
    req:any,
    res:Response
  ){


    try{


      const {
        orderId,
        paymentId
      } = req.body;



      const result =
        await PaymentService.verifyPayment(

          BigInt(orderId),

          paymentId

        );



      return res.status(200).json({

        success:true,

        message:
          "Payment verified successfully",

        data:
          result,

      });



    }
    catch(err:any){


      return res.status(500).json({

        success:false,

        message:
          err.message,

      });


    }


  }





  static async webhook(
    req:any,
    res:Response
  ){

    try{


      const signature =
        req.headers[
          "x-razorpay-signature"
        ] as string;



      await PaymentService.handleWebhook(

        req.body,

        signature

      );



      return res.status(200).json({

        success:true,

        message:
          "Webhook processed",

      });



    }
    catch(err:any){


      return res.status(400).json({

        success:false,

        message:
          err.message,

      });


    }

  }


}