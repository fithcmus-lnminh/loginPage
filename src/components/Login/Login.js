import React, { useState, useEffect, useReducer, useContext } from "react";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
  if (action.type === "EMAIL_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passReducer = (state, action) => {
  if (action.type === "PASS_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = () => {
  const context = useContext(AuthContext);
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  //      STATE         ACTION
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null, //init state
  });

  const [passState, dispatchPass] = useReducer(passReducer, {
    value: "",
    isValid: null, //init state
  });

  //Object Destructing -> pull out the properties of object (solve problem re-run effect
  const { isValid: emailIsValid } = emailState;
  const { isValid: passIsValid } = passState;
  //Only use isValid to change, not use Value in state
  //->the Value is changed but the isValid is not changed
  // -> effect not rerun

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passIsValid);
    }, 500);

    return () => {
      clearTimeout(identifier); //temp to store keystroke...
    }; //Clean function
  }, [emailIsValid, passIsValid]); //called when pass and email changed (enter keystroke) -> get the correct state

  const emailChangeHandler = (event) => {
    //be dispatched to reducer action to change state (change value and isValid)
    dispatchEmail({ type: "EMAIL_INPUT", val: event.target.value }); //action attribute

    // setFormIsValid(
    //     event.target.value.includes("@") && passState.isValid
    // ); //not optimal, because maybe state scheduled incorrect state
  };

  const passwordChangeHandler = (event) => {
    dispatchPass({ type: "PASS_INPUT", val: event.target.value });

    // setFormIsValid(
    //     emailState.value.includes("@") && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPass({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    context.onLogin(emailState.value, passState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          isValid={passIsValid}
          value={passState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
