import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components"
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
    margin-top: 50px;
    background-color: white;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap : 5px;
    align-items: center;
    justify-content: center;
    color:black;
    width: 100%;
    cursor: pointer;
    &:hover{
        opacity: 0.8;
    }
`;
const Logo = styled.img`
    height: 25px;
`;
export default function GithubBtn(){
    const navigate = useNavigate();
    const onClick = async() =>{
        try {
            const provieder = new GithubAuthProvider();
            await signInWithPopup(auth, provieder);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <Button onClick={onClick}>
            <Logo src="/github-logo.svg"/>
            깃허브로 계속하기
        </Button>
    )
}