import logo from './logo.svg';
import React, { useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import * as XLSX from 'xlsx';
import Test from './pages/Test.js';

function App() {

  const [items, setItems] = useState([]);

  const readExcel=(file)=> {

    const promise = new Promise((resolve,reject)=>{

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file)

      fileReader.onload=(e)=>{
        const bufferArray=e.target.result;

        const wb = XLSX.read(bufferArray, {type: 'buffer'});

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    

    promise.then((d) => {
      setItems(d);
      console.log(d[Math.floor(Math.random() * d.length)+1].username);
      document.getElementById("demo").innerHTML = d[Math.floor(Math.random() * d.length)+1].username;
    });
   
  }
  return (
    <>

    <h1>Winner</h1>
    <h2 id='demo'>hello</h2>
    <input type="file" onChange={(e) => {
      const file = e.target.files[0];
      readExcel(file);    
      }} />

      <table className='table'>
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Number</th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((d)=> (
            <tr key={d.id}>
            <th>{d.username}</th>
            <td>{d.__rowNum__}</td>
            </tr>

            ))}
          
        </tbody>
      </table>
    </>
  );
}

export default App;
