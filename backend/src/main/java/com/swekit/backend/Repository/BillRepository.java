package com.swekit.backend.Repository;

import com.swekit.backend.Model.Bill;
import com.swekit.backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Integer> {
    Optional<Bill> findByUrl(String url);

    List<Bill> findByUser(User user);
}
