import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { CButton, CCard, CCardBody, CCardImage } from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilImagePlus } from '@coreui/icons'
import Config from '../../../Config'
import { useSelector } from 'react-redux'
import { toast } from "react-toastify";

const ProfilePictureUpload = ({ profilePicture, setProfilePicture, employeeDetails }) => {
  const user = useSelector((state) => state.user)
  const [isSameUser, setIsSameUser] = useState(true)
  const employeeId = user?.empid;
  const fileInputRef = useRef(null);
  let toastId = null;

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        if (employeeDetails.length > 0) {
          let empid_;
          if (user?.userType == 1) {
            empid_ = employeeDetails[0].empid
          } else {
            empid_ = employeeId
          }
          const response = await axios.get(`${Config.apiUrl}/getProfilePhoto`, {
            params: { empid_ },
            responseType: 'blob' // Important to get the image as a blob
          });
          const imageUrl = URL.createObjectURL(response.data);
          setProfilePicture(imageUrl);
          if(employeeDetails[0].empid == user?.empid) {
            setIsSameUser(true)
          } else {
            setIsSameUser(false)
          }
        }
      } catch (error) {
        console.error('Error fetching profile picture.', error);
      }
    };

    fetchProfilePicture();
  }, [employeeId, employeeDetails]);




  // Example handleFileChange function in React.js component
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      setProfilePicture(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('empid', user?.empid);

      try {
        const response = await axios.post(`${Config.apiUrl}/profilePictureUpload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data.status);
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success("Profile picture uploaded successfully.", { autoClose: 3000 });
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        if (toastId) toast.dismiss(toastId);
        toastId = toast.error("Error in uploading profile picture." + error, { autoClose: 3000 });
      }
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <CCardImage
          src={profilePicture || 'https://via.placeholder.com/150'}
          className="img-fluid mb-3"
          style={{
            borderRadius: '50%',
            backgroundColor: 'black',
            width: '200px',
            height: '200px',
            objectFit: 'cover',
            border: '1px solid #000'
          }}
        />
        {isSameUser && (
          <>
            <CButton
              color="tertiary"
              style={{ color: '#5856d6', cursor: 'pointer' }}
              onClick={() => fileInputRef.current.click()}>
              <CIcon
                icon={cilImagePlus}
                style={{ color: '#5856d6', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }} />
              Change Photo
            </CButton>
          </>
        )}
      </div>
    </>
  );
};

export default ProfilePictureUpload;
