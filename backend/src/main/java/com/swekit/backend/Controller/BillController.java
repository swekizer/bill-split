package com.swekit.backend.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.swekit.backend.Model.Bill;
import com.swekit.backend.Model.BillRequest;
import com.swekit.backend.Model.User;
import com.swekit.backend.Repository.BillRepository;
import com.swekit.backend.Repository.UserRepository;
import com.swekit.backend.Service.BillService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "https://bill-split-six-ruby.vercel.app")
public class BillController {

    private BillService billService;
    private final UserRepository userRepository;
    private BillRepository billRepository;



    public BillController(BillService billService, UserRepository userRepository, BillRepository billRepository){
        this.billService = billService;
        this.userRepository = userRepository;
        this.billRepository = billRepository;
    }

    @PostMapping("/create")
    public Bill createBill(@RequestBody BillRequest billRequest) throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email).orElse(null);
        return billService.createBill(billRequest, currentUser);
    }

    @GetMapping("/bills")
    public List<Bill> getMyBills(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email).orElse(null);
        return billRepository.findByUser(currentUser);
    }

}
