import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Error, Form, Input, Switcher, Title, Wrapper } from "../components/Auth";
import GithubBtn from "../components/GitgubBtn";

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "email") {
            setEmail(value);
        }
        else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError("")
        e.preventDefault();
        if(isLoading  || email === "" || password === "")return;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(true)
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
        console.log(email, password)
    }
    return (
        <Wrapper>
            <Title>Twitter에 로그인하기</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} name="email" value={email} placeholder="이메일" type="email" required />
                <Input onChange={onChange} name="password" value={password} placeholder="비밀번호" type="password" required />
                <Input type="submit" value={isLoading ? "로딩중..." : "로그인"} />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                계정이 없으신가요? <Link to="/create-account">계정 만들기 &rarr;</Link>
                <br/><br/>비밀번호를 잊으셨나요? <Link to="/reset-password">비밀번호 변경 &rarr;</Link>
            </Switcher>
            <GithubBtn/>
        </Wrapper>
    )
}