package com.swekit.backend.Model;

public class PaymentResponse {
    public String getUpiLink() {
        return upiLink;
    }

    public void setUpiLink(String upiLink) {
        this.upiLink = upiLink;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public PaymentResponse(String upiLink, double totalAmount) {
        this.upiLink = upiLink;
        this.totalAmount = totalAmount;
    }

    public PaymentResponse(){

    }

    private double totalAmount;
    private String upiLink;
}
