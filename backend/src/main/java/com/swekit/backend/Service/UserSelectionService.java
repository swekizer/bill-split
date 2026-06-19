package com.swekit.backend.Service;

import com.swekit.backend.Model.Bill;
import com.swekit.backend.Model.BillItem;
import com.swekit.backend.Model.User;
import com.swekit.backend.Model.UserSelection;
import com.swekit.backend.Repository.UserSelectionRepository;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

@Service
public class UserSelectionService {

    public UserSelectionService(UserSelectionRepository userSelectionRepository) {
        this.userSelectionRepository = userSelectionRepository;
    }

    private UserSelectionRepository userSelectionRepository;


    public UserSelection saveSelection(User user, Bill bill, ArrayList<BillItem> selectedItems){
        UserSelection selection = new UserSelection();
        selection.setUser(user);
        selection.setBill(bill);
        selection.setBillItems(selectedItems);
        return userSelectionRepository.save(selection);
    }

    public double getMyTotal(ArrayList<BillItem> list){
        double total = 0.0;
        for(BillItem b: list){
            total += b.getPrice() * b.getQuantity();
        }

        return total;
    }

    public String generateUpiLink(double amount, String upiId, String name, String transactionId) {

        String payeeAddress = upiId; // Your verified VPA
        String payeeName = name;
        String currency = "INR";

        try {
            return "upi://pay?" +
                    "pa=" + payeeAddress +
                    "&pn=" + URLEncoder.encode(payeeName, StandardCharsets.UTF_8) +
                    "&am=" + amount +
                    "&cu=" + currency +
                    "&tn=" + URLEncoder.encode("Order " + transactionId, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error generating UPI link string", e);
        }
    }
}
