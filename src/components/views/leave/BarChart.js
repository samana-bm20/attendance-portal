import React, { useEffect, useState } from 'react'
import Config from "../../../Config";
import { useSelector } from "react-redux";
import { CChartBar } from '@coreui/react-chartjs'
import axios from 'axios'

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react'

const BarChart = () => {
    const user = useSelector((state) => state.user);
    const [empNames, setEmpNames] = useState([]);
    const [leavesUsed, setLeavesUsed] = useState([]);
    const [empLeaves, setEmpLeaves] = useState([]);

    useEffect(() => {
        const fetchEmployeeLeaves = async () => {
            const response = await axios.get(`${Config.apiUrl}/empleaves`);
            setEmpLeaves(response.data.data);
        };
        fetchEmployeeLeaves();
    }, [empLeaves]);

    useEffect(() => {
        const extractedEmpNames = empLeaves.map(obj => obj.EmpName);
        const extractedLeavesUsed = empLeaves.map(obj => obj.LeavesUsed);

        setEmpNames(extractedEmpNames);
        setLeavesUsed(extractedLeavesUsed);
    }, [empLeaves]);

    const chartData = {
        data: {
            labels: empNames,
            datasets: [
                {
                    barPercentage: 0.8,
                    label: 'Leaves Used',
                    backgroundColor: ['rgba(90, 209, 255, 1)'],
                    borderColor: 'rgba(6, 27, 94, 1)', 
                    borderWidth: 1,
                    data: leavesUsed,
                },
            ],
        },
        labels: "Employee",
        options: {
            indexAxis: 'x',
        }
    }


    return (
        <div>
            <CRow xs={{ gutter: 3 }}>
                <CCol>
                    <CCard style={{marginBottom: '50px'}}>
                        <CCardHeader>
                            Employee Leave Count
                        </CCardHeader>
                        <CCardBody style={{maxHeight: '26rem'}}>
                            <CChartBar
                                style={{maxHeight: '25rem'}}
                                data={chartData.data}
                                options={chartData.options}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )
}

export default BarChart;
