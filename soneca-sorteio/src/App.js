import logo from './logo.svg';
import React, { useEffect, useState} from 'react';
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
      console.log(d.length);
      console.log(d[Math.floor(Math.random() * d.length)+1].username);
    });
   
  }
  return (
    <>

<nav class="navbar navbar-expand-lg bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Soneca Sorteio</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onClick={<Test/>}>Sorteio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Spreedsheet</a>
        </li>
       
      </ul>
    </div>
  </div>
</nav>

    <h1>Planilha de Usernames</h1>
    <input type="file" onChange={(e) => {
      const file = e.target.files[0];
      readExcel(file);    }} />

<table class="table">
  <thead>
    <tr>
      <th scope="col">Username</th>
      <th scope="col">Number</th>
    </tr>
  </thead>
  <tbody>
    {
      items.map((d)=> (
      <tr key={d.username}>
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
