package com.swekit.backend.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.swekit.backend.Model.Bill;
import com.swekit.backend.Model.BillItem;
import com.swekit.backend.Model.BillRequest;
import com.swekit.backend.Model.User;
import com.swekit.backend.Repository.BillRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.UUID;

@Service
public class BillService {

    private BillRepository billRepository;
    private AiExtractionService aiExtractionService;

    public BillService(BillRepository billRepository, AiExtractionService aiExtractionService) {
        this.billRepository = billRepository;
        this.aiExtractionService = aiExtractionService;
    }


    public Bill createBill(BillRequest billRequest, User user) throws JsonProcessingException {
        Bill newBill = new Bill(billRequest.getGeneratedAt(), billRequest.getTitle(), billRequest.getBillImage());
        String aiResponse = aiExtractionService.extractItemsFromImage(billRequest.getBillImage());
        newBill.setBillItems(convertStringToArrayList(aiResponse));
        newBill.setUrl(sharingUrl());
        newBill.setUser(user);
        return billRepository.save(newBill);
    }


    public static ArrayList<BillItem> convertStringToArrayList(String aiResponse) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ArrayList<BillItem> billItems = objectMapper.readValue(
                aiResponse,
                new TypeReference<ArrayList<BillItem>>() {}
        );

        return billItems;
    }

    public static String sharingUrl(){
        return UUID.randomUUID().toString();
    }




}
