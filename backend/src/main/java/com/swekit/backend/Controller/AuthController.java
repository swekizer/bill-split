package com.swekit.backend.Controller;

import com.swekit.backend.Model.LoginRequest;
import com.swekit.backend.Model.User;
import com.swekit.backend.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "https://bill-split-six-ruby.vercel.app")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public String emailEntry(@RequestBody User user){
        String hashed = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashed);
        userRepository.save(user);
        return "User saved successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isPresent()) {
            User dbUser = userOptional.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", "Login successful",
                        "email", dbUser.getEmail(),
                        "username", dbUser.getUsername(),
                        "upiId", dbUser.getUpiId() != null ? dbUser.getUpiId() : ""
                ));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("status", "error", "message", "Invalid email or password"));
    }
}

