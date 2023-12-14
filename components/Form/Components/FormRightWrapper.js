import styled from 'styled-components';
import { FormState } from '../Form';
import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import {TailSpin} from 'react-loader-spinner'
import {create as IPFSHTTPClient} from 'ipfs-http-client';
import axios from 'axios';


const projectId = process.env.NEXT_PUBLIC_IPFS_ID
const projectSecret = process.env.NEXT_PUBLIC_IPFS_KEY



const FormRightWrapper = () => {
  const Handler = useContext(FormState);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileImg, setFileImg] = useState(null);

  const uploadTextToPinata = async (textData) => {
    try {
      const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
      const pinataApiKey = process.env.NEXT_PUBLIC_IPFS_ID;
      const pinataSecretApiKey = process.env.NEXT_PUBLIC_IPFS_KEY;

      const metadata = JSON.stringify({
        name: 'YourFileName.json', // Set the desired file name
        keyvalues: {
          content: textData // Your string/text content to be uploaded
        }
      });

      const response = await axios.post(url, metadata, {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey,
        },
      });

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading text to Pinata:', error);
      throw error; // Rethrow the error for handling in the caller function
    }
  };
  const uploadFiles = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    console.log(process.env.NEXT_PUBLIC_IPFS_ID);
    console.log(process.env.NEXT_PUBLIC_ADDRESS);
    console.log(fileImg);

    if(fileImg) {
      // try {
      //   const added = await client.add(Handler.form.story);
      //   Handler.setStoryUrl(added.path)
      // } catch (error) {
      //   toast.warn(`Error Uploading Story`);
      // }
      try {

        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
                'pinata_api_key': `${process.env.NEXT_PUBLIC_IPFS_ID}`,
                'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_IPFS_KEY}`,
                "Content-Type": "multipart/form-data"
            },
        });
        const ImgHash = resFile.data.IpfsHash;
        Handler.setImageUrl(ImgHash)
      }
    
     catch (error) {
        console.log("Error sending File to IPFS: ")
        console.log(error)
    }
    
   
   
  }


  if (Handler.form.story !== null) {
    try {
      const textData = Handler.form.story; // Assuming this is a string

      // Upload the text content as JSON to Pinata
      const storyHash = await uploadTextToPinata(textData);
      Handler.setStoryUrl(storyHash);
    } catch (error) {
      console.log("Error sending text data to IPFS: ");
      console.log(error);
    }
  }

      setUploadLoading(false);
      setUploaded(true);
      Handler.setUploaded(true);
      toast.success("Files Uploaded Sucessfully")
}

  return (
    <FormRight>
      <FormInput>
        <FormRow>
          <RowFirstInput>
            <label>Required Amount</label>
            <Input onChange={Handler.FormHandler} value={Handler.form.requiredAmount} name="requiredAmount" type={'number'} placeholder='Required Amount'></Input>
          </RowFirstInput>
          <RowSecondInput>
            <label>Choose Category</label>
            <Select onChange={Handler.FormHandler} value={Handler.form.category} name="category">
              <option>Education</option>
              <option>Health</option>
              <option>Animal</option>
            </Select>
          </RowSecondInput>
        </FormRow>
      </FormInput>
      {/* Image */}
      <FormInput>
        <label>Select Image</label>
        <Image alt="dapp" onChange={(e) =>setFileImg(e.target.files[0])} required type={'file'} accept='image/*'>
        </Image>
      </FormInput>
      {uploadLoading == true ? <Button><TailSpin color='#fff' height={20} /></Button> :
        uploaded == false ? 
        <Button onClick={uploadFiles}>
          Upload Files to IPFS
        </Button>
        : <Button style={{cursor: "no-drop"}}>Files uploaded Sucessfully</Button>
      }
      <Button onClick={Handler.startCampaign}>
        Start Campaign
      </Button>
    </FormRight>
  )
}

const FormRight = styled.div`
  width:45%;
`

const FormInput = styled.div`
  display:flex ;
  flex-direction:column;
  font-family:'poppins';
  margin-top:10px ;
`

const FormRow = styled.div`
  display: flex;
  justify-content:space-between;
  width:100% ;
`

const Input = styled.input`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;
` 

const RowFirstInput = styled.div`
  display:flex ;
  flex-direction:column ;
  width:45% ;
`

const RowSecondInput = styled.div`
  display:flex ;
  flex-direction:column ;
  width:45% ;
`

const Select = styled.select`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;
`

const Image = styled.input`
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;

  &::-webkit-file-upload-button {
    padding: 15px ;
    background-color: ${(props) => props.theme.bgSubDiv} ;
    color: ${(props) => props.theme.color} ;
    outline:none ;
    border:none ;
    font-weight:bold ;
  }  
`

const Button = styled.button`
  display: flex;
  justify-content:center;
  width:100% ;
  padding:15px ;
  color:white ;
  background-color:#00b712 ;
  background-image:
      linear-gradient(180deg, #00b712 0%, #5aff15 80%) ;
  border:none;
  margin-top:30px ;
  cursor: pointer;
  font-weight:bold ;
  font-size:large ;
`

export default FormRightWrapper