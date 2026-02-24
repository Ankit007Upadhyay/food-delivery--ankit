import express from "express";
import authMiddleware from "../middleware/auth.js";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, getRestroOwnerOrders, updateRestroOrderStatus, removeDeliveredOrders, acceptOrder, rejectOrder, cancelOrder, updateOrderWithDeliveryBoy } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/status",authMiddleware,updateStatus);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",authMiddleware,listOrders);
orderRouter.post("/restro-orders",authMiddleware,getRestroOwnerOrders);
orderRouter.post("/restro-status",authMiddleware,updateRestroOrderStatus);
orderRouter.post("/accept-order",authMiddleware,acceptOrder);
orderRouter.post("/reject-order",authMiddleware,rejectOrder);
orderRouter.post("/cancel-order",authMiddleware,cancelOrder);
orderRouter.post("/remove-delivered",authMiddleware,removeDeliveredOrders);
orderRouter.post("/update-with-delivery-boy",authMiddleware,updateOrderWithDeliveryBoy);

export default orderRouter;