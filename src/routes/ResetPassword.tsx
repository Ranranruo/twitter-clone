import { Link, useNavigate } from "react-router-dom";
import { Error, Form, Input, Switcher, Title, Wrapper } from "../components/Auth";
import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../firebase";

export default function ResetPassword() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [error, setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    const navigate = useNavigate();
    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            alert('메일을 성공적으로 보냈습니다.')  
            navigate('/')
        } catch (e) {
            console.log(e)
            if(e instanceof FirebaseError){
                setError(e.message)
            }
        } finally{
            setLoading(false)
        }
    }
    return (
        <Wrapper>
            <Title>비밀번호 초기화</Title>
            <Form onSubmit={onSubmit} >
                <Input onChange={onChange}value={email} placeholder="비밀번호를 변경할 이메일" type="email" />
                <Input value={loading ? "메일 보내는중..." : "메일 보내기"} type="submit"/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                비밀번호를 알고 있나요? <Link to="/login">로그인 하러가기 &rarr;</Link>
                <br/><br/>계정이 없으신가요? <Link to="/create-account">회원가입 하러가기 &rarr;</Link>
            </Switcher>
        </Wrapper>
    )
}