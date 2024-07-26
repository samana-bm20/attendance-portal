import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CForm,
    CFormLabel,
    CFormInput,
    CFormTextarea,
    CFormCheck
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilPencil, cilCheckCircle } from '@coreui/icons'
import { toast } from "react-toastify";
import axios from 'axios';
import Config from '../../../Config';

const EmployeeAddress = ({ personalDetails, setPersonalDetails }) => {
    const user = useSelector((state) => state.user)
    const [empid, setEmpid] = useState('');
    const [currentAddress, setCurrentAddress] = useState([])
    const [permanentAddress, setPermanentAddress] = useState([])
    const [isCurrentAddressEdit, setIsCurrentAddressEdit] = useState(false)
    const [isPermanentAddressEdit, setIsPermanentAddressEdit] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [isSameUser, setIsSameUser] = useState(true)
    const currentAddressRef = useRef(null)
    const permanentAddressRef = useRef(null)
    let toastId = null;

    useEffect(() => {
        const fetchPersonalDetails = () => {
            try {
                if (personalDetails.length > 0) {
                    setEmpid(personalDetails[0].empid);
                    setIsChecked(personalDetails[0].sameAsCurrent);
                    setCurrentAddress(personalDetails[0].currentAddress ? JSON.parse(personalDetails[0].currentAddress) : []);
                    setPermanentAddress(personalDetails[0].permanentAddress ? JSON.parse(personalDetails[0].permanentAddress) : []);
                    if (personalDetails[0].empid == user?.empid) {
                        setIsSameUser(true)
                    } else {
                        setIsSameUser(false)
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchPersonalDetails();
    }, [personalDetails])

    //#region Current Address
    const currentAddressChange = (index, event) => {
        setCurrentAddress(prevAddress => {
            const updatedAddress = [...prevAddress];
            updatedAddress[index] = event.target.value;
            return updatedAddress;
        });
    }

    const turnOnCurrentAddressEdit = () => {
        setIsCurrentAddressEdit(true);
        currentAddressRef.current.focus();
    }

    const turnOffCurrentAddressEdit = useCallback(async () => {
        try {
            if (currentAddress[0] == '' || currentAddress[1] == '' || currentAddress[2] == '' || currentAddress[3] == '') {
                if (toastId) toast.dismiss(toastId);
                toastId = toast.info("Address fields cannot be empty.", { autoClose: 3000 });
                setIsCurrentAddressEdit(true);
                return;
            }
            const params = {
                'empid': empid,
                'currentAddress': currentAddress,
            }
            const _ = await axios.put(`${Config.apiUrl}/updateCurrentAddress`, params);
            setIsCurrentAddressEdit(false);
            if (isChecked) {
                setPermanentAddress(currentAddress);
                const params = {
                    'empid': empid,
                    'sameAsCurrent': 1,
                    'permanentAddress': currentAddress,
                }
                const _ = await axios.put(`${Config.apiUrl}/updatePermanentAddress`, params);
            }
            if (toastId) toast.dismiss(toastId);
            toastId = toast.success("Current address updated successfully.", { autoClose: 3000 });
        } catch (error) {
            console.error(error)
            if (toastId) toast.dismiss(toastId);
            toastId = toast.error("Error in current address updation." + error, { autoClose: 3000 });
        }
    }, [currentAddress]);
    //#end region

    //#region Permanent Address
    const sameAddressCheckedChange = async (event) => {
        setIsChecked(event.target.checked)
        if (event.target.checked == true) {
            setPermanentAddress(currentAddress)
            const params = {
                'empid': empid,
                'sameAsCurrent': 1,
                'permanentAddress': currentAddress,
            }
            const _ = await axios.put(`${Config.apiUrl}/updatePermanentAddress`, params);
        } else {
            setPermanentAddress('')
            const params = {
                'empid': empid,
                'sameAsCurrent': 0,
                'permanentAddress': '',
            }
            const _ = await axios.put(`${Config.apiUrl}/updatePermanentAddress`, params);
        }
    }

    const permanentAddressChange = (index, event) => {
        setPermanentAddress(prevAddress => {
            const updatedAddress = [...prevAddress];
            updatedAddress[index] = event.target.value;
            return updatedAddress;
        });
    }

    const turnOnPermanentAddressEdit = () => {
        setIsPermanentAddressEdit(true);
        permanentAddressRef.current.focus();
    }

    const turnOffPermanentAddressEdit = useCallback(async () => {
        try {
            if (permanentAddress == '') {
                if (toastId) toast.dismiss(toastId);
                toastId = toast.info("Address fields cannot be empty.", { autoClose: 3000 });
                setIsPermanentAddressEdit(true);
                return;
            }
            let params;
            if (permanentAddress.every((value, index) => value === currentAddress[index])) {
                params = {
                    'empid': empid,
                    'sameAsCurrent': 1,
                    'permanentAddress': permanentAddress,
                }
                setIsChecked(1);
            } else {
                params = {
                    'empid': empid,
                    'sameAsCurrent': 0,
                    'permanentAddress': permanentAddress,
                }
                setIsChecked(0);
            }
            const _ = await axios.put(`${Config.apiUrl}/updatePermanentAddress`, params);
            setIsPermanentAddressEdit(false);
            if (toastId) toast.dismiss(toastId);
            toastId = toast.success("Permanent address updated successfully.", { autoClose: 3000 });
        } catch (error) {
            console.error(error)
            if (toastId) toast.dismiss(toastId);
            toastId = toast.error("Error in permanent address updation." + error, { autoClose: 3000 });
        }
    }, [permanentAddress]);
    //#end region

    return (
        <CRow>
            <CCol xl={6}>
                <CCard className="mb-4" >
                    <CCardHeader style={{ fontWeight: 'bold'}}>
                            Current Address
                            {isSameUser && (
                                <>
                                    {isCurrentAddressEdit ? (
                                        <CIcon
                                            icon={cilCheckCircle}
                                            style={{ color: 'green', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                                            onClick={turnOffCurrentAddressEdit}
                                        />
                                    ) : (
                                        <CIcon
                                            icon={cilPencil}
                                            style={{ color: '#5856d6', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                                            onClick={turnOnCurrentAddressEdit}
                                        />
                                    )}
                                </>
                            )}
                    </CCardHeader>
                    <CCardBody>
                        <CForm>
                            <CRow>
                                <CCol>
                                    <div className="mb-4">
                                        <CFormLabel htmlFor='current-address'>Address Line</CFormLabel>
                                        <CFormTextarea
                                            id='current-address'
                                            name='address-line'
                                            rows={2}
                                            ref={currentAddressRef}
                                            placeholder='Enter Address'
                                            value={currentAddress[0] ? currentAddress[0] : ''}
                                            onChange={() => currentAddressChange(0, event)}
                                            readOnly={!isCurrentAddressEdit}
                                        />
                                    </div>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xl={4} className="mb-3">
                                    <CFormLabel htmlFor='current-address'>City</CFormLabel>
                                    <CFormInput
                                        id='current-address'
                                        name='city'
                                        type='text'
                                        placeholder='City'
                                        value={currentAddress[1] ? currentAddress[1] : ''}
                                        onChange={() => currentAddressChange(1, event)}
                                        readOnly={!isCurrentAddressEdit}
                                    />
                                </CCol>
                                <CCol xl={4}>
                                    <CFormLabel htmlFor='current-address'>State</CFormLabel>
                                    <CFormInput
                                        id='current-address'
                                        name='state'
                                        type='text'
                                        placeholder='State'
                                        value={currentAddress[2] ? currentAddress[2] : ''}
                                        onChange={() => currentAddressChange(2, event)}
                                        readOnly={!isCurrentAddressEdit}
                                    />
                                </CCol>
                                <CCol xl={4}>
                                    <CFormLabel htmlFor='current-address'>Pincode</CFormLabel>
                                    <CFormInput
                                        id='current-address'
                                        name='pincode'
                                        type='text'
                                        placeholder='Pincode'
                                        value={currentAddress[3] ? currentAddress[3] : ''}
                                        onChange={() => currentAddressChange(3, event)}
                                        readOnly={!isCurrentAddressEdit}
                                    />
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xl={6}>
                <CCard className="mb-4" >
                    <CCardHeader style={{ fontWeight: 'bold'}}>
                            Permanent Address
                            {isSameUser && (
                                <>
                                    {isPermanentAddressEdit ? (
                                        <CIcon
                                            icon={cilCheckCircle}
                                            style={{ color: 'green', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                                            onClick={turnOffPermanentAddressEdit}
                                        />
                                    ) : (
                                        <CIcon
                                            icon={cilPencil}
                                            style={{ color: '#5856d6', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                                            onClick={turnOnPermanentAddressEdit}
                                        />
                                    )}
                                </>
                            )}
                    </CCardHeader>
                    <CCardBody>
                        <CForm>
                            <CRow>
                                <CCol>
                                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                        <CFormCheck
                                            inline
                                            id='permanent-address'
                                            name='permanent-address'
                                            value="Yes"
                                            label='Same as current address'
                                            checked={isChecked}
                                            onChange={sameAddressCheckedChange}
                                            disabled={!isSameUser}
                                        />
                                    </div>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor='permanent-address'>Address Line</CFormLabel>
                                        <CFormTextarea
                                            id='permanent-address'
                                            name='address-line'
                                            rows={2}
                                            ref={permanentAddressRef}
                                            placeholder='Enter Address'
                                            value={permanentAddress[0] ? permanentAddress[0] : ''}
                                            onChange={() => permanentAddressChange(0, event)}
                                            readOnly={!isPermanentAddressEdit}
                                        />
                                    </div>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xl={4}>
                                    <CFormLabel htmlFor='permanent-address'>City</CFormLabel>
                                    <CFormInput
                                        id='permanent-address'
                                        name='city'
                                        type='text'
                                        placeholder='City'
                                        value={permanentAddress[1] ? permanentAddress[1] : ''}
                                        onChange={() => permanentAddressChange(1, event)}
                                        readOnly={!isPermanentAddressEdit}
                                    />
                                </CCol>
                                <CCol xl={4}>
                                    <CFormLabel htmlFor='permanent-address'>State</CFormLabel>
                                    <CFormInput
                                        id='permanent-address'
                                        name='state'
                                        type='text'
                                        placeholder='State'
                                        value={permanentAddress[2] ? permanentAddress[2] : ''}
                                        onChange={() => permanentAddressChange(2, event)}
                                        readOnly={!isPermanentAddressEdit}
                                    />
                                </CCol>
                                <CCol xl={4}>
                                    <CFormLabel htmlFor='permanent-address'>Pincode</CFormLabel>
                                    <CFormInput
                                        id='permanent-address'
                                        name='pincode'
                                        type='text'
                                        placeholder='Pincode'
                                        value={permanentAddress[3] ? permanentAddress[3] : ''}
                                        onChange={() => permanentAddressChange(3, event)}
                                        readOnly={!isPermanentAddressEdit}
                                    />
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default EmployeeAddress
