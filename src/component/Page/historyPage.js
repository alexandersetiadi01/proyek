import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { dateFilter, textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { getAllBarangKeluar, getAllBarangMasuk, getAllBarangSisa, getHistory, getSelectedProyek } from "../../repository";
import Navbar from "../Menu/navbar";
function HistoryPage(){

    const [data, setData] = useState([]);
    const proyek = getSelectedProyek();
    useEffect(() => {
        async function getHistoryAPI(){
            const dataBarangMasuk = await getAllBarangMasuk();
            let rowsData = []
            for (const barang of dataBarangMasuk){
                const newBarang = {
                    //kodebarang: barang.kodebarang,
                    namabarang: barang.namabarang,
                    kodePO: barang.kodePO,
                    quantity: barang.quantity,  
                    tgl: barang.tgl,
                    lokasi: barang.lokasi,
                    status: barang.status,
                    proyek: barang.proyek,
                    satuan: barang.satuan
                }
                if(newBarang.proyek === proyek){
                    rowsData.push(newBarang);
                }
            }
            const dataBarangKeluar = await getAllBarangKeluar();
            for (const barang of dataBarangKeluar){
                const newBarang = {
                    //kodebarang: barang.kodebarang,
                    namabarang: barang.namabarang,
                    kodePO: barang.kodePO,
                    quantity: barang.quantity,  
                    tgl: barang.tgl,
                    lokasi: barang.lokasi,
                    status: barang.status,
                    proyek: barang.proyek,
                    satuan: barang.satuan
                }
                if(newBarang.proyek === proyek){
                    rowsData.push(newBarang);
                }
               
            }
            const dataBarangSisa = await getAllBarangSisa();
            for (const barang of dataBarangSisa){
                const newBarang = {
                    //kodebarang: barang.kodebarang,
                    namabarang: barang.namabarang,
                    kodePO: barang.kodePO,
                    quantity: barang.quantity,  
                    tgl: barang.tgl,
                    lokasi: barang.lokasi,
                    status: barang.status,
                    proyek: barang.proyek,
                    satuan: barang.satuan
                }
                if(newBarang.proyek === proyek){
                    rowsData.push(newBarang);
                }
               
            }
            setData(rowsData);
        }
        getHistoryAPI();
    }, [])

    //console.log(typeof(getSelectedProyek()))
    const columns = [
        {
            dataField: 'namabarang',
            text: 'Nama Barang',
            sort: true,
            filter: textFilter()
        }, 
        {
            dataField: 'quantity',
            text: 'Qty',
            sort: true
        },
        {
            dataField: 'satuan',
            text: 'Satuan'
        },
        {
            dataField: 'tgl',
            text: 'Tgl',
            filter: dateFilter(),
            sort: true
        },
        {
            dataField: 'status',
            text: 'Status',
            sort: true,
            filter: textFilter()
        },
        {
            dataField: 'lokasi',
            text: 'Lokasi',
            sort: true,
            filter: textFilter()
        }
        
    ];
    return(
        <>
          <Navbar />
            <h2>History Barang</h2>
            <br/>
            <BootstrapTable 
                    keyField='kodemasuk' data={data} columns={ columns } 
                    filter={ filterFactory() } pagination={paginationFactory()} striped hover/>
        </>
    );
}

export default HistoryPage;