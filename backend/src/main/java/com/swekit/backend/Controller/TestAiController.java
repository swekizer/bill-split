package com.swekit.backend.Controller;

import com.swekit.backend.Service.AiExtractionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestAiController {

    private final AiExtractionService aiService;

    public TestAiController(AiExtractionService aiService) {
        this.aiService = aiService;
    }

    // You can test this right in your browser!
    @GetMapping("/test-ai")
    public String testAi(@RequestParam String imageUrl) {
        return aiService.extractItemsFromImage(imageUrl);
    }
}