import React, {useState, useEffect} from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";
import * as BsIcons from "react-icons/bs";
import { addBarangKeluar, getAllBarangKeluar, getAllBarangMasuk } from "../../repository";

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { dateFilter, textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from "react-bootstrap-table2-paginator";


function BarangKeluarPage(){
    const [modal, setModal] = useState(false);
    const initialState = {
        //kodebarang:"",
        namabarang: "",
        kodeKeluar: "", 
        namaPengambil: "",
        QTY: "",
        progress: "",  
        tgl: "",
    }
    const [inputs, setInputs] = useState(initialState);
    const showModal = () => {
        setModal(!modal)
        setInputs(initialState)
    };
    const resetInput = () => setInputs(initialState);
    const handleInputChange = (event) => {
        setInputs({...inputs, [event.target.name]: event.target.value});
    };

    const keluarinBarang = async (event) => {
        event.preventDefault();
        await addBarangKeluar(inputs);
        window.alert("item added to barang keluar")
        showModal();
        window.location.reload();
    }

    const [rows, setRows] = useState([]);
    const [search, setSearch] = useState("");
    const handleSearch = (event) => {
        event.preventDefault();
        setSearch({...search, [event.target.name]: event.target.value});
    }

    useEffect(() => {
        async function getAllBarangKeluarAPI(){
            const data = await getAllBarangKeluar()
            let rowsData = []
            for (const barang of data){
                const newBarang = {
                    //kodebarang: barang.kodebarang,
                    namabarang: barang.namabarang,
                    kodeKeluar: barang.kodeKeluar, 
                    namaPengambil: barang.namaPengambil,
                    QTY: barang.QTY,
                    progress: barang.progress,  
                    tgl: barang.tgl,
                }
                rowsData.push(newBarang);
            }
            setRows(rowsData);
        }
        getAllBarangKeluarAPI();
    }, [])

    //data master barang 
    const [options, setOption] = useState([]);

    useEffect(() => {
        async function getNamaMasterBarang(){
            const data = await getAllBarangMasuk();
            let optionData = []
            for (const barang of data){
                const newBarang = {
                    namabarang: barang.namabarang,
                }
                optionData.push(newBarang);
            }
            setOption(optionData);
        }
        getNamaMasterBarang();
    }, [])

    const columns = [
        {
            dataField: 'kodeKeluar',
            text: 'Kode Keluar',
            sort: true
        }, 
        {
            dataField: 'namabarang',
            text: 'Nama Barang',
            filter: textFilter(),
            sort: true
        }, 
        {
            dataField: 'namaPengambil',
            text: 'Nama Pengambil',
            sort: true
        },
        {
            dataField: 'quantity',
            text: 'Quantity',
            sort: true
        },
        {
            dataField: 'progress',
            text: 'Progress',
    
        },
        {
            dataField: 'tgl',
            text: 'tgl Keluar',
            filter: dateFilter(),
            sort: true
        }];

    return(
        <>
        <h2 text-align="center">Barang Keluar</h2>
         {/*
            <div className="searchGroup">
                <input onChange={handleSearch} placeholder="masukan nama barang"></input>
                <Button>search</Button>
            </div> 
            */}
        <br/>
        <BootstrapTable keyField='kodemasuk' data={ rows } columns={ columns } filter={ filterFactory() } pagination={paginationFactory()} striped hover/>
        <div className="addButton">
            <BsIcons.BsFillPlusCircleFill size={50} onClick={showModal}/>
        </div>  
            <Modal 
                show={modal}
                size="lg-down"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">Keluar Barang</Modal.Title>
                    <CloseButton onClick={showModal}/>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={keluarinBarang}>
                            <br/>
                            <h4>Nama Barang:</h4>
                            <input type="text" list="namabarang" name="namabarang" value={inputs.namabarang} onChange={handleInputChange} required autoComplete="off"></input>
                            <datalist id="namabarang" name="namabarang">
                                {options.map((item, index) => 
                                    <option key={index}>{item.namabarang}</option>
                                )}
                            </datalist>
                            <h4>Quantity:</h4>
                            <input type="number" name="QTY" value={inputs.QTY} onChange={handleInputChange} min="0" required></input>
                            <h4>Nama Pengambil:</h4>
                            <input type="text" name="namaPengambil" value={inputs.namaPengambil} onChange={handleInputChange} required></input>
                            <h4>Progress:</h4>
                            <input type="number" name="progress" value={inputs.progress} onChange={handleInputChange} min="0" required></input>
                            <h4>Tanggal:</h4>
                            <input type="date" name="tgl" value={inputs.tgl} onChange={handleInputChange} required></input>
                            <br/><br/>
                            <div className="twoside">
                            <Button class="btn btn-danger" onClick={resetInput}>Reset</Button>
                            </div>
                            <div className="twoside">
                                <Button class="btn btn-primary" type="submit">Add</Button>
                            </div>
                    </form>
                </Modal.Body>
            </Modal>
        
        </>
    );
}

export default BarangKeluarPage;