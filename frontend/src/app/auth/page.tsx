"use client";
import React from "react";
import { Box } from "@chakra-ui/react";
import AuthForm from "@/ui/components/web/AuthForm";

const AuthPage = () => {
  // authentification page, use two different forms for login and register

  return (
    <div>
      <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
        <AuthForm />
      </Box>
    </div>
  );
};

export default AuthPage;
