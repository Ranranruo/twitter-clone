import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Input, Switcher, Title, Wrapper, Form } from "../components/Auth";
import GithubBtn from "../components/GitgubBtn";

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "name") {
            setName(value);
        }
        else if (name === "email") {
            setEmail(value);
        }
        else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("")
        if(isLoading || name === "" || email === "" || password === "")return;
        try {
            setLoading(true)
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log(credentials.user);
            await updateProfile(credentials.user, {
                displayName: name,
            });
            navigate("/");
        }
        catch (e) {
            if(e instanceof FirebaseError){
                setError(e.message)
            }
        }
        finally {
            setLoading(false)
        }
        console.log(name, email, password)
    }
    return (
        <Wrapper>
            <Title>Twitter에 가입하기</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} name="name" value={name} placeholder="이름" type="text" required />
                <Input onChange={onChange} name="email" value={email} placeholder="이메일" type="email" required />
                <Input onChange={onChange} name="password" value={password} placeholder="비밀번호" type="password" required />
                <Input type="submit" value={isLoading ? "로딩중..." : "계정 만들기"} />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                계정이 이미 있으신가요? <Link to="/login">로그인 하기 &rarr;</Link>
                <br/><br/>비밀번호를 잊으셨나요? <Link to="/reset-password">비밀번호 변경 &rarr;</Link>
            </Switcher>
            <GithubBtn/>
        </Wrapper>
    )
}