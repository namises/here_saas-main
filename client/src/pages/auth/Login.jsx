import { useState } from "react";
import useLogin from "src/API/hooks/useLogin";
import NormalInput from "src/components/NormalInput";
import SolidButton from "src/components/SolidButton";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, error, loading } = useLogin(email, password);

  return (
    <div className="flex flex-col gap-y-4">
      <NormalInput label={"Email"} value={email} setter={setEmail} error={error.email} required />
      <NormalInput label={"Password"} value={password} setter={setPassword} error={error.password} required type="password" />
      <SolidButton loading={loading} onClick={handleLogin} title={"Login"} />
    </div>
  );
};

export default Register;
