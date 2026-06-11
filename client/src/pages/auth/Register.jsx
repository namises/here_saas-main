import { useState } from "react";
import useRegister from "src/API/hooks/useRegister";
import CheckBox from "src/components/CheckBox";
import NormalInput from "src/components/NormalInput";
import SolidButton from "src/components/SolidButton";

const Register = () => {
  const [orgName, setOrgName] = useState("");
  const [address, setAddress] = useState("");
  const [pan, setPan] = useState("");
  const [domain, setDomain] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToterms] = useState(false);
  const { error, handleRegister, loading } = useRegister(orgName, address, pan, domain, name, email, mobile, password, confirmPassword, agreeToTerms);

  return (
    <div className="flex flex-col gap-y-4">
      <NormalInput label={"Organization Name"} value={orgName} setter={setOrgName} error={error.orgName} required />
      <NormalInput label={"Organization Address"} value={address} setter={setAddress} error={error.address} required />
      <NormalInput label={"Organization PAN"} value={pan} setter={setPan} error={error.pan} required />
      <NormalInput label={"Domain"} value={domain} setter={setDomain} error={error.domain} required />
      <NormalInput label={"Name"} value={name} setter={setName} error={error.name} required />
      <NormalInput label={"Email"} value={email} setter={setEmail} error={error.email} required />
      <NormalInput label={"Mobile"} value={mobile} setter={setMobile} error={error.mobile} required />
      <NormalInput label={"Password"} value={password} setter={setPassword} error={error.password} required type="password" />
      <NormalInput label={"Confirm Password"} value={confirmPassword} setter={setConfirmPassword} error={error.confirmPassword} required type="password" />
      <CheckBox label={"I agree to"} href={"/terms"} hrefText={"Terms and Conditions"} value={agreeToTerms} error={error.agreeToTerms} setter={setAgreeToterms} />
      <SolidButton loading={loading} onClick={handleRegister} title={"Register"} />
    </div>
  );
};

export default Register;
