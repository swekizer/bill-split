package com.swekit.backend.Model;

//In this we will take few things from user like image and a title. This is called DTO i guess


import java.time.LocalDateTime;

public class BillRequest {
    private LocalDateTime generatedAt;
    private String title;
    private String billImage;

    public String getBillImage() {
        return billImage;
    }

    public void setBillImage(String billImage) {
        this.billImage = billImage;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

}
