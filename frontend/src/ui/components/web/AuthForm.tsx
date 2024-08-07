"use client";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Input,
	Text,
	useToast,
} from "@chakra-ui/react";
import { useState, ChangeEvent } from "react";
import { register, login } from "@/utils/userUtils";
import {
	isValidUsername,
	isValidEmail,
	isValidPassword,
	isValidNickname,
} from "@/utils/generalUtils";

// Define types for form fields
type FormFields = {
	username: string;
	password: string;
	userEmail: string;
	phoneNumber: string;
	nickname: string;
};

type TouchedFields = {
	[key in keyof FormFields]: boolean;
};

const AuthForm = () => {
	// this is the auth form for the users to complete in order to login or register
	const toast = useToast();

	const [formValues, setFormValues] = useState<FormFields>({
		// these are all the text fields required in register
		username: "",
		password: "",
		userEmail: "",
		phoneNumber: "",
		nickname: "",
	});

	const [touchedFields, setTouchedFields] = useState<TouchedFields>({
		// record whether each field is touched by the user, for the warning UI that requires the user to complete a field
		username: false,
		password: false,
		userEmail: false,
		phoneNumber: false,
		nickname: false,
	});

	const [showRegister, setShowRegister] = useState(false); // whether to show the register form or login form

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		// to record the change on any of the text field
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
		setTouchedFields({ ...touchedFields, [name]: true });
	};

	const clearForm = () => {
		// to clear the form
		setFormValues({
			username: "",
			password: "",
			userEmail: "",
			phoneNumber: "",
			nickname: "",
		});
		setTouchedFields({
			username: false,
			password: false,
			userEmail: false,
			phoneNumber: false,
			nickname: false,
		});
	};

	const handleRegisterClick = () => {
		// clear the form if switch from login to register or vice versa
		setShowRegister(!showRegister);
		clearForm();
	};

	const handleSubmit = async () => {
		// submit the form to call register or login
		// only call the backend APIs if all required fields are completed.

		const { username, password, userEmail, phoneNumber, nickname } = formValues;

		// Validate fields
		const errors: Partial<FormFields> = {};

		if (!isValidUsername(username)) {
			errors.username = "Invalid or profane username.";
		}

		if (!isValidPassword(password)) {
			errors.password =
				"Password must be at least 8 characters long, with letters and numbers.";
		}

		if (showRegister) {
			if (!isValidEmail(userEmail)) {
				errors.userEmail = "Invalid email address.";
			}

			if (!nickname) {
				errors.nickname = "Nickname is required.";
			}
		}

		// Update touched fields and errors state
		setTouchedFields({
			...touchedFields,
			username: true,
			password: true,
			userEmail: showRegister ? true : touchedFields.userEmail,
			phoneNumber: showRegister ? true : touchedFields.phoneNumber,
			nickname: showRegister ? true : touchedFields.nickname,
		});

		// If there are errors, prevent form submission
		if (Object.keys(errors).length > 0) {
			toast({
				description:
					"Please fill in all required fields following the requirements and try again",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		try {
			if (showRegister) {
				await register({
					username,
					password,
					userEmail,
					phoneNumber,
					nickname,
				});
				toast({
					description: "Registration Successful.",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				handleRegisterClick();
			} else {
				await login({ username, password });
				toast({
					description: "Login Successful.",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				window.location.href = "/";
			}
		} catch (error: any) {
			toast({
				description: `${showRegister ? "Registration" : "Login"} failed, ${
					error.message
				}`,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const renderInputField = (
		label: string,
		name: keyof FormFields,
		type: string,
		isRequired: boolean,
		condition: Function | null
	) => (
		// function to render each text input field in the form
		<FormControl
			isInvalid={
				touchedFields[name] &&
				(!formValues[name] ||
					(isRequired && condition != null && !condition(formValues[name])))
			}
			mt="4"
		>
			<FormLabel>
				{label}
				{isRequired && (
					<Text as="span" color="red">
						*
					</Text>
				)}
			</FormLabel>

			{touchedFields[name] && label == "Username" && showRegister && (
				<FormHelperText>
					Username must only contain letters, numbers, underscores(_) and
					dashes(-).
				</FormHelperText>
			)}
			{touchedFields[name] && label == "Password" && showRegister && (
				<FormHelperText>
					Password must be at least 8 characters long.
				</FormHelperText>
			)}
			{touchedFields[name] && label == "Nickname" && (
				<FormHelperText>
					Nickname must only contain letters, numbers, underscores(_) and
					dashes(-).
				</FormHelperText>
			)}
			<Input
				mt="2"
				type={type}
				name={name}
				value={formValues[name]}
				onChange={handleChange}
			/>
			{touchedFields[name] &&
				(!formValues[name] ||
					(condition != null && !condition(formValues[name]))) && (
					<FormErrorMessage>Please provide a valid {label}.</FormErrorMessage>
				)}
		</FormControl>
	);

	return (
		<Flex direction="column" align="center" m="4">
			<Box w="300px" p="4" bg="white" borderRadius="md" boxShadow="lg">
				<Box fontSize="xl" mb="4" fontWeight={500}>
					{showRegister ? "Register" : "Log In"}
				</Box>
				{renderInputField(
					"Username",
					"username",
					"text",
					true,
					isValidUsername
				)}
				{renderInputField(
					"Password",
					"password",
					"password",
					true,
					isValidPassword
				)}
				{showRegister && ( // these fields are only needed for register
					<>
						{renderInputField(
							"Email",
							"userEmail",
							"email",
							true,
							isValidEmail
						)}
						{renderInputField(
							"Phone Number",
							"phoneNumber",
							"tel",
							false,
							null
						)}
						{renderInputField(
							"Nickname",
							"nickname",
							"text",
							true,
							isValidNickname
						)}
					</>
				)}
				<Button fontSize="md" mt="4" mb="4" onClick={handleSubmit}>
					{showRegister ? "Register" : "Log In"}
				</Button>
				<Text
					fontSize="sm"
					mb="4"
					cursor="pointer"
					_hover={{ textDecoration: "underline" }}
					onClick={handleRegisterClick}
				>
					{showRegister
						? "Have an account already? Log in here"
						: "Don't have an account? Register here"}
				</Text>
			</Box>
		</Flex>
	);
};

export default AuthForm;
