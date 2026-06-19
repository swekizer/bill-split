package com.swekit.backend.Controller;

import com.swekit.backend.Model.*;
import com.swekit.backend.Repository.BillRepository;
import com.swekit.backend.Repository.UserRepository;
import com.swekit.backend.Service.UserSelectionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;



@RestController
@CrossOrigin(origins = "https://bill-split-six-ruby.vercel.app")
public class UserSelectionController {

    public UserSelectionController(UserSelectionService userSelectionService, UserRepository userRepository, BillRepository billRepository) {
        this.userSelectionService = userSelectionService;
        this.userRepository = userRepository;
        this.billRepository= billRepository;
    }

    private UserSelectionService userSelectionService;
    private UserRepository userRepository;
    private BillRepository billRepository;



    @PostMapping("/save")
    public PaymentResponse save(@RequestBody SelectionRequest selectionRequest){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email).orElse(null);
        Bill bill = billRepository.findByUrl(selectionRequest.getBillUrl()).orElse(null);
        ArrayList<BillItem> selectedItem = selectionRequest.getSelectedItems();
        userSelectionService.saveSelection(currentUser, bill, selectedItem);
        double total = userSelectionService.getMyTotal(selectedItem);
        String upiLink = userSelectionService.generateUpiLink(total, bill.getUser().getUpiId(), bill.getUser().getUsername(), selectionRequest.getBillUrl());
        return new PaymentResponse(upiLink, total);
    }

    @GetMapping("/bill/{uuid}")
    public ArrayList<BillItem> bill(@PathVariable String uuid){
        Bill bill =  billRepository.findByUrl(uuid).orElse(null);
        ArrayList<BillItem> billItems = bill.getBillItems();
        return billItems;
    }

}
