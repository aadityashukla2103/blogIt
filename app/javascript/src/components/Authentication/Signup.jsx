import React, { useState } from "react";

import authApi from "apis/auth";
import SignupForm from "components/Authentication/Form/Signup";
import Logger from "js-logger";

const Signup = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      await authApi.signup({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        organization,
      });
      setLoading(false);
      history.push("/");
    } catch (error) {
      Logger.error(error);
      setLoading(false);
    }
  };

  return (
    <SignupForm
      handleSubmit={handleSubmit}
      loading={loading}
      organization={organization}
      setEmail={setEmail}
      setName={setName}
      setOrganization={setOrganization}
      setPassword={setPassword}
      setPasswordConfirmation={setPasswordConfirmation}
    />
  );
};

export default Signup;
