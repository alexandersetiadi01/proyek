import React, { useState, useEffect, Fragment } from "react";
import "../../App.css";
import { Button, CloseButton, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"
import * as BsIcons from "react-icons/bs";
import {  
    addBarangMasuk, getAllBarangMasuk, getAllMasterBarang, 
    addHistory, getKodePO, seeAllPurchasing, inventoryMasuk, 
    findInventory, newInventory, getUserName, addActivityMasuk, getSelectedProyek, getBarangMasukPO
} from "../../repository";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { dateFilter, textFilter } from 'react-bootstrap-table2-filter';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import Navbar from "../Menu/navbar";
//import { getKodePO } from "../../../../back-end/controller/purchasingController";
function BarangMasukPage(){

    const user = getUserName();
    
    const datePickerIconst = new Date().toLocaleDateString('en-ca');
    const navigate = useNavigate();
    const proyek = getSelectedProyek()
    const initialState = {
        //kodebarang:"",
        namabarang: "",
        //kodemasuk: "", 
        kodePO: "",
        namaPenerima: "",
        quantity: 0,  
        noSuratJalan: "",
        tgl: "",
        lokasi: "",
        action: "barang masuk",
        username: user.username,
        proyek: proyek
    }

    const [modal, setModal] = useState(false);

    const [inputs, setInputs] = useState(initialState);
    
    const [search, setSearch] = useState("");
    const handleSearch = (event) => {
        event.preventDefault();
        setSearch({...search, [event.target.name]: event.target.value});
    }

    //data barang masuk
    const [rows, setRows] = useState([]);

    useEffect(() => {
        async function getBarangMasukAPI(){
            const data = await getAllBarangMasuk();
            let rowsData = []
            for (const barang of data){
                const newBarang = {
                    //kodebarang: barang.kodebarang,
                    namabarang: barang.namabarang,
                    kodemasuk: barang.kodemasuk, 
                    kodePO: barang.kodePO,
                    noSuratJalan: barang.noSuratJalan,
                    namaPenerima: barang.namaPenerima,
                    quantity: barang.quantity,  
                    tgl: barang.tgl,
                    lokasi: barang.lokasi,
                    proyek: barang.proyek
                }
                if(newBarang.proyek === proyek){
                    rowsData.push(newBarang);
                }
                
            }
            setRows(rowsData);
        }
        getBarangMasukAPI();
    }, [])

    //data master barang 
    const [options, setOption] = useState([]);
    const [barang, setBarang] = useState(inputs.namabarang);
    const[PO, setPO] = useState([]);
    useEffect(() => {
        async function getNamaBarangAPI(){
            const data = await seeAllPurchasing();
            let optionData = []
            let POdata = []
            for (const barang of data){
                const newBarang = {
                    namabarang: barang.namabarang,
                    kodePO: barang.kodePO,
                    proyek: barang.proyek
                }
                if(newBarang.proyek === proyek){
                    optionData.push(newBarang);
                }
                
            }
            setOption(optionData);
        }
        getNamaBarangAPI();
    }, [])

    const showModal = () => {
        setModal(!modal);
        setInputs(initialState);
    };
    useEffect(() => {
        async function getPO(){
            const data = await getKodePO();
            let optionData = []
            for (const barang of data){
                const newBarang = {
                    kodePO: barang.kodePO,
                    proyek: barang.proyek
                }
                if(newBarang.proyek === proyek){
                    optionData.push(newBarang);
                }
          
            }
            setPO(optionData);
        }
        getPO();
    }, [])
    const resetInput = () => setInputs(initialState);
    const handleInputChange = (event) => {
        setInputs({...inputs, [event.target.name]: event.target.value});
        
    };

    const add = async (event) => {
        event.preventDefault();
        if(window.confirm(
            "confirm adding: " + 
            "\n namabarang: " + inputs.namabarang +
            "\n kode PO: " + inputs.kodePO + 
            "\n surat jalan: " + inputs.noSuratJalan + 
            "\n nama penerima: " + inputs.namaPenerima +
            "\n quantity: " + inputs.quantity +
            "\n tgl: " + inputs.tgl +
            "\n lokasi: " + inputs.lokasi) === true){
                await addBarangMasuk(inputs);
                window.alert("item added as barang masuk");
                //addHistory(inputs);
                addActivityMasuk(inputs)
                
                const check = await findInventory(inputs.namabarang);
                if(check === null) {
                    newInventory(inputs);
                    //window.alert("new inventory added");
                    window.location.reload();
                }else{
                    inventoryMasuk(inputs);
                    //window.alert("inventory updated");
                    window.location.reload();
                } 
                
            }
        
       
        //showKonfirmasi();
        //navigate("/Barang_Masuk");
         
    }
    

    const columns = 
        /*return */[
        {
            dataField: 'kodemasuk',
            text: 'Kode Masuk',
            sort: true
        }, 
        {
            dataField: 'namabarang',
            text: 'Nama Barang',
            filter: textFilter(),
            sort: true,
           /* formatter: (cellContent, row, index, extraData) => {
                if (!selectedRow || extraData.selectedRow.id !== row.id) return cellContent;
                return `You have selected : ${cellContent}`;
              },
              formatExtraData: {
                selectedRow
              },      */
        }, 
        {
            dataField: 'kodePO',
            text: 'Kode PO',
        },
        {
            dataField: 'namaPenerima',
            text: 'Nama Penerima',
            sort: true
        },
        {
            dataField: 'quantity',
            text: 'Qty',
            sort: true
        },
        {
            dataField: 'noSuratJalan',
            text: 'No Surat Jalan',

        },
        {
            dataField: 'tgl',
            text: 'Tgl',
            filter: dateFilter(),
            sort: true
        },
        {
            dataField: 'lokasi',
            text: 'Lokasi',
            filter: textFilter(),
            sort: true
        }];
/*
    const selectRow = {
        mode: 'checkbox',
        style: {background: 'red'}
    }

    const handleSelect = (row) => {
        setSelected(curr=>({...curr, selected, row}));
    }; */
    const [selected, setSelected] = useState();
    const [selecting, setSelecting] = useState(false);
    const handleClickToSelect = () => setSelecting(!selecting);
    const handleSelect = (event) => {
        event.preventDefault();
        setSelected({...selected, [event.target.name]: event.target.value});
        //console.log(selected);
    }

    const [konfirmasi, setKonfirmasi] = useState(false);

    const showKonfirmasi = () => {
        showModal();
        setKonfirmasi(!konfirmasi);
    }

    return(
        <>
          <Navbar />
            <h2 text-align="center">Barang Masuk</h2>
            
             {/*
            <div className="searchGroup">
                <input onChange={handleSearch} placeholder="masukan nama barang"></input>
                <Button>search</Button>
            </div> 
            */}
            <br/>
            
            <BootstrapTable keyField='kodemasuk' data={ rows } columns={ columns } 
            filter={ filterFactory() } pagination={paginationFactory()} 
            /*selectRow={{
                mode: "checkbox",
                bgColor: "red",
                clickToSelect: {handleClickToSelect},
                onSelect: (row, isSelect, rowIndex, e) => {
                }
            }}*/
            hover/>
                    
            <div className="addButton">
                <BsIcons.BsFillPlusCircleFill size={50} onClick={showModal}/>
            </div>  
        
                <Modal 
                show={modal}
                size="lg-down"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">Masuk Barang</Modal.Title>
                    <CloseButton onClick={showModal}/>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={add}>
                        <h4>Nama Barang:</h4>
                        <input type="text" class="form-control" list="namabarang" name="namabarang" value={inputs.namabarang} onChange={handleInputChange} required autoComplete="off"></input>
                        <datalist id="namabarang" name="namabarang">
                            {options.map((item, index) => 
                                <option key={index}>{item.namabarang}</option>
                            )}
                        </datalist>
                        <h4>Nama Penerima:</h4>
                        <input type="text" class="form-control" name="namaPenerima" value={inputs.namaPenerima} onChange={handleInputChange} required/>
                        <h4>No. PO</h4>
                        <input type="text" class="form-control" list="kodePO" name="kodePO" value={inputs.kodePO} onChange={handleInputChange} required autoComplete="off"></input>
                        <datalist id="kodePO" name="kodePO">
                            {PO.map((item, index) => 
                                <option key={index}>{item.kodePO}</option>
                            )}
                        </datalist>
                        <h4>Quantity:</h4>
                        <input type="number" class="form-control" name="quantity" value={inputs.quantity } onChange={handleInputChange} min="0" required/>
                        <h4>No Surat Jalan:</h4>
                        <input type="text" class="form-control" name="noSuratJalan" value={inputs.noSuratJalan} onChange={handleInputChange} required/>
                        <h4>Tanggal Masuk:</h4>
                        <input type="date" class="form-control" name="tgl" value={inputs.tgl} onChange={handleInputChange} max={datePickerIconst} required/>
                        <h4>Lokasi:</h4>
                        <input type="text" class="form-control" name="lokasi" value={inputs.lokasi} onChange={handleInputChange} required/>
                        <br/><br/>
                        <div className="twoside">
                            <Button class="btn btn-danger" onClick={resetInput}>Reset</Button>
                        </div>
                        <div className="twoside">
                            <Button class="btn btn-primary" type="submit">Confirm</Button>
                        </div>
                    </form>
                </Modal.Body>
                </Modal>
                {/*<Modal 
                show={konfirmasi}
                size="lg-down"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">Konfirmasi Barang Masuk</Modal.Title>
                    <CloseButton onClick={showKonfirmasi}/>
                </Modal.Header>
                <Modal.Body>
                    <h4>Nama Barang:</h4>
                    <input type="text" disabled> {inputs.namabarang} </input>
                    <h4>Nama Penerima:</h4>
                    <input type="text" disabled> {inputs.namaPenerima} </input>
                    <h4>No. PO:</h4>
                    <input type="text" disabled> {inputs.kodePO} </input>
                    <h4>Quantity:</h4>
                    <text> {inputs.quantity} </text>
                    <input type="text" disabled> {inputs.quantity} </input>
                    <h4>No Surat Jalan:</h4>
                    <input type="text" disabled> {inputs.noSuratJalan} </input>
                    <h4>Tanggal Masuk:</h4>
                    <input type="text" disabled> {inputs.tgl} </input>
                    <h4>Lokasi:</h4>
                    <input type="text" disabled> {inputs.lokasi} </input>
                    <div className="twoside">
                        <Button class="btn btn-danger" onClick={showKonfirmasi}>Cancel</Button>
                    </div>
                    <div className="twoside">
                        <Button class="btn btn-primary" onClick={add}>Add</Button>
                    </div>
                </Modal.Body>
                </Modal>*/}
        </>
    );
}

export default BarangMasukPage;