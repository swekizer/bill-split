package com.swekit.backend.Service;

import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;

import java.net.MalformedURLException;

@Service
public class AiExtractionService {

    private final ChatModel chatModel;

    public AiExtractionService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String extractItemsFromImage(String imageUrl) {
        String promptText = """
    You are a receipt parser. Extract all purchased items from this receipt image.
    
    Steps you must follow:
    1. Extract all individual items with their name, quantity, and UNIT price.
    2. Find the grand total (the final amount on the bill).
    3. Calculate subtotal = sum of (unit_price × quantity) for all items.
    4. Calculate tax_amount = grand_total - subtotal.
    5. Distribute tax proportionally to each item's UNIT price:
       unit_price_with_tax = unit_price + (unit_price / subtotal) * tax_amount
       Round to 2 decimal places.
    6. Verify: sum of (unit_price_with_tax × quantity) ≈ grand_total (±0.02 tolerance).
       If small rounding gap remains, adjust the most expensive item's unit price.
    
    Return ONLY a raw JSON array (no markdown, no backticks):
    [
      { "name": "string", "quantity": number, "price": number }
    ]
    
    Rules:
    - "price" = unit price AFTER tax distribution (not total for that row).
    - If 3 Crackers at 26 each → { "name": "Crackers", "quantity": 3, "price": 26.XX }
    - If same item appears multiple times on receipt, MERGE them (sum quantities, same unit price).
    - Strip special characters (* # %) from item names.
    - If grand total is not visible, return original unit prices without tax adjustment.
    - Include zero-priced items as-is (price: 0).
    """;
        // Pass URL directly as a string resource
        UrlResource imageResource = null;
        try {
            imageResource = new UrlResource(imageUrl);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        Media imageMedia = new Media(MimeTypeUtils.IMAGE_JPEG, imageResource);

        UserMessage userMessage = UserMessage.builder()
                .text(promptText)
                .media(imageMedia)
                .build();
        ChatResponse response = chatModel.call(new Prompt(userMessage));

        return response.getResult().getOutput().getText();
    }
}