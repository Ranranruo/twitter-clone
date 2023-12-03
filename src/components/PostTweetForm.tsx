import styled from "styled-components"
import { useState } from "react"
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    &::placeholder{
        font-size: 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    &:focus{
        outline: none;
        border-color: #1d9bf0;
    }
`;

const AttachFileButton = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;

const AttachFileInput = styled.input`
    display: none;
`;

const SubmitBtn = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active{
        opacity: 0.8;
    }
`;

export default function PostTweetForm() {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setTweet(e.target.value);
    }
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.files);
        const {files} = e.target;
        const maxSize = 1024 ** 2;
        if(files && files.length === 1 && files[0].size <= maxSize){
            setFile(files[0])
        } else{
            alert('1MB 이하의 파일만 올려주세요!')
        }
    }
    const onSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const user = auth.currentUser
        if(!user || isLoading || tweet === "" || tweet.length > 200) return;
        try {
            setLoading(true);
            const doc = await addDoc(collection(db,"tweets"), {
                tweet,
                createdAt: Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid,
            })
            if(file){
                const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`);
                const result = await uploadBytes(locationRef, file)
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc, {
                    photo: url
                })
            }
            setTweet("")
            setFile(null);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Form onSubmit={onSubmit}>
            <TextArea rows={5} maxLength={200} onChange={onChange} value={tweet} placeholder="무슨 일이 있으셨나요?" required/>
            <AttachFileButton htmlFor="file">{file ? "사진 추가 ✅" : "사진 추가"}</AttachFileButton>
            <AttachFileInput onChange={onFileChange} id="file" type="file" accept="image/*"></AttachFileInput>
            <SubmitBtn type="submit" value={isLoading ? "포스팅 중..." : "트윗 포스팅" }/>
        </Form>
    )
}