package com.rra.local_mission_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.BankDetails;
import com.rra.local_mission_management.exception.UniqueConstraintViolationException;
import com.rra.local_mission_management.repository.BankDetailsRepository;

@Service
public class BankDetailsServices {

    @Autowired
    private BankDetailsRepository bankDetailsRepository;

    public List<BankDetails> getAllBankDetails() {
        return bankDetailsRepository.findAll();
    }

    public Optional<BankDetails> getBankDetailById(Long id) {
        return bankDetailsRepository.findById(id);
    }

   public BankDetails saveBankDetail(BankDetails bank) {
        try {
            return bankDetailsRepository.save(bank);
        } catch (DataIntegrityViolationException ex) {
            throw new UniqueConstraintViolationException("A bank detail with the same account or employee ID already exists.");
        }
    }

    public void deleteBankDetail(Long id) {
        bankDetailsRepository.deleteById(id);
    }

    public Optional<BankDetails> getempById(String id) {
        return bankDetailsRepository.findByEmployeeId(id);
    }

}

