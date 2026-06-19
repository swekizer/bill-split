package com.swekit.backend.Model;

import java.util.ArrayList;

public class SelectionRequest {
    public SelectionRequest(String billUrl, ArrayList<BillItem> selectedItems) {
        this.billUrl = billUrl;
        this.selectedItems = selectedItems;
    }

    public SelectionRequest(){

    }

    public String getBillUrl() {
        return billUrl;
    }

    public void setBillUrl(String billUrl) {
        this.billUrl = billUrl;
    }

    public ArrayList<BillItem> getSelectedItems() {
        return selectedItems;
    }

    public void setSelectedItems(ArrayList<BillItem> selectedItems) {
        this.selectedItems = selectedItems;
    }

    private String billUrl;           // to find the bill
    private ArrayList<BillItem> selectedItems;
}
