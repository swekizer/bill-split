package com.swekit.backend.Model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.util.ArrayList;

@Entity
public class UserSelection implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    public ArrayList<BillItem> getBillItems() {
        return billItems;
    }

    public void setBillItems(ArrayList<BillItem> billItems) {
        this.billItems = billItems;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Bill getBill() {
        return bill;
    }

    public void setBill(Bill bill) {
        this.bill = bill;
    }

    public UserSelection(Bill bill, User user, ArrayList<BillItem> billItems) {
        this.bill = bill;
        this.user = user;
        this.billItems = billItems;
    }

    public UserSelection(){

    }

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private ArrayList<BillItem> billItems;

    @ManyToOne
    @JoinColumn(name = "user_user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name ="bill_id")
    private Bill bill;

}
