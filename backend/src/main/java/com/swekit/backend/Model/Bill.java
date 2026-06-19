package com.swekit.backend.Model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Entity
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int billId;

    @Column(nullable = false)
    private LocalDateTime generatedAt;

    //We will store image of bill in bucket then get a url and add it here.
    @Column(nullable = false)
    private String billImage;

    @Column(nullable = false)
    private String title;

    //Will get this from LLM response
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private ArrayList<BillItem> billItems;

    //We will generate a url that can be shared with other people to select the items and pay
    @Column(nullable = false)
    private String url;

    @ManyToOne
    @JoinColumn(name = "user_user_id")
    private User user;

    public Bill(){

    }


    public Bill(LocalDateTime generatedAt, String billImage, String title,ArrayList<BillItem> billItems, String url){
        this.generatedAt = generatedAt;
        this.billImage = billImage;
        this.title = title;
        this.billItems = billItems;
        this.url = url;
    }

    public Bill(LocalDateTime generatedAt, String title, String billImage) {
        this.generatedAt = generatedAt;
        this.title = title;
        this.billImage = billImage;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBillImage() {
        return billImage;
    }

    public void setBillImage(String billImage) {
        this.billImage = billImage;
    }

    public ArrayList<BillItem> getBillItems() {
        return billItems;
    }

    public void setBillItems(ArrayList<BillItem> billItems) {
        this.billItems = billItems;
    }
}
