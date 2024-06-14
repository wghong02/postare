package org.example.postplaceSpring.controller;

import org.example.postplaceSpring.entity.Users;
//import org.example.database.service.UserService;
import org.example.postplaceSpring.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/seller")
public class UserController {

    private final UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // get all sellers
    @GetMapping()
    public Iterable<Users> getUser() {
        Iterable<Users> users =  this.userService.findAllUsers();
        if (users != null) {
            logger.info("all seller returned");
            return users;  // Returns the list of sellers
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No available seller in database");  // Returns 404 Not Found
        }
    }

    // get one seller by user id
    @GetMapping("/{userID}")
    Users getIdUser(@PathVariable long userID) {

        Users users = userService.findUserById(userID);
        if (users != null) {
            logger.info("seller {} returned", userID);
            return users;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Seller not found");
        }
    }

    @PostMapping("/update/{userID}")
    Users updateUser(@RequestBody Users newUsers, @PathVariable long userID) {
        try{
            return userService.updateUserById(newUsers, userID);
        }catch (DataIntegrityViolationException e){
            logger.error("Failed to create seller: Missing required fields or violation of database constraints.", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create seller: Missing required fields.");
        }catch (Exception e) {
            // Log the general exception
            logger.error("An error occurred during seller creation.", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred during seller creation.");
        }
    }

    @DeleteMapping("/{userID}")
    void deleteUser(@PathVariable long userID) {
        userService.deleteUserByUserId(userID);
    }
}