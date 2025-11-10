import { useEffect } from "react";
import { toast } from "react-toastify";
import socket from "../socket";

const useOwnerNotifications = (ownerId) => {
  useEffect(() => {
    if (!ownerId) {
      console.log("🟡 No ownerId provided to useOwnerNotifications");
      return;
    }

    console.log("✅ useOwnerNotifications active for ownerId:", ownerId);

    const handleParkingPayment = (data) => {
      console.log("📨 'parking-payment' event received:", data);

      toast.success(
        data?.message || "💰 You received a payment for your parking slot!",
        { position: "top-right" }
      );
    };

    // Register the socket listener
    console.log("📡 Listening for 'parking-payment'...");
    socket.off("parking-payment").on("parking-payment", handleParkingPayment);

    // Cleanup
    return () => {
      socket.off("parking-payment", handleParkingPayment);
      console.log("🧹 Cleaned up 'parking-payment' listener");
    };
  }, [ownerId]);
};

export default useOwnerNotifications;